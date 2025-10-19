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

        $loginInput = $request->input('login'); // felhasználónév vagy email
        $password = $request->input('password');

        // Kiválasztjuk, hogy email vagy username alapján próbálkozzunk
        $credentials = ['password' => $password];

        if (filter_var($loginInput, FILTER_VALIDATE_EMAIL)) {
            $credentials['email'] = $loginInput;
        } else {
            $credentials['username'] = $loginInput;
        }

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            // Hibás próbálkozások és tiltás visszaállítása
            (new BannerController)->resetLoginCounter($user->username);
            (new BannerController)->resetBanningTime($user->username);

            // Token létrehozása
            $token = $user->createToken($user->username . "Token")->plainTextToken;

            $data = [
                "username" => $user->username,
                "token" => $token
            ];

            return $this->sendResponse($data, "Sikeres bejelentkezés");
        } else {
            // Hibás próbálkozások kezelése
            (new BannerController)->setLoginCounter($loginInput);
            $counter = (new BannerController)->getLoginCounter($loginInput);
            $banningTime = (new BannerController)->getBanningTime($loginInput);

            if ($counter > 3 && $banningTime != null) {
                $errorMessage = [
                    "Következő lehetőség: ",
                    $banningTime
                ];
                return $this->sendError("Azonosítási hiba", $errorMessage, 405);
            } else {
                (new BannerController)->setBanningTime($loginInput);
                return $this->sendError("Azonosítási hiba", "Hibás felhasználónév vagy jelszó", 401);
            }
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
