<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FavouriteController extends Controller
{
        public function toggle(Request $request, $productId)
        {
            $user = $request->user();

            //  létezik-e a termék
            if (!\App\Models\Product::find($productId)) {
                return response()->json(['message' => 'Termék nem található.'], 404);
            }

            // hozzáadja, ha nincs, és eltávolítja, ha már benne van
            $result = $user->favourites()->toggle($productId);

            // Laravel toggle visszaad egy tömböt:
            // ['attached' => [id...], 'detached' => [id...]]
            $isNowFavourite = !empty($result['attached']);

            return response()->json([
                'favourited' => $isNowFavourite,
                'message' => $isNowFavourite
                    ? 'Hozzáadva a kedvencekhez.'
                    : 'Eltávolítva a kedvencek közül.'
            ], 200);
        }

}
