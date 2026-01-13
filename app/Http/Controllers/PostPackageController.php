<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Post;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PostPackageController extends Controller
{
    public function store(Request $request, Post $post)
    {
        abort_if($post->user_id !== Auth::id(), 403);
        
        // Chỉ cho phép gia hạn nếu status là draft hoặc expired
        abort_if(!in_array($post->status, ['draft', 'expired']), 403);

        $data = $request->validate([
            'subscription_id' => 'required|exists:subscriptions,id',
            'days' => 'required|in:7,10,15,30,60',
            'payment_method' => 'required|in:momo,vnpay,stripe,paypal',

        ]);

        $subscription = Subscription::where('id', $data['subscription_id'])
            ->where('active', true)
            ->firstOrFail();

        $amount = $subscription->price_per_day * $data['days'];

        $payment = Payment::create([
            'user_id' => Auth::id(),
            'subscription_id' => $subscription->id,
            'days' => $data['days'],
            'method' => $data['payment_method'],
            'amount' => $amount,
            'currency' => 'VND',
            'status' => 'pending',
            'metadata' => [
                'post_id' => $post->id,
            ],
        ]);

        return Inertia::location(
            route('payments.create', $payment->id)
        );
    }
}
