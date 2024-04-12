<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'client_name',
        'phone',
        'address',
        'country',
        'state',
        'city',
        'partner_id',
        'created_at',
        'updated_at',
        'deleted_at',
        'status',
    ];
    
}
