<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;



class AuthController extends ResponseController
{
    public function register(RegisterRequest $request){
        $request->validated();
        $user = User::create([
            "username" => $request["username"],
            "email" => $request["email"],
            "firstname" => $request["firstname"],
            "lastname" => $request["lastname"],
            "password" => bcrypt($request["password"]),
            'role' => 0, // mindig normál user
        ]);
        return $this->sendResponse($user, "Sikeres regisztráció");
    }

            public function login(LoginRequest $request)
            {
                    $request->validated();

                    $loginInput = $request->input('login');
                    $password = $request->input('password');

                    $credentials = ['password' => $password];
                    if (filter_var($loginInput, FILTER_VALIDATE_EMAIL)) {
                        $credentials['email'] = $loginInput;
                    } else {
                        $credentials['username'] = $loginInput;
                    }

                        // ⛔️ Ellenőrzés: tiltva van-e a felhasználó
                    $banner = new BannerController();
                    $banningTime = $banner->getBanningTime($loginInput);

                    if ($banningTime && Carbon::parse($banningTime)->isFuture()) {
                        // Még tart a tiltás
                        return $this->sendError(
                            "Túl sok sikertelen próbálkozás",
                            ["Túl sok sikertelen próbálkozás. Következő lehetőség: ", $banningTime],
                            403
                        );
                    }

                    // Ha lejárt, akkor feloldjuk
                    if ($banningTime && Carbon::parse($banningTime)->isPast()) {
                        $banner->resetBanningTime($loginInput);
                        $banner->resetLoginCounter($loginInput);
                    }

                    if (Auth::attempt($credentials)) {
                        $user = Auth::user();

                        (new BannerController)->resetLoginCounter($user->username);
                        (new BannerController)->resetBanningTime($user->username);

                        $token = $user->createToken($user->username . "Token")->plainTextToken;

                        $data = [
                            "name" => $user->username,
                            "user_id" => $user->id,
                            "email" => $user->email,
                            "token" => $token
                        ];

                        return $this->sendResponse($data, "Sikeres bejelentkezés");
                    } else {
                        $banner = new BannerController();

                        // előbb növeljük a számlálót
                        $banner->setLoginCounter($loginInput);

                        // lekérjük az aktuális értékeket
                        $counter = $banner->getLoginCounter($loginInput);
                        $banningTime = $banner->getBanningTime($loginInput);

                        // ha most lépte túl a 3-at -> tiltás beállítása és hibaüzenet
                        if ($counter > 3) {
                            if (!$banningTime) {
                                $banner->setBanningTime($loginInput);
                                $banningTime = $banner->getBanningTime($loginInput);
                            }

                            $errorMessage = [
                                "Következő lehetőség: ",
                                $banningTime
                            ];
                            return $this->sendError("Túl sok sikertelen próbálkozás", $errorMessage, 405);
                        }

                        // ha még nem tiltott, sima hiba
                        return $this->sendError("Azonosítási hiba", "Hibás felhasználónév vagy jelszó", 401);
                    }
            }






    public function logout() {
        $user = auth("sanctum")->user();
        $user->currentAccessToken()->delete();
        return $this->sendResponse( $user->name, "Sikeres kijelentkezés" );
    }



    public function getUserDetails(Request $request) {
        return response()->json([
            'success' => true,
            'data' => $request->user()
        ]);
    }





            // Megnézzük valós időben, hogy létezik-e ilyen telefonszámú user
            public function checkPhone(Request $request)
            {
                $phone = $request->query('phone');

                $exists = \App\Models\User::where('phone_number', $phone)->exists();

                return response()->json([
                    'exists' => $exists
                ]);
            }


            // Csak adminoknak
            public function getUsers(Request $request)
            {
                // Ellenőrizzük, hogy az aktuális user admin-e
                $user = $request->user();
                if ($user->role !== 'admin') {
                    return response()->json([
                        'success' => false,
                        'message' => 'Unauthorized'
                    ], 403);
                }

                // Visszaadjuk az összes felhasználót
                $users = User::select('id', 'name', 'email', 'role', 'created_at')->get();

                return response()->json([
                    'success' => true,
                    'users' => $users
                ]);
            }
}
