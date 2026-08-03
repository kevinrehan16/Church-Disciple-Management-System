<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsurePasswordIsChanged
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // 1. Suriin kung naka-login at kung kailangan pang magpalit ng password
        // 2. I-exempt (huwag harangin) ang route ng pagpapalit ng password para makapasok sila
        if ($user && $user->must_change_password && !$request->routeIs('api.password.change')) {
            return response()->json([
                'message' => 'Please change your temporary password first.',
                'must_change_password' => true
            ], 403); // 403 Forbidden o 409 Conflict
        }

        return $next($request);
    }
}
