<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Exception;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
class ClientController extends Controller
{
    /**
     * @OA\get(
     *      path="/clients",
     *      operationId="get_all_clients",
     *      tags={"Clients"},
     *      summary="Get list of clients",
     *      description="get all clients",
     *      security={{"bearer_token":{}}},
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *       ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthenticated",
     *      ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      )
     *     )
     */

   public function index()
   {
    $clients = Client::where('status',1)->where('partner_id',1)->get();
    return response()->json(['clients' => $clients], 200);   
    }
   /**
    * Show the form for creating a new resource.
    *
    * @return \Illuminate\Http\Response
    */
   public function create()
   {
       //
   }
       
   /**
     * @OA\Post(
     *      path="/clients",
     *      operationId="store_client",
     *      tags={"Clients"},
     *      summary="store client",
     *      description="store client",
     *     @OA\Parameter(
     *          name="client_name",
     *          description="Client Name",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="text"
     *          ) ),
     * @OA\Parameter(
     *          name="phone",
     *          description="phone",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="text"
     *          )
     *      ),
     *     @OA\Parameter(
     *          name="city",
     *          description="city",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="text"
     *          ) ),
     *     @OA\Parameter(
     *          name="state",
     *          description="State",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="text"
     *          ) ),
     *     @OA\Parameter(
     *          name="country",
     *          description="country",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="text"
     *          ) ),
     *     @OA\Parameter(
     *          name="address",
     *          description="Address",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="text"
     *          )
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *       ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthenticated",
     *      ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      )
     *     )
     */
   public function store(Request $request)
   {
    try {
        $client=new Client;
        $client->client_name=$request->client_name;
        $client->phone=$request->phone;
        $client->address=$request->address;
        $client->country=$request->country;
        $client->state=$request->state;
        $client->city=$request->city;
        $client->partner_id=auth()->user()->id;
        $client->save();
        
        return response()->json(['msg'=>'Success'], 200);   
    } catch(\Exception $exception) {
        // throw new HttpException(400, "Invalid data - {$exception->getMessage}");
        return response()->json(['msg'=>$exception->getMessage()], 400);   
    }
   }
   /**
     * @OA\get(
     *      path="/clients/{id}",
     *      operationId="show_client",
     *      tags={"Clients"},
     *      summary="show client",
     *      description="show client",
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *       ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthenticated",
     *      ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      )
     *     )
     */
   public function show($id)
   {
        $client = Client::find($id);
        return response()->json(['data' => ['client'=>$client]], 200);   
    }
   /**
    * Show the form for editing the specified resource.
    *
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
   public function edit($id)
   {
   
   }
   /**
     * @OA\put(
     *      path="/clients",
     *      operationId="update_client",
     *      tags={"Clients"},
     *      summary="update client",
     *      description="update client",
     *     @OA\Parameter(
     *          name="id",
     *          description="id",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="integer"
     *          ) ),
     *     @OA\Parameter(
     *          name="client_name",
     *          description="Client Name",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="text"
     *          ) ),
     * @OA\Parameter(
     *          name="phone",
     *          description="phone",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="text"
     *          )
     *      ),
     *     @OA\Parameter(
     *          name="city",
     *          description="city",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="text"
     *          ) ),
     *     @OA\Parameter(
     *          name="state",
     *          description="State",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="text"
     *          ) ),
     *     @OA\Parameter(
     *          name="country",
     *          description="country",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="text"
     *          ) ),
     *     @OA\Parameter(
     *          name="address",
     *          description="Address",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="text"
     *          )
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *       ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthenticated",
     *      ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      )
     *     )
     */
   public function update(Request $request, $id)
   {
    
    try {
        $client = Client::find($id);
        $client=new Client;
        $client->client_name=$request->client_name;
        $client->phone=$request->phone;
        $client->address=$request->address;
        $client->country=$request->country;
        $client->state=$request->state;
        $client->city=$request->city;
        $client->save();
        return response()->json(['msg'=>'Success','data'=>['client'=>$client]], 200);
    } catch(\Exception $exception) {
        // throw new HttpException(400, "Invalid data - {$exception->getMessage}");
        return response()->json(['msg'=>$exception->getMessage()], 400);   
    }
   }
   /**
     * @OA\delete(
     *      path="/clients/{id}",
     *      operationId="delete_client",
     *      tags={"Clients"},
     *      summary="delete client",
     *      description="delete client",
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *       ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthenticated",
     *      ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      )
     *     )
     */
   
   public function destroy($id)
   {
    $client= Client::findOrFail($id);
    $client->delete();
    return response()->json(['msg'=>'Success'], 200);
   }

   public function change_status(Request $request)
   {
    $id = $request->id;
    $unit = Unit::findOrFail($id);
    $unit->status=$request->status;
    $unit->save();
    return response()->json(['تمت العملية بنجاح'], 200);
   }
}