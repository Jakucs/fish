<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Carbon\Carbon;

class BannerController extends Controller
{
    public function getLoginCounter($name){
        $user = User::where("name", $name)->first();
        $counter = $user->login_counter;
        return $counter;
    }

    public function setLoginCounter($name){
        $user = User::where("name", $name)->first();
        $user->increment("login_counter");
    }

    public function resetLoginCounter(){
        $user = User::where("name", $name)->first();
        $user->login_counter = 0;
        $user->update();
    }

    public function getBanningTime(){
        $user = User::where("name", $name)->first();
        return $user->banning_time;
    }

    public function setBanningTime(){
        $user = User::where("name", $name)->first();
        $user->banning_time = Carbon::now()->addminutes(1);
        $user->update();
    }

    public function resetBanningTime(){
        $user = User::where("name", $name)->first();
        $user->banning_time = null;
        $user->update();
    }
}
