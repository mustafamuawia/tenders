<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;

class ItemController extends Controller
{
    /**
     * @OA\get(
     *      path="/items",
     *      operationId="get_all_items",
     *      tags={"Items"},
     *      summary="Get list of items",
     *      description="get all items",
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
    $items = Item::all();
    return response()->json(['data'=>['items' => $items]], 200);   
   }
   /**
    * Show the form for creating a new resource.
    *
    * @return \Illuminate\Http\Response
    */
   public function create()
   {
       //
   }/**
     * @OA\Post(
     *      path="/items",
     *      operationId="store_item",
     *      tags={"Items"},
     *      summary="store item",
     *      description="store item",
     *     @OA\Parameter(
     *          name="item_name",
     *          description="Item Name",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="text"
     *          ) ),
     *     @OA\Parameter(
     *          name="description",
     *          description="Description",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="text"
     *          ) ),
     *     @OA\Parameter(
     *          name="specifications",
     *          description="Specifications",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="text"
     *          ) ),
     *     @OA\Parameter(
     *          name="manufacturer",
     *          description="Manufacturer",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="text"
     *          ) ),
     *     @OA\Parameter(
     *          name="origin_country",
     *          description="Origin Country",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="text"
     *          ) ),
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
        $item=New Item;
        
        $item->item_name=$request->item_name;
        $item->description=$request->description;
        $item->specifications=$request->specifications;
        $item->manufacturer=$request->manufacturer;
        $item->origin_country=$request->origin_country;
        $item->created_by=auth()->user()->id;

        $item->save();

        return response()->json(['msg'=>'Success','data'=>['item' => $item]], 200);   
    } catch(\Exception $exception) {
        // throw new HttpException(400, "Invalid data - {$exception->getMessage}");
        return response()->json(['msg'=>$exception->getMessage()], 400);   
        }
   }
   /**
     * @OA\get(
     *      path="/items/{id}",
     *      operationId="show_item",
     *      tags={"Items"},
     *      summary="show item",
     *      description="show item",
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
        $item = Item::find($id);
        return response()->json(['data'=>['item' => $item]], 200);
   }
   /**
    * Show the form for editing the specified resource.
    *
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
//    public function edit($id)
//    {
//     $unit = Unit::find($id);
//     $unitgroups = Unitgroup::all();
//     return view('units' ,['unit' => $unit,'unitgroups'=>$unitgroups]);
//    }
   /**
     * @OA\put(
     *      path="/items/{id}",
     *      operationId="update_item",
     *      tags={"Items"},
     *      summary="update item",
     *      description="update item",
     *     @OA\Parameter(
     *          name="item_name",
     *          description="Item Name",
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
        $item = Item::find($id);
        $item->item_name=$request->item_name;
        $item->description=$request->description;
        $item->specifications=$request->specifications;
        $item->manufacturer=$request->manufacturer;
        $item->origin_country=$request->origin_country;
        $item->save();

        return response()->json(['msg'=>'Success','data'=>['item' => $item]], 200);   
    } catch(\Exception $exception) {
        // throw new HttpException(400, "Invalid data - {$exception->getMessage}");
        return response()->json(['msg'=>$exception->getMessage()], 400);   
    }
   }
   /**
     * @OA\delete(
     *      path="/items/{id}",
     *      operationId="delete_item",
     *      tags={"Items"},
     *      summary="delete item",
     *      description="delete item",
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
    $item= Item::findOrFail($id);
    $item->delete();
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