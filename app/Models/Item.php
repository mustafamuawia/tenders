<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'item_name',
        'description',
        'specifications',
        'manufacturer',
        'origin_country',
        'created_by',
        'created_at',
        'updated_at',
        'note',
        'status',
    ];

    public function rfq_details():BelongsToMany
    {
        return $this->belongsToMany(Item::class, 'rfq_details', 'Item_id')->using(RequireProduct::class)
                    ->withPivot('qty','unit_id','unit_price');
    }
}
