<?php

namespace App\Http\Controllers;

use App\Models\Quotation;
use App\Models\Quotation_details;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\File;

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
        $requests = Quotation::with('rfq')->with('files')->get();
        else
        $requests = Quotation::with(['rfq', 'files'])
                    ->whereHas('rfq', function($q) {
                    $q->where('partner_id', auth()->user()->id);
                    })
                    ->get();
        return response()->json(['data' => $requests], 200);   
   }
   public function store(Request $request)
    {
        try {
            // Create a new quotation
            $quotationData = $request->only(['title', 'note', 'expire_date', 'address','rfq_id']);
            $quotationData['user_id'] = auth()->user()->id;
            $quotation = Quotation::create($quotationData);

            // Insert details for the quotation
            // $detailsData = $request->input('details');
                // foreach ($detailsData as $detail) {
                //     $detail['quotation_id'] = $quotation->id;
                //     // Quotation_details::create($detail);
                // }
            $uploadFolder = 'public/uploads';

            // Ensure the folder exists
            if (!Storage::exists($uploadFolder)) {
                Storage::makeDirectory($uploadFolder); // Create the folder in the storage/app/public directory
            }
            $files=[];
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $filename = $file->getClientOriginalName();
                   
    
                    
                    $path = $file->store('uploads', 'public');
                    $fileRecord = File::create([
                        'file_name' => $file->getClientOriginalName(),
                        'file_path' => $path,
                        'file_type' => $file->getClientMimeType(),
                        'file_size' => $file->getSize(),
                        'related_to' => 'quotation',
                        'related_id' => $quotation->id
                    ]);
    
                }
            }
            return response()->json($quotation, 201);
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
    
    return response()->json(Quotation::where('id', $id)->with('files')->get());
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

     // Insert details for the quotation
            // $detailsData = $request->input('details');
                // foreach ($detailsData as $detail) {
                //     $detail['quotation_id'] = $quotation->id;
                //     // Quotation_details::create($detail);
                // }
                $uploadFolder = 'public/uploads';

                // Ensure the folder exists
                if (!Storage::exists($uploadFolder)) {
                    Storage::makeDirectory($uploadFolder); // Create the folder in the storage/app/public directory
                }
                $files=[];
                if ($request->hasFile('files')) {
                    foreach ($request->file('files') as $file) {
                        $filename = $file->getClientOriginalName();
                       
        
                        
                        $path = $file->store('uploads', 'public');
                        $fileRecord = File::create([
                            'file_name' => $file->getClientOriginalName(),
                            'file_path' => $path,
                            'file_type' => $file->getClientMimeType(),
                            'file_size' => $file->getSize(),
                            'related_to' => 'quotation',
                            'related_id' => $quotation->id
                        ]);
        
                    }
                }// $detailsData = $request->input('details');
    // foreach ($detailsData as $detail) {
    //     $detail['quotation_id'] = $quotation->id;
    //     quotation_details::create($detail);
    // }

    return response()->json($quotation);
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