<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Partner;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{

    public function changestatus(Request $request)
    {
        $user = User::find($request->id);
        $user->Status = $request->Status;
        $user->save();
        return response()->json(  ['msg'=>'Success']);
    }
    public function createadmin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|confirmed|min:2',
        ]);
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }
    $user= new User;
 
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->role='Admin';
        $user->Status='Activated';
        $user->save();
        return response()->json(  ['msg'=>'Success']);
   
    }
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|confirmed|min:2',
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

    public function getusers(Request $request)
    {
        $token = $request->bearerToken();
        $user = JWTAuth::user();
        
        $users = User::where('id','<>',$user->id)->with("Partner")->get();
        return response()->json(  $users);
        // 'id',
        // 'name',
        // 'email',
    }

   
    public function updateuser(Request $request)
    {
        $token = $request->bearerToken();
    $user = JWTAuth::User($token);
    $UserId= $user['id'];
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|confirmed|min:2',
        ]);
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }
        
    $user= User::find($UserId);
 
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->save();

        $partner= Partner::where('UserID', $UserId)->first();;
        $partner->CompanyEmail=$request->CompanyEmail;
        $partner->CompanyName=$request->CompanyName;
        $partner->Phone=$request->Phone;
        $partner->Class=$request->Class;
        $partner->save();
        return response()->json(  ['msg'=>'Success']);
    }
    
    public function updateadmin(Request $request)
    {
        $token = $request->bearerToken();
        $user = JWTAuth::User($token);
        $UserId= $user['id'];
  
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|confirmed|min:2',
        ]);
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }
        $user= User::find($UserId);
 
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        
        $user->save();

        $partner= new Partner;
        $partner->CompanyEmail=$request->CompanyEmail;
        $partner->CompanyName=$request->CompanyName;
        $partner->Phone=$request->Phone;
        $partner->Class=$request->Class;
        $partner->save();
        return response()->json(  ['msg'=>'Success']);
    }

    public function delete(Request $request)
    {
        //
      
      

        User::destroy($request->id);

        return response()->json(  ['msg'=>'Success']);
    }

}
