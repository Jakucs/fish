<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class LocationRequest extends FormRequest
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
            'product_id'  => 'required|exists:products,id',
            'postal_code' => 'required|string|max:10',
            'city'        => 'required|string|max:255',
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
        'product_id.required' => 'A termék azonosítója kötelező.',
        'product_id.exists'   => 'A megadott termék azonosító nem létezik.',
        'postal_code.required' => 'Az irányítószám megadása kötelező.',
        'postal_code.string'   => 'Az irányítószámnak szövegnek kell lennie.',
        'postal_code.max'      => 'Az irányítószám maximum 10 karakter lehet.',
        'city.required'        => 'A város megadása kötelező.',
        'city.string'          => 'A városnak szövegnek kell lennie.',
        'city.max'             => 'A város maximum 255 karakter lehet.',
    ];
}




}
