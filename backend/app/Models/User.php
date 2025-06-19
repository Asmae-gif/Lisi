<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    // Champs pouvant être remplis en masse
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    // Champs cachés lors de la sérialisation
    protected $hidden = [
        'password',
        'remember_token',
        'email_verified_at',
    ];

    // Conversion automatique des attributs en types PHP
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_blocked' => 'boolean',
        'is_approved' => 'boolean',
    ];

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isMembre(): bool
    {
        return $this->hasRole('membre');
    }

    public function membre()
    {
        return $this->hasOne(Membre::class);
    }
   
}
