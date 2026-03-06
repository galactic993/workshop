<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureRateLimiting();
    }

    /**
     * Configure the rate limiters for the application.
     */
    protected function configureRateLimiting(): void
    {
        // ログインAPI用レート制限
        // IPアドレス単位: 1分間に10回まで
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(10)
                ->by($request->ip())
                ->response(function () {
                    return response()->json([
                        'success' => false,
                        'message' => 'ログイン試行回数が多すぎます。しばらく待ってから再度お試しください。',
                    ], 429);
                });
        });

        // ログインAPI用レート制限（アカウント単位）
        // 同一アカウントへの試行: 1分間に5回まで
        RateLimiter::for('login-account', function (Request $request) {
            $key = $request->input('section_cd', '').'|'.$request->input('employee_cd', '').'|'.$request->ip();

            return Limit::perMinute(5)
                ->by($key)
                ->response(function () {
                    return response()->json([
                        'success' => false,
                        'message' => 'このアカウントへのログイン試行回数が多すぎます。しばらく待ってから再度お試しください。',
                    ], 429);
                });
        });
    }
}
