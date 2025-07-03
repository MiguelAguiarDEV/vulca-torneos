<?php

namespace App\Http\Requests;

use App\Models\Registration;
use App\Models\Tournament;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreRegistrationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'tournament_id' => [
                'required',
                'exists:tournaments,id',
                function ($attribute, $value, $fail) {
                    // Check if user is already registered
                    $existingRegistration = Registration::where('user_id', Auth::id())
                        ->where('tournament_id', $value)
                        ->first();
                    
                    if ($existingRegistration) {
                        $fail('Ya estás inscrito en este torneo.');
                    }

                    // Check if tournament is active
                    $tournament = Tournament::find($value);
                    if ($tournament && $tournament->status !== 'active') {
                        $fail('Este torneo no está activo para inscripciones.');
                    }

                    // Check if registration period is still open
                    if ($tournament && $tournament->registration_ends_at && now()->isAfter($tournament->registration_ends_at)) {
                        $fail('El período de inscripción para este torneo ha terminado.');
                    }

                    // Check if tournament is full
                    if ($tournament && $tournament->registrations()->count() >= $tournament->max_participants) {
                        $fail('Este torneo ya está completo.');
                    }
                }
            ],
            'payment_method' => 'required|in:cash,transfer,card'
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'tournament_id.required' => 'Debes seleccionar un torneo.',
            'tournament_id.exists' => 'El torneo seleccionado no existe.',
        ];
    }
}
