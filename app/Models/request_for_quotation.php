<?php

namespace App\Models;

use App\Models\Client;
use App\Models\Project;
use App\Models\Partner;
use App\Models\Item;
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

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }   

    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }

    public function details()
    {
        
    }


}
