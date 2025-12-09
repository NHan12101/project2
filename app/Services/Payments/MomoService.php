<?php

namespace App\Services\Payments;

use Illuminate\Support\Facades\Http;

class MomoService
{
    public function pay($amount, $returnUrl, $cancelUrl, $postId = null, $paymentId = null)
    {
        // Ép amount thành integer
        $amount = (int) $amount;

        $endpoint    = env('MOMO_ENDPOINT');
        $partnerCode = env('MOMO_PARTNER_CODE');
        $accessKey   = env('MOMO_ACCESS_KEY');
        $secretKey   = env('MOMO_SECRET_KEY');

        // Dùng returnUrl từ controller, không dùng .env nữa
        $redirectUrl = $returnUrl;

        // IPN xử lý trạng thái thanh toán
        $ipnUrl      = route('payment.momo.ipn');

        $orderId   = time();
        $requestId = time();

        // ExtraData chứa cancelUrl để xử lý khi user hủy
        $extraData = json_encode([
            'cancelUrl' => $cancelUrl,
            'post_id'   => $postId,
            'payment_id' => $paymentId,
        ]);

        // Raw hash
        $rawHash = "accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl"
            . "&orderId=$orderId&orderInfo=Thanh toán MoMo&partnerCode=$partnerCode"
            . "&redirectUrl=$redirectUrl&requestId=$requestId&requestType=captureWallet";


        $signature = hash_hmac("sha256", $rawHash, $secretKey);

        $response = Http::post($endpoint, [
            'partnerCode' => $partnerCode,
            'accessKey'   => $accessKey,
            'requestId'   => $requestId,
            'amount'      => $amount,
            'orderId'     => $orderId,
            'orderInfo'   => 'Thanh toán MoMo',
            'redirectUrl' => $redirectUrl,
            'ipnUrl'      => $ipnUrl,
            'lang'        => 'vi',
            'extraData'   => $extraData,
            'requestType' => 'captureWallet',
            'signature'   => $signature
        ]);

        $data = $response->json();

        // Nếu trả về url thành công -> redirect
        if (isset($data['payUrl'])) {
            return redirect()->to($data['payUrl']);
        }

        // Nếu lỗi
        return redirect()->route('posts.create')->with('error', $data['message'] ?? 'Lỗi thanh toán Momo');
    }
}
