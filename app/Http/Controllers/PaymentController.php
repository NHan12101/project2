<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PaymentController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'amount'   => 'required|numeric|min:1',
            'method'   => 'required|string',
        ]);

        $amount = $request->amount;
        $method = $request->method;

        // Auto select currency
        $currency = in_array($method, ['stripe', 'paypal']) ? 'USD' : 'VND';

        switch ($method) {
            case 'stripe':
                return $this->stripePayment($amount, $currency);

            case 'paypal':
                return $this->paypalPayment($amount, $currency);

            case 'momo':
                return $this->momoPayment($amount);

            case 'vnpay':
                return $this->vnpayPayment($amount);

            default:
                return response()->json(['error' => 'Phương thức không hợp lệ'], 400);
        }
    }

    /* -------------------------------------------
    |  STRIPE PAYMENT (USD)
    --------------------------------------------*/
    private function stripePayment($amount, $currency)
    {
        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));

        $session = \Stripe\Checkout\Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => strtolower($currency),
                    'product_data' => ['name' => 'Thanh toán hóa đơn'],
                    'unit_amount' => $amount * 100, // USD (cent)
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => url('/payments/success'),
            'cancel_url' => url('/payments/cancel'),
        ]);

        return response()->json(['url' => $session->url]);
    }

    /* -------------------------------------------
    |  PAYPAL PAYMENT (USD)
    --------------------------------------------*/
    private function paypalPayment($amount, $currency)
    {
        $clientId = env('PAYPAL_CLIENT_ID');
        $secret   = env('PAYPAL_CLIENT_SECRET');

        // Get token
        $tokenRes = Http::asForm()
            ->withBasicAuth($clientId, $secret)
            ->post('https://api-m.sandbox.paypal.com/v1/oauth2/token', [
                'grant_type' => 'client_credentials'
            ]);

        $accessToken = $tokenRes->json()['access_token'];

        // Create order
        $order = Http::withToken($accessToken)
            ->post('https://api-m.sandbox.paypal.com/v2/checkout/orders', [
                'intent' => 'CAPTURE',
                'purchase_units' => [[
                    'amount' => [
                        'currency_code' => $currency,
                        'value' => number_format($amount, 2, '.', '')
                    ]
                ]],
                'application_context' => [
                    'return_url' => url('/payments/paypal/return'),
                    'cancel_url' => url('/payments/paypal/cancel')
                ]
            ]);

        $approvalUrl = collect($order->json()['links'])->firstWhere('rel', 'approve')['href'];

        return response()->json(['url' => $approvalUrl]);
    }

    /* -------------------------------------------
    |  MOMO PAYMENT (VND)
    --------------------------------------------*/
    private function momoPayment($amount)
    {
        $endpoint = env('MOMO_ENDPOINT');
        $partnerCode = env('MOMO_PARTNER_CODE');
        $accessKey   = env('MOMO_ACCESS_KEY');
        $secretKey   = env('MOMO_SECRET_KEY');

        $orderId = time();
        $requestId = time();
        $redirectUrl = env('MOMO_REDIRECT_URL');
        $ipnUrl = env('MOMO_IPN_URL');

        $rawHash = "accessKey=$accessKey&amount=$amount&extraData=&ipnUrl=$ipnUrl"
            . "&orderId=$orderId&orderInfo=Thanh toán MoMo&partnerCode=$partnerCode"
            . "&redirectUrl=$redirectUrl&requestId=$requestId&requestType=captureWallet";

        $signature = hash_hmac("sha256", $rawHash, $secretKey);

        $response = Http::post($endpoint, [
            'partnerCode' => $partnerCode,
            'accessKey' => $accessKey,
            'requestId' => $requestId,
            'amount' => $amount,
            'orderId' => $orderId,
            'orderInfo' => 'Thanh toán MoMo',
            'redirectUrl' => $redirectUrl,
            'ipnUrl' => $ipnUrl,
            'lang' => 'vi',
            'extraData' => '',
            'requestType' => 'captureWallet',
            'signature' => $signature
        ]);

        return response()->json(['url' => $response->json()['payUrl']]);
    }

    /* -------------------------------------------
    |  VNPAY PAYMENT (VND)
    --------------------------------------------*/
private function vnpayPayment($amount)
{
    $vnp_TmnCode    = env('VNP_TMN_CODE');
    $vnp_HashSecret = env('VNP_HASH_SECRET');
    $vnp_Url        = env('VNP_PAYMENT_URL');
    $vnp_ReturnUrl  = env('VNP_RETURN_URL');

    $vnp_TxnRef = time();
    $vnp_Amount = $amount * 100;
    
    $inputData = [
        "vnp_Version" => "2.1.0",
        "vnp_TmnCode" => $vnp_TmnCode,
        "vnp_Amount" => $vnp_Amount,
        "vnp_Command" => "pay",
        "vnp_CreateDate" => date('YmdHis'),
        "vnp_CurrCode" => "VND",
        "vnp_IpAddr" => request()->ip(),
        "vnp_Locale" => "vn",
        "vnp_OrderInfo" => "Thanh toan VNPAY",
        "vnp_OrderType" => "other",
        "vnp_ReturnUrl" => $vnp_ReturnUrl,
        "vnp_TxnRef" => $vnp_TxnRef
    ];

    ksort($inputData);

    // ==== BẮT BUỘC: HASH THEO ĐÚNG FORMAT CỦA TÀI LIỆU VNPAY ====
    $hashData = "";
    $i = 0;
    foreach ($inputData as $key => $value) {
        if ($i == 1) {
            $hashData .= '&' . urlencode($key) . "=" . urlencode($value);
        } else {
            $hashData .= urlencode($key) . "=" . urlencode($value);
            $i = 1;
        }
    }

    $vnpSecureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

    $query = http_build_query($inputData);
    $paymentUrl = $vnp_Url . "?" . $query . "&vnp_SecureHash=" . $vnpSecureHash;

    return response()->json(['url' => $paymentUrl]);
}

}
