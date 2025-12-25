<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Post;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Services\Payments\StripeService;
use App\Services\Payments\PaypalService;
use App\Services\Payments\MomoService;
use App\Services\Payments\VnpayService;
use Illuminate\Support\Facades\Http;
use Stripe\Checkout\Session;
use Stripe\Stripe;

class PaymentController extends Controller
{
    // ===================== CREATE PAYMENT =====================
    public function create(Payment $payment)
    {
        $postId = $payment->metadata['post_id'];
        $method = $payment->method;

        $post = Post::findOrFail($postId);

        abort_if($post->user_id !== Auth::id(), 403);
        abort_if($payment->status !== 'pending', 403);

        $amount   = $payment->amount;
        $currency = $payment->currency;

        // Gán order_id nếu provider yêu cầu
        if (!$payment->order_id) {
            $payment->order_id = uniqid("order_");
            $payment->save();
        }


        // Tạo return và cancel URL
        $returnUrl = route('payments.success', [
            'payment_id' => $payment->id,
            'provider'   => $method,
        ]);

        $cancelUrl = route('payments.cancel', [
            'payment_id' => $payment->id,
            'provider'   => $method,
        ]);

        // Redirect sang provider
        return match ($method) {
            'stripe' => app(StripeService::class)->pay($amount, $currency, $returnUrl, $cancelUrl, $post->id),
            'paypal' => app(PaypalService::class)->pay($amount, $currency, $returnUrl, $cancelUrl, $post->id),
            'momo'   => app(MomoService::class)->pay($amount, $returnUrl, $cancelUrl, $post->id, $payment->id),
            'vnpay'  => app(VnpayService::class)->pay($amount, $returnUrl, $cancelUrl, $post->id),
            default  => redirect()->route('posts.create')->with('error', 'Phương thức thanh toán không hỗ trợ')
        };
    }

    // ===================== SUCCESS PAYMENT =====================
    public function success(Request $request)
    {
        $paymentId = $request->query('payment_id');
        $provider  = $request->query('provider');

        $payment = Payment::findOrFail($paymentId);
        $post    = Post::findOrFail($payment->metadata['post_id']);

        abort_if($payment->status !== 'pending', 403);
        abort_if($post->user_id !== Auth::id(), 403);

        $verified = false;


        // ===== VERIFY PAYMENT THEO PROVIDER =====

        if ($provider === 'stripe') {
            $sessionId = $request->query('stripe_session_id');
            if ($sessionId) {
                Stripe::setApiKey(env('STRIPE_SECRET'));
                try {
                    $session = Session::retrieve($sessionId);
                    $verified = $session && $session->payment_status === 'paid';
                } catch (\Exception $e) {
                    Log::error('Stripe verify error: ' . $e->getMessage());
                }
            }
        }


        // ------- PAYPAL --------
        elseif ($provider === 'paypal') {

            $token   = $request->query('token');      // PayPal Order ID
            $payerId = $request->query('PayerID');    // User's PayPal payer ID

            if (!$token || !$payerId) {
                return redirect()->route('posts.create')
                    ->with('error', 'Paypal không có token hợp lệ.');
            }

            // Lấy Access Token
            $clientId = env('PAYPAL_CLIENT_ID');
            $secret   = env('PAYPAL_CLIENT_SECRET');

            $auth = Http::asForm()
                ->withBasicAuth($clientId, $secret)
                ->post('https://api-m.sandbox.paypal.com/v1/oauth2/token', [
                    'grant_type' => 'client_credentials'
                ]);

            if (!$auth->ok()) {
                return redirect()->route('posts.create')
                    ->with('error', 'Không xác thực được PayPal.');
            }

            $accessToken = $auth->json()['access_token'];

            // Capture đơn hàng
            $capture = Http::withToken($accessToken)
                ->withHeaders([
                    'Content-Type' => 'application/json'
                ])
                ->withBody('{}', 'application/json')
                ->post("https://api-m.sandbox.paypal.com/v2/checkout/orders/$token/capture");

            if ($capture->failed()) {
                return redirect()->route('posts.create')
                    ->with('error', 'PayPal capture thất bại.');
            }

            $status = $capture->json()['status'] ?? null;

            if ($status !== 'COMPLETED') {
                return redirect()->route('posts.create')
                    ->with('error', 'PayPal chưa hoàn tất giao dịch.');
            }

            // transaction id
            $transactionId = $capture->json()['purchase_units'][0]['payments']['captures'][0]['id'] ?? null;

            // update request
            $request->merge([
                'transaction_id' => $transactionId,
                'paypal_order_id' => $token,
            ]);

            $verified = true;
        }


        // ------- MOMO --------
        elseif ($provider === 'momo') {

            $resultCode = $request->query('resultCode') ?? $request->query('errorCode');

            // Nếu user cancel hoặc lỗi MoMo -> update failed ngay tại đây
            if (!in_array((string)$resultCode, ['0', '00'])) {

                $this->markPaymentFailed($post->id, 'momo');

                return redirect()
                    ->route('posts.create')
                    ->with('error', 'Bạn đã hủy thanh toán MoMo.');
            }

            // Nếu OK -> verified
            $verified = true;
        }

        // ------- VNPay --------
        elseif ($provider === 'vnpay') {

            $responseCode = $request->query('vnp_ResponseCode');

            // Nếu bị hủy hoặc lỗi VNPAY -> FAILED
            if ($responseCode !== '00') {

                $this->markPaymentFailed($post->id, 'vnpay');

                return redirect()
                    ->route('posts.create')
                    ->with('error', 'Bạn đã hủy thanh toán VNPAY.');
            }

            $verified = true;
        }

        // Nếu xác thực thất bại
        if (!$verified) {
            return redirect()->route('posts.create')
                ->with('error', 'Thanh toán không xác thực.');
        }

        // ===== CẬP NHẬT PAYMENT =====
        $payment->update([
            'status' => 'success',
            'transaction_id' => $request->query('transaction_id'),
            'metadata' => array_merge($payment->metadata ?? [], [
                'paypal_order_id' => $request->query('paypal_order_id'),
                'verified_at' => now(),
            ]),
        ]);


        // ===== CẬP NHẬT POST =====
        $post->update([
            'status' => 'visible',
            'subscription_id' => $payment->subscription_id,
            'package_expired_at' => now()->addDays($payment->days),
        ]);

        return redirect()->route('propertyDetail.show', $post->slug)
            ->with('success', 'Thanh toán thành công. Bài đăng đã được hiển thị.');
    }


    // ===================== CANCEL PAYMENT =====================
    public function cancel(Request $request)
    {
        $paymentId = $request->query('payment_id');

        $payment = Payment::find($paymentId);

        if ($payment && $payment->status === 'pending') {
            $payment->update(['status' => 'failed']);
        }

        return redirect()->route('posts.create')
            ->with('error', 'Bạn đã hủy thanh toán.');
    }


    // ===================== Momo IPN =====================
    public function momoIpn(Request $request)
    {
        $data = $request->all();

        $receivedSignature = $data['signature'] ?? null;
        $raw = "{$data['partnerCode']}{$data['accessKey']}{$data['orderId']}{$data['requestId']}{$data['amount']}";
        $calculated = hash_hmac('sha256', $raw, env('MOMO_SECRET_KEY'));

        if ($receivedSignature && hash_equals($calculated, $receivedSignature)) {

            $resultCode = $data['resultCode'] ?? $data['errorCode'] ?? null;
            $paymentId  = $data['payment_id'] ?? null;

            if ($paymentId) {
                $payment = Payment::find($paymentId);

                if ($payment) {
                    $payment->update([
                        'status'         => (string)$resultCode === '0' || (string)$resultCode === '00' ? 'success' : 'failed',
                        'transaction_id' => $data['transId'] ?? null,
                        'metadata'       => array_merge($payment->metadata ?? [], $data),
                    ]);
                }
            }

            if ((string)$resultCode === '0' || (string)$resultCode === '00') {
                $postId = $data['post_id'] ?? null;

                if ($postId) {
                    $post = Post::find($postId);
                    $subscription = Subscription::find($payment->subscription_id);

                    if ($post && $payment && $subscription) {
                        $post->update([
                            'status' => 'visible',
                            'subscription_id' => $payment->subscription_id,
                            'package_expired_at' => now()->addDays($payment->days),
                        ]);
                    }
                }
                return response()->json(['resultCode' => 0, 'message' => 'Success']);
            }
        }

        return response()->json(['resultCode' => 1, 'message' => 'Failed']);
    }

    private function markPaymentFailed($postId, $provider)
    {
        $payment = Payment::where('method', $provider)
            ->where('status', 'pending')
            ->where('metadata->post_id', $postId)
            ->latest()
            ->first();

        if ($payment) {
            $payment->update(['status' => 'failed']);
        }
    }
}
