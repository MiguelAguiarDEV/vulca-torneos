@extends('layouts.admin')

@section('title', 'Editar Juego')
@section('page-title', 'Editar Juego')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-3xl font-bold text-[#F5F5F5] flex items-center gap-2">
                <svg class="w-8 h-8 text-[#FDC900]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Editar Juego
            </h1>
            <p class="text-[#F5F5F5] mt-2">
                Modifica la información del juego
            </p>
        </div>
        <a href="{{ route('admin.games.index') }}" 
           class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Volver
        </a>
    </div>

    <!-- Form Card -->
    <div class="bg-[#212121] rounded-xl shadow-lg border border-[#FDC900] max-w-2xl mx-auto">
        <div class="p-8">
            <form action="{{ route('admin.games.update', $game) }}" method="POST" enctype="multipart/form-data" class="space-y-6">
                @csrf
                @method('PUT')
                
                <!-- Preview de imagen -->
                <div class="flex justify-center mb-6">
                    <div class="relative">
                        <div class="w-32 h-32 rounded-xl overflow-hidden bg-[#1F1F1F] border-2 border-[#FDC900] flex items-center justify-center">
                            <img id="imagePreview" 
                                 src="{{ $game->image ?: '/assets/default-game.svg' }}" 
                                 alt="Preview"
                                 class="w-full h-full object-cover">
                        </div>
                        <button type="button" 
                                id="removeImageBtn"
                                class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 items-center justify-center transition-colors {{ $game->image && $game->image !== '/assets/default-game.svg' ? 'flex' : 'hidden' }}">
                            ✕
                        </button>
                    </div>
                </div>
                
                <!-- Nombre del Juego -->
                <div>
                    <label for="name" class="block text-sm font-medium text-[#F5F5F5] mb-2">
                        Nombre del Juego *
                    </label>
                    <input type="text" 
                           id="name" 
                           name="name" 
                           value="{{ old('name', $game->name) }}"
                           class="w-full px-4 py-3 bg-[#1F1F1F] border border-[#FDC900] rounded-lg text-[#F5F5F5] focus:ring-2 focus:ring-[#FDC900] focus:border-[#FDC900] transition-colors placeholder-gray-400"
                           placeholder="Ej: League of Legends, Counter-Strike, etc."
                           required>
                    @error('name')
                        <p class="mt-1 text-sm text-red-400">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Descripción -->
                <div>
                    <label for="description" class="block text-sm font-medium text-[#F5F5F5] mb-2">
                        Descripción *
                    </label>
                    <textarea id="description" 
                              name="description" 
                              rows="4"
                              class="w-full px-4 py-3 bg-[#1F1F1F] border border-[#FDC900] rounded-lg text-[#F5F5F5] focus:ring-2 focus:ring-[#FDC900] focus:border-[#FDC900] transition-colors resize-none placeholder-gray-400"
                              placeholder="Describe el juego, género, características principales..."
                              required>{{ old('description', $game->description) }}</textarea>
                    @error('description')
                        <p class="mt-1 text-sm text-red-400">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Imagen del Juego -->
                <div>
                    <label for="image_file" class="block text-sm font-medium text-[#F5F5F5] mb-2">
                        Imagen del Juego
                    </label>
                    <div class="flex items-center justify-center w-full">
                        <label for="image_file" class="flex flex-col items-center justify-center w-full h-32 border-2 border-[#FDC900] border-dashed rounded-lg cursor-pointer bg-[#1F1F1F] hover:bg-opacity-50 transition-colors">
                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg class="w-8 h-8 mb-4 text-[#FDC900]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                </svg>
                                <p class="mb-2 text-sm text-[#F5F5F5]">
                                    <span class="font-semibold">Click para cambiar</span> la imagen
                                </p>
                                <p class="text-xs text-[#FDC900]">PNG, JPG, GIF o SVG (MAX. 2MB)</p>
                            </div>
                            <input id="image_file" 
                                   name="image_file" 
                                   type="file" 
                                   class="hidden" 
                                   accept="image/*">
                        </label>
                    </div>
                    @error('image_file')
                        <p class="mt-1 text-sm text-red-400">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center justify-end space-x-4 pt-6 border-t border-[#FDC900]">
                    <a href="{{ route('admin.games.index') }}" 
                       class="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                        Cancelar
                    </a>
                    <button type="submit" 
                            class="bg-[#FDC900] hover:bg-[#e6b500] text-[#212121] font-semibold px-6 py-3 rounded-lg transition-colors">
                        Actualizar Juego
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('image_file');
    const imagePreview = document.getElementById('imagePreview');
    const removeBtn = document.getElementById('removeImageBtn');
    
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                removeBtn.classList.remove('hidden');
                removeBtn.classList.add('flex');
            };
            reader.readAsDataURL(file);
        }
    });
    
    removeBtn.addEventListener('click', function() {
        imageInput.value = '';
        imagePreview.src = '/assets/default-game.svg';
        removeBtn.classList.add('hidden');
        removeBtn.classList.remove('flex');
    });
});
</script>
@endsection
