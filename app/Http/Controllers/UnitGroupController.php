<?php

namespace App\Http\Controllers;

use App\Models\unit_group;
use App\Http\Requests\Storeunit_groupRequest;
use App\Http\Requests\Updateunit_groupRequest;

class UnitGroupController extends Controller
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
     * @param  \App\Http\Requests\Storeunit_groupRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Storeunit_groupRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\unit_group  $unit_group
     * @return \Illuminate\Http\Response
     */
    public function show(unit_group $unit_group)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\unit_group  $unit_group
     * @return \Illuminate\Http\Response
     */
    public function edit(unit_group $unit_group)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\Updateunit_groupRequest  $request
     * @param  \App\Models\unit_group  $unit_group
     * @return \Illuminate\Http\Response
     */
    public function update(Updateunit_groupRequest $request, unit_group $unit_group)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\unit_group  $unit_group
     * @return \Illuminate\Http\Response
     */
    public function destroy(unit_group $unit_group)
    {
        //
    }
}
