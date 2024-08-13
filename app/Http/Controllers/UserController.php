<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
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
            'password' => 'required|string|confirmed|min:8',
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
            'password' => 'required|string|confirmed|min:8',
        ]);
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }
    $user= new User;
 
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->role='Partner';
        $user->Status='Not Activated';
        $user->save();

        $partner= new Partner;
        $partner->CompanyEmail=$request->CompanyEmail;
        $partner->CompanyName=$request->CompanyName;
        $partner->Phone=$request->Phone;
        $partner->Class=$request->Class;
        $partner->UserId=$user->id;
        $partner->save();
        return response()->json(  ['msg'=>'Success']);
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

    public function getPartners()
{
    // Fetch all partners with their associated user data
    $partners = Partner::with('user')->get();

    // Format the data to include necessary user information
    $formattedPartners = $partners->map(function($partner) {
        return [
            'id' => $partner->id,
            'CompanyEmail' => $partner->CompanyEmail,
            'CompanyName' => $partner->CompanyName,
            'Phone' => $partner->Phone,
            'Class' => $partner->Class,
            'name' => $partner->user ? $partner->user->name : 'N/A',
            'email' => $partner->user ? $partner->user->email : 'N/A',
            'status' => $partner->user ? $partner->user->status : 'N/A'
        ];
    });

    // Return the formatted partners in JSON format
    return response()->json($formattedPartners);
}

public function getUser($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }

public function edit(Request $request, $id)
{
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|between:2,100',
        'email' => 'required|string|email|max:100|unique:users,email,' . $id,
        'password' => 'nullable|string|confirmed|min:8', // Password is optional for editing
        'CompanyEmail' => 'required|string|email|max:100',
        'CompanyName' => 'required|string|max:100',
        'Phone' => 'required|string|max:15',
        'Class' => 'required|string|in:Silver,Gold,Platinum',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors()->toJson(), 400);
    }

    try {
        // Update the user
        $user = User::findOrFail($id);
        $user->name = $request->name;
        $user->email = $request->email;
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        $user->save();

        // Update the partner
        $partner = Partner::where('UserId', $id)->first();
        if ($partner) {
            $partner->CompanyEmail = $request->CompanyEmail;
            $partner->CompanyName = $request->CompanyName;
            $partner->Phone = $request->Phone;
            $partner->Class = $request->Class;
            $partner->save();
        } else {
            return response()->json(['msg' => 'Partner record not found'], 404);
        }

        return response()->json(['msg' => 'Update successful']);
    } catch (\Exception $e) {
        Log::error('Error editing record: ' . $e->getMessage());
        return response()->json(['msg' => 'Error editing record', 'error' => $e->getMessage()], 500);
    }
}


    public function updateadmin(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:users,email,' . $id,
            'password' => 'nullable|string|confirmed|min:8',
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

    public function delete($id)
    {
        try {
            // Find and delete the partner
            $partner = Partner::where('UserId', $id)->first();
            if ($partner) {
                $partner->delete();
            }
    
            // Find and delete the user
            $user = User::findOrFail($id);
            $user->delete();
    
            return response()->json(['msg' => 'Delete successful']);
        } catch (\Exception $e) {
            Log::error('Error deleting record: ' . $e->getMessage());
            return response()->json(['msg' => 'Error deleting record', 'error' => $e->getMessage()], 500);
        }
    }


    public function updateProfilePicture(Request $request)
    {
        $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
        ]);

        $user = Auth::user();

        if ($request->hasFile('image')) {
            // Delete old profile picture if it exists
            if ($user->image) {
                Storage::disk('public')->delete($user->image);
            }

            // Store new profile picture
            $imagePath = $request->file('image')->store('website/profile_pictures', 'public');
            $user->image = $imagePath;
            $user->save();

            return response()->json([
                'success' => true,
                'image_url' => asset('storage/' . $user->image)
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No profile picture uploaded.'
        ], 400);
    }


    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // Send the reset link to the user's email
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Reset link sent to your email.'], 200);
        }

        return response()->json(['error' => 'Unable to send reset link.'], 400);
    }
    

    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        // Reset the user's password
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Password has been successfully reset.'], 200);
        }

        return response()->json(['error' => 'Failed to reset password.'], 400);
    }
}
