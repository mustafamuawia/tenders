<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Partner extends Model
{
    use HasFactory;
    protected $primaryKey = 'PartnerId';
    protected $table = 'partners';
    protected $fillable = [
'CompanyEmail',
'CompanyName',
'Phone',
'Class',
'UserId',
'Status', 
];
public $timestamps = false;
public function User()
{
    return $this->hasOne(User::class, 'id', 'UserId');
}
}
