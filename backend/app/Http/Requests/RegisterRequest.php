<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class RegisterRequest extends FormRequest
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
            "name" => "required|min:3|max:10",
            "email" => "required|email|unique:users,email",
            "password" => ["required",
                "min:5",
                "regex:/[a-z]/",
                "regex:/[A-Z]/",
                "regex:/[0-9]/"
        ],
        "confirm_password" => "same:password"
        ];
    }

    	    public function messages(){
        return [
            "name.required" => "Név elvárt.",
            "name.unique" => "Ez a név már foglalt",
            "name.min" => "Név nemlehet kevesebb mint 3 karakter",
            "name.max" => "Név nem lehet hosszabb mint 10 karakter",
            "email.required" => "Az email cím megadása kötelező",
            "email.unique" => "Email cím már foglalt (Hibás email cím)",
            "password.required" => "A jelszó megadása kötelező.",
            "password.min" => "A jelszónak legalább 5 karakter hosszúnak kell lennie.",
            "password.confirmed" => "A jelszó megerősítés nem egyezik.",
        ];

    }

    	    public function failedValidation(Validator $validator){
        throw new HttpResponseException(response()->json([
            "success" => false,
            "message" => "Adatbeviteli hiba",
            "errors" => $validator->errors()
        ]));
    }
}
