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
        // Mahalaga para sa Render HTTPS proxy
        $middleware->trustProxies(at: '*');

        // Ito ang mag-aalis ng CSRF error sa API
        $middleware->validateCsrfTokens(except: [
            // 'api/*', //// Pwedeng tanggalin o i-comment out kung gusto mo ng mahigpit na CSRF check
        ]);

        // Ito ang mag-a-allow ng Sanctum Statefulness (Cookie Auth)
        // $middleware->api(prepend: [
        //     \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        // ]);

        // 🔥 ITO ANG PINAKA-IMPORTANTENG KULANG!
        // Awtomatiko nitong ikakabit ang EncryptCookies, StartSession, 
        // at ang Sanctum Stateful Middleware sa lahat ng API routes.
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
