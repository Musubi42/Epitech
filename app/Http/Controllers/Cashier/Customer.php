<?php

namespace App\Http\Controllers\Cashier;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Cashier\Cashier;

class Customer extends Controller
{
    public function show(String $stripeId)
    {
        $user = Cashier::findBillable($stripeId);
        return response()->json($user);
    }
}
