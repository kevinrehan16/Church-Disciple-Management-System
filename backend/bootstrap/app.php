<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\EnsurePasswordIsChanged;

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

        // I-register ang custom middleware alias dito
        $middleware->alias([
            'password.changed' => EnsurePasswordIsChanged::class,
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
        ]);

        // Walang stateful middleware o CSRF exceptions para sa pure Token API.
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
