<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Client;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'project_code',
        'project_title',
        'start_date',
        'end_date',
        'country',
        'state',
        'city',
        'address',
        'partner_id',
        'created_at',
        'updated_at',
        'status',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
