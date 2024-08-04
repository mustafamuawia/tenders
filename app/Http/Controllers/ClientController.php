<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use Illuminate\Support\Facades\Validator;

class ClientController extends Controller
{
    // Get all clients
    public function index()
    {
        try {
            $clients = Client::all();
            return response()->json($clients, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch clients'], 500);
        }
    }

    // Store a new client
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'client_name' => 'required|string',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'country' => 'nullable|string',
            'state' => 'nullable|string',
            'city' => 'nullable|string',
            'status' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        }

        try {
            $client = Client::create($request->all());
            return response()->json($client, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create client'], 500);
        }
    }

    // Get a specific client
    public function show($id)
    {
        try {
            $client = Client::findOrFail($id);
            return response()->json($client, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Client not found'], 404);
        }
    }

    // Update a client
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'client_name' => 'required|string',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'country' => 'nullable|string',
            'state' => 'nullable|string',
            'city' => 'nullable|string',
            'status' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        }

        try {
            $client = Client::findOrFail($id);
            $client->update($request->all());
            return response()->json($client, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update client'], 500);
        }
    }

    // Delete a client
    public function destroy($id)
    {
        try {
            $client = Client::findOrFail($id);
            $client->delete();
            return response()->json(['message' => 'Client deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete client'], 500);
        }
    }

    // Change client status
    public function changeStatus(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:clients,id',
            'status' => 'required|string|in:Activated,Not Activated',
        ]);

        $client = Client::find($request->id);
        $client->status = $request->status;
        $client->save();

        return response()->json($client);
    }
}
