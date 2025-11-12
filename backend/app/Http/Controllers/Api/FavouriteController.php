<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class FavouriteController extends Controller
{

    public function index(Request $request)
    {
        $user = $request->user();
        $favourites = $user->favourites()->with('category')->get(); // opcionális with()

        return response()->json(['data' => $favourites]);
    }


    public function toggle(Request $request, $productId)
    {
        $user = $request->user();

        $product = Product::find($productId);
        if (!$product) {
            return response()->json(['message' => 'Termék nem található.'], 404);
        }

        $result = $user->favourites()->toggle($productId);
        $isNowFavourite = !empty($result['attached']);

        return response()->json([
            'favourited' => $isNowFavourite,
            'message' => $isNowFavourite
                ? 'Hozzáadva a kedvencekhez.'
                : 'Eltávolítva a kedvencek közül.'
        ], 200);
    }

    public function getFavourites(Request $request)
    {
        $user = $request->user();

        $favourites = $user->favourites()
            ->get();

        return response()->json([
            'data' => $favourites
        ]);
    }

}
