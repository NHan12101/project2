<?php

namespace App\Services\Payments;

use Illuminate\Support\Facades\Request as HttpRequest;

class VnpayService
{
    public function pay($amount, $returnUrl, $cancelUrl, $postId = null)
    {
        $vnp_TmnCode    = env('VNP_TMN_CODE');
        $vnp_HashSecret = env('VNP_HASH_SECRET');
        $vnp_Url        = env('VNP_PAYMENT_URL');

        // Gắn post_id để quay về
        $vnp_ReturnUrl  = $returnUrl;

        $vnp_TxnRef = time() . $postId;
        $vnp_Amount = $amount * 100;

        $inputData = [
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => HttpRequest::ip(),
            "vnp_Locale" => "vn",
            "vnp_OrderInfo" => "Thanh toan VNPAY",
            "vnp_OrderType" => "other",
            "vnp_ReturnUrl" => $vnp_ReturnUrl,
            "vnp_TxnRef" => $vnp_TxnRef
        ];

        ksort($inputData);

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

        return response()->redirectTo($paymentUrl);
    }

    // verify callback khi VNPAY redirect về
    public function verify($queryParams)
    {
        $vnp_HashSecret = env('VNP_HASH_SECRET');

        $providedHash = $queryParams["vnp_SecureHash"];
        unset($queryParams["vnp_SecureHash"]);
        unset($queryParams["vnp_SecureHashType"]);

        ksort($queryParams);

        $hashData = urldecode(http_build_query($queryParams));
        $calculatedHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        return $calculatedHash === $providedHash;
    }
}
