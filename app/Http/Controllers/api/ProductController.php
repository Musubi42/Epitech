<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class ProductController extends Controller {

    public function index() {
        $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
        $response = (array) $stripe->products->all()["data"];
        $products = array_reduce($response, function($accumulator, $item) {
            $object = (object) ["id" => $item->id, "name" => $item->name, "description" => $item->description, "photo" => (!$item->images) ? "" : $item->images[0]];
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
        $product = $stripe->products->create([
            "name" => $validatedData["name"],
            "description" => $validatedData["description"],
            "images" => (!$request->photo) ? [] : [$validatedData["photo"]]
        ]);
        $price = $stripe->prices->create([
            "unit_amount" => $validatedData["price"],
            "currency" => "eur",
            "product" => $product->id,
        ]);

        return response()->json();
    }

    public function show(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
