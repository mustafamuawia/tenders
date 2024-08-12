<?php

namespace App\Http\Controllers;

use App\Models\UnitGroup;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;

class UnitGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $unitGroups = UnitGroup::all();
        return response()->json($unitGroups);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string|in:Activated,Not Activated',
        ]);

        $unitGroup = UnitGroup::create($validatedData);

        return response()->json($unitGroup, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\UnitGroup $unitGroup
     * @return \Illuminate\Http\Response
     */
    public function show(UnitGroup $unitGroup)
    {
        return response()->json($unitGroup);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\UnitGroup $unitGroup
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string|in:Activated,Not Activated',
        ]);
    
        $unitGroup = UnitGroup::find($id);

        if (!$unitGroup) {
            return response()->json(['message' => 'Unit Group not found'], 404);
        }
    
        $unitGroup->update($validatedData);
    
        return response()->json([
            'message' => 'UnitGroup updated successfully',
            'data' => $unitGroup
        ], 200);
    }
    

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\UnitGroup $unitGroup
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $unitGroup=UnitGroup::find($id);

        if (!$unitGroup) {
            return response()->json(['message' => 'Unit Group not found'], 404);
        }

        $unitGroup->delete();

        return response()->json(['message' => 'Unit Group deleted successfully'], 200);
    }
    


    public function changeStatus(Request $request)
    {
        $validatedData = $request->validate([
            'id' => 'required|integer|exists:unit_groups,id',
            'status' => 'required|string|in:Activated,Not Activated',
        ]);

        $unitGroup = UnitGroup::findOrFail($validatedData['id']);
        $unitGroup->status = $validatedData['status'];
        $unitGroup->save();

        return response()->json(['message' => 'Status updated successfully.']);
    }
    
}
