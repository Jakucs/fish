<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description');
            $table->unsignedBigInteger('type_id'); // kell az UNSIGNED
            $table->foreign('type_id')->references('id')->on('types')->onDelete('cascade');
            $table->integer('price');
            $table->string('image');
            $table->integer('stock');
            $table->timestamps();
            $table->engine = 'InnoDB'; // biztos, ami biztos
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
