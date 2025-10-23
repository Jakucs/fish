<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\TypeController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\FavouriteController;

Route::middleware('auth:sanctum')->group(function () {

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
    Route::get( "/userdetails", [ AuthController::class, "getUserDetails"]);
    // Kedvencek végpontja
    Route::post('/favourites/toggle/{productId}', [FavouriteController::class, 'toggle']);

    Route::get ("/products", [ProductController::class, "getProducts"]);

});

Route::post( "/register", [ AuthController::class, "register" ]);
Route::post( "/login", [ AuthController::class, "login" ]);
Route::post( "/logout", [ AuthController::class, "logout" ]);
Route::get( "/users", [ AuthController::class, "getUsers" ]);


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

// Telefonszám ellenőrzése valós időben
Route::get('/check-phone', [AuthController::class, 'checkPhone']);




Route::get( "/users", [ AuthController::class, "getUsers" ]);