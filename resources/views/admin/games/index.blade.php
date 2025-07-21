@extends('layouts.admin')

@section('title', 'Gestión de Juegos')
@section('page-title', 'Juegos')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-3xl font-bold text-[#F5F5F5] flex items-center gap-2">
                <svg class="w-8 h-8 text-[#FDC900]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V5a1 1 0 011-1h3a1 1 0 001-1V2a2 2 0 012-2z"></path>
                </svg>
                Gestión de Juegos
            </h1>
            <p class="text-[#F5F5F5] mt-2">
                Administra todos los juegos disponibles para torneos
            </p>
        </div>
        <a href="{{ route('admin.games.create') }}" 
           class="bg-[#FDC900] hover:bg-[#e6b500] text-[#212121] font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Nuevo Juego
        </a>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-[#212121] p-6 rounded-xl shadow-lg border-2 border-[#FDC900] hover:shadow-xl transition-shadow">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-[#F5F5F5] uppercase tracking-wide">Total de Juegos</p>
                    <p class="text-3xl font-bold text-[#FDC900] mt-2">{{ $games->count() }}</p>
                </div>
                <div class="w-14 h-14 bg-[#FDC900] bg-opacity-20 rounded-xl flex items-center justify-center border border-[#FDC900]">
                    <svg class="w-7 h-7 text-[#FDC900]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V5a1 1 0 011-1h3a1 1 0 001-1V2a2 2 0 012-2z"></path>
                    </svg>
                </div>
            </div>
        </div>

        <div class="bg-[#212121] p-6 rounded-xl shadow-lg border-2 border-[#FDC900] hover:shadow-xl transition-shadow">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-[#F5F5F5] uppercase tracking-wide">Total Torneos Activos</p>
                    <p class="text-3xl font-bold text-[#FDC900] mt-2">{{ $games->sum('tournaments_count') }}</p>
                </div>
                <div class="w-14 h-14 bg-[#FDC900] bg-opacity-20 rounded-xl flex items-center justify-center border border-[#FDC900]">
                    <svg class="w-7 h-7 text-[#FDC900]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                    </svg>
                </div>
            </div>
        </div>
    </div>

    <!-- Games Table -->
    <div class="bg-[#212121] rounded-xl shadow-sm border border-[#FDC900] overflow-hidden">
        <div class="px-6 py-4 border-b border-[#FDC900]">
            <h2 class="text-xl font-semibold text-[#FDC900]">Lista de Juegos</h2>
        </div>

        @if($games->count() === 0)
            <div class="p-12 text-center">
                <svg class="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V5a1 1 0 011-1h3a1 1 0 001-1V2a2 2 0 012-2z"></path>
                </svg>
                <h3 class="text-lg font-medium text-[#F5F5F5] mb-2">No hay juegos registrados</h3>
                <p class="text-gray-400 mb-6">Comienza agregando tu primer juego</p>
                <a href="{{ route('admin.games.create') }}" 
                   class="bg-[#FDC900] hover:bg-[#e6b500] text-[#212121] font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-2 mx-auto transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Agregar Juego
                </a>
            </div>
        @else
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-[#1F1F1F]">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-[#F5F5F5] uppercase tracking-wider">
                                Juego
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-[#F5F5F5] uppercase tracking-wider">
                                Descripción
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-[#F5F5F5] uppercase tracking-wider">
                                Torneos
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-[#F5F5F5] uppercase tracking-wider">
                                Creado
                            </th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-[#F5F5F5] uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-[#212121] divide-y divide-[#FDC900]">
                        @foreach($games as $game)
                            <tr class="hover:bg-[#1F1F1F] transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap cursor-pointer" onclick="window.location.href='{{ route('admin.games.show', $game) }}'">
                                    <div class="flex items-center">
                                        <div class="w-12 h-12 rounded-lg overflow-hidden mr-3 bg-[#1F1F1F] border-2 border-[#FDC900]">
                                            @if($game->image)
                                                <img src="{{ $game->image }}" 
                                                     alt="{{ $game->name }}"
                                                     class="w-full h-full object-cover">
                                            @else
                                                <div class="w-full h-full bg-[#FDC900] bg-opacity-20 rounded-lg flex items-center justify-center">
                                                    <svg class="w-6 h-6 text-[#FDC900]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V5a1 1 0 011-1h3a1 1 0 001-1V2a2 2 0 012-2z"></path>
                                                    </svg>
                                                </div>
                                            @endif
                                        </div>
                                        <div>
                                            <div class="text-sm font-medium text-[#F5F5F5] hover:text-[#FDC900] transition-colors">
                                                {{ $game->name }}
                                            </div>
                                            <div class="text-sm text-[#FDC900]">
                                                /{{ str_replace(' ', '-', strtolower($game->name)) }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="text-sm text-[#F5F5F5] max-w-xs truncate">
                                        {{ $game->description }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    @if($game->tournaments_count > 0)
                                        <div class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-[#FDC900] bg-opacity-20 text-[#FDC900] border border-[#FDC900] hover:bg-[#FDC900] hover:text-[#212121] transition-all duration-200 cursor-pointer"
                                             onclick="window.location.href='{{ route('admin.games.show', $game) }}'">
                                            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                                            </svg>
                                            {{ $game->tournaments_count }} {{ $game->tournaments_count === 1 ? 'torneo' : 'torneos' }}
                                            <svg class="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                            </svg>
                                        </div>
                                    @else
                                        <span class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-500 bg-opacity-20 text-gray-400">
                                            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                                            </svg>
                                            Sin torneos
                                        </span>
                                    @endif
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-[#F5F5F5]">
                                    {{ $game->created_at->format('d \d\e F \d\e Y') }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div class="flex items-center justify-end gap-2">
                                        <a href="{{ route('admin.games.edit', $game) }}" 
                                           class="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-400 hover:bg-opacity-10 transition-all duration-150 ease-out hover:scale-110" 
                                           title="Editar juego">
                                            <svg class="w-4 h-4 transition-transform duration-150 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                            </svg>
                                        </a>
                                        <form action="{{ route('admin.games.destroy', $game) }}" 
                                              method="POST" 
                                              class="inline-block"
                                              onsubmit="return confirm('¿Estás seguro de que quieres eliminar este juego?')">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" 
                                                    class="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-400 hover:bg-opacity-10 transition-all duration-150 ease-out hover:scale-110" 
                                                    title="Eliminar juego">
                                                <svg class="w-4 h-4 transition-transform duration-150 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </div>
</div>
@endsection
