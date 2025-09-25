<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRegistrationRequest extends FormRequest
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
            'payment_method.required' => 'El método de pago es obligatorio.',
            'payment_method.in' => 'El método de pago debe ser: cash, transfer o card.',
            'payment_status.required' => 'El estado del pago es obligatorio.',
            'payment_status.in' => 'El estado del pago debe ser: pending, confirmed o failed.',
        ];
    }
}