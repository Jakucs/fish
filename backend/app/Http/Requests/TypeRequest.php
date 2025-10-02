<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class TypeRequest extends FormRequest
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
            "type" => "required|min:3|max:20|unique"
        ];
    }

    public function failedValidation(Validator $validator)
    {
    throw new HttpResponseException(response()->json([
        "success" => false,
        "errors" => $validator->errors(),
        "message" => "Adatbeviteli hiba"
    ]));
    }

        public function messages(){
        return [
            "type.required" => "Típus megadása szükséges",
            "type.min" => "Típus minimum 3 karakter kell legyen",
            "type.max" => "Típus maximum 20 karakter kell legyen",
            "type.unique" => "Ez a típus már létezik"
        ];
    }
}
