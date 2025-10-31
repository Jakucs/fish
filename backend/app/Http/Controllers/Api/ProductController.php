<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Http\Resources\Product as ProductResource;
use App\Http\Requests\ProductRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\QueryException;
use Illuminate\Database\UniqueConstraintViolationException;


class ProductController extends ResponseController
{
        public function getProducts(Request $request)
        {
            $products = Product::with('type', 'user')->get();

            $user = $request->user(); // null, ha nincs bejelentkezve

            $products = $products->map(function ($product) use ($user) {
                $product->is_favourite = $user ? $user->favourites()->where('product_id', $product->id)->exists() : false;
                return $product;
            });

                return response()->json([
                    'data' => ProductResource::collection($products)
                ]);
        }

        public function getProductsPublic()
        {
            $products = Product::with('type', 'user')->get();

            // Nincs user, ezért minden termék is_favourite = false
            $products = $products->map(function ($product) {
                $product->is_favourite = false;
                return $product;
            });

                return response()->json([
                    'data' => ProductResource::collection($products)
                ]);
        }

                            // ProductController.php
            public function getProductsByType(Request $request, $id)
            {
                $products = Product::with('type', 'user')
                    ->where('type_id', $id)
                    ->orderBy('created_at', 'desc')
                    ->take(100)
                    ->get();

                $user = $request->user(); // null, ha nincs bejelentkezve

                // is_favourite mező beállítása
                $products = $products->map(function ($product) use ($user) {
                    $product->is_favourite = $user ? $user->favourites()->where('product_id', $product->id)->exists() : false;
                    return $product;
                });

                return response()->json([
                    'data' => ProductResource::collection($products)
                ]);
            }




        public function getmyads(){
        $userId = Auth::id();
        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'Nincs jogosultságod a művelet végrehajtásához. Kérlek jelentkezz be.'
            ], 401);
    }
        $products = Product::where("user_id", Auth::id())->with("type")->get();
        return $this->sendResponse(ProductResource::collection($products), "Adat betöltve");
        }

        public function getProduct($id){
            $product = Product::with('location', 'user')->find($id);

            if (is_null($product)) {
                return $this->sendError("Adathiba", ["Nincs ilyen termék"]);
            } else {
                return $this->sendResponse(new ProductResource($product), "Adat betöltve");
            }
        }




        public function newProduct(ProductRequest $request)
        {
            try {
                $request->validated();

                $product = new Product();
                $product->name = $request["name"];
                $product->description = $request["description"];
                $product->type_id = $request["type_id"];
                $product->user_id = Auth::id();
                $product->price = $request["price"];
                $product->image = $request["image"];
                $product->image_public_id = json_encode(json_decode($request["image_public_id"], true));
                $product->condition = $request["condition"];
                $product->status = $request["status"];
                $product->save();

                // Helyszín mentése
                $product->location()->create([
                    'postal_code' => $request['postal_code'],
                    'city' => $request['city'],
                ]);

                // Telefonszám mentése
                if ($request->has('phone_number') && $request['phone_number']) {
                    $user = Auth::user();
                    $user->phone_number = $request['phone_number'];
                    $user->save();
                }

                return $this->sendResponse(new ProductResource($product), "Sikeres felvitel!");

            } catch (UniqueConstraintViolationException $e) {
                // 🔹 Konkrétan az egyedi constraint hiba
                return $this->sendError(
                    'A megadott telefonszám már egy másik felhasználóhoz tartozik.',
                    [],
                    409
                );

            } catch (QueryException $e) {
                // 🔹 Egyéb SQL hibák
                return $this->sendError(
                    'Adatbázis hiba történt. Kérlek, próbáld újra később.',
                    [],
                    500
                );

            } catch (\Exception $e) {
                // 🔹 Váratlan hiba
                return $this->sendError(
                    'Váratlan hiba történt. Kérlek, próbáld újra később.',
                    [],
                    500
                );
            }
        }


        public function updateProduct(ProductRequest $request, $id){
            $request->validated();

            $product = Product::find($id);
            if(is_null($product)){
                return $this->sendError("Adathiba", ["Nincs ilyen termék"]);
            }

            // Ellenőrzés: csak a termék tulajdonosa frissíthet
            if($product->user_id !== Auth::id()){
                return $this->sendError("Jogosultsági hiba", ["Ehhez a termékhez nincs jogosultságod"]);
            }

            $product->update([
                'name' => $request->name,
                'description' => $request->description,
                'type_id' => $request->type_id,
                'price' => $request->price,
                'image' => $request->image
            ]);

            return $this->sendResponse(new ProductResource($product), "Sikeres módosítás");
        }


        public function destroyProduct($id)
        {
            $product = Product::find($id);

            if (is_null($product)) {
                return $this->sendError("Adathiba", ["Nincs ilyen termék"], 404);
            }

            // Ellenőrzés: csak a tulajdonos törölheti
            if ($product->user_id !== Auth::id()) {
                return $this->sendError("Jogosultsági hiba", ["Ehhez a termékhez nincs jogosultságod"], 403);
            }

            $product->delete();

            return $this->sendResponse(new ProductResource($product), "Termék törölve");
        }


        //We can modify pictures CRUD

        public function getPictures($id)
        {
            $product = Product::find($id);

            if (!$product) {
                return response()->json(['message' => 'Termék nem található.'], 404);
            }

            // Ha JSON string, dekódoljuk (pl. '["url1","url2"]')
            $image = is_string($product->image)
                ? json_decode($product->image, true)
                : $product->image;

            return response()->json([
                'product_id' => $product->id,
                'image' => $image ?? [],
            ]);
        }




        public function newPicture(Request $request)
        {
            $request->validate([
                'product_id' => 'required|integer|exists:products,id',
                'images' => 'required|array',
                'images.*' => 'string',
            ]);

            $product = Product::findOrFail($request->product_id);

            // meglévő képek + újak összevonása
            $existing = is_string($product->image)
                ? json_decode($product->image, true)
                : ($product->image ?? []);

            $merged = array_merge($existing, $request->images);

            $product->image = json_encode($merged);
            $product->save();

            return response()->json([
                'message' => 'Képek hozzáadva.',
                'images' => $merged,
            ]);
        }


        public function destroyPicture($id, Request $request)
        {
            $request->validate(['url' => 'required|string']);

            $product = Product::findOrFail($id);
            $images = is_string($product->image)
                ? json_decode($product->image, true)
                : [];

            $filtered = array_filter($images, fn($img) => $img !== $request->url);

            $product->image = json_encode(array_values($filtered));
            $product->save();

            return response()->json([
                'message' => 'Kép törölve.',
                'images' => array_values($filtered),
            ]);
        }

        public function updatePicture($id, Request $request)
        {
            $request->validate([
                'index' => 'required|integer',
                'new_url' => 'required|string',
            ]);

            $product = Product::findOrFail($id);
            $images = is_string($product->image)
                ? json_decode($product->image, true)
                : [];

            if (!isset($images[$request->index])) {
                return response()->json(['message' => 'A megadott index nem létezik.'], 404);
            }

            $images[$request->index] = $request->new_url;

            $product->image = json_encode(array_values($images));
            $product->save();

            return response()->json([
                'message' => 'Kép frissítve.',
                'images' => array_values($images),
            ]);
        }





}
