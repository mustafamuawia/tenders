<?php

namespace App\Http\Controllers;

use App\Models\request_for_quotation;
use App\Http\Requests\Storerequest_for_quotationRequest;
use App\Http\Requests\Updaterequest_for_quotationRequest;

class RequestForQuotationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\Storerequest_for_quotationRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Storerequest_for_quotationRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\request_for_quotation  $request_for_quotation
     * @return \Illuminate\Http\Response
     */
    public function show(request_for_quotation $request_for_quotation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\request_for_quotation  $request_for_quotation
     * @return \Illuminate\Http\Response
     */
    public function edit(request_for_quotation $request_for_quotation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\Updaterequest_for_quotationRequest  $request
     * @param  \App\Models\request_for_quotation  $request_for_quotation
     * @return \Illuminate\Http\Response
     */
    public function update(Updaterequest_for_quotationRequest $request, request_for_quotation $request_for_quotation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\request_for_quotation  $request_for_quotation
     * @return \Illuminate\Http\Response
     */
    public function destroy(request_for_quotation $request_for_quotation)
    {
        //
    }
}
