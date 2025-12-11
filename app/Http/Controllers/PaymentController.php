<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Post;
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
    public function create(Request $request)
    {
        // Lấy post_id và phương thức thanh toán
        $postId = session('pending_post_id');
        $method = session('pending_payment_method', $request->query('method'));

        if (!$postId) {
            return redirect()->route('posts.create')
                ->with('error', 'Không tìm thấy bài cần thanh toán.');
        }

        $post = Post::with('subscription')->findOrFail($postId);
        $subscription = $post->subscription;

        if (!$subscription) {
            return redirect()->route('posts.create')
                ->with('error', 'Gói không hợp lệ.');
        }

        $amount   = $subscription->price;
        $currency = $subscription->currency ?? 'VND';

        // Tạo payment pending trước khi redirect
        $payment = Payment::create([
            'user_id'         => Auth::id(),
            'subscription_id' => $subscription->id,
            'method'          => $method,
            'status'          => 'pending',
            'currency'        => $currency,
            'amount'          => $amount,
            'metadata' => [
                'post_id' => $post->id,
                'post_slug' => $post->slug,
                'paypal_order_id' => null, // Sẽ lưu sau
            ],
        ]);

        // Gán order_id nếu provider yêu cầu
        $payment->order_id = uniqid("order_");
        $payment->save();

        // Tạo return và cancel URL
        $returnUrl = route('payments.success', ['post_id' => $post->id, 'provider' => $method]);
        $cancelUrl = route('payments.cancel', ['post_id' => $post->id]);

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
        // dd("SUCCESS CALLBACK", $request->all());

        $postId   = $request->query('post_id');
        $provider = $request->query('provider');

        // dd("CHECKPOINT 2", [
        //     'postId'   => $postId,
        //     'provider' => $provider,
        //     'token'    => $request->token,
        //     'PayerID'  => $request->PayerID,
        // ]);

        $post = Post::findOrFail($postId);

        // dd("CHECKPOINT 3: Load post OK", $post->toArray());

        // Kiểm tra quyền user
        if ($post->user_id !== Auth::id()) {
            return redirect()->route('posts.create')
                ->with('error', 'Bạn không có quyền thực hiện thao tác này.');
        }

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

            // dd("CHECKPOINT 4: vào block PAYPAL", $request->all());

            $token   = $request->query('token');      // PayPal Order ID
            $payerId = $request->query('PayerID');    // User's PayPal payer ID

            // dd("CHECKPOINT 5: PayPal trả token + payerId", [
            //     "token" => $token,
            //     "payerId" => $payerId
            // ]);

            if (!$token || !$payerId) {
                dd("CHECKPOINT 6: token hoặc payerId NULL");

                return redirect()->route('posts.create')
                    ->with('error', 'Paypal không có token hợp lệ.');
            }

            // Lấy Access Token
            $clientId = env('PAYPAL_CLIENT_ID');
            $secret   = env('PAYPAL_CLIENT_SECRET');

            // dd("CHECKPOINT 7: chuẩn bị lấy access token");

            $auth = Http::asForm()
                ->withBasicAuth($clientId, $secret)
                ->post('https://api-m.sandbox.paypal.com/v1/oauth2/token', [
                    'grant_type' => 'client_credentials'
                ]);

            // dd("CHECKPOINT 8: Nhận về access token", $auth->json());

            if (!$auth->ok()) {

                dd("CHECKPOINT 9: Access token FAIL", $auth->json());

                return redirect()->route('posts.create')
                    ->with('error', 'Không xác thực được PayPal.');
            }

            $accessToken = $auth->json()['access_token'];

            // dd("CHECKPOINT 10: Access Token OK", $accessToken);

            // Capture đơn hàng
            $capture = Http::withToken($accessToken)
                ->withHeaders([
                    'Content-Type' => 'application/json'
                ])
                ->withBody('{}', 'application/json')
                ->post("https://api-m.sandbox.paypal.com/v2/checkout/orders/$token/capture");



            // dd("CHECKPOINT 11: Capture kết quả", $capture->json());

            if ($capture->failed()) {

                dd("CHECKPOINT 12: Capture FAILED", $capture->json());

                return redirect()->route('posts.create')
                    ->with('error', 'PayPal capture thất bại.');
            }

            $status = $capture->json()['status'] ?? null;

            // dd("CHECKPOINT 13: Status", $status);

            if ($status !== 'COMPLETED') {
                dd("CHECKPOINT 14: Status không phải COMPLETED");

                return redirect()->route('posts.create')
                    ->with('error', 'PayPal chưa hoàn tất giao dịch.');
            }

            // transaction id
            $transactionId = $capture->json()['purchase_units'][0]['payments']['captures'][0]['id'] ?? null;

            // update request
            $request->merge(['transaction_id' => $transactionId]);

            // Tìm chính xác payment theo paypal_order_id
            $payment = Payment::where('method', 'paypal')
                ->where('metadata->paypal_order_id', $token)
                ->where('status', 'pending')
                ->first();

            if ($payment) {
                $payment->update([
                    'status' => 'success',
                    'transaction_id' => $transactionId,
                    'metadata' => array_merge($payment->metadata ?? [], [
                        'verified_at' => now()
                    ]),
                ]);
            }

            $verified = true;

            // dd("CHECKPOINT 15: VERIFIED OK");
        }


        // ------- MOMO --------
        elseif ($provider === 'momo') {

            $resultCode = $request->query('resultCode') ?? $request->query('errorCode');

            // Nếu user cancel hoặc lỗi MoMo -> update failed ngay tại đây
            if (!in_array((string)$resultCode, ['0', '00'])) {

                $this->markPaymentFailed($postId, 'momo');

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

                $this->markPaymentFailed($postId, 'vnpay');

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
        $payment = Payment::where('method', $provider)
            ->where('metadata->post_id', $postId)
            ->where('status', 'pending')
            ->latest()
            ->first();


        if ($payment) {
            $payment->update([
                'status'         => 'success',
                'transaction_id' => $request->query('transaction_id') ?? null,
                'metadata'       => array_merge($payment->metadata ?? [], ['verified_at' => now()]),
            ]);
        }

        // ===== CẬP NHẬT POST =====
        $subscription = $post->subscription;
        $updateData = ['status' => 'visible', 'is_vip' => true];

        if ($subscription && isset($subscription->days)) {
            $updateData['package_expired_at'] = now()->addDays($subscription->days);
        }

        $post->update($updateData);

        // Xóa session tạm
        session()->forget(['pending_post_id', 'pending_payment_method']);

        return redirect()->route('propertyDetail.show', $post->slug)
            ->with('success', 'Thanh toán thành công. Bài đăng đã được hiển thị.');
    }


    // ===================== CANCEL PAYMENT =====================
    public function cancel(Request $request)
    {
        // dd("CANCEL CALLBACK", $request->all());

        $postId = $request->query('post_id') ?? session('pending_post_id');
        $method = session('pending_payment_method') ?? $request->query('method');

        // dd($postId, $method);

        if ($postId && $method) {
            $post = Post::find($postId);

            if ($post && $post->user_id === Auth::id()) {
                $payment = Payment::where('subscription_id', $post->subscription_id)
                    ->where('method', $method)
                    ->where('status', 'pending')
                    ->latest()
                    ->first();

                if ($payment) {
                    $payment->update(['status' => 'failed']);
                }
            }
        }

        session()->forget(['pending_post_id', 'pending_payment_method']);

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
                    if ($post) $post->update(['status' => 'visible', 'is_vip' => true]);
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
