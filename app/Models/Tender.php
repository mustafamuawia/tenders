<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;


class Tender extends Model
{
    use HasFactory;

   // public $timestamps = false;
    protected $primaryKey = 'TenderId';
    protected $table = 'tenders';
    public $timestamps = false;
    protected $fillable = [
        'TenderId',
        'UserId',
        'EndUserCompanyName',
        'EndUserContactName',
        'EndUserContactEmail',
        'EndUserContactPhone',
        'InstallationCity',
        'InstallationState',
        'ResellerCompanyName',
        'ResellerContactName',
        'ResellerEmail',
        'DistributorCompanyName',
        'DistributorContactName',
        'DistributorEmail',
        'TenderCode',
        'Sector',
        'Summary',
        'Revenue',
        'StartDate',
        'FinishDate',
        'created_at',
        'updated_at',
        'Status',
    ];
    public function User()
    {
        return $this->hasOne(User::class, 'id', 'UserId');
    }
    

}
