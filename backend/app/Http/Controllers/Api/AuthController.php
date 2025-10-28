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
use Illuminate\Support\Facades\Gate;




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
        $user->sendEmailVerificationNotification();
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
                            "role" => $user->role, // ✅ role -t is küldjük.
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



    public function getUserDetailsById($id)
    {
        $admin = auth()->user();

        // Csak admin/superadmin férhet hozzá
        if (!Gate::allows('admin-access')) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $user = User::select('id', 'username', 'firstname', 'lastname', 'phone_number', 'email', 'role', 'is_active', 'created_at')
                    ->find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Felhasználó nem található'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }


        public function getUserDetails(Request $request)
    {
        // A bejelentkezett user lekérése
        $user = $request->user(); // vagy auth()->user()

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Felhasználó nem bejelentkezett'
            ], 401);
        }

        // Csak a szükséges mezőket adhatod vissza
        $userData = $user->only(['id', 'username', 'firstname', 'lastname', 'phone_number', 'email', 'role', 'is_active', 'created_at']);

        return response()->json([
            'success' => true,
            'data' => $userData
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
                $user = $request->user();

                // Ellenőrizzük, hogy az aktuális user admin vagy superadmin
                if (!Gate::allows('admin-access')) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Unauthorized'
                    ], 403);
            }

                // Paginate: 50 felhasználó oldalanként
                $users = User::select('id', 'username', 'email', 'role', 'created_at')
                            ->paginate(30); // ← ez adja vissza a pagination meta adatokat is

                return response()->json([
                    'success' => true,
                    'users' => $users->items(),    // tényleges felhasználók
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'total' => $users->total()
                ]);
            }




            // érzékeny végpont példa - fiók aktív-e
 /*            public function protectedFunction(Request $request)
           {
                $user = $request->user();

                if (!$user || $user->is_active == 0) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Fiókodat felfüggesztettük.'
                    ], 403); // 403 Forbidden
                }

                // A tényleges logika, ha aktív
                return response()->json([
                    'success' => true,
                    'data' => 'Valami érzékeny adat'
                ]);
            }     
                
*/




}
