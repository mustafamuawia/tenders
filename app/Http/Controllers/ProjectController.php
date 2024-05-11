<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * @OA\get(
     *      path="/projects",
     *      operationId="get_all_projects",
     *      tags={"Projects"},
     *      summary="Get list of projects",
     *      description="get all projects",
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
    $projects = Project::with('client')->where('partner_id',auth()->user()->id)->get();
    return response()->json(['data'=>['projects' => $projects]], 200);   
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
     *      path="/projects",
     *      operationId="store_project",
     *      tags={"Projects"},
     *      summary="store project",
     *      description="store project",
     *     @OA\Parameter(
     *          name="project_code",
     *          description="Project Code",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="string"
     *          ) ),
     *     @OA\Parameter(
     *          name="project_title",
     *          description="Project Title",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="string"
     *          ) ),
     *     @OA\Parameter(
     *          name="start_date",
     *          description="Start Date",
     *          description="Start Date Ex. (2024-03-20)",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="Date"
     *          ) ),
     *     @OA\Parameter(
     *          name="end_date",
     *          description="End Date",
     *          description="End Date Ex. (2024-03-20)",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="Date"
     *          ) ),
     *     @OA\Parameter(
     *          name="country",
     *          description="Country",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="string"
     *          ) ),
     *     @OA\Parameter(
     *          name="state",
     *          description="State",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="string"
     *          ) ),
     *     @OA\Parameter(
     *          name="city",
     *          description="City",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="string"
     *          ) ),
     *     @OA\Parameter(
     *          name="address",
     *          description="Address",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="string"
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
        $project=new Project;
        $project->project_code=$request->project_code;
        $project->project_title=$request->project_title;
        $project->start_date=$request->start_date;
        $project->end_date=$request->end_date;
        $project->country=$request->country;
        $project->state=$request->state;
        $project->city=$request->city;
        $project->address=$request->address;
        $project->partner_id=auth()->user()->id;
        $project->save();
        return response()->json(['msg'=>'Success'], 200);   
    } catch(\Exception $exception) {
        // throw new HttpException(400, "Invalid data - {$exception->getMessage}");
        return response()->json(['msg'=>$exception->getMessage()], 400);   
    }
   }
   /**
     * @OA\get(
     *      path="/projects/{id}",
     *      operationId="show_project",
     *      tags={"Projects"},
     *      summary="show project",
     *      description="show project",
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
    $project = Project::find($id);
    return response()->json(['data' => ['project'=>$project]], 200);
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
     *      path="/projects/{id}",
     *      operationId="update_project",
     *      tags={"Projects"},
     *      summary="update project",
     *      description="update project",
     *     @OA\Parameter(
     *          name="project_code",
     *          description="Project Code",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="string"
     *          ) ),
     *     @OA\Parameter(
     *          name="project_title",
     *          description="Project Title",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="string"
     *          ) ),
     *     @OA\Parameter(
     *          name="start_date",
     *          description="Start Date",
     *          description="Start Date Ex. (2024-03-20)",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="Date"
     *          )),
     *     @OA\Parameter(
     *          name="end_date",
     *          description="End Date",
     *          description="End Date Ex. (2024-03-20)",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="Date"
     *          ) ),
     *     @OA\Parameter(
     *          name="country",
     *          description="Country",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="string"
     *          ) ),
     *     @OA\Parameter(
     *          name="state",
     *          description="State",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="string"
     *          ) ),
     *     @OA\Parameter(
     *          name="city",
     *          description="City",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="string"
     *          ) ),
     *     @OA\Parameter(
     *          name="address",
     *          description="Address",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="string"
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
   
   public function update(Request $request, $id)
   {
    
    try {
        $project = Project::find($id);

        $project->project_code=$request->project_code;
        $project->project_title=$request->project_title;
        $project->start_date=$request->start_date;
        $project->end_date=$request->end_date;
        $project->country=$request->country;
        $project->state=$request->state;
        $project->city=$request->city;
        $project->address=$request->address;
        $project->partner_id=auth()->user()->id;
        $project->save();

        return response()->json(['msg'=>'Success'], 200);
    } catch(\Exception $exception) {
        // throw new HttpException(400, "Invalid data - {$exception->getMessage}");
        return response()->json(['msg'=>$exception->getMessage()], 400);    
    }
   }
   /**
     * @OA\delete(
     *      path="/projects/{id}",
     *      operationId="delete_project",
     *      tags={"Projects"},
     *      summary="delete project",
     *      description="delete project",
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
    $project= Project::findOrFail($id);
    $project->delete();
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