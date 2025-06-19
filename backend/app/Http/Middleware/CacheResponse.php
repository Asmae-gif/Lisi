<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Response;

class CacheResponse
{
    public function handle(Request $request, Closure $next, $ttl = 60)
    {
        if (!$request->isMethod('GET')) {
            return $next($request);
        }

        $ttl = (int) $ttl; // minutes
        $key = 'response_' . sha1($request->fullUrl());

        if (Cache::has($key)) {
            $cachedContent = Cache::get($key);
            return new Response($cachedContent['content'], 200, $cachedContent['headers']);
        }

        $response = $next($request);

        if ($response->getStatusCode() === 200) {
            Cache::put($key, [
                'content' => $response->getContent(),
                'headers' => $response->headers->all(),
            ], $ttl);
        }

        return $response;
    }
}
