<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::all();
        return response()->json($projects, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
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

        $project = Project::create($validated);

        return response()->json($project, 201);
    }

    public function show($id)
    {
        $project = Project::find($id);

        if ($project) {
            return response()->json($project, 200);
        }

        return response()->json(['message' => 'Project not found'], 404);
    }

    public function update(Request $request, $id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $validated = $request->validate([
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

        $project->update($validated);

        return response()->json($project, 200);
    }

    public function destroy($id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully'], 200);
    }
}
