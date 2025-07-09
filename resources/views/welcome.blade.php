@extends('layouts.web')

@section('content')
    <div class="container mx-auto px-4 py-12">
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gray-800 mb-4">Bienvenido a Vulca Torneos</h1>
            <p class="text-lg text-gray-600">Selecciona un juego para ver los torneos disponibles</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @foreach ($games as $game)
                <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                    <a href="{{ route('games.tournaments', $game->slug) }}" class="block h-full">
                        <div class="p-6">
                            <h2 class="text-xl font-semibold text-gray-800 mb-3">{{ $game->name }}</h2>
                            <p class="text-gray-600 text-sm leading-relaxed mb-4">{{ $game->description }}</p>
                            <div class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                                Ver torneos
                                <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </div>
                        </div>
                    </a>
                </div>
            @endforeach
        </div>
    </div>
@endsection