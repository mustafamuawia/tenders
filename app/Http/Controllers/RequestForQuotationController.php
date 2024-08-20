<?php

namespace App\Http\Controllers;

use App\Models\request_for_quotation;
use App\Http\Requests\Storerequest_for_quotationRequest;
use App\Http\Requests\Updaterequest_for_quotationRequest;
use App\Models\Unit;
use App\Models\Unitgroup;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

class RequestForQuotationController extends Controller
{
    /** 
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */
   public function index()
   {
    // client
    // project
    // partner
    // items
    // units
    if (auth()->user()->role=='Admin')
    $requests = request_for_quotation::with('unit_group')->with('client')->with('project')-> with('partner')->with('items')->get();
else
    $requests = request_for_quotation::where('partner_id',auth()->user()->id)->with('unit_group')->with('client')->with('project')-> with('partner')->with('items')->get();
        return response()->json(['data'=>['requests' => $requests]], 200);   
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
    * Store a newly created resource in storage.
    *
    * @param  \Illuminate\Http\Request  $request
    * @return \Illuminate\Http\Response
    */
   public function store(Request $request)
   {
    try {
        $unit=Unit::create($request->all());

        $units = Unit::with('unit_group')->get();
        $unitgroups = Unitgroup::all();

        return view('units' ,['units' => $units,'unitgroups'=>$unitgroups]);
    } catch(\Exception $exception) {
        // throw new HttpException(400, "Invalid data - {$exception->getMessage}");
        $units = Unit::with('unit_group')->get();
        return view('units' ,['units' => $units,'error'=>$exception->getMessage()]);
    }
   }
   /**
    * Display the specified resource.
    *
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
   public function show($id)
   {
    if(is_numeric($id))
    {
        $unit = Unit::find($id);
        return view('user' ,['unit' => $unit]);
    }
    else
    {
        $units = Unit::with('unit_group')->get();
        return view('units' ,['units' => $units]);
    }
   }
   /**
    * Show the form for editing the specified resource.
    *
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
   public function edit($id)
   {
    $unit = Unit::find($id);
    $unitgroups = Unitgroup::all();
    return view('units' ,['unit' => $unit,'unitgroups'=>$unitgroups]);
   }
   /**
    * Update the specified resource in storage.
    *
    * @param  \Illuminate\Http\Request  $request
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
   public function update(Request $request, $id)
   {
    
    try {
        $unit = Unit::find($id);
    $unit->unit_name=$request->unit_name;
    $unit->eq=$request->unit_name;
    $unit->unit_group_id=$request->unit_name;
    $unit->status=$request->unit_name;
$unit->save();
        $units = Unit::with('unit_group')->get();
        $unitgroups = Unitgroup::all();

        return view('units' ,['units' => $units,'unitgroups'=>$unitgroups]);
    } catch(\Exception $exception) {
        // throw new HttpException(400, "Invalid data - {$exception->getMessage}");
        $units = Unit::with('unit_group')->get();
        return view('units' ,['units' => $units,'error'=>$exception->getMessage()]);
    }
   }
   /**
    * Remove the specified resource from storage.
    *
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
   public function destroy($id)
   {
    $unit= Unit::findOrFail($id);
    $unit->delete();
    return response()->json(['تمت العملية بنجاح'], 200);
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