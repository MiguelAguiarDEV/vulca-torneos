<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Registration;
use App\Models\Tournament;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminRegistrationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $registrations = Registration::with(['user', 'tournament.game'])->latest()->get();
        $tournaments = Tournament::with('game')->get();
        $users = User::all();
        
        return Inertia::render('Admin/Registrations/Index', [
            'registrations' => $registrations,
            'tournaments' => $tournaments,
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
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
        if ($request->input('user_selection_type') === 'existing') {
            $userId = $request->input('user_id');
        } else {
            // Create new user or find existing by email
            if ($request->input('new_user_email')) {
                // Check if user already exists by email
                $existingUser = User::where('email', $request->input('new_user_email'))->first();
                if ($existingUser) {
                    $userId = $existingUser->id;
                } else {
                    // Check if email is already used
                    if (User::where('email', $request->input('new_user_email'))->exists()) {
                        return redirect()->back()->withErrors(['new_user_email' => 'Este email ya está registrado.'])->withInput();
                    }
                    
                    $user = User::create([
                        'name' => $request->input('new_user_name'),
                        'email' => $request->input('new_user_email'),
                        'password' => bcrypt('password'), // Default password
                        'role' => 'user',
                    ]);
                    $userId = $user->id;
                }
            } else {
                // Generate unique email if not provided
                $baseEmail = str_replace(' ', '', strtolower($request->input('new_user_name'))) . '@temp.local';
                $counter = 1;
                $email = $baseEmail;
                
                while (User::where('email', $email)->exists()) {
                    $email = str_replace('@temp.local', $counter . '@temp.local', $baseEmail);
                    $counter++;
                }
                
                $user = User::create([
                    'name' => $request->input('new_user_name'),
                    'email' => $email,
                    'password' => bcrypt('password'), // Default password
                    'role' => 'user',
                ]);
                $userId = $user->id;
            }
        }

        // Check if user is already registered for this tournament
        $existingRegistration = Registration::where('user_id', $userId)
            ->where('tournament_id', $request->input('tournament_id'))
            ->first();

        if ($existingRegistration) {
            return redirect()->back()->withErrors(['error' => 'El usuario ya está inscrito en este torneo.'])->withInput();
        }

        // Get tournament entry fee
        $tournament = Tournament::findOrFail($request->input('tournament_id'));

        Registration::create([
            'user_id' => $userId,
            'tournament_id' => $request->input('tournament_id'),
            'status' => Registration::STATUS_CONFIRMED,
            'registered_at' => now(),
            'payment_method' => $request->input('payment_method'),
            'payment_status' => $request->input('payment_status'),
            'amount' => $tournament->entry_fee,
            'payment_notes' => $request->input('payment_notes'),
            'payment_confirmed_at' => $request->input('payment_status') === 'confirmed' ? now() : null,
            'payment_confirmed_by' => $request->input('payment_status') === 'confirmed' ? auth()->id() : null,
        ]);

        return redirect()->back()->with('success', 'Inscripción creada exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $registration = Registration::with(['user', 'tournament.game'])->findOrFail($id);
        
        return Inertia::render('Admin/Registrations/Show', [
            'registration' => $registration,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $registration = Registration::findOrFail($id);
        
        $request->validate([
            'payment_method' => 'required|in:cash,transfer,card',
            'payment_status' => 'required|in:pending,confirmed,failed',
            'payment_notes' => 'nullable|string',
        ]);

        $registration->update([
            'payment_method' => $request->input('payment_method'),
            'payment_status' => $request->input('payment_status'),
            'payment_notes' => $request->input('payment_notes'),
            'payment_confirmed_at' => $request->input('payment_status') === 'confirmed' ? now() : null,
            'payment_confirmed_by' => $request->input('payment_status') === 'confirmed' ? auth()->id() : null,
        ]);

        return redirect()->back()->with('success', 'Inscripción actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $registration = Registration::findOrFail($id);
        $registration->delete();
        
        return redirect()->back()->with('success', 'Inscripción eliminada exitosamente.');
    }
}