<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Type;
use App\Http\Requests\TypeRequest;
use App\Http\Resources\Type as TypeResource;

class TypeController extends ResponseController
{
    public function getTypes(){
        $types = Type::all();
        return TypeResource::collection($types);
    }

    public function getType(Request $request){
        $type = Type::where( "type", $request["type"])->first();
        if(is_null($type)){
            return $this->sendError("Adathiba", ["Nincs ilyen típus"]);
        }
        else{
            return $this->sendResponse(new TypeResource($type), "Adat betöltve");
        }
    }

    public function newType(TypeRequest $request){
        $request->validated();
        $type = new Type();
        $type->type = $request["type"];
        $type->save();
        return new TypeResource($type);
    }

    public function updateType(Request $request, $id){
        $type=Type::find($id);
        if(is_null($type)){
            return $this->sendError("Adathiba", ["Nincs ilyen típus"]);
        }else{
            $type->type = $request["type"];
            $type->update();
            return $this->sendResponse(new TypeResource($type), "Sikeres módosítás");
        }
    }
    
    public function destroyType(Request $request, $id){
        $type = Type::find($id);

        if (is_null($type)) {
            return $this->sendError("Adathiba", ["Nincs ilyen típus"]);
        }

        $type->delete();
        return $this->sendResponse(new TypeResource($type), "Sikeres törlés");
}
}
