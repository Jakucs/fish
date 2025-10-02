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
            "name" => "required | min:3 | max:30",
            "description" => "max:200",
            "type_id" => "required",
            "price" => "required | numeric",
            "image" => "required"
        ];
    }


    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            "success" =>false,
            "errors" => $validator->errors(),
            "message" => "Adatbeviteli hiba"
        ]));
    }

        public function messages()
        {
        return [
            "name.required" => "Product megadása szükséges",
            "name.min" => "Product minimum 3 karakter kell legyen",
            "name.max" => "Product maximum 30 karakter kell lehet",

            "description.max" => "A leírás maximum 200 karakter lehet",
            "type_id.required" => "A típus megadása kötelező",
            "price.required" => "Az ár megadása kötelező",
            "price.numeric" => "Az ár csak szám lehet",
            "image.required" => "A kép megadása kötelező"
        ];
    }
}
