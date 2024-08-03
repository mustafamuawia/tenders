<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    public function changeStatus(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:users,id',
            'status' => 'required|string|in:Activated,Not Activated', // Validation updated
        ]);

        try {
            $user = User::findOrFail($request->id);
            $user->status = $request->status;
            $user->save();

            return response()->json(['msg' => 'Status updated successfully', 'status' => $user->status], 200);
        } catch (\Exception $e) {
            Log::error('Error changing status: ' . $e->getMessage());
            return response()->json(['msg' => 'Error changing status', 'error' => $e->getMessage()], 500);
        }
    }

    public function createadmin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|confirmed|min:2',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = new User;
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->role = 'Admin';
        $user->status = 'Activated'; // Updated status
        $user->save();

        return response()->json(['msg' => 'Success']);
    }

    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|confirmed|min:2',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = new User;
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->role = 'Partner';
        $user->status = 'Not Activated'; // Updated status
        $user->save();

        return response()->json(['msg' => 'Success'], 200);
    }

    public function fetchAdmin()
    {
        try {
            $admins = User::where('role', 'Admin')->get();
            return response()->json($admins, 200);
        } catch (\Exception $e) {
            Log::error('Error fetching admins: ' . $e->getMessage());
            return response()->json(['msg' => 'Error fetching admins'], 500);
        }
    }

    public function getusers(Request $request)
    {
        $token = $request->bearerToken();
        $user = JWTAuth::user();
        
        $users = User::where('id', '<>', $user->id)->with("Partner")->get();
        return response()->json($users);
    }

    public function updateuser(Request $request)
    {
        $token = $request->bearerToken();
        $user = JWTAuth::user();
        $UserId = $user->id;
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:users,email,' . $UserId,
            'password' => 'required|string|confirmed|min:2',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }
        
        $user = User::find($UserId);
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->save();

        $partner = Partner::where('UserID', $UserId)->first();
        $partner->CompanyEmail = $request->CompanyEmail;
        $partner->CompanyName = $request->CompanyName;
        $partner->Phone = $request->Phone;
        $partner->Class = $request->Class;
        $partner->save();

        return response()->json(['msg' => 'Success']);
    }

    public function updateadmin(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:users,email,' . $id,
            'password' => 'nullable|string|confirmed|min:2',
            'status' => 'required|in:Activated,Not Activated', // Validation updated
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        try {
            // Find and update the user
            $user = User::findOrFail($id);
            $user->name = $request->name;
            $user->email = $request->email;
            if ($request->filled('password')) {
                $user->password = Hash::make($request->password);
            }
            $user->status = $request->status; // Updated status
            $user->save();

            return response()->json(['msg' => 'Success'], 200);
        } catch (\Exception $e) {
            Log::error('Error updating admin: ' . $e->getMessage());
            return response()->json(['msg' => 'Error updating admin'], 500);
        }
    }

    public function deleteadmin($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();
            return response()->json(['msg' => 'Success'], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting admin: ' . $e->getMessage());
            return response()->json(['msg' => 'Error deleting admin'], 500);
        }
    }

    public function delete(Request $request)
    {
        User::destroy($request->id);
        return response()->json(['msg' => 'Success']);
    }
}
