<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Js;
use Throwable;

class CartController extends Controller {

    public function index(Request $request) {
        try {
            $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
            $items = [];
            $products = [];
            if (empty($request->user()->session_id)) {
                return response()->json(["message" => "Empty cart."]);
            } else {
                $session = $stripe->checkout->sessions->retrieve($request->user()->session_id);
                if ($session->payment_status !== "paid") {
                    $items = $stripe->checkout->sessions->allLineItems($request->user()->session_id);
                    foreach ($items as &$item) {
                        $price = $stripe->prices->retrieve($item->price->id, []);
                        $product = $stripe->products->retrieve($price->product, []);
                        $products = array_merge($products, [(object) ["id" => $product->id, "name" => $product->name, "description" => $product->description, "photo" => (!$product->images) ? "" : $product->images[0], "price" => $price->unit_amount / 100, "quantity" => $item->quantity]]);
                    }
                } else {
                    $request->user()->session_id = null;
                    $request->user()->save();
                    return response()->json(["message" => "Empty cart."]);
                }
            }
            return response()->json($products);
        } catch (Throwable $e) {
            return response()->json(["error" => "Internal server error."])->setStatusCode(500);
        }
    }

    public function store(Request $request, string $id) {
        try {
            $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
            $products = [];
            $prices = [];
            if (empty($request->user()->session_id)) {
                $product = $stripe->products->retrieve($id);
                $price = $stripe->prices->retrieve($product->default_price);
                $products = array_merge($products, [(object) ["id" => $product->id, "name" => $product->name, "description" => $product->description, "photo" => (!$product->images) ? "" : $product->images[0], "price" => $price->unit_amount / 100, "quantity" => 1]]);
                $prices = array_merge($prices, [$product->default_price => 1]);
            } else {
                $session = $stripe->checkout->sessions->retrieve($request->user()->session_id);
                if ($session->payment_status !== "paid") {
                    $items = $stripe->checkout->sessions->allLineItems($request->user()->session_id);
                    foreach ($items as &$item) {
                        $prices = array_merge($prices, [$item->price->id => $item->quantity]);
                        $price = $stripe->prices->retrieve($item->price->id, []);
                        $product = $stripe->products->retrieve($price->product, []);
                        $products = array_merge($products, [(object) ["id" => $product->id, "name" => $product->name, "description" => $product->description, "photo" => (!$product->images) ? "" : $product->images[0], "price" => $price->unit_amount / 100, "quantity" => $id === $product->id ? $item->quantity + 1 : $item->quantity]]);
                    }
                    $product = $stripe->products->retrieve($id);
                    $price = $stripe->prices->retrieve($product->default_price);
                    if (array_key_exists($product->default_price, $prices)) {
                        $prices = array_merge($prices, [$product->default_price => $prices[$product->default_price] + 1]);
                    } else {
                        $prices = array_merge($prices, [$product->default_price => 1]);
                        $products = array_merge($products, [(object) ["id" => $product->id, "name" => $product->name, "description" => $product->description, "photo" => (!$product->images) ? "" : $product->images[0], "price" => $price->unit_amount / 100, "quantity" => 1]]);
                    }
                } else {
                    $request->user()->session_id = null;
                    $request->user()->save();
                    $product = $stripe->products->retrieve($id);
                    $price = $stripe->prices->retrieve($product->default_price);
                    $products = array_merge($products, [(object) ["id" => $product->id, "name" => $product->name, "description" => $product->description, "photo" => (!$product->images) ? "" : $product->images[0], "price" => $price->unit_amount / 100, "quantity" => 1]]);
                    $prices = array_merge($prices, [$product->default_price => 1]);
                }
            }
            $checkout = $request->user()->checkout($prices, [
                "success_url" => route("success"),
                "cancel_url" => route("success"),
                "client_reference_id" => $request->user()->stripe_id,
                "customer" => $request->user()->stripe_id
            ]);
            $request->user()->session_id = $checkout->id;
            $request->user()->save();
            $object = (object) ["id" => $checkout->id, "totalPrice" => $checkout->amount_total, "creationDate" => date("Y-m-d H:m:s", $checkout->created), "products" => $products, "url" => $checkout->url];
            return response()->json($object);
        } catch (Throwable $e) {
            return response()->json(["error" => "Internal server error."])->setStatusCode(500);
        }
    }

    public function update(Request $request, string $id) {
        try {
            $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
            $products = [];
            $prices = [];
            if (empty($request->user()->session_id)) {
                return response()->json(["message" => "Can not remove product from an empty cart."])->setStatusCode(400);
            } else {
                $session = $stripe->checkout->sessions->retrieve($request->user()->session_id);
                if ($session->payment_status !== "paid") {
                    $items = $stripe->checkout->sessions->allLineItems($request->user()->session_id);
                    foreach ($items as &$item) {
                        $prices = array_merge($prices, [$item->price->id => $item->quantity]);
                        $price = $stripe->prices->retrieve($item->price->id, []);
                        $product = $stripe->products->retrieve($price->product, []);
                        $products = array_merge($products, [(object) ["id" => $product->id, "name" => $product->name, "description" => $product->description, "photo" => (!$product->images) ? "" : $product->images[0], "price" => $price->unit_amount / 100, "quantity" => $id === $product->id ? $item->quantity - 1 : $item->quantity]]);
                    }
                    $product = $stripe->products->retrieve($id);
                    $price = $stripe->prices->retrieve($product->default_price);
                    if (array_key_exists($product->default_price, $prices)) {
                        if ($prices[$product->default_price] !== 1) {
                            $prices = array_merge($prices, [$product->default_price => $prices[$product->default_price] - 1]);
                        } else {
                            unset($prices[$product->default_price]);
                        }
                    } else {
                        return response()->json(["message" => "No product found."])->setStatusCode(400);
                    }
                } else {
                    $request->user()->session_id = null;
                    $request->user()->save();
                    return response()->json(["message" => "Can not remove product from an empty cart."])->setStatusCode(400);
                }
            }
            $object = [];
            if (empty($prices)) {
                $request->user()->session_id = null;
                $request->user()->save();
                return response()->json(["message" => "Empty cart."]);
            } else {
                $checkout = $request->user()->checkout($prices, [
                    "success_url" => route("success"),
                    "cancel_url" => route("success"),
                    "client_reference_id" => $request->user()->stripe_id,
                    "customer" => $request->user()->stripe_id
                ]);
                $request->user()->session_id = $checkout->id;
                $request->user()->save();
                $object = (object) ["id" => $checkout->id, "totalPrice" => $checkout->amount_total, "creationDate" => date("Y-m-d H:m:s", $checkout->created), "products" => $products, "url" => $checkout->url];
            }
            return response()->json($object);
        } catch (Throwable $e) {
            return response()->json(["error" => "Internal server error."])->setStatusCode(500);
        }
    }

    public function validation(Request $request, string $id) {
        try {
            $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
            if (empty($request->user()->session_id)) {
                return response()->json(["message" => "Can not validate an empty cart."])->setStatusCode(400);
            } else {
                $session = $stripe->checkout->sessions->retrieve($request->user()->session_id);
                if ($session->payment_status !== "paid") {
                    $items = $stripe->checkout->sessions->allLineItems($request->user()->session_id);
                    $prices = [];
                    foreach ($items as &$item) {
                        $prices = array_merge($prices, [$item->price->id => $item->quantity]);
                    }
                    $checkout = $request->user()->checkout($prices, [
                        "mode" => "payment",
                        "invoice_creation" => ["enabled" => true],
                        "success_url" => route("success"),
                        "cancel_url" => route("success"),
                        "client_reference_id" => $request->user()->stripe_id,
                        "customer" => $request->user()->stripe_id
                    ]);
                    $request->user()->session_id = $checkout->id;
                    $request->user()->save();
                    return response()->json(["url" => $checkout->url]);
                } else {
                    $request->user()->session_id = null;
                    $request->user()->save();
                    return response()->json(["message" => "Empty cart."]);
                }
            }
        } catch (Throwable $e) {
            return response()->json(["error" => "Internal server error."])->setStatusCode(500);
        }
    }
}
