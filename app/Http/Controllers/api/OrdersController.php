<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Throwable;

class OrdersController extends Controller {

    public function index(Request $request) {
        try {
            $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
            $response = (array) $stripe->invoices->search(["query" => 'customer:"'.$request->user()->stripe_id.'"'])["data"];
            if (empty($response)) {
                return response()->json(["message" => "Empty previous orders."]);
            } else {
                $invoices = array_reduce($response, function($accumulator, $item) {
                    if ($item->paid === true) {
                        $products = array_reduce((array) $item->lines->data, function($accumulator, $item) {
                            $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
                            $product = $stripe->products->retrieve($item->price->product);
                            array_push($accumulator, [(object) ["id" => $product->id, "name" => $product->name, "description" => $product->description, "photo" => (!$product->images) ? "" : $product->images[0], "price" => $item->price->unit_amount / 100, "quantity" => $item->quantity]]);
                            return $accumulator;
                        }, []);
                        array_push($accumulator, (object) ["id" => $item->id, "totalPrice" => $item->amount_paid, "creationDate" => date("Y-m-d H:m:s", $item->created), "products" => $products, "url" => $item->hosted_invoice_url]);
                    }
                    return $accumulator;
                }, []);
                return response()->json($invoices);
            }
            return response()->json($response);
        } catch (Throwable $e) {
            return response()->json(["error" => "Internal server error."])->setStatusCode(500);
        }
    }
}