<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Http\Resources\Product as ProductResource;
use App\Http\Requests\ProductRequest;

class ProductController extends ResponseController
{
        public function getProducts()
    {
        $products = Product::with("type")->get();
        return $this->sendResponse(ProductResource::collection($products), "Adat betöltve");
    }

        public function getProduct(Request $request){
        $product = Product::where("name", $request["name"])->first();
        if(is_null($product)){
            return $this->sendError("Adathiba", ["Nincs ilyen termék"]);
        }
        else
        {
            return $this->sendResponse(new ProductResource($product), "Adat betöltve");
        }
    }


        public function newProduct(ProductRequest $request){
        $request->validated();
        $product = new Product();
        $product->name = $request["name"]; 
        $product->description = $request["description"];
        $product->category = $request["category"];
        $product->price = $request["price"];
        $product->image	= $request["image"];
        $product->stock = $request["stock"];
        $product->save();
        return $this->sendResponse(new ProductResource($product), "Sikeres felvitel!");
    }


        public function updateProduct(ProductRequest $request, $id){
        $request->validated();
        $product = Product::find($id);
        if(is_null($product)){
            return $this->sendError("Adathiba", ["Nincs ilyen termék"]);
        }
        else{
            $product->name = $request["name"]; 
            $product->description = $request["description"];
            $product->category = $request["category"];
            $product->price = $request["price"];
            $product->image	= $request["image"];
            $product->stock = $request["stock"];
            $product->save();
            return $this->sendResponse(new ProductResource($product), "Sikeres módosítás");
        }

    }


    	public function destroyProduct ($id){
        $product = Product::find ($id);
        if(is_null($product)){
            return $this->sendError("Adathiba", ["Nincs ilyen termék"]);
        }
        else{
            $product->delete();
        }

        return $this->sendResponse(new ProductResource($product), "Termék törölve");
    }


}
