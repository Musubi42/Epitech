<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{

    public function index()
    {
        $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
        $response = (array) $stripe->products->all(["active" => true])["data"];
        $products = array_reduce($response, function ($accumulator, $item) {
            $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
            $price = $stripe->prices->retrieve($item->default_price);
            $object = (object) ["id" => $item->id, "name" => $item->name, "description" => $item->description, "photo" => (!$item->images) ? "" : $item->images[0], "price" => $price->unit_amount / 100];
            array_push($accumulator, $object);
            return $accumulator;
        }, []);
        return response()->json($products)->setStatusCode(200);
    }

    public function store(Request $request)
    {
        $rules = [
            "name" => "required|string|max:255",
            "description" => "required|string",
            "photo" => "nullable|url",
            "price" => "required|numeric"
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            // Handle validation errors
            return redirect()->back()->withErrors($validator);
        }

        $allowed_fields = array_keys($rules);
        $input_fields = array_keys($request->all());

        $non_valid_fields = array_diff($input_fields, $allowed_fields);

        if (!empty($non_valid_fields)) {
            // Handle non-valid fields
            return response()->json(['error' => 'Invalid fields: ' . implode(', ', $non_valid_fields)], 400);
        }

        $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
        $stripe->products->create([
            "name" => $request["name"],
            "description" => $request["description"],
            "images" => (!$request->photo) ? [] : [$request["photo"]],
            "default_price_data" => [
                "unit_amount" => $request["price"],
                "currency" => "eur"
            ]
        ]);
        return response()->json("Product successfully created")->setStatusCode(201);
    }

    public function show(string $id)
    {
        $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
        $product = $stripe->products->retrieve($id);
        $price = $stripe->prices->retrieve($product->default_price);
        $object = (object) ["id" => $product->id, "name" => $product->name, "description" => $product->description, "photo" => (!$product->images) ? "" : $product->images[0], "price" => $price->unit_amount / 100];
        return response()->json($product->active ? $object : null)->setStatusCode(200);
    }

    public function update(Request $request, string $id)
    {
        $rules = [
            "name" => "string|max:255",
            "description" => "string",
            "photo" => "url",
            "price" => "numeric"
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            // Handle validation errors
            return redirect()->back()->withErrors($validator);
        }

        $allowed_fields = array_keys($rules);
        $input_fields = array_keys($request->all());

        $non_valid_fields = array_diff($input_fields, $allowed_fields);

        if (!empty($non_valid_fields)) {
            // Handle non-valid fields
            return response()->json(['error' => 'Invalid fields: ' . implode(', ', $non_valid_fields)], 400);
        }

        $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
        $stripe->products->update($id, [
            "name" => (!$request->name) ? "" : $request["name"],
            "description" => (!$request->description) ? "" : $request["description"],
            "images" => (!$request->photo) ? [] : [$request["photo"]]
        ]);
        return response()->json("Product successfully updated")->setStatusCode(200);
    }

    public function destroy(string $id)
    {
        $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
        $stripe->products->update($id, [
            "active" => false
        ]);
        return response()->json()->setStatusCode(204);
    }
}
