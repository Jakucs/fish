<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Http\Resources\Product as ProductResource;
use App\Http\Requests\ProductRequest;
use Illuminate\Support\Facades\Auth;


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




        public function newProduct(ProductRequest $request){
        $request->validated();
        
        $product = new Product();
        $product->name = $request["name"]; 
        $product->description = $request["description"];
        $product->type_id = $request["type_id"];
        $product->user_id = Auth::id();
        //$product->user_id = $request["user_id"];
        $product->price = $request["price"];
        $product->image	= $request["image"];
        $product->condition = $request["condition"]; // pl. 'új', 'használt', 'újszerű'
        $product->status = $request["status"];       // pl. 'pending', 'active', 'sold', 'archived'
        $product->save();

        // Helyszín mentése a locations táblába
        $product->location()->create([
        'postal_code' => $request['postal_code'],
        'city' => $request['city'],
    ]);


        // 🔹 Telefonszám mentése a users táblába
        if ($request->has('phone_number') && $request['phone_number']) {
            $user = Auth::user(); // vagy User::find($userId)
            $user->phone_number = $request['phone_number'];
            $user->save();
        }

        return $this->sendResponse(new ProductResource($product), "Sikeres felvitel!");
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


                    // ProductController.php
            public function getProductsByType($id)
            {
                $products = Product::where('type_id', $id)
                    ->orderBy('created_at', 'desc')
                    ->take(100) // opcionális limitálás
                    ->get();

                return response()->json($products);
            }



}
