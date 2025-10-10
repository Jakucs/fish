<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;



class AuthController extends ResponseController
{
    public function register(RegisterRequest $request){
        $request->validated();
        $user = User::create([
            "username" => $request["username"],
            "email" => $request["email"],
            "firstname" => $request["firstname"],
            "lastname" => $request["lastname"],
            "password" => bcrypt($request["password"])
        ]);
        return $this->sendResponse($user, "Sikeres regisztráció");
    }

    public function login(LoginRequest $request)
    {
        $request->validated();

        $loginField = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        if (Auth::attempt([$loginField => $request->login, 'password' => $request->password])) {

            $user = Auth::user();

            $token = $user->createToken(($user->username ?? $user->email) . "Token")->plainTextToken;

            $data = [
                "username" => $user->username,
                "user_id" => $user->id,
                "email" => $user->email,
                "token" => $token
            ];

            return $this->sendResponse($data, "Sikeres bejelentkezés");

        } else {
            return $this->sendError("Azonosítási hiba", "Hibás felhasználónév vagy jelszó", 405);
        }
    }

    public function logout() {
        $user = auth("sanctum")->user();
        $user->currentAccessToken()->delete();
        return $this->sendResponse( $user->name, "Sikeres kijelentkezés" );
    }

        public function getUsers(){
        $users = User::all();
        return $users;
    }

    public function getUserDetails(Request $request) {
        return response()->json([
            'success' => true,
            'data' => $request->user()
        ]);
    }
}
