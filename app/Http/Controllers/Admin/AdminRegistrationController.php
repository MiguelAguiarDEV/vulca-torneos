<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreRegistrationRequest;
use App\Http\Requests\Admin\UpdateRegistrationRequest;
use App\Models\Registration;
use App\Models\Tournament;
use App\Models\User;
use Inertia\Inertia;

class AdminRegistrationController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Registrations/Index', [
            'registrations' => Registration::with(['user', 'tournament.game'])->latest()->get(),
            'tournaments' => Tournament::with('game')->get(),
            'users' => User::all(),
        ]);
    }

    public function store(StoreRegistrationRequest $request)
    {
        $userId = $this->resolveUserId($request);

        // Verificar duplicados
        if (Registration::where('user_id', $userId)
            ->where('tournament_id', $request->tournament_id)
            ->exists()) {
            return back()->withErrors(['error' => 'El usuario ya está inscrito en este torneo.']);
        }

        $tournament = Tournament::findOrFail($request->tournament_id);

        Registration::create([
            'user_id' => $userId,
            'tournament_id' => $request->tournament_id,
            'status' => Registration::STATUS_CONFIRMED,
            'registered_at' => now(),
            'payment_method' => $request->payment_method,
            'payment_status' => $request->payment_status,
            'amount' => $tournament->entry_fee,
            'payment_notes' => $request->payment_notes,
            'payment_confirmed_at' => $request->payment_status === 'confirmed' ? now() : null,
            'payment_confirmed_by' => $request->payment_status === 'confirmed' ? auth()->id() : null,
        ]);

        return back()->with('success', 'Inscripción creada exitosamente.');
    }

    public function show(string $id)
    {
        return Inertia::render('Admin/Registrations/Show', [
            'registration' => Registration::with(['user', 'tournament.game'])->findOrFail($id),
        ]);
    }

    public function update(UpdateRegistrationRequest $request, string $id)
    {
        $registration = Registration::findOrFail($id);

        $registration->update([
            'payment_method' => $request->payment_method,
            'payment_status' => $request->payment_status,
            'payment_notes' => $request->payment_notes,
            'payment_confirmed_at' => $request->payment_status === 'confirmed' ? now() : null,
            'payment_confirmed_by' => $request->payment_status === 'confirmed' ? auth()->id() : null,
        ]);

        return back()->with('success', 'Inscripción actualizada exitosamente.');
    }

    public function destroy(string $id)
    {
        Registration::findOrFail($id)->delete();
        return back()->with('success', 'Inscripción eliminada exitosamente.');
    }

    private function resolveUserId($request): int
    {
        if ($request->user_selection_type === 'existing') {
            return $request->user_id;
        }

        // Buscar usuario existente por email
        if ($request->new_user_email) {
            $user = User::where('email', $request->new_user_email)->first();
            if ($user) return $user->id;
        }

        // Crear nuevo usuario
        $email = $request->new_user_email ?: $this->generateUniqueEmail($request->new_user_name);

        return User::create([
            'name' => $request->new_user_name,
            'email' => $email,
            'password' => bcrypt('password'),
            'role' => 'user',
        ])->id;
    }

    private function generateUniqueEmail(string $name): string
    {
        $base = str_replace(' ', '', strtolower($name)) . '@temp.local';
        $email = $base;
        $counter = 1;

        while (User::where('email', $email)->exists()) {
            $email = str_replace('@temp.local', "{$counter}@temp.local", $base);
            $counter++;
        }

        return $email;
    }
}
