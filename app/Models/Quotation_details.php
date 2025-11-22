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
        'quotation_id',
        'available_qty',
        'unit_price'
    ];

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }  
    
}
