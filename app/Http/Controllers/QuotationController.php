<?php

namespace App\Http\Controllers;

use App\Models\Quotation;
use App\Models\Quotation_details;
use Illuminate\Http\Request;

class QuotationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if (auth()->user()->role=='Admin')
    $requests = Quotation::with('client')->with('partner')->with('items')->get();
else
    $requests = Quotation::where('partner_id',auth()->user()->id)->with('items')->get();
        return response()->json(['data'=>['requests' => $requests]], 200);   
   }
   public function store(Request $request)
    {
        try {
            // Create a new quotation
            $quotationData = $request->only(['title', 'note', 'expire_date', 'address']);
            $quotationData['user_id'] = auth()->user()->id;
            $quotation = Quotation::create($quotationData);

            // Insert details for the quotation
            $detailsData = $request->input('details');
            foreach ($detailsData as $detail) {
                $detail['quotation_id'] = $quotation->id;
                Quotation_details::create($detail);
            }

            return response()->json($quotation->load('details'), 201);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
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
    
    return response()->json(Quotation::where('id', $id)->with('details')->with('items')->get());
   }
   /**
    * Show the form for editing the specified resource.
    *
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
   /**
    * Update the specified resource in storage.
    *
    * @param  \Illuminate\Http\Request  $request
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
   public function update(Request $request, $id)
   {
    $quotation = Quotation::findOrFail($id);
    $quotation->update($request->only(['title', 'expire_date','status']));

    $quotation->details()->delete();
    $detailsData = $request->input('details');
    foreach ($detailsData as $detail) {
        $detail['quotation_id'] = $quotation->id;
        quotation_details::create($detail);
    }

    return response()->json($quotation->load('details'));
   }
   /**
    * Remove the specified resource from storage.
    *
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
    public function destroy($id)
    {
        try {
            $quotation = Quotation::findOrFail($id);
            $quotation->details()->delete(); 
            $quotation->delete(); 
    
            return response()->json(['message' => 'RFQ deleted successfully'], 200);
        } catch (\Exception $exception) {
            return response()->json(['error' => 'Failed to delete RFQ: ' . $exception->getMessage()], 500);
        }
    }
    
   public function change_status(Request $request)
   {
    $id = $request->id;
    $unit = Quotation::findOrFail($id);
    $unit->status=$request->status;
    $unit->save();
    return response()->json(['success'], 200);
   }
}