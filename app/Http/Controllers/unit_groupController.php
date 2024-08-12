<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\unit_group;
 
class unit_groupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $unit_groups = unit_group::all();
        return response()->json(['data'=>['unit_groups' => $unit_groups]], 200);   
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
            $unit_group = new unit_group;
            $unit_group->unit_group_name=$request->unit_group_name;
            $unit_group->description=$request->description;
            $unit_group->status=$request->status;
            $unit_group->save();
            return response()->json(['msg'=>'Success','data' => ['unit_group'=>$unit_group]], 200);
        } catch(\Exception $exception) {
            // throw new HttpException(400, "Invalid data - {$exception->getMessage}");
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
            $unit_group->save();
        } catch(\Exception $exception) {
            // throw new HttpException(400, "Invalid data - {$exception->getMessage}");
            return response()->json(['error'=>$exception->getMessage()], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $unit_group = unit_group::findOrFail($id);
        $unit_group->delete();
        return response()->json(['msg'=>'Success'], 200);
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
