<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CartController extends Controller {

    public function index(Request $request) {
        $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
        $sessions = $stripe->checkout->sessions->all(["limit" => 1]);
        $userSession = array_filter($sessions->data, function($item) use ($request) {
            return $item->status === "open" && $item->customer === $request->user()->stripe_id;
        });
        $items = [];
        $prices = [];
        $products = [];
        if (!empty($userSession)) {
            $items = $stripe->checkout->sessions->allLineItems($userSession[0]->id);
        }
        foreach ($items as &$item) {
            $prices = array_merge($prices, [$item->price->id => $item->quantity]);
            $price = $stripe->prices->retrieve($item->price->id, []);
            $product = $stripe->products->retrieve($price->product, []);
            $products = array_merge($products, [(object) ["id" => $product->id, "name" => $product->name, "description" => $product->description, "photo" => (!$product->images) ? "" : $product->images[0], "price" => $price->unit_amount/100, "quantity" => $item->quantity]]);
        }
        return response()->json($products);
    }

    public function store(Request $request, string $id) {
        $request->user()->session_id = "Test";
        $request->user()->save();
        return response()->json();
        // $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
        // $sessions = $stripe->checkout->sessions->all(["limit" => 1]);
        // $userSession = array_filter($sessions->data, function($item) use ($request) {
        //     return $item->status === "open" && $item->customer === $request->user()->stripe_id;
        // });
        // $items = [];
        // $prices = [];
        // $products = [];
        // if (!empty($userSession)) {
        //     // Session already exists
        //     $items = $stripe->checkout->sessions->allLineItems($userSession[0]->id);
        //     $stripe->checkout->sessions->expire($userSession[0]->id, []);
        // } else {
        //     // No session exists
        //     $product = $stripe->products->retrieve($id, []);
        //     $price = $stripe->prices->retrieve($product->default_price, []);
        //     $products = array_merge($products, [(object) ["id" => $product->id, "name" => $product->name, "description" => $product->description, "photo" => (!$product->images) ? "" : $product->images[0], "price" => $price->unit_amount/100, "quantity" => 1]]);
        // }
        // // Retrieve data of all session's products
        // foreach ($items as &$item) {
        //     $prices = array_merge($prices, [$item->price->id => $item->quantity]);
        //     $price = $stripe->prices->retrieve($item->price->id, []);
        //     $product = $stripe->products->retrieve($price->product, []);
        //     $products = array_merge($products, [(object) ["id" => $product->id, "name" => $product->name, "description" => $product->description, "photo" => (!$product->images) ? "" : $product->images[0], "price" => $price->unit_amount/100, "quantity" => $id === $product->id ? $item->quantity + 1 : $item->quantity]]);
        // }
        // if (array_key_exists($stripe->products->retrieve($id, [])->default_price, $prices)) {
        //     $prices = array_merge($prices, [$stripe->products->retrieve($id, [])->default_price => $prices[$stripe->products->retrieve($id, [])->default_price] + 1]);
        // } else {
        //     $prices = array_merge($prices, [$stripe->products->retrieve($id, [])->default_price => 1]);
        //     $product = $stripe->products->retrieve($id, []);
        //     $products = array_merge($products, [(object) ["id" => $product->id, "name" => $product->name, "description" => $product->description, "photo" => (!$product->images) ? "" : $product->images[0], "price" => $price->unit_amount/100, "quantity" => 1]]);
        // }
        // $checkout = $request->user()->checkout($prices, [
        //     "success_url" => route("success"),
        //     "cancel_url" => route("success"),
        //     "client_reference_id" => $request->user()->stripe_id,
        //     "customer" => $request->user()->stripe_id
        // ]);
        // $object = (object) ["id" => $checkout->id, "totalPrice" => $checkout->amount_total, "creationDate" => date("Y-m-d H:m:s", $checkout->created), "products" => $products, "url" => $checkout->url];
        // return response()->json($object);
    }

    public function update(Request $request, string $id) {
        $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
        $sessions = $stripe->checkout->sessions->all(["limit" => 1]);
        $userSession = array_filter($sessions->data, function($item) use ($request) {
            return $item->status === "open" && $item->customer === $request->user()->stripe_id;
        });
        $items = [];
        $prices = [];
        $products = [];
        if (!empty($userSession)) {
            // Session already exists
            $items = $stripe->checkout->sessions->allLineItems($userSession[0]->id);
            $stripe->checkout->sessions->expire($userSession[0]->id, []);
        }
        // Retrieve data of all session's products
        foreach ($items as &$item) {
            $prices = array_merge($prices, [$item->price->id => $item->quantity]);
            $price = $stripe->prices->retrieve($item->price->id, []);
            $product = $stripe->products->retrieve($price->product, []);
            if ($id === $product->id) {
                if ($item->quantity !== 1) {
                    $products = array_merge($products, [(object) ["id" => $product->id, "name" => $product->name, "description" => $product->description, "photo" => (!$product->images) ? "" : $product->images[0], "price" => $price->unit_amount/100, "quantity" => $item->quantity - 1]]);
                } else {
                    // Product is removed
                }
            } else {
                $products = array_merge($products, [(object) ["id" => $product->id, "name" => $product->name, "description" => $product->description, "photo" => (!$product->images) ? "" : $product->images[0], "price" => $price->unit_amount/100, "quantity" => $item->quantity]]);
            }
        }
        if (array_key_exists($stripe->products->retrieve($id, [])->default_price, $prices)) {
            if ($prices[$stripe->products->retrieve($id, [])->default_price] !== 1) {
                $prices = array_merge($prices, [$stripe->products->retrieve($id, [])->default_price => $prices[$stripe->products->retrieve($id, [])->default_price] - 1]);
            } else {
                unset($prices[$stripe->products->retrieve($id, [])->default_price]);
            }
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