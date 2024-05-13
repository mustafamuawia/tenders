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
Route::post('/user/create',[UserController::class, 'create'])->name('create');
Route::post('/user/createadmin',[UserController::class, 'createadmin'])->name('createadmin');

Route::post('/login',[AuthController::class, 'login'])->name('login');


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
//Route::post('create',[AuthController::class, 'create'])->name('create');
Route::group([

    'middleware' => 'api',
    'prefix' => ''

], function ($router) {
    //project
    Route::apiResource('projects', ProjectController::class);

    Route::apiResource('clients', ClientController::class);

    Route::apiResource('items', ItemController::class);

    Route::apiResource('units', UnitController::class);

    Route::apiResource('unitgroups', unit_groupController::class);
//     Route::post('/tender/create',[TenderController::class, 'create'])->name('create');
//     Route::post('/tender/update',[TenderController::class, 'update'])->name('update');
//     Route::get('/tender/delete/{id}',[TenderController::class, 'delete'])->name('delete');
//     Route::get('/tender/gettenders',[TenderController::class, 'getall'])->name('getall');

// //user
// Route::get('/user/getusers',[UserController::class, 'getusers'])->name('getusers');
// Route::post('/user/changestatus',[UserController::class, 'changestatus'])->name('changestatus');
// Route::get('/user/delete/{id}',[UserController::class, 'delete'])->name('delete');
// Route::post('/user/updateuser',[UserController::class, 'updateuser'])->name('updateuser');
// Route::post('/user/updateadmin',[UserController::class, 'updateadmin'])->name('updateadmin');

// //partner
// Route::get('/partner/getpartners',[PartnerController::class, 'getpartners'])->name('getpartners');
// Route::get('/partner/delete/{id}',[PartnerController::class, 'delete'])->name('delete');
 
//    //  Route::post('login', 'AuthController@login');
//      //Route::post('create', 'AuthController@create');
   
//     // client
//     Route::get('/client/getclients',[]);
    // Route::post('logout', 'AuthController@logout');
    // Route::post('refresh', 'AuthController@refresh');
    // Route::post('me', 'AuthController@me');

});
