<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\ProductController;
use App\Http\Controllers\api\CartController;
use Illuminate\Support\Facades\Redirect;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post("/register", [AuthController::class, "register"]);
Route::post("/login", [AuthController::class, "login"]);
Route::get("/me", [AuthController::class, "me"])->middleware("auth:sanctum");

// Products

Route::get("/products", [ProductController::class, "index"]);
Route::get("/products/{id}", [ProductController::class, "show"]);
Route::post("/products", [ProductController::class, "store"])->middleware(["auth:sanctum"]);
Route::post("/products/{id}", [ProductController::class, "update"])->middleware(["auth:sanctum"]);
Route::delete("/products/{id}", [ProductController::class, "destroy"])->middleware(["auth:sanctum"]);

// Cart

Route::post("/carts/{id}", [CartController::class, "store"])->middleware(["auth:sanctum"]);

Route::get("/success", function() {
    return Redirect::to("https://example.com/success");
})->name("success");