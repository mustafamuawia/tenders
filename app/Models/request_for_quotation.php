<?php

namespace App\Models;

use App\Models\Client;
use App\Models\Project;
use App\Models\Partner;
use App\Models\Item;
use App\Models\Unit;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class request_for_quotation extends Model
{
    use HasFactory;

    protected $table = 'request_for_quotations';

    protected $fillable = [
        'id',
        'title',
        'client_id',
        'project_id',
        'issue_date',
        'partner_id',
        'status',
        'note',
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

    public function items()
    {
        return $this->belongsToMany(Item::class,'rfq_details','rfq_id','item_id');
    }

    public function units()
    {
        return $this->belongsToMany(Unit::class,'rfq_details','rfq_id','unit_id');
    }

    public function details()
    {
        return $this->hasMany(rfq_details::class, 'rfq_id');
    }


}
