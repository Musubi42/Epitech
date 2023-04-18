<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CartController extends Controller {

    public function store(Request $request, string $id) {
        // $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
        // // $stripe->checkout->sessions->expire("cs_test_a11XD7AkgGgFi6PAdXC43goOZCeY5M26sMjprMwsZXbwRAAkfGqZzIRH13", []);
        // $sessions = $stripe->checkout->sessions->all();
        // $products = array_reduce($sessions->data, function($accumulator, $item) {
        //     if ($item->status == "open") {
        //         $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
        //         $allItems = $stripe->checkout->sessions->allLineItems($item->id);
        //         $prices = array_map(fn($element) => ["price" => $element->price->id, "quantity" => 1], $allItems->data);
        //         if (array_key_exists($item->customer, $accumulator)) {
        //             $accumulator[$item->customer] = array_merge($accumulator[$item->customer], ["session" => $item->id, "products" => $prices]);
        //         } else {
        //             $accumulator[$item->customer] = ["session" => $item->id, "products" => $prices];
        //         }
        //     }
        //     return $accumulator;
        // }, []);
        // $product = $stripe->products->retrieve($id, []);
        // var_dump(array_merge($products[$request->user()->stripe_id]["products"], [["price" => $product->default_price, "quantity" => 1]]));
        // $checkout = $stripe->checkout->sessions->create([
        //     "success_url" => "https://example.com/success",
        //     "line_items" => array_merge($products[$request->user()->stripe_id]["products"], [["price" => $product->default_price, "quantity" => 1]]),
        //     "mode" => "payment",
        //     "client_reference_id" => $request->user()->stripe_id,
        //     "customer" => $request->user()->stripe_id
        // ]);



        $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
        $sessions = $stripe->checkout->sessions->all();
        $userSession = array_filter($sessions->data, function($item) use ($request) {
            return $item->status === "open" && $item->customer === $request->user()->stripe_id;
        });
        $items = (empty($userSession)) ? [] : $stripe->checkout->sessions->allLineItems($userSession[0]->id); // Supprimer les anciennes sessions
        $prices = [];
        $products = [];
        foreach ($items as &$item) {
            $prices = array_merge($prices, [$item->price->id => $item->quantity]);
            $price = $stripe->prices->retrieve($item->price->id, []);
            $product = $stripe->products->retrieve($price->product, []);
            $products = array_merge($products, [(object) ["id" => $product->id, "name" => $product->name, "description" => $product->description, "photo" => (!$product->images) ? "" : $product->images[0], "price" => $price->unit_amount/100, "quantity" => $item->quantity]]);
        }
        if (array_key_exists($stripe->products->retrieve($id, [])->default_price, $prices)) {
            $prices = array_merge($prices, [$stripe->products->retrieve($id, [])->default_price => $prices[$stripe->products->retrieve($id, [])->default_price] + 1]); // Décalage de 1
        } else {
            $prices = array_merge($prices, [$stripe->products->retrieve($id, [])->default_price => 1]);
        }
        $checkout = $request->user()->checkout($prices, [
            "success_url" => route("success"),
            "cancel_url" => route("success"),
            "client_reference_id" => $request->user()->stripe_id,
            "customer" => $request->user()->stripe_id
        ]);
        $object = (object) ["id" => $checkout->id, "totalPrice" => $checkout->amount_total, "creationDate" => date("Y-m-d H:m:s", $checkout->created), "products" => $products, "url" => $checkout->url];
        return response()->json($object);
    }

}