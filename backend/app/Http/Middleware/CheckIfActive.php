<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckIfActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Ha a user be van jelentkezve, de inaktív
        if ($user && !$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'A fiókod inaktív. Kérjük, vedd fel a kapcsolatot az adminisztrátorral.'
            ], 403);
        }

        return $next($request);
    }
}
