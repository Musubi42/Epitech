<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{

    public function register(Request $request)
    {
        $request->validate([
            "firstname" => "required|string|max:255",
            "lastname" => "required|string|max:255",
            "email" => "required|string|email|max:255|unique:users",
            "password" => "required|string|min:8"
        ]);

        $allowed_fields = array(
            "firstname",
            "lastname",
            "email",
            "password"
        );

        $input_fields = array_keys($request->all());

        $non_valid_fields = array_diff($input_fields, $allowed_fields);

        if (!empty($non_valid_fields)) {
            // Handle non-valid fields
            return response()->json(['error' => 'Invalid fields: ' . implode(', ', $non_valid_fields)], 400);
        }

        $user = User::create([
            "firstname" => $request["firstname"],
            "lastname" => $request["lastname"],
            "email" => $request["email"],
            "password" => Hash::make($request["password"]),
        ]);
        $user->createAsStripeCustomer();
        $token = $user->createToken("auth_token")->plainTextToken;
        return response()->json(["token" => $token, "type" => "Bearer"]);
    }

    public function login(Request $request)
    {
        $allowed_fields = array(
            "email",
            "password"
        );

        $input_fields = array_keys($request->all());

        $non_valid_fields = array_diff($input_fields, $allowed_fields);

        if (!empty($non_valid_fields)) {
            // Handle non-valid fields
            return response()->json(['error' => 'Invalid fields: ' . implode(', ', $non_valid_fields)], 400);
        }

        if (!Auth::attempt($request->only("email", "password"))) {
            return response()->json(["message" => "Invalid login details"], 401);
        }
        $user = User::where("email", $request["email"])->firstOrFail();
        $token = $user->createToken("auth_token")->plainTextToken;
        return response()->json(["token" => $token, "type" => "Bearer"]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        $object = (object) ["login" => $user->email, "email" => $user->email, "firstname" => $user->firstname, "lastname" => $user->lastname];
        return response()->json($object);
    }

    public function update(Request $request)
    {
        $request->validate([
            'lastname' => 'string|max:255',
            'firstname' => 'string|max:255',
            'email' => 'email|unique:users,email,',
            'password' => 'string|min:8'
        ]);

        $allowed_fields = array(
            "firstname",
            "lastname",
            "email",
            "password"
        );

        // $allowed_fields = array_keys($rules);
        $input_fields = array_keys($request->all());

        $non_valid_fields = array_diff($input_fields, $allowed_fields);

        if (!empty($non_valid_fields)) {
            // Handle non-valid fields
            return response()->json(['error' => 'Invalid fields: ' . implode(', ', $non_valid_fields)], 400);
        }

        $user = $request->user();
        $user->update([
            "firstname" => $request->firstname ? $request->firstname : $user->firstname,
            "lastname" => $request->lastname ? $request->lastname : $user->lastname,
            "login" => $request->email ? $request->email : $user->email,
            "email" => $request->email ? $request->email : $user->email,
            "password" => $request->password ? Hash::make($request["password"]) : $user->password,
        ]);

        return response()->json("User successfully updated!");
    }
}
