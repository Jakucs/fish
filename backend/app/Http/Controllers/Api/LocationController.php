<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Location;
use App\Http\Requests\LocationRequest;

class LocationController extends Controller
{
    public function newLocation(LocationRequest $request)
    {
        $validated = $request->validated();
        $location = new Location();
        $location->product_id = $validated['product_id']; // kötelező
        $location->postal_code = $validated['postal_code'];
        $location->city = $validated['city'];
        $location->save();

        return response()->json(['location' => $location]);
    }

}
