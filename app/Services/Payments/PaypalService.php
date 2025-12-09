<?php

namespace App\Services\Payments;

use App\Models\Payment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Arr;

class PaypalService
{
    public function pay($amount, $currency, $returnUrl, $cancelUrl, $postId = null)
    {
        // Paypal sandbox không nhận VND => đổi tạm sang USD
        if ($currency === 'VND') {
            $currency = 'USD';
            // Chuyển đổi tiền tệ VND -> USD (1 USD ~ 26_400 VND)
            $amount = round($amount / 26400, 2);
        }

        $clientId = env('PAYPAL_CLIENT_ID');
        $secret   = env('PAYPAL_CLIENT_SECRET');

        // Lấy token
        $tokenRes = Http::asForm()
            ->withBasicAuth($clientId, $secret)
            ->post('https://api-m.sandbox.paypal.com/v1/oauth2/token', [
                'grant_type' => 'client_credentials'
            ]);

        if (!$tokenRes->ok()) {
            dd('Token request failed', $tokenRes->json());
        }

        $accessToken = $tokenRes->json()['access_token'] ?? null;
        if (!$accessToken) {
            dd('No access token', $tokenRes->json());
        }

        // dd([
        //     'amount' => $amount,
        //     'currency' => $currency,
        //     'returnUrl' => $returnUrl,
        //     'cancelUrl' => $cancelUrl
        // ]);


        // Tạo order
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
                    'return_url' => $returnUrl,
                    'cancel_url' => $cancelUrl
                ]
            ]);

        $orderJson = $order->json();

        if (($order->status() >= 400) || isset($orderJson['name'])) {
            dd('Order creation failed', $orderJson);
        }

        $payment = Payment::where('method', 'paypal')
            ->where('status', 'pending')
            ->where('metadata->post_id', $postId)
            ->latest()
            ->first();

        if ($payment) {
            $meta = $payment->metadata;
            $meta['paypal_order_id'] = $orderJson['id']; // ID PayPal trả về
            $payment->update(['metadata' => $meta]);
        }


        // Lấy link approve
        $approvalUrl = Arr::get(collect($orderJson['links'])->firstWhere('rel', 'approve'), 'href');

        if (!$approvalUrl) {
            dd('No approval link found', $orderJson);
        }

        return redirect()->to($approvalUrl);
    }
}
