<?php

namespace App\Services\Payments;

use Stripe\Stripe;
use Stripe\Checkout\Session;

class StripeService
{
    public function pay($amount, $currency, $returnUrl, $cancelUrl, $postId = null)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => strtolower($currency),
                    'product_data' => ['name' => 'Thanh toán hóa đơn'],
                    'unit_amount' => $amount * 100,
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => $returnUrl . '&stripe_session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => $cancelUrl,
        ]);

        return response()->redirectTo($session->url);
    }
}
