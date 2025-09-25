<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTournamentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'game_id' => 'required|exists:games,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'registration_start' => 'nullable|date',
            'entry_fee' => 'nullable|numeric|min:0',
            'has_registration_limit' => 'boolean',
            'registration_limit' => 'nullable|integer|min:1|required_if:has_registration_limit,true',
            'status' => 'required|in:draft,published,registration_open,registration_closed,ongoing,finished,cancelled',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del torneo es obligatorio.',
            'name.max' => 'El nombre no puede tener más de 255 caracteres.',
            'game_id.required' => 'Debe seleccionar un juego.',
            'game_id.exists' => 'El juego seleccionado no existe.',
            'start_date.required' => 'La fecha de inicio es obligatoria.',
            'start_date.date' => 'La fecha de inicio debe ser una fecha válida.',
            'end_date.date' => 'La fecha de fin debe ser una fecha válida.',
            'end_date.after' => 'La fecha de fin debe ser posterior a la fecha de inicio.',
            'registration_start.date' => 'La fecha de inicio de inscripciones debe ser una fecha válida.',
            'entry_fee.numeric' => 'La cuota de inscripción debe ser un número.',
            'entry_fee.min' => 'La cuota de inscripción no puede ser negativa.',
            'registration_limit.integer' => 'El límite de inscripciones debe ser un número entero.',
            'registration_limit.min' => 'El límite de inscripciones debe ser al menos 1.',
            'registration_limit.required_if' => 'El límite de inscripciones es obligatorio cuando se habilita el límite.',
            'status.required' => 'El estado del torneo es obligatorio.',
            'status.in' => 'El estado seleccionado no es válido.',
            'image.image' => 'El archivo debe ser una imagen.',
            'image.mimes' => 'La imagen debe ser de tipo: jpeg, png, jpg, gif.',
            'image.max' => 'La imagen no puede ser mayor a 2MB.',
        ];
    }
}