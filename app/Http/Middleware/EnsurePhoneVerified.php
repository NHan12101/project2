<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsurePhoneVerified
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user || !$user->phone) {
            return redirect()
                ->back()
                ->with([
                    'phone_otp_required' => true,
                ]);
        }

        return $next($request);
    }
}
