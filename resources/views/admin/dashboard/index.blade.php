@extends('layouts.admin')

@section('title', 'Dashboard')
@section('page-title', 'Dashboard')

@section('content')
<div class="space-y-6">
    <!-- Welcome Header -->
    <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-[#F5F5F5] mb-2">
            ¡Bienvenido al Dashboard!
        </h1>
        <p class="text-[#FDC900] text-lg">
            Gestiona tus torneos de gaming desde aquí
        </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Juegos -->
        <div class="bg-[#212121] border-2 border-[#FDC900] rounded-xl p-6 smooth-hover glow-on-hover">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-[#F5F5F5] text-sm font-medium">Total Juegos</p>
                    <p class="text-3xl font-bold text-[#FDC900]">{{ $stats['games'] }}</p>
                </div>
                <div class="bg-[#FDC900] p-3 rounded-full">
                    <svg class="w-8 h-8 text-[#212121] icon-hover" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <rect width="20" height="16" x="2" y="3" rx="2"/>
                        <circle cx="8" cy="9" r="2"/>
                        <path d="m9 12 2 2 4-4"/>
                        <circle cx="16" cy="11" r="2"/>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Torneos -->
        <div class="bg-[#212121] border-2 border-[#FDC900] rounded-xl p-6 smooth-hover glow-on-hover">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-[#F5F5F5] text-sm font-medium">Total Torneos</p>
                    <p class="text-3xl font-bold text-[#FDC900]">{{ $stats['tournaments'] }}</p>
                </div>
                <div class="bg-[#FDC900] p-3 rounded-full">
                    <svg class="w-8 h-8 text-[#212121] icon-hover" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                        <path d="M4 22h16"/>
                        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Inscripciones -->
        <div class="bg-[#212121] border-2 border-[#FDC900] rounded-xl p-6 smooth-hover glow-on-hover">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-[#F5F5F5] text-sm font-medium">Inscripciones</p>
                    <p class="text-3xl font-bold text-[#FDC900]">{{ $stats['registrations'] }}</p>
                </div>
                <div class="bg-[#FDC900] p-3 rounded-full">
                    <svg class="w-8 h-8 text-[#212121] icon-hover" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="m19 8 2 2-2 2"/>
                        <path d="m17 12 2 2-2 2"/>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Usuarios -->
        <div class="bg-[#212121] border-2 border-[#FDC900] rounded-xl p-6 smooth-hover glow-on-hover">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-[#F5F5F5] text-sm font-medium">Total Usuarios</p>
                    <p class="text-3xl font-bold text-[#FDC900]">{{ $stats['users'] }}</p>
                </div>
                <div class="bg-[#FDC900] p-3 rounded-full">
                    <svg class="w-8 h-8 text-[#212121] icon-hover" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="m22 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="m16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                </div>
            </div>
        </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <a href="{{ route('admin.games.create') }}" 
           class="bg-[#212121] border-2 border-[#FDC900] rounded-xl p-6 smooth-hover glow-on-hover group">
            <div class="text-center">
                <div class="bg-[#FDC900] p-4 rounded-full inline-block mb-4">
                    <svg class="w-8 h-8 text-[#212121] icon-hover" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path d="M12 5v14m-7-7h14"/>
                    </svg>
                </div>
                <h3 class="text-[#F5F5F5] font-bold text-lg mb-2">Agregar Juego</h3>
                <p class="text-[#FDC900] text-sm">Añade un nuevo juego a la plataforma</p>
            </div>
        </a>

        <a href="{{ route('admin.tournaments.create') }}" 
           class="bg-[#212121] border-2 border-[#FDC900] rounded-xl p-6 smooth-hover glow-on-hover group">
            <div class="text-center">
                <div class="bg-[#FDC900] p-4 rounded-full inline-block mb-4">
                    <svg class="w-8 h-8 text-[#212121] icon-hover" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path d="M12 5v14m-7-7h14"/>
                    </svg>
                </div>
                <h3 class="text-[#F5F5F5] font-bold text-lg mb-2">Crear Torneo</h3>
                <p class="text-[#FDC900] text-sm">Organiza un nuevo torneo</p>
            </div>
        </a>

        <a href="{{ route('admin.registrations.index') }}" 
           class="bg-[#212121] border-2 border-[#FDC900] rounded-xl p-6 smooth-hover glow-on-hover group">
            <div class="text-center">
                <div class="bg-[#FDC900] p-4 rounded-full inline-block mb-4">
                    <svg class="w-8 h-8 text-[#212121] icon-hover" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
                    </svg>
                </div>
                <h3 class="text-[#F5F5F5] font-bold text-lg mb-2">Ver Inscripciones</h3>
                <p class="text-[#FDC900] text-sm">Gestiona las inscripciones</p>
            </div>
        </a>
    </div>

    <!-- Recent Activity & Upcoming Tournaments -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Activity -->
        <div class="bg-[#212121] border-2 border-[#FDC900] rounded-xl p-6">
            <h3 class="text-[#F5F5F5] font-bold text-xl mb-4 flex items-center">
                <svg class="w-6 h-6 text-[#FDC900] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                Actividad Reciente
            </h3>
            
            @if($recentActivity->isEmpty())
                <p class="text-[#F5F5F5] text-center py-8">No hay actividad reciente</p>
            @else
                <div class="space-y-4">
                    @foreach($recentActivity as $activity)
                        <div class="flex items-start space-x-3 p-3 rounded-lg bg-[#1F1F1F] border border-[#FDC900] border-opacity-30">
                            <div class="text-2xl">{{ $activity['icon'] }}</div>
                            <div class="flex-1">
                                <p class="text-[#F5F5F5] text-sm">{{ $activity['message'] }}</p>
                                <p class="text-[#FDC900] text-xs mt-1">{{ $activity['time'] }}</p>
                            </div>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>

        <!-- Upcoming Tournaments -->
        <div class="bg-[#212121] border-2 border-[#FDC900] rounded-xl p-6">
            <h3 class="text-[#F5F5F5] font-bold text-xl mb-4 flex items-center">
                <svg class="w-6 h-6 text-[#FDC900] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                    <path d="M4 22h16"/>
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                </svg>
                Próximos Torneos
            </h3>
            
            @if($upcomingTournaments->isEmpty())
                <p class="text-[#F5F5F5] text-center py-8">No hay torneos próximos</p>
            @else
                <div class="space-y-4">
                    @foreach($upcomingTournaments as $tournament)
                        <div class="p-3 rounded-lg bg-[#1F1F1F] border border-[#FDC900] border-opacity-30">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h4 class="text-[#F5F5F5] font-semibold">{{ $tournament['name'] }}</h4>
                                    <p class="text-[#FDC900] text-sm">{{ $tournament['start_date'] }}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-[#F5F5F5] text-sm">{{ $tournament['participants_count'] }}</p>
                                    <p class="text-[#FDC900] text-xs">participantes</p>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>
    </div>
</div>
@endsection
