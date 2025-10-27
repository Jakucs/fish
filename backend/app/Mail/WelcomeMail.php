<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class WelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user; // a Blade-nek elérhető

    public function __construct($user)
    {
        $this->user = $user;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Üdvözlet a FishDrobe-ban!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'welcome', // ide készítjük majd a Blade-t
        );
    }
}
