<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller; // ← ide kell
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class UserController extends Controller
{
    // Csak adminok módosíthatják a státuszt
    public function toggleActive($id)
    {
        $admin = auth()->user();

        // 🔒 Csak admin vagy superadmin (role >= 1) férhet hozzá
        if (!$admin || $admin->role < 1) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Felhasználó nem található'
            ], 404);
        }

        // 🚫 Saját fiók inaktiválása tiltva
        if ($admin->id === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Saját fiók inaktiválása nem engedélyezett.'
            ], 403);
        }

        // 🚫 Superadmin fiók védelme (pl. role = 3)
        if ($user->role === 3) {
            return response()->json([
                'success' => false,
                'message' => 'Superadmin fiók nem inaktiválható.'
            ], 403);
        }

        // ✅ Állapot váltása
        $user->is_active = !$user->is_active;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Felhasználó státusza módosítva',
            'data' => [
                'id' => $user->id,
                'is_active' => $user->is_active
            ]
        ]);
    }


    public function toggleAdminRole($id)
{
    $currentUser = auth()->user(); // Bejelentkezett user

    // Megkeressük a célfelhasználót
    $user = User::find($id);

    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'Felhasználó nem található'
        ], 404);
    }

    // Csak superadmin férhet hozzá
    if (Gate::denies('superadmin-access')) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized'
        ], 403);
    }

    // A superadmin nem módosíthatja saját jogát
    if ($currentUser->id === $user->id && $currentUser->role === 2) {
        return response()->json([
            'success' => false,
            'message' => 'A superadmin nem módosíthatja saját jogosultságát.'
        ], 403);
    }

    // Admin jogosultság váltása (1 ⇄ 0)
    $user->role = $user->role === 1 ? 0 : 1;
    $user->save();

    return response()->json([
        'success' => true,
        'role' => $user->role
    ]);
}



}
