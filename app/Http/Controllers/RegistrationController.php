<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use App\Models\Tournament;
use App\Models\User;
use Illuminate\Http\Request;

class RegistrationController extends Controller
{
    public function adminIndex()
    {
        $registrations = Registration::with(['user', 'tournament.game'])->latest()->get();
        return view('admin.registrations', compact('registrations'));
    }

    public function adminCreate()
    {
        $tournaments = Tournament::with('game')->get();
        $users = User::all();
        return view('admin.registrations.create', compact('tournaments', 'users'));
    }

    public function adminStore(Request $request)
    {
        $request->validate([
            'user_selection_type' => 'required|in:existing,new',
            'user_id' => 'required_if:user_selection_type,existing|nullable|exists:users,id',
            'new_user_name' => 'required_if:user_selection_type,new|nullable|string|max:255',
            'new_user_email' => 'nullable|email|max:255',
            'tournament_id' => 'required|exists:tournaments,id',
            'payment_method' => 'required|in:cash,transfer,card',
            'payment_status' => 'required|in:pending,confirmed,failed',
            'payment_notes' => 'nullable|string',
        ]);

        // Determine the user ID to use
        if ($request->user_selection_type === 'existing') {
            $userId = $request->user_id;
        } else {
            // Create new user or find existing by email
            if ($request->new_user_email) {
                // Check if user already exists by email
                $existingUser = User::where('email', $request->new_user_email)->first();
                if ($existingUser) {
                    $userId = $existingUser->id;
                } else {
                    // Check if email is already used
                    if (User::where('email', $request->new_user_email)->exists()) {
                        return redirect()->back()->withErrors(['new_user_email' => 'Este email ya está registrado.'])->withInput();
                    }
                    
                    $user = User::create([
                        'name' => $request->new_user_name,
                        'email' => $request->new_user_email,
                        'password' => bcrypt('password'), // Default password
                        'role' => 'user',
                    ]);
                    $userId = $user->id;
                }
            } else {
                // Generate unique email if not provided
                $baseEmail = str_replace(' ', '', strtolower($request->new_user_name)) . '@temp.local';
                $counter = 1;
                $email = $baseEmail;
                
                while (User::where('email', $email)->exists()) {
                    $email = str_replace('@temp.local', $counter . '@temp.local', $baseEmail);
                    $counter++;
                }
                
                $user = User::create([
                    'name' => $request->new_user_name,
                    'email' => $email,
                    'password' => bcrypt('password'), // Default password
                    'role' => 'user',
                ]);
                $userId = $user->id;
            }
        }

        // Check if user is already registered for this tournament
        $existingRegistration = Registration::where('user_id', $userId)
            ->where('tournament_id', $request->tournament_id)
            ->first();

        if ($existingRegistration) {
            return redirect()->back()->withErrors(['error' => 'El usuario ya está inscrito en este torneo.'])->withInput();
        }

        // Get tournament entry fee
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

        return redirect()->route('admin.registrations.index')->with('success', 'Inscripción creada exitosamente.');
    }

    public function adminEdit(Registration $registration)
    {
        $tournaments = Tournament::with('game')->get();
        $users = User::all();
        return view('admin.registrations.edit', compact('registration', 'tournaments', 'users'));
    }

    public function adminUpdate(Request $request, Registration $registration)
    {
        $request->validate([
            'payment_method' => 'required|in:cash,transfer,card',
            'payment_status' => 'required|in:pending,confirmed,failed',
            'payment_notes' => 'nullable|string',
        ]);

        $registration->update([
            'payment_method' => $request->payment_method,
            'payment_status' => $request->payment_status,
            'amount' => $registration->tournament->entry_fee,
            'payment_notes' => $request->payment_notes,
            'payment_confirmed_at' => $request->payment_status === 'confirmed' ? now() : null,
            'payment_confirmed_by' => $request->payment_status === 'confirmed' ? auth()->id() : null,
        ]);

        return redirect()->route('admin.registrations.index')->with('success', 'Inscripción actualizada exitosamente.');
    }

    public function adminDestroy(Registration $registration)
    {
        $registration->delete();
        return redirect()->route('admin.registrations.index')->with('success', 'Inscripción eliminada exitosamente.');
    }
}
