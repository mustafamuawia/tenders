<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class UnitGroup extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $dates = ['deleted_at']; 

    protected $fillable = [
        'name',
        'description',
        'deleted_at',
        'created_at',
        'updated_at',
        'status'
    ];

    public function units()
    {
        return $this->hasMany(Unit::class, 'unit_group_id', 'id');
    }
}
