<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Show admin dashboard
     */
    public function index()
    {
        if (!auth()->check()) {
            return redirect()->route('login')->with('message', 'Please log in to access the admin dashboard.');
        }

        if (!auth()->user()->isAdmin()) {
            abort(403, 'Access denied. Admins only.');
        }

        try {
            return Inertia::render('Admin/index');
        } catch (\Exception $e) {
            \Log::error('Admin dashboard error: ' . $e->getMessage());
            return response()->view('errors.500', [], 500);
        }
    }

}
