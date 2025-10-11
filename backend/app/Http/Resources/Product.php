<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class Product extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
        public function toArray($request)
        {
            return [
                'id' => $this->id,
                'name' => $this->name,
                'description' => $this->description,
                'type_id' => $this->type_id,
                'price' => $this->price,
                'image' => $this->image,
                'condition' => $this->condition, // új mező
                'status' => $this->status,       // új mező
                'postal_code' => $this->location?->postal_code,
                'city' => $this->location?->city,
                'created_at' => $this->created_at?->format('Y.m.d H:i'),
                'type' => $this->type ? $this->type->type : null,
                'user' => [
                    'firstname' => $this->user?->firstname,
                    'lastname' => $this->user?->lastname,
                    'email' => $this->user?->email,
                    'phone_number' => $this->user?->phone_number
                ],
            ];
        }

}