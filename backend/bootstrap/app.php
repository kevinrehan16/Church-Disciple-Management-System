<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Para kilalanin ni Laravel ang HTTPS Proxy ng Render (Sobrang mahalaga para sa Cookies!)
        $middleware->trustProxies(at: '*');

        // Ito ang mag-aalis ng CSRF error sa API
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);

        // Ito ang mag-a-allow ng Sanctum Statefulness (Cookie Auth)
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
