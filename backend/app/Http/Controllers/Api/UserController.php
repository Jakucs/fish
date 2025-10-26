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
        // Megkeressük a felhasználót az id alapján
        $user = User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Felhasználó nem található'], 404);
        }

        // Ellenőrizzük, hogy csak superadmin módosíthat admin jogosultságot
        if (Gate::denies('superadmin-access')) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        // Felhasználó admin/jogosultság váltása
        $user->role = $user->role === 1 ? 0 : 1; // admin ⇄ felhasználó
        $user->save();

        return response()->json(['success' => true, 'role' => $user->role]);
    }


}
