<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\unit_group;
 
class unit_groupsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $unit_groups = unit_group::all();
        return view('unit_groups' ,['unit_groups' => $unit_groups]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $unit_groups=unit_group::create($request->all());
    
            $unit_groups = unit_group::all();
            return view('unit_groups' ,['unit_groups' => $unit_groups]);
        } catch(\Exception $exception) {
            // throw new HttpException(400, "Invalid data - {$exception->getMessage}");
            $unit_groups = unit_group::all();
            return view('units' ,['unit_groups' => $unit_groups,'error'=>$exception->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $unit_group = unit_group::find($id);
        return view('editunit_group' ,['unit_group' => $unit_group]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $unit_group=unit_group::find($id);
            $unit_group->unit_group_name=$request->unit_group_name;
            $unit_group->description=$request->description;
            $unit_group->status=$request->status;
            $unit_groups = unit_group::all();
            return view('unit_groups' ,['unit_groups' => $unit_groups]);
        } catch(\Exception $exception) {
            // throw new HttpException(400, "Invalid data - {$exception->getMessage}");
            $unit_groups = unit_group::all();
            return view('units' ,['unit_groups' => $unit_groups,'error'=>$exception->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $unit_group = unit_group::findOrFail($id);
        $unit_group->delete();
        return response()->json(['تمت العملية بنجاح'], 200);
    }
    /**
     * Change the status of a unit group.
     *
     * @param Request $request The request object containing the ID and status.
     * @throws ModelNotFoundException If the unit group with the given ID is not found.
     * @
     * 
     * @return JsonResponse The updated unit group object.
     */
    public function change_status(Request $request)
    {
    $id = $request->id;
    $unit_group = unit_group::findOrFail($id);
    $unit_group->status=$request->status;
    $unit_group->save();
    return response()->json(['تمت العملية بنجاح'], 200);
   }
}
