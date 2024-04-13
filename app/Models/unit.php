<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class unit extends Model
{
    use HasFactory;
    use SoftDeletes;
    
    protected $dates = ['deleted_at']; 

    protected $fillable = [
        'unit_name',
        'ratio',
        'unit_group_id',
        'description',
        'deleted_at',
        'created_at',
        'updated_at',
        'status'
    ];

    public function unit_group()
    {
        return $this->belongsTo(unit_group::class,'unit_group_id','id');
    }
}
