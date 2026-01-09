<?php

namespace App\Http\Controllers;

use App\Models\Notification;
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
        Log::info('PAYMENT SUCCESS HIT', [
            'query' => $request->query(),
            'auth_id' => Auth::id(),
        ]);

        $paymentId = $request->query('payment_id');
        $provider  = $request->query('provider');

        $payment = Payment::findOrFail($paymentId);
        $post    = Post::findOrFail($payment->metadata['post_id']);

        Log::info('PAYMENT & POST LOADED', [
            'payment_id' => $payment->id,
            'payment_status' => $payment->status,
            'payment_method' => $payment->method,
            'provider' => $provider,
            'post_id' => $post->id,
        ]);

        if ($payment->status === 'success') {
            return redirect()->route('propertyDetail.show', $post->slug)
                ->with('success', 'Thanh toán đã được xử lý.');
        }

        abort_if($payment->status !== 'pending', 403);
        abort_if($payment->method !== $provider, 403);

        Log::info('BEFORE ABORT CHECK', [
            'payment_status' => $payment->status,
            'payment_method' => $payment->method,
            'provider' => $provider,
        ]);


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

            Log::info('ENTER PAYPAL VERIFY', [
                'payment_id' => $payment->id,
                'query' => $request->query(),
            ]);

            $token   = $request->query('token');      // PayPal Order ID

            if (!$token) {
                return redirect()->route('posts.create')
                    ->with('error', 'Paypal callback thiếu order token.');
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

            $orderCheck = Http::withToken($accessToken)
                ->get("https://api-m.sandbox.paypal.com/v2/checkout/orders/$token");

            if (!$orderCheck->ok()) {
                return redirect()->route('posts.create')
                    ->with('error', 'Không kiểm tra được trạng thái PayPal.');
            }


            $orderStatus = $orderCheck->json()['status'] ?? null;

            Log::info('PAYPAL ORDER STATUS', [
                'order_id' => $token,
                'status' => $orderStatus,
                'raw' => $orderCheck->json(),
            ]);


            if (!in_array($orderStatus, ['APPROVED', 'COMPLETED'])) {
                Log::warning('PayPal order not approved', [
                    'order_id' => $token,
                    'status' => $orderStatus,
                    'response' => $orderCheck->json(),
                ]);

                return redirect()->route('posts.create')
                    ->with('error', 'PayPal order chưa được approve.');
            }

            // Capture đơn hàng
            if ($orderStatus === 'APPROVED') {
                $capture = Http::withToken($accessToken)
                    ->withHeaders([
                        'Content-Type' => 'application/json'
                    ])
                    ->withBody('{}', 'application/json')
                    ->post("https://api-m.sandbox.paypal.com/v2/checkout/orders/$token/capture");

                Log::info('PAYPAL CAPTURE RESPONSE', [
                    'capture_status' => $capture->status(),
                    'body' => $capture->body(),
                ]);
            } else {
                // Đã COMPLETED sẵn
                $capture = $orderCheck;
            }

            if ($capture->status() === 422) {

                $error = $capture->json('details.0.issue');

                if ($error === 'INSTRUMENT_DECLINED') {

                    Log::warning('PAYPAL INSTRUMENT DECLINED', [
                        'order_id' => $token,
                    ]);

                    // Redirect user quay lại PayPal để chọn funding source khác
                    $redirectUrl = collect($capture->json('links'))
                        ->firstWhere('rel', 'redirect')['href'] ?? null;

                    if ($redirectUrl) {
                        return redirect()->away($redirectUrl);
                    }

                    return redirect()->route('posts.create')
                        ->with('error', 'Phương thức thanh toán bị từ chối, vui lòng thử lại.');
                }
            }


            Log::info('PayPal capture response', [
                'payment_id' => $payment->id,
                'response' => $capture->json(),
            ]);

            if (($capture->json()['status'] ?? null) !== 'COMPLETED') {
                return redirect()->route('posts.create')
                    ->with('error', 'PayPal chưa hoàn tất giao dịch.');
            }

            // transaction id
            $transactionId = data_get(
                $capture->json(),
                'purchase_units.0.payments.captures.0.id'
            );

            $verified = true;

            Log::info('PAYMENT VERIFIED', [
                'payment_id' => $payment->id,
                'provider' => $provider,
                'transaction_id' => $transactionId ?? null,
            ]);
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

        $metadata = array_merge($payment->metadata ?? [], [
            'verified_at' => now(),
        ]);

        if ($provider === 'paypal') {
            $metadata['paypal_order_id'] = $token;
        }

        Log::info('UPDATING PAYMENT', [
            'payment_id' => $payment->id,
        ]);


        // ===== CẬP NHẬT PAYMENT =====
        $payment->update([
            'status' => 'success',
            'transaction_id' => $transactionId ?? null,
            'metadata' => $metadata,
        ]);



        // ===== CẬP NHẬT POST =====
        $post->update([
            'status' => 'visible',
            'subscription_id' => $payment->subscription_id,
            'package_expired_at' => now()->addDays($payment->days),
        ]);

        // THÔNG BÁO ĐĂNG BÀI THÀNH CÔNG
        Notification::create([
            'user_id' => $post->user_id,
            'type' => 'post_published',
            'data' => [
                'post_id' => $post->id,
                'title' => $post->title,
            ],
        ]);

        Log::info('PAYMENT SUCCESS REDIRECT', [
            'post_slug' => $post->slug,
        ]);

        return redirect()->route('propertyDetail.show', $post->slug)
            ->with('success', 'Thanh toán thành công. Bài đăng đã được hiển thị.');
    }


    // ===================== CANCEL PAYMENT =====================
    public function cancel(Request $request)
    {
        Log::info('PAYPAL CANCEL HIT', $request->all());

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
