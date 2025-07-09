@extends('layouts.admin')

@section('title', 'Crear Inscripción')
@section('page-title', 'Crear Inscripción')

@section('content')
<div class="container mx-auto px-6 py-8">
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Crear Nueva Inscripción</h1>
        <p class="text-gray-600">Inscribir un usuario existente o crear un nuevo usuario para un torneo</p>
    </div>

    @if($errors->has('error'))
        <div class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {{ $errors->first('error') }}
        </div>
    @endif

    <div class="bg-white rounded-lg shadow-md p-6">
        <form action="{{ route('admin.registrations.store') }}" method="POST">
            @csrf
            
            <!-- User Selection Type -->
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-3">Tipo de Usuario</label>
                <div class="flex space-x-4">
                    <label class="flex items-center">
                        <input type="radio" 
                               name="user_selection_type" 
                               value="existing" 
                               class="form-radio text-blue-600 focus:ring-blue-500"
                               {{ old('user_selection_type', 'existing') == 'existing' ? 'checked' : '' }}>
                        <span class="ml-2 text-gray-700">Usuario Existente</span>
                    </label>
                    <label class="flex items-center">
                        <input type="radio" 
                               name="user_selection_type" 
                               value="new" 
                               class="form-radio text-blue-600 focus:ring-blue-500"
                               {{ old('user_selection_type') == 'new' ? 'checked' : '' }}>
                        <span class="ml-2 text-gray-700">Nuevo Usuario</span>
                    </label>
                </div>
                @error('user_selection_type')
                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Existing User Selection -->
            <div id="existing-user-section" class="mb-6">
                <label for="user_id" class="block text-sm font-medium text-gray-700 mb-2">Usuario Existente</label>
                <select id="user_id" 
                        name="user_id" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Selecciona un usuario</option>
                    @foreach($users as $user)
                        <option value="{{ $user->id }}" {{ old('user_id') == $user->id ? 'selected' : '' }}>
                            {{ $user->name }} ({{ $user->email }})
                        </option>
                    @endforeach
                </select>
                @error('user_id')
                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- New User Section -->
            <div id="new-user-section" class="mb-6" style="display: none;">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="text-lg font-medium text-gray-800 mb-4">Datos del Nuevo Usuario</h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="new_user_name" class="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                            <input type="text" 
                                   id="new_user_name" 
                                   name="new_user_name" 
                                   value="{{ old('new_user_name') }}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                   placeholder="Nombre completo del usuario">
                            @error('new_user_name')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>
                        
                        <div>
                            <label for="new_user_email" class="block text-sm font-medium text-gray-700 mb-2">Email (opcional)</label>
                            <input type="email" 
                                   id="new_user_email" 
                                   name="new_user_email" 
                                   value="{{ old('new_user_email') }}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                   placeholder="email@ejemplo.com">
                            @error('new_user_email')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                            <p class="text-sm text-gray-500 mt-1">
                                <i class="fas fa-info-circle"></i> Si no se proporciona email, se generará uno automáticamente. Si el email ya existe, se usará ese usuario.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mb-6">
                <label for="tournament_id" class="block text-sm font-medium text-gray-700 mb-2">Torneo</label>
                <select id="tournament_id" 
                        name="tournament_id" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required>
                    <option value="" data-entry-fee="">Selecciona un torneo</option>
                    @foreach($tournaments as $tournament)
                        <option value="{{ $tournament->id }}" 
                                data-entry-fee="{{ $tournament->entry_fee }}"
                                {{ old('tournament_id') == $tournament->id ? 'selected' : '' }}>
                            {{ $tournament->name }} - {{ $tournament->game->name }} ({{ $tournament->start_date->format('d/m/Y') }}) - ${{ number_format($tournament->entry_fee, 2) }}
                        </option>
                    @endforeach
                </select>
                @error('tournament_id')
                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>

            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Monto de Inscripción</label>
                <div id="amount-display" class="px-4 py-3 border-2 border-gray-300 rounded-lg bg-blue-50 text-blue-800 font-bold text-xl text-center">
                    Selecciona un torneo para ver el monto
                </div>
                <p class="text-sm text-gray-500 mt-2 text-center">
                    <i class="fas fa-info-circle"></i> El monto se establece automáticamente según el precio del torneo seleccionado.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label for="payment_method" class="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
                    <select id="payment_method" 
                            name="payment_method" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required>
                        <option value="">Selecciona método</option>
                        <option value="cash" {{ old('payment_method') == 'cash' ? 'selected' : '' }}>Efectivo</option>
                        <option value="transfer" {{ old('payment_method') == 'transfer' ? 'selected' : '' }}>Transferencia</option>
                        <option value="card" {{ old('payment_method') == 'card' ? 'selected' : '' }}>Tarjeta</option>
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
                        <option value="confirmed" {{ old('payment_status') == 'confirmed' ? 'selected' : '' }}>Confirmado</option>
                        <option value="pending" {{ old('payment_status') == 'pending' ? 'selected' : '' }}>Pendiente</option>
                        <option value="failed" {{ old('payment_status') == 'failed' ? 'selected' : '' }}>Fallido</option>
                    </select>
                    @error('payment_status')
                        <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>
            </div>

            <div class="flex items-center justify-end space-x-4">
                <a href="{{ route('admin.registrations.index') }}" 
                   class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200">
                    Cancelar
                </a>
                <button type="submit" 
                        class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Crear Inscripción
                </button>
            </div>
        </form>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const tournamentSelect = document.getElementById('tournament_id');
    const amountDisplay = document.getElementById('amount-display');
    const userSelectionRadios = document.querySelectorAll('input[name="user_selection_type"]');
    const existingUserSection = document.getElementById('existing-user-section');
    const newUserSection = document.getElementById('new-user-section');
    const userIdSelect = document.getElementById('user_id');
    const newUserNameInput = document.getElementById('new_user_name');
    
    // Tournament amount update functionality
    function updateAmount() {
        const selectedOption = tournamentSelect.options[tournamentSelect.selectedIndex];
        const entryFee = selectedOption.getAttribute('data-entry-fee');
        
        if (entryFee && entryFee !== '') {
            const formattedAmount = '$' + parseFloat(entryFee).toFixed(2);
            amountDisplay.textContent = formattedAmount;
            amountDisplay.className = 'px-4 py-3 border-2 border-green-300 rounded-lg bg-green-50 text-green-800 font-bold text-xl text-center animate-pulse';
            
            // Remove animation after 1 second
            setTimeout(function() {
                amountDisplay.className = 'px-4 py-3 border-2 border-green-300 rounded-lg bg-green-50 text-green-800 font-bold text-xl text-center';
            }, 1000);
        } else {
            amountDisplay.textContent = 'Selecciona un torneo para ver el monto';
            amountDisplay.className = 'px-4 py-3 border-2 border-gray-300 rounded-lg bg-blue-50 text-blue-800 font-bold text-xl text-center';
        }
    }
    
    // User selection type toggle functionality
    function toggleUserSections() {
        const selectedType = document.querySelector('input[name="user_selection_type"]:checked').value;
        
        if (selectedType === 'existing') {
            existingUserSection.style.display = 'block';
            newUserSection.style.display = 'none';
            userIdSelect.required = true;
            newUserNameInput.required = false;
        } else {
            existingUserSection.style.display = 'none';
            newUserSection.style.display = 'block';
            userIdSelect.required = false;
            newUserNameInput.required = true;
        }
    }
    
    // Event listeners
    tournamentSelect.addEventListener('change', updateAmount);
    userSelectionRadios.forEach(radio => {
        radio.addEventListener('change', toggleUserSections);
    });
    
    // Initialize on page load
    updateAmount();
    toggleUserSections();
});
</script>
@endsection
