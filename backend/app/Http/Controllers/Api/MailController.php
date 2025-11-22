<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Mail\FishDrobemail;
use App\Mail\WelcomeMail; 
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use Illuminate\Support\Facades\URL;
use Illuminate\Auth\Events\Verified;


class MailController extends Controller
{
        public function sendMail(){
        $content = [
            "title" => "Próba email",
            "message" => "Üdvözlet a projektből",
            "version" => "Ez már Laravel 12"
        ];
        Mail::to("bogarkamwebshop@gmail.com")->send(new FishDrobemail($content));
    }






    public function sendWelcomeEmail()
    {
        // Teszt felhasználó
        $user = (object) ['name' => 'Gergely', 'email' => 'jakucs42@gmail.com'];

        // Küldés
        Mail::to("jakucs42@gmail.com")->send(new WelcomeMail($user));

        return "Üdvözlő email elküldve!";
    }


    public function sendVerificationEmail(User $user)
    {
        // Ideiglenes aláírt URL készítése
        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            [
                'id' => $user->id,
                'hash' => sha1($user->email),
            ]
        );

        // E-mail kiküldése
        Mail::raw("Kattints a linkre az e-mail címed megerősítéséhez: {$verificationUrl}", function ($message) use ($user) {
            $message->to($user->email)
                    ->subject('E-mail megerősítés');
        });

        return response()->json(['message' => 'Verification email sent']);
    }

    //  Verifikáció kezelése
    public function verify($id, $hash, Request $request)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Ellenőrizd a hash-t
        if (! hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            return response()->json(['message' => 'Invalid verification link'], 400);
        }

        // Már verifikált?
        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified']);
        }

        // Verifikáljuk
        $user->markEmailAsVerified();
        event(new Verified($user));

        // Redirect Angular felé 
        return redirect('http://192.168.100.147:8000/products'); //VAGY A MEGFELELŐ FRONTEND URL
    }
}
