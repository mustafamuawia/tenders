<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quotation extends Model
{
    use HasFactory;

    protected $table = 'quotations';

    protected $fillable = [
        'id',
        'title',
        'note',
        'expire_date',
        'address',
        'user_id',
        'rfq_id',
        'status',
    ];

    
    public function partner()
    {
        return $this->belongsTo(Partner::class,'partner_id');
    }
    
    public function items()
    {
        return $this->belongsToMany(Item::class,'quotation_details','quotation_id','item_id');
    }

    public function units()
    {
        return $this->belongsToMany(Unit::class,'quotation_details','quotation_id','unit_id');
    }

    public function details()
    {
        return $this->hasMany(Quotation_details::class, 'quotation_id');
    }

    public function rfq()
    {
        return $this->belongsTo(request_for_quotation::class,'rfq_id');
    }

    public function files()
    {
        return $this->hasMany(File::class, 'related_id')->where('related_to', 'quotation');
    }
}
