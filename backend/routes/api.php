<?php

use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Http\Middleware\CheckIfActive;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Password;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\TypeController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\FavouriteController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\MailController;

Route::middleware(['auth:sanctum', CheckIfActive::class])->group(function () {

    // Bejelentkezett user adatai
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Hirdetések végpontja
    //Route::get('ads', [AdController::class, 'getAds']);
    //Route::put('updateAd/{id}', [AdController::class, 'modifyAd']);
    //Route::delete('destroyAd/{id}', [AdController::class, 'destroyAd']);

    Route::get ("/getmyads", [ProductController::class, "getmyads"]);
    Route::post ("/newproduct", [ProductController::class, "newProduct"]);
    Route::put ("/updateproduct/{id}", [ProductController::class, "updateProduct"]);
    Route::delete ("/destroyproduct/{id}", [ProductController::class, "destroyProduct"]);
    Route::get( "/userdetails/{id}", [ AuthController::class, "getUserDetailsById"]);
    Route::get( "/userdetails", [ AuthController::class, "getUserDetails"]);
    // Kedvencek végpontja
    Route::post('/favourites/toggle/{productId}', [FavouriteController::class, 'toggle']);
    Route::get('/favourites', [FavouriteController::class, 'getFavourites']);

    Route::get ("/products", [ProductController::class, "getProducts"]);
    Route::get( "/users", [ AuthController::class, "getUsers" ]);

    Route::put('/users/{id}/toggle-active', [UserController::class, 'toggleActive']);
    Route::put('/users/{id}/toggle-admin-role', [UserController::class, 'toggleAdminRole']);

});

Route::post( "/register", [ AuthController::class, "register" ]);
Route::post( "/login", [ AuthController::class, "login" ]);
Route::post( "/logout", [ AuthController::class, "logout" ]);


Route::get ("/product/{id}", [ProductController::class, "getProduct"]);
Route::get("/products/public", [ProductController::class, "getProductsPublic"]);

Route::get ("/types", [TypeController::class, "getTypes"]);
Route::get ("/type", [TypeController::class, "getType"]);
Route::post ("/newtype", [TypeController::class, "newType"]);
Route::put ("/updatetype/{id}", [TypeController::class, "updateType"]);
Route::delete ("/destroytype/{id}", [TypeController::class, "destroyType"]);

Route::get("/getproductsbytype/{id}", [ProductController::class, "getProductsByType"]);

Route::post ("/newlocation", [LocationController::class, "newLocation"]);

Route::get("/pictures/{id}", [ProductController::class, "getPictures"]);
Route::post("/newpicture", [ProductController::class, "newPicture"]);
Route::delete("/destroypicture/{id}", [ProductController::class, "destroyPicture"]);
Route::put("/updatepicture/{id}", [ProductController::class, "updatePicture"]);

Route::get('/products/search', [ProductController::class, 'search']);

// Telefonszám ellenőrzése valós időben
Route::get('/check-phone', [AuthController::class, 'checkPhone']);


Route::get("/email", [MailController::class, "sendMail"]);
Route::get('/send-welcome', [MailController::class, 'sendWelcomeEmail']);

//Reset password--->
Route::get('/reset-password/{token}', function ($token, Request $request) {
    return response()->json([
        'token' => $token,
        'email' => $request->email
    ]);
})->name('password.reset');

Route::post('/forgot-password', function (Request $request) {
    $request->validate(['email' => 'required|email']);

    $status = Password::sendResetLink($request->only('email'));

    return $status === Password::RESET_LINK_SENT
        ? response()->json(['message' => 'Jelszó-visszaállító email elküldve.'])
        : response()->json(['message' => 'Nem sikerült elküldeni az emailt.'], 400);
})->name('password.email');
// <--- Reset password





Route::get('/email/verify/{id}/{hash}', [MailController::class, 'verify'])
    ->name('verification.verify');

    Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->name('verification.verify');


Route::post('/email/send-verification', function (Request $request) {
    $user = \App\Models\User::find($request->user_id);
    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    (new \App\Http\Controllers\MailController)->sendVerificationEmail($user);
});