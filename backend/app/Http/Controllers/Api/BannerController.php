<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Carbon\Carbon;

class BannerController extends Controller
{
    public function getLoginCounter($login)
    {
        $user = User::where('username', $login)
            ->orWhere('email', $login)
            ->first();

        return $user ? $user->login_counter : 0;
    }

    public function setLoginCounter($login)
    {
        $user = User::where('username', $login)
            ->orWhere('email', $login)
            ->first();

        if ($user) {
            $user->increment('login_counter');
        }
    }

    public function resetLoginCounter($login)
    {
        $user = User::where('username', $login)
            ->orWhere('email', $login)
            ->first();

        if ($user) {
            $user->login_counter = 0;
            $user->save();
        }
    }

    public function getBanningTime($login)
    {
        $user = User::where('username', $login)
            ->orWhere('email', $login)
            ->first();

        return $user ? $user->banning_time : null;
    }

    public function setBanningTime($login)
    {
        $user = User::where('username', $login)
            ->orWhere('email', $login)
            ->first();

        if ($user) {
            $user->banning_time = Carbon::now()->addHours(1); // Átkéne gondolni a User élmény és biztonság közto egyensúlyt
            $user->save();
        }
    }

    public function resetBanningTime($login)
    {
        $user = User::where('username', $login)
            ->orWhere('email', $login)
            ->first();

        if ($user) {
            $user->banning_time = null;
            $user->save();
        }
    }

}
