<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Throwable;

class OrdersController extends Controller {

    public function index(Request $request) {
        try {
            $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
            $invoices = $stripe->invoices->search(["query" => 'customer:"'.$request->user()->stripe_id.'"']);
            
            return response()->json($invoices);
        } catch (Throwable $e) {
            return response()->json(["message" => "Internal server error."])->setStatusCode(500);
        }
    }
}