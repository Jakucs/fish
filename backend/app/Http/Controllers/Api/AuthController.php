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

            $banner = new BannerController();
            $banningTime = $banner->getBanningTime($loginInput);

            if ($banningTime && Carbon::parse($banningTime)->isFuture()) {
                return $this->sendError(
                    "Túl sok sikertelen próbálkozás",
                    ["Túl sok sikertelen próbálkozás. Következő lehetőség: ", $banningTime],
                    403
                );
            }

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
                    "role" => $user->role,
                    "token" => $token
                ];

                return $this->sendResponse($data, "Sikeres bejelentkezés");
            } else {
                $banner = new BannerController();

                $banner->setLoginCounter($loginInput);

                $counter = $banner->getLoginCounter($loginInput);
                $banningTime = $banner->getBanningTime($loginInput);

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
        $user = $request->user(); // vagy auth()->user()

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Felhasználó nem bejelentkezett'
            ], 401);
        }

        $userData = $user->only(['id', 'username', 'firstname', 'lastname', 'phone_number', 'email', 'role', 'is_active', 'created_at']);

        return response()->json([
            'success' => true,
            'data' => $userData
        ]);
    }



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

            // Alap query
            $query = User::select('id', 'username', 'email', 'role', 'created_at');

            // Ha van kereső kifejezés
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function($q) use ($search) {
                    $q->where('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('role', 'like', "%{$search}%"); // ha role szám, akkor ->orWhere('role', $search)
                });
            }

            // Lapozás: 30 felhasználó oldalanként
            $users = $query->orderBy('id', 'desc')->paginate(30);

            return response()->json([
                'success' => true,
                'users' => $users->items(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'total' => $users->total()
            ]);
        }


        public function verifyEmail($id, $hash)
        {
            $user = User::findOrFail($id);

            if (! hash_equals(sha1($user->email), $hash)) {
                return response()->json(['message' => 'Invalid verification link'], 403);
            }

            if (! $user->hasVerifiedEmail()) {
                $user->markEmailAsVerified();
            }

            return redirect('http://localhost:4200/email-verified');
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
