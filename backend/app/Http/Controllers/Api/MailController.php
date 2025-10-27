<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Mail\FishDrobemail;
use App\Mail\WelcomeMail; 
use Illuminate\Support\Facades\Mail;


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
}
