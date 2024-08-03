<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;

class ItemController extends Controller
{
    /**
     * Display a listing of the items.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $items = Item::all();
        return response()->json($items);
    }

    /**
     * Store a newly created item in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'item_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'specifications' => 'nullable|string',
            'manufacturer' => 'nullable|string',
            'origin_country' => 'nullable|string',
            'note' => 'required|string',
            'status' => 'required|boolean',
        ]);

        $item = Item::create([
            'item_name' => $request->item_name,
            'description' => $request->description,
            'specifications' => $request->specifications,
            'manufacturer' => $request->manufacturer,
            'origin_country' => $request->origin_country,
            'note' => $request->note,
            'status' => $request->status,
            'created_by' => auth()->id(), // Assuming the user is authenticated
        ]);

        return response()->json($item, 201);
    }

    /**
     * Display the specified item.
     *
     * @param  \App\Models\Item  $item
     * @return \Illuminate\Http\Response
     */
    public function show(Item $item)
    {
        return response()->json($item);
    }

    /**
     * Update the specified item in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Item  $item
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Item $item)
    {
        $request->validate([
            'item_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'specifications' => 'nullable|string',
            'manufacturer' => 'nullable|string',
            'origin_country' => 'nullable|string',
            'note' => 'required|string',
            'status' => 'required|boolean',
        ]);

        $item->update([
            'item_name' => $request->item_name,
            'description' => $request->description,
            'specifications' => $request->specifications,
            'manufacturer' => $request->manufacturer,
            'origin_country' => $request->origin_country,
            'note' => $request->note,
            'status' => $request->status,
        ]);

        return response()->json($item);
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  \App\Models\Item  $item
     * @return \Illuminate\Http\Response
     */
    public function destroy(Item $item)
    {
        $item->delete();
        return response()->json(null, 204);
    }

    /**
     * Change the status of the specified item.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function changeStatus(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:items,id',
            'status' => 'required|boolean',
        ]);

        $item = Item::find($request->id);
        $item->status = $request->status;
        $item->save();

        return response()->json($item);
    }
}
