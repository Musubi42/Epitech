<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller {

    public function index() {
        $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
        $response = (array) $stripe->products->all(["active" => true])["data"];
        $products = array_reduce($response, function($accumulator, $item) {
            $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
            $price = $stripe->prices->retrieve($item->default_price);
            $object = (object) ["id" => $item->id, "name" => $item->name, "description" => $item->description, "photo" => (!$item->images) ? "" : $item->images[0], "price" => $price->unit_amount/100];
            array_push($accumulator, $object);
            return $accumulator;
        }, []);
        return response()->json($products);
    }

    public function store(Request $request) {
        $validatedData = $request->validate([
            "name" => "required|string|max:255",
            "description" => "required|string",
            "photo" => "nullable|url",
            "price" => "required|numeric"
        ]);
        $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
        $stripe->products->create([
            "name" => $validatedData["name"],
            "description" => $validatedData["description"],
            "images" => (!$request->photo) ? [] : [$validatedData["photo"]],
            "default_price_data" => [
                "unit_amount" => $validatedData["price"],
                "currency" => "eur"
            ]
        ]);
        return response()->json();
    }

    public function show(string $id) {
        $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
        $product = $stripe->products->retrieve($id);
        $price = $stripe->prices->retrieve($product->default_price);
        $object = (object) ["id" => $product->id, "name" => $product->name, "description" => $product->description, "photo" => (!$product->images) ? "" : $product->images[0], "price" => $price->unit_amount/100];
        return response()->json($product->active ? $object : null);
    }

    public function update(Request $request, string $id) {
        $validatedData = $request->validate([
            "name" => "string|max:255",
            "description" => "string",
            "photo" => "url",
            "price" => "numeric"
        ]);
        $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
        $stripe->products->update($id, [
            "name" => (!$request->name) ? "" : $validatedData["name"],
            "description" => (!$request->description) ? "" : $validatedData["description"],
            "images" => (!$request->photo) ? [] : [$validatedData["photo"]]
        ]);
        return response()->json();
    }

    public function destroy(string $id) {
        $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
        $stripe->products->update($id, [
            "active" => false
        ]);
        return response()->json();
    }
}
