<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class request_for_quotation extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'client_id',
        'project_id',
        'issue_date',
        'expire_date',
        'partner_id',
        'status',
        'deleted_at',
        'created_at',
        'updated_at',
        'status'
    ];

}
