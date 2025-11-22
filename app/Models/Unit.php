<?php

namespace App\Models;

use App\Models\UnitGroup;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Unit extends Model
{
    use HasFactory;
    use SoftDeletes;
    
    protected $dates = ['deleted_at']; 

    protected $fillable = [
        'unit_name',
        'ratio',
        'unit_group_id',
        'description',
        'created_by',
        'status'
    ];

    public function unit_group()
    {
        return $this->belongsTo(UnitGroup::class, 'unit_group_id', 'id');
    }
}
