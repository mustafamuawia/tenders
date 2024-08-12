<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UserController;
use App\Http\Controllers\TenderController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\unit_groupController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\RequestForQuotationController;
use App\Http\Controllers\ItemController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public routes
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/user/create', [UserController::class, 'create'])->name('create');

// Authenticated routes
Route::middleware(['auth:api'])->group(function () {
    // Admin routes
    Route::post('/user/createadmin', [UserController::class, 'createadmin'])->name('createadmin');
    Route::post('/admin/changestatus', [UserController::class, 'changeStatus']);
    Route::get('/admin/fetch', [UserController::class, 'fetchAdmin']);
    Route::put('/admin/edit/{id}', [UserController::class, 'updateadmin']);
    Route::delete('/admin/delete/{id}', [UserController::class, 'deleteadmin']);

       // Partner routes
    Route::get('/user/fetch', [UserController::class, 'getPartners'])->name('getPartners');
    Route::put('/user/edit/{id}', [UserController::class, 'edit']);
    Route::delete('/user/delete/{id}', [UserController::class, 'delete']);
    Route::get('/user/getadmin', [UserController::class, 'getusers'])->name('getadmin');
    Route::get('/user/{id}', [UserController::class, 'getUser']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Project routes
    Route::apiResource('projects', ProjectController::class);

    //Clients routes
    Route::apiResource('clients', ClientController::class);
    Route::post('changeclientstatus', [ClientController::class, 'changeStatus']);

    //Items routes
    Route::apiResource('items', ItemController::class);
    Route::post('changeitemstatus', [ItemController::class, 'changeStatus']);

    Route::apiResource('units', UnitController::class);

    
    //Unit Groups routes
    Route::apiResource('unitgroups', unit_groupController::class);
    Route::post('unitgroups/change-status', [unit_groupController::class, 'change_status']);

    // JWT routes
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('me', [AuthController::class, 'me']);
});
