<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class StoreRegistrationRequest extends FormRequest
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
            'user_selection_type' => 'required|in:existing,new',
            'user_id' => 'required_if:user_selection_type,existing|nullable|exists:users,id',
            'new_user_name' => 'required_if:user_selection_type,new|nullable|string|max:255',
            'new_user_email' => 'nullable|email|max:255|unique:users,email',
            'tournament_id' => 'required|exists:tournaments,id',
            'payment_method' => 'required|in:cash,transfer,card',
            'payment_status' => 'required|in:pending,confirmed,failed',
            'payment_notes' => 'nullable|string',
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
            'user_selection_type.required' => 'Debe seleccionar el tipo de usuario.',
            'user_selection_type.in' => 'El tipo de usuario debe ser "existing" o "new".',
            'user_id.required_if' => 'Debe seleccionar un usuario existente.',
            'user_id.exists' => 'El usuario seleccionado no existe.',
            'new_user_name.required_if' => 'El nombre del nuevo usuario es obligatorio.',
            'new_user_name.max' => 'El nombre no puede tener más de 255 caracteres.',
            'new_user_email.email' => 'El email debe tener un formato válido.',
            'new_user_email.max' => 'El email no puede tener más de 255 caracteres.',
            'new_user_email.unique' => 'Este email ya está registrado.',
            'tournament_id.required' => 'Debe seleccionar un torneo.',
            'tournament_id.exists' => 'El torneo seleccionado no existe.',
            'payment_method.required' => 'El método de pago es obligatorio.',
            'payment_method.in' => 'El método de pago debe ser: cash, transfer o card.',
            'payment_status.required' => 'El estado del pago es obligatorio.',
            'payment_status.in' => 'El estado del pago debe ser: pending, confirmed o failed.',
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->input('user_selection_type') === 'new' && !$this->input('new_user_email')) {
                // Check if email would be unique for generated email
                $baseEmail = str_replace(' ', '', strtolower($this->input('new_user_name'))) . '@temp.local';
                $counter = 1;
                $email = $baseEmail;

                while (User::where('email', $email)->exists()) {
                    $email = str_replace('@temp.local', $counter . '@temp.local', $baseEmail);
                    $counter++;
                }

                // If we couldn't find a unique email, add error
                if ($counter > 100) { // Arbitrary limit to prevent infinite loop
                    $validator->errors()->add('new_user_name', 'No se pudo generar un email único para este usuario.');
                }
            }
        });
    }
}