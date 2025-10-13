<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{

        protected $fillable = [
        'name',
        'description',
        'type_id',
        'user_id',
        'price',
        'image'
    ];

    public function type(){
        return $this->belongsTo(Type::class);
    }

    public function location(){
        return $this->hasOne(Location::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function favouritedBy()
    {
        return $this->belongsToMany(User::class, 'favourites')->withTimestamps();
    }

}
