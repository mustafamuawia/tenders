<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;
use App\Models\Item;
use App\Models\Unit;


class Quotation_details extends Pivot
{
    use HasFactory;

    protected $table = 'Quotation_details';

    protected $fillable = [
        'rfq_id',
        'item_id',
        'rfq_qty',
        'available_qty',
        'unit_id',
        'unit_price'
    ];

    public function base_product()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }   
}
