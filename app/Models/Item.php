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
        'timestamp',
        'created_at',
        'updated_at',
        'status',
    ];
}
