<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Tournament;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Show admin dashboard
     */
    public function index()
    {
        // Check if user is authenticated
        if (!auth()->check()) {
            return redirect()->route('login')->with('message', 'Please log in to access the admin dashboard.');
        }

        // Check if user is admin
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Access denied. Admins only.');
        }

        try {
            $stats = [
                'games' => Game::count(),
                'tournaments' => Tournament::count(),
                'registrations' => Registration::count(),
                'users' => User::count(),
            ];

            // Use original view
            return view('admin.dashboard', compact('stats'));
        } catch (\Exception $e) {
            // Log the error and return a simple error page
            \Log::error('Admin dashboard error: ' . $e->getMessage());
            return response()->view('errors.500', [], 500);
        }
    }

}
