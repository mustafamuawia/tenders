<?php

namespace App\Http\Controllers;

use App\Models\request_for_quotation;
use App\Http\Requests\Storerequest_for_quotationRequest;
use App\Http\Requests\Updaterequest_for_quotationRequest;
use App\Models\rfq_details;
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
        try {
            // Check user role and fetch RFQs accordingly
            if (auth()->user()->role == 'Admin') {
                // Fetch all RFQs with clients, projects, and partners
                $requests = request_for_quotation::with([
                    'client',
                    'project',
                    'partner',
                    'details.item', // Fetch related items in details
                    'details.unit'  // Fetch related units in details
                ])->get();
            } else {
                // Fetch RFQs for the authenticated partner with additional details
                $requests = request_for_quotation::where('partner_id', auth()->user()->id)->with([
                    'client',
                    'project',
                    'partner',
                    'details.item', // Fetch related items in details
                    'details.unit'  // Fetch related units in details
                ])->get();
            }
    
            // Return the fetched data in the response
            return response()->json(['data' => ['requests' => $requests]], 200);
    
        } catch (\Exception $exception) {
            // Handle any errors and return a 500 response
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
    
    public function store(Request $request)
    {
     try {
         $rfqData = $request->only(['title','client_id', 'project_id', 'issue_date','status','note']);
         $rfqData['partner_id'] = auth()->user()->id;
         $rfq = request_for_quotation::create($rfqData);
 
         $detailsData = $request->input('details');
         foreach ($detailsData as $detail) {
             $detail['rfq_id'] = $rfq->id;
             rfq_details::create($detail);
         }
 
         return response()->json($rfq->load('details'), 201);
        
     } catch(\Exception $exception) {
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
    
    return response()->json(request_for_quotation::where('id', $id)->with('details')->with('client')->with('project')-> with('partner')->with('items')->get());
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
        try {
            // Fetch the RFQ by its ID
            $rfq = request_for_quotation::findOrFail($id);
    
            // Update the main RFQ fields
            $rfqData = $request->only(['title', 'client_id', 'project_id', 'issue_date', 'note']);
            $rfqData['partner_id'] = auth()->user()->id; 
    
            $rfq->update($rfqData);
    
            // Update the RFQ details
            $detailsData = $request->input('details');
    
            // Detach existing details that are not in the request
            $existingDetailIds = $rfq->details->pluck('id')->toArray();
            $newDetailIds = array_column($detailsData, 'id');
    
            $detailsToDelete = array_diff($existingDetailIds, $newDetailIds);
            rfq_details::whereIn('id', $detailsToDelete)->delete();
    
            // Update existing details or create new ones
            foreach ($detailsData as $detail) {
                if (isset($detail['id']) && in_array($detail['id'], $existingDetailIds)) {
                    // Update existing detail
                    rfq_details::where('id', $detail['id'])->update($detail);
                } else {
                    // Create new detail
                    $detail['rfq_id'] = $rfq->id;
                    rfq_details::create($detail);
                }
            }
    
            // Return the updated RFQ with its details
            return response()->json($rfq->load('details'), 200);
    
        } catch (\Exception $exception) {
            // Return an error response if something goes wrong
            return response()->json(['error' => $exception->getMessage()], 500);
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
        try {
            $rfq = request_for_quotation::findOrFail($id);
            $rfq->details()->delete(); 
            $rfq->delete(); 
    
            return response()->json(['message' => 'RFQ deleted successfully'], 200);
        } catch (\Exception $exception) {
            return response()->json(['error' => 'Failed to delete RFQ: ' . $exception->getMessage()], 500);
        }
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