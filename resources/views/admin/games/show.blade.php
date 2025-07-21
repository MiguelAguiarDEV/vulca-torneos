@extends('layouts.admin')

@section('title', $game->name)
@section('page-title', 'Detalles del Juego')

@section('content')
<div class="container mx-auto px-6 py-8">
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-8">
        <div class="flex items-center space-x-4">
            <a href="{{ route('admin.games.index') }}" 
               class="text-gray-500 hover:text-gray-700 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
            </a>
            <div>
                <h1 class="text-3xl font-bold text-gray-800">{{ $game->name }}</h1>
                <p class="text-gray-600 mt-1">{{ $game->tournaments_count }} torneos disponibles</p>
            </div>
        </div>
        <div class="flex items-center space-x-3">
            <a href="{{ route('admin.games.edit', $game) }}" 
               class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Editar
            </a>
            <form action="{{ route('admin.games.destroy', $game) }}" 
                  method="POST" 
                  class="inline-block"
                  onsubmit="return confirm('¿Estás seguro de que quieres eliminar este juego?')">
                @csrf
                @method('DELETE')
                <button type="submit" 
                        class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Eliminar
                </button>
            </form>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Game Information Card -->
        <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                    @if($game->image)
                        <img src="{{ $game->image }}" 
                             alt="{{ $game->name }}" 
                             class="w-full h-full object-cover">
                    @else
                        <img src="/assets/default-game.svg" 
                             alt="Imagen por defecto" 
                             class="w-24 h-24 text-gray-400">
                    @endif
                </div>
                
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $game->name }}</h3>
                <p class="text-gray-600 text-sm mb-4">{{ $game->description }}</p>
                
                <div class="border-t pt-4">
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-500">Torneos:</span>
                        <span class="font-medium text-gray-900">{{ $game->tournaments_count }}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm mt-2">
                        <span class="text-gray-500">Creado:</span>
                        <span class="font-medium text-gray-900">{{ $game->created_at->format('d/m/Y') }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tournaments List -->
        <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-gray-900">Torneos de {{ $game->name }}</h3>
                        <a href="{{ route('admin.tournaments.create') }}?game={{ $game->id }}" 
                           class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center text-sm">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            Crear Torneo
                        </a>
                    </div>
                </div>
                
                @if($tournaments->count() > 0)
                    <div class="divide-y divide-gray-200">
                        @foreach($tournaments as $tournament)
                            <div class="p-6 hover:bg-gray-50 transition-colors">
                                <div class="flex items-center justify-between">
                                    <div class="flex-1">
                                        <h4 class="text-lg font-medium text-gray-900 mb-1">{{ $tournament->name }}</h4>
                                        <p class="text-gray-600 text-sm mb-2">{{ $tournament->description }}</p>
                                        <div class="flex items-center space-x-4 text-sm text-gray-500">
                                            <span class="flex items-center">
                                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                                                </svg>
                                                {{ $tournament->registrations_count }} registros
                                            </span>
                                            <span class="flex items-center">
                                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                                {{ $tournament->created_at->format('d/m/Y') }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="flex items-center space-x-2 ml-4">
                                        <a href="{{ route('admin.tournaments.edit', $tournament) }}" 
                                           class="text-blue-600 hover:text-blue-800 transition-colors">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                            </svg>
                                        </a>
                                        <form action="{{ route('admin.tournaments.destroy', $tournament) }}" 
                                              method="POST" 
                                              class="inline-block"
                                              onsubmit="return confirm('¿Estás seguro de que quieres eliminar este torneo?')">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" 
                                                    class="text-red-600 hover:text-red-800 transition-colors">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                @else
                    <div class="p-12 text-center">
                        <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                        </svg>
                        <h4 class="text-lg font-medium text-gray-900 mb-2">No hay torneos creados</h4>
                        <p class="text-gray-600 mb-6">Este juego aún no tiene torneos asociados.</p>
                        <a href="{{ route('admin.tournaments.create') }}?game={{ $game->id }}" 
                           class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            Crear Primer Torneo
                        </a>
                    </div>
                @endif
            </div>
        </div>
    </div>
</div>
@endsection
