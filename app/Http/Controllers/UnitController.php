<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UnitController extends Controller
{
    /**
     * Display a listing of the units.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $units = Unit::with('unit_group')->get();
        return response()->json($units);
    }

    /**
     * Store a newly created unit in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'unit_name' => 'required|string',
            'description' => 'nullable|string',
            'ratio' => 'required|numeric',
            'unit_group_id' => 'required|integer',
            'status' => 'required|string|in:Activated,Not Activated',
        ]);

        $unit = Unit::create([
            'unit_name' => $request->unit_name,
            'description' => $request->description,
            'ratio' => $request->ratio,
            'unit_group_id' => $request->unit_group_id,
            'status' => $request->status,
            'created_by' => auth()->id(), 
        ]);

        return response()->json($unit, Response::HTTP_CREATED);
    }

    /**
     * Display the specified unit.
     *
     * @param \App\Models\Unit $unit
     * @return \Illuminate\Http\Response
     */
    public function show(Unit $unit)
    {
        return response()->json($unit);
    }

    /**
     * Update the specified unit in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Unit $unit
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Unit $unit)
    {
        $request->validate([
            'unit_name' => 'required|string',
            'description' => 'nullable|string',
            'ratio' => 'required|numeric',
            'unit_group_id' => 'required|integer',
            'status' => 'required|string|in:Activated,Not Activated',
        ]);

        $unit->update([
            'unit_name' => $request->unit_name,
            'description' => $request->description,
            'ratio' => $request->ratio,
            'unit_group_id' => $request->unit_group_id,
            'status' => $request->status,
        ]);

        return response()->json($unit);
    }

    /**
     * Remove the specified unit from storage.
     *
     * @param \App\Models\Unit $unit
     * @return \Illuminate\Http\Response
     */
    public function destroy(Unit $unit)
    {
        $unit->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    public function changeStatus(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:units,id',
            'status' => 'required|string|in:Activated,Not Activated'
        ]);
    
        $unit = Unit::findOrFail($request->id);
    
        $unit->status = $request->status;
        $unit->save();
    
        return response()->json($unit);
    }

}
