<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

class RegisteredUserController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/Register/index', [
            'canLogin' => Route::has('login'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required','string','max:255'],
            'email' => ['required','string','lowercase','email','max:255','unique:'.User::class],
            'password' => ['required','confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => defined(User::class.'::ROLE_USER') ? User::ROLE_USER : 'user',
        ]);

        event(new Registered($user));

        // No auto-login -> evita 403 si vuelve a admin
        return redirect()->route('login')->with('status', 'Cuenta creada con éxito. Inicia sesión para continuar.');
    }
}
