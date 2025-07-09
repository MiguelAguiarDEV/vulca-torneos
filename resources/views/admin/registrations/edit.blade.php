@extends('layouts.admin')

@section('title', 'Editar Inscripción')
@section('page-title', 'Editar Inscripción')

@section('content')
<div class="container mx-auto px-6 py-8">
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Editar Inscripción</h1>
        <p class="text-gray-600">Modificar los datos de la inscripción</p>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
        <form action="{{ route('admin.registrations.update', $registration) }}" method="POST">
            @csrf
            @method('PUT')
            
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                <div class="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-8 w-8">
                            <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                <span class="text-xs font-medium text-gray-700">
                                    {{ strtoupper(substr($registration->user->name, 0, 1)) }}
                                </span>
                            </div>
                        </div>
                        <div class="ml-3">
                            <div class="text-sm font-medium text-gray-900">{{ $registration->user->name }}</div>
                            <div class="text-sm text-gray-500">{{ $registration->user->email }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Torneo</label>
                <div class="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                    <div class="text-sm font-medium text-gray-900">{{ $registration->tournament->name }}</div>
                    <div class="text-sm text-gray-500">{{ $registration->tournament->game->name }} - {{ $registration->tournament->start_date->format('d/m/Y') }}</div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label for="payment_method" class="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
                    <select id="payment_method" 
                            name="payment_method" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required>
                        <option value="">Selecciona método</option>
                        <option value="cash" {{ old('payment_method', $registration->payment_method) == 'cash' ? 'selected' : '' }}>Efectivo</option>
                        <option value="transfer" {{ old('payment_method', $registration->payment_method) == 'transfer' ? 'selected' : '' }}>Transferencia</option>
                        <option value="card" {{ old('payment_method', $registration->payment_method) == 'card' ? 'selected' : '' }}>Tarjeta</option>
                    </select>
                    @error('payment_method')
                        <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <div>
                    <label for="payment_status" class="block text-sm font-medium text-gray-700 mb-2">Estado del Pago</label>
                    <select id="payment_status" 
                            name="payment_status" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required>
                        <option value="">Selecciona estado</option>
                        <option value="confirmed" {{ old('payment_status', $registration->payment_status) == 'confirmed' ? 'selected' : '' }}>Confirmado</option>
                        <option value="pending" {{ old('payment_status', $registration->payment_status) == 'pending' ? 'selected' : '' }}>Pendiente</option>
                        <option value="failed" {{ old('payment_status', $registration->payment_status) == 'failed' ? 'selected' : '' }}>Fallido</option>
                    </select>
                    @error('payment_status')
                        <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>
            </div>

            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">💰 Monto de Inscripción</label>
                <div class="px-4 py-3 border-2 border-green-300 rounded-lg bg-green-50 text-green-800 font-bold text-xl text-center">
                    ${{ number_format($registration->tournament->entry_fee, 2) }}
                </div>
                <p class="text-sm text-gray-500 mt-2 text-center">
                    <i class="fas fa-info-circle"></i> El monto se establece automáticamente según el precio del torneo: <strong>{{ $registration->tournament->name }}</strong>.
                </p>
            </div>

            <div class="flex items-center justify-end space-x-4">
                <a href="{{ route('admin.registrations.index') }}" 
                   class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200">
                    Cancelar
                </a>
                <button type="submit" 
                        class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Actualizar Inscripción
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
