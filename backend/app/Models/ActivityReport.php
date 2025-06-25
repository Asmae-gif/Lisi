<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ActivityReport extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'pdf_path',
        'report_date',
    ];

    protected $casts = [
        'report_date' => 'date',
    ];
}
