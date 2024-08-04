<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'end_user_company_name',
        'end_user_contact_email',
        'distributor_contact_name',
        'estimated_revenue',
        'estimated_implementation_finish_date',
        'summary',
        'end_user_contact_name',
        'end_user_contact_phone',
        'project_status',
        'installation_city',
        'installation_state',
        'distributor_email',
        'estimated_business_purchasing_decision_date',
        'estimated_implementation_start_date',
        'sector',
        'project_code'
    ];
}
