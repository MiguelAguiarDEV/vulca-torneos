@extends('layouts.web')

@section('content')
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="mb-8">
            <a href="{{ route('index.welcome') }}" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Volver a juegos
            </a>
            
            <h1 class="text-3xl font-bold text-gray-800 mb-2">Torneos de {{ $game->name }}</h1>
            <p class="text-gray-600">{{ $game->description }}</p>
        </div>

        @if($tournaments->count() > 0)
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @foreach ($tournaments as $tournament)
                    <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                        <h3 class="text-xl font-semibold mb-3">{{ $tournament->name }}</h3>
                        <p class="text-gray-600 mb-4">{{ $tournament->description }}</p>
                        
                        <!-- Estado simple -->
                        <div class="mb-4">
                            @if($tournament->status === 'registration_open')
                                <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                    Inscripciones Abiertas
                                </span>
                            @elseif($tournament->status === 'in_progress')
                                <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    En Progreso
                                </span>
                            @else
                                <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                                    {{ ucfirst(str_replace('_', ' ', $tournament->status)) }}
                                </span>
                            @endif
                        </div>

                        <!-- Información básica -->
                        <div class="text-sm text-gray-500 space-y-1">
                            <p><strong>Fecha:</strong> {{ $tournament->start_date->format('d/m/Y') }}</p>
                            <p><strong>Máx. participantes:</strong> {{ $tournament->max_participants }}</p>
                            <p><strong>Precio:</strong> ${{ number_format($tournament->entry_fee, 0) }}</p>
                        </div>

                        @if($tournament->status === 'registration_open')
                            @auth
                                <button class="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
                                    Inscribirse
                                </button>
                            @else
                                <a href="{{ route('login') }}" class="block w-full mt-4 bg-gray-600 text-white py-2 px-4 rounded text-center hover:bg-gray-700 transition">
                                    Inicia sesión para inscribirte
                                </a>
                            @endauth
                        @endif
                    </div>
                @endforeach
            </div>
        @else
            <div class="text-center py-12">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No hay torneos disponibles</h3>
                <p class="mt-1 text-sm text-gray-500">Aún no hay torneos programados para este juego.</p>
            </div>
        @endif
    </div>
@endsection