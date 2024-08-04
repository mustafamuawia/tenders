<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Project::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'end_user_company_name' => 'required|string|max:255',
            'end_user_contact_email' => 'required|string|email|max:255',
            'distributor_contact_name' => 'required|string|max:255',
            'estimated_revenue' => 'nullable|numeric',
            'estimated_implementation_finish_date' => 'nullable|date',
            'summary' => 'nullable|string',
            'end_user_contact_name' => 'required|string|max:255',
            'end_user_contact_phone' => 'required|string|max:255',
            'project_status' => 'required|string|max:255',
            'installation_city' => 'nullable|string|max:255',
            'installation_state' => 'nullable|string|max:255',
            'distributor_email' => 'nullable|string|email|max:255',
            'estimated_business_purchasing_decision_date' => 'nullable|date',
            'estimated_implementation_start_date' => 'nullable|date',
            'sector' => 'required|string|max:255',
            'project_code' => 'required|string|max:255',
        ]);

        $project = Project::create($request->all());

        return response()->json($project, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function show(Project $project)
    {
        return $project;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Project $project)
    {
        $request->validate([
            'end_user_company_name' => 'required|string|max:255',
            'end_user_contact_email' => 'required|string|email|max:255',
            'distributor_contact_name' => 'required|string|max:255',
            'estimated_revenue' => 'nullable|numeric',
            'estimated_implementation_finish_date' => 'nullable|date',
            'summary' => 'nullable|string',
            'end_user_contact_name' => 'required|string|max:255',
            'end_user_contact_phone' => 'required|string|max:255',
            'project_status' => 'required|string|max:255',
            'installation_city' => 'nullable|string|max:255',
            'installation_state' => 'nullable|string|max:255',
            'distributor_email' => 'nullable|string|email|max:255',
            'estimated_business_purchasing_decision_date' => 'nullable|date',
            'estimated_implementation_start_date' => 'nullable|date',
            'sector' => 'required|string|max:255',
            'project_code' => 'required|string|max:255',
        ]);

        $project->update($request->all());

        return response()->json($project, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function destroy(Project $project)
    {
        $project->delete();

        return response()->json(null, 204);
    }


    public function changeStatus(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:projects,id',
            'status' => 'required|string|in:Activated,Not Activated',
        ]);

        $project = Project::find($request->id);
        $project->project_status = $request->status;
        $project->save();

        return response()->json($project);
    }
}
