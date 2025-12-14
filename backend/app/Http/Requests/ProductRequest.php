<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => "required | min:3 | max:50 | regex:/^(?![0-9]+$).*/",
            "description" => "max:2000",
            "type_id" => "required",
            "price" => "required | numeric | max:99999999",
            "image" => "nullable|string",
            'postal_code' => 'required | string | size:4 | regex:/^\d{4}$/',
            'city' => 'required | string | min:2 | max:50 | regex:/^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű\s\-]+$/',
        ];
    }


        public function messages()
        {
        return [
            "name.required" => "Product megadása szükséges",
            "name.min" => "Product minimum 3 karakter kell legyen",
            "name.max" => "Product maximum 50 karakter kell lehet",
            'name.regex' => 'A terméknév nem állhat csak számokból.',

            "description.max" => "A leírás maximum 2000 karakter lehet",
            "type_id.required" => "A típus megadása kötelező",
            "price.required" => "Az ár megadása kötelező",
            "price.numeric" => "Az ár csak szám lehet",
            "price.max" => "Az ár nem lehet nagyobb, mint 99 999 999.",
            "image.required" => "A kép megadása kötelező",

            // ⬇️ PostalCode üzenetek
            'postal_code.required' => 'Az irányítószám megadása kötelező.',
            'postal_code.size' => 'Az irányítószám pontosan 4 számjegyből állhat.',
            'postal_code.regex' => 'Az irányítószám csak számokat tartalmazhat.',


            // ⬇️ City üzenetek
            'city.required' => 'A város megadása kötelező.',
            'city.min' => 'A város neve legalább 2 karakter hosszú kell legyen.',
            'city.max' => 'A város neve legfeljebb 50 karakter lehet.',
            'city.regex' => 'A város neve csak betűket, szóközt és kötőjelet tartalmazhat.',

        ];
    }

    	    public function failedValidation(Validator $validator)
            {
                $response = response()->json([
                    "success" => false,
                    "message" => "Adatbeviteli hiba",
                    "errors" => $validator->errors()
                ], 422); // státuszkód itt a response()->json() része

                throw new HttpResponseException($response); // csak a response objektum megy a konstruktorba
            }
}
