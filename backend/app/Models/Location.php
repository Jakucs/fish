<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = [
        'product_id',
        'postal_code',
        'city',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
