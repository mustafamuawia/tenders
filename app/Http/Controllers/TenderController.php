<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tender;
use Carbon\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;

class TenderController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login']]);
    }
  
    public function getall(Request $request)
    {
        $token = $request->bearerToken();
        $user = JWTAuth::User($token);
        
        if ($user['role']=='Admin')
        $tenders = Tender::with(["User" => function($q){
            $q->with('Partner');
        }
    ])->get();

    else
    $tenders = Tender::where('UserId',$user['id'])->with(["User" => function($q){
        $q->with('Partner');
    }
])->get();
        return response()->json( $tenders );
    }


    public function create(Request $request)
    {
    $tender= new Tender;
    $token = $request->bearerToken();
    $user = JWTAuth::User($token);
    $tender->UserId= $user['id'];
    $tender->EndUserCompanyName= $request->EndUserCompanyName;
    $tender->EndUserContactName= $request->EndUserContactName;
    $tender->EndUserContactEmail= $request->EndUserContactEmail;
    $tender->EndUserContactPhone= $request->EndUserContactPhone;
    $tender->InstallationCity= $request->InstallationCity;
    $tender->InstallationState= $request->InstallationState;
    $tender->ResellerCompanyName= $request->ResellerCompanyName;
    $tender->ResellerContactName= $request->ResellerContactName;
    $tender->ResellerEmail= $request->ResellerEmail;
    $tender->DistributorCompanyName= $request->DistributorCompanyName;
    $tender->DistributorContactName= $request->DistributorContactName;
    $tender->DistributorEmail= $request->DistributorEmail;
    $tender->TenderCode= $request->TenderCode;
    $tender->Sector= $request->Sector;
    $tender->Summary= $request->Summary;
    $tender->Revenue= $request->Revenue;
    $tender->PurchasingDecisionDate= $request->PurchasingDecisionDate;
    $tender->StartDate= $request->StartDate;
    $tender->FinishDate= $request->FinishDate;
    $tender->Status= $request->Status;
    $tender->save();      
        return response()->json(  ['msg'=>'Success']);
    }

    public function update(Request $request)
    {
        $token = $request->bearerToken();
        $user = JWTAuth::User($token);
        $tender = Tender::find($request->TenderId);
   

    //$tender->TenderId= $tender->TenderId;
    $tender->EndUserCompanyName= $request->EndUserCompanyName;
    $tender->EndUserContactName= $request->EndUserContactName;
    $tender->EndUserContactEmail= $request->EndUserContactEmail;
    $tender->EndUserContactPhone= $request->EndUserContactPhone;
    $tender->InstallationCity= $request->InstallationCity;
    $tender->InstallationState= $request->InstallationState;
    $tender->ResellerCompanyName= $request->ResellerCompanyName;
    $tender->ResellerContactName= $request->ResellerContactName;
    $tender->ResellerEmail= $request->ResellerEmail;
    $tender->DistributorCompanyName= $request->DistributorCompanyName;
    $tender->DistributorContactName= $request->DistributorContactName;
    $tender->DistributorEmail= $request->DistributorEmail;
    $tender->TenderCode= $request->TenderCode;
    $tender->Sector= $request->Sector;
    $tender->Summary= $request->Summary;
    $tender->Revenue= $request->Revenue;
    $tender->PurchasingDecisionDate= $request->PurchasingDecisionDate;
    $tender->StartDate= $request->StartDate;
    $tender->FinishDate= $request->FinishDate;
    $tender->Status= $request->Status;
    $tender->save();

    return response()->json(  ['msg'=>'Success']);
    }
   
    public function delete(Request $request)
    {
        Tender::destroy($request->id);
        return response()->json(  ['msg'=>'Success']);
    }

}
