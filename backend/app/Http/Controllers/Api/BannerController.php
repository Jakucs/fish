<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Carbon\Carbon;

class BannerController extends Controller
{
    public function getLoginCounter($username)
    {
        $user = User::where("username", $username)->first();
        return $user ? $user->login_counter : 0;
    }

    public function setLoginCounter($username)
    {
        $user = User::where("username", $username)->first();
        if ($user) {
            $user->increment("login_counter");
        }
    }

    public function resetLoginCounter($username)
    {
        $user = User::where("username", $username)->first();
        if ($user) {
            $user->login_counter = 0;
            $user->update();
        }
    }

    public function getBanningTime($username)
    {
        $user = User::where("username", $username)->first();
        return $user ? $user->banning_time : null;
    }

    public function setBanningTime($username)
    {
        $user = User::where("username", $username)->first();
        if ($user) {
            $user->banning_time = Carbon::now()->addMinutes(1);
            $user->update();
        }
    }

    public function resetBanningTime($username)
    {
        $user = User::where("username", $username)->first();
        if ($user) {
            $user->banning_time = null;
            $user->update();
        }
    }
}
