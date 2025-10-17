<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
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
            "login" => "required|string",
            "password" => "required"
        ];
    }

        public function messages() {

        return [
            "login.required" => "Add meg a felhasználóneved vagy e-mail címed.",
            "password.required" => "Jelszó elvárt."
        ];
    }

    	    public function failedValidation(Validator $validator)
            {
                $response = response()->json([
                    "success" => false,
                    "message" => "Adatbeviteli hiba",
                    "errors" => $validator->errors()
                ], 422); // ✅ státuszkód itt a response()->json() része

                throw new HttpResponseException($response); // ✅ csak a response objektum megy a konstruktorba
            }
}
