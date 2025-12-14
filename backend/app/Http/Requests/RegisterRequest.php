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
            "username" => "required|min:3|max:20|unique:users,username|regex:/^(?![0-9]+$).*/",
            "email" => "required|email|unique:users,email",
            "firstname" => "required|min:3|max:15",
            "lastname" => "required|min:3|max:15",
            "password" => ["required",
                "min:7",
                "regex:/[a-z]/",
                "regex:/[A-Z]/",
                "regex:/[0-9]/"
        ],
        "confirm_password" => "same:password"
        ];
    }

    	    public function messages(){
                return [
                    "username.required" => "Felhasználónév megadása kötelező.",
                    "username.unique"   => "Ez a felhasználónév már foglalt.",
                    "username.min"      => "Felhasználónév nem lehet kevesebb mint 3 karakter.",
                    "username.max"      => "Felhasználónév nem lehet hosszabb mint 20 karakter.",
                    "username.regex"    => "A felhasználónév nem állhat csak számokból.",

                    "email.required"    => "Az email cím megadása kötelező.",
                    "email.unique"      => "Ez az email cím már foglalt.",
                    "email.email"       => "Érvényes email címet adj meg.",

                    "firstname.required"=> "Vezetéknév megadása kötelező.",
                    "firstname.min"     => "Vezetéknév legalább 3 karakter.",
                    "firstname.max"     => "Vezetéknév legfeljebb 15 karakter lehet.",

                    "lastname.required" => "Keresztnév megadása kötelező.",
                    "lastname.min"      => "Keresztnév legalább 3 karakter.",
                    "lastname.max"      => "Keresztnév legfeljebb 15 karakter lehet.",

                    "password.required" => "A jelszó megadása kötelező.",
                    "password.min"      => "A jelszónak legalább 7 karakter hosszúnak kell lennie.",
                    "password.regex"    => "A jelszónak tartalmaznia kell kis- és nagybetűt, valamint számot.",

                    "confirm_password.same" => "A jelszavak nem egyeznek."
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
