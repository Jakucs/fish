<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordEmail extends Notification
{
    public $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $url = "http://192.168.100.147:4200/change-password?token={$this->token}&email={$notifiable->email}";

        return (new MailMessage)
            ->subject('Jelszó visszaállítása')
            ->line('Kattints a gombra a jelszó visszaállításához:')
            ->action('Jelszó módosítása', $url)
            ->line('Ha nem te kérted, hagyd figyelmen kívül.');
    }
}
