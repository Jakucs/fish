<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MailController extends Controller
{
        public function sendMail(){
        $content = [
            "title" => "Próba email",
            "message" => "Üdvözlet a projektből",
            "version" => "Ez már Laravel 12"
        ];
        Mail::to("bogarkamwebshop@gmail.com")->send(new TesztMail($content));
    }
}
