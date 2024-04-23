<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class unit_group extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $dates = ['deleted_at']; 

    protected $fillable = [
        'unit_group_name',
        'description',
        'created_by',
        'deleted_at',
        'created_at',
        'updated_at',
        'status'
    ];
}
