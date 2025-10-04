<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;

class AuthenticatedSessionController extends Controller
{
    public function create(Request $request)
    {
        return Inertia::render('Auth/Login/index', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = $request->user();
        $isAdmin = $user && (
            (method_exists($user, 'isAdmin') && $user->isAdmin()) ||
            (($user->role ?? null) === (defined(User::class.'::ROLE_ADMIN') ? User::ROLE_ADMIN : 'admin'))
        );

        $target = $isAdmin ? route('admin.dashboard') : route('welcome');

        return redirect()->intended($target);
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
