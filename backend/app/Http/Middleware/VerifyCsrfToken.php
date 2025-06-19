<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        'sanctum/csrf-cookie',
        'api/login',
        'api/register',
        'api/logout',
        //'api/*', // This will exclude all API routes from CSRF verification
    ];
}
