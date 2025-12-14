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

        public function messages(){
        return [
            "type.required" => "Típus megadása szükséges",
            "type.min" => "Típus minimum 3 karakter kell legyen",
            "type.max" => "Típus maximum 20 karakter kell legyen",
            "type.unique" => "Ez a típus már létezik"
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
