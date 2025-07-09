@extends('layouts.web')

@section('title', 'Dashboard Admin - Vulca Torneos')

@section('content')
<div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
        <a href="{{ route('index.welcome') }}" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Volver al inicio
        </a>
        
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Dashboard Administrativo</h1>
        <p class="text-gray-600">Gestiona juegos, torneos y usuarios</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex items-center">
                <div class="p-3 bg-blue-100 rounded-full">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path>
                    </svg>
                </div>
                <div class="ml-4">
                    <p class="text-sm text-gray-600">Juegos</p>
                    <p class="text-2xl font-semibold">{{ $stats['games'] ?? 0 }}</p>
                </div>
            </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex items-center">
                <div class="p-3 bg-green-100 rounded-full">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                    </svg>
                </div>
                <div class="ml-4">
                    <p class="text-sm text-gray-600">Torneos</p>
                    <p class="text-2xl font-semibold">{{ $stats['tournaments'] ?? 0 }}</p>
                </div>
            </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex items-center">
                <div class="p-3 bg-purple-100 rounded-full">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                    </svg>
                </div>
                <div class="ml-4">
                    <p class="text-sm text-gray-600">Usuarios</p>
                    <p class="text-2xl font-semibold">{{ $stats['users'] ?? 0 }}</p>
                </div>
            </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex items-center">
                <div class="p-3 bg-yellow-100 rounded-full">
                    <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <div class="ml-4">
                    <p class="text-sm text-gray-600">Inscripciones</p>
                    <p class="text-2xl font-semibold">{{ $stats['registrations'] ?? 0 }}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-semibold mb-4">Gestión de Juegos</h3>
            <p class="text-gray-600 mb-4">Administra los juegos disponibles en la plataforma</p>
            <div class="space-y-2">
                <button class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
                    Ver Juegos
                </button>
                <button class="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
                    Crear Juego
                </button>
            </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-semibold mb-4">Gestión de Torneos</h3>
            <p class="text-gray-600 mb-4">Crea y administra torneos para cada juego</p>
            <div class="space-y-2">
                <button class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
                    Ver Torneos
                </button>
                <button class="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
                    Crear Torneo
                </button>
            </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-semibold mb-4">Gestión de Usuarios</h3>
            <p class="text-gray-600 mb-4">Administra usuarios y sus permisos</p>
            <div class="space-y-2">
                <button class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
                    Ver Usuarios
                </button>
                <button class="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition">
                    Gestionar Admins
                </button>
            </div>
        </div>
    </div>
</div>
@endsection
        <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
                <a href="{{ route('admin.tournaments.index') }}" class="font-medium text-green-600 hover:text-green-500">
                    Ver todos
                </a>
            </div>
        </div>
    </div>

    <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                        <i class="fas fa-users text-white text-sm"></i>
                    </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                    <dl>
                        <dt class="text-sm font-medium text-gray-500 truncate">Inscripciones</dt>
                        <dd class="text-lg font-medium text-gray-900">{{ $stats['registrations'] }}</dd>
                    </dl>
                </div>
            </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
                <a href="{{ route('admin.registrations.index') }}" class="font-medium text-indigo-600 hover:text-indigo-500">
                    Ver todas
                </a>
            </div>
        </div>
    </div>

    <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <i class="fas fa-user text-white text-sm"></i>
                    </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                    <dl>
                        <dt class="text-sm font-medium text-gray-500 truncate">Usuarios</dt>
                        <dd class="text-lg font-medium text-gray-900">{{ $stats['users'] }}</dd>
                    </dl>
                </div>
            </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
                <span class="text-gray-500">Registrados</span>
            </div>
        </div>
    </div>
</div>

<!-- Quick Actions & Recent Activity -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Quick Actions -->
    <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Acciones Rápidas</h3>
        </div>
        <div class="p-6">
            <div class="grid grid-cols-1 gap-4">
                <a href="{{ route('admin.games.create') }}" class="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <i class="fas fa-plus text-white"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium text-gray-900">Crear Juego</p>
                            <p class="text-xs text-gray-500">Agregar nuevo juego TCG</p>
                        </div>
                    </div>
                    <i class="fas fa-arrow-right text-blue-500"></i>
                </a>

                <a href="{{ route('admin.tournaments.create') }}" class="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <i class="fas fa-trophy text-white"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium text-gray-900">Crear Torneo</p>
                            <p class="text-xs text-gray-500">Organizar nuevo torneo</p>
                        </div>
                    </div>
                    <i class="fas fa-arrow-right text-green-500"></i>
                </a>

                <a href="{{ route('admin.payments.index') }}" class="flex items-center justify-between p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                            <i class="fas fa-credit-card text-white"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium text-gray-900">Gestionar Pagos</p>
                            <p class="text-xs text-gray-500">Confirmar pagos pendientes</p>
                        </div>
                    </div>
                    <i class="fas fa-arrow-right text-yellow-500"></i>
                </a>
            </div>
        </div>
    </div>

    <!-- System Overview -->
    <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Resumen del Sistema</h3>
        </div>
        <div class="p-6">
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-gamepad text-blue-600"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium text-gray-900">Juegos TCG</p>
                            <p class="text-xs text-gray-500">Total registrados</p>
                        </div>
                    </div>
                    <span class="text-2xl font-bold text-blue-600">{{ $stats['games'] }}</span>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-trophy text-green-600"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium text-gray-900">Torneos</p>
                            <p class="text-xs text-gray-500">Activos y programados</p>
                        </div>
                    </div>
                    <span class="text-2xl font-bold text-green-600">{{ $stats['tournaments'] }}</span>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-users text-indigo-600"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium text-gray-900">Inscripciones</p>
                            <p class="text-xs text-gray-500">Participantes registrados</p>
                        </div>
                    </div>
                    <span class="text-2xl font-bold text-indigo-600">{{ $stats['registrations'] }}</span>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-user text-yellow-600"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium text-gray-900">Usuarios</p>
                            <p class="text-xs text-gray-500">Cuentas activas</p>
                        </div>
                    </div>
                    <span class="text-2xl font-bold text-yellow-600">{{ $stats['users'] }}</span>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Welcome Message -->
<div class="mt-8 bg-primary-50 border border-primary-200 rounded-lg p-6">
    <div class="flex items-center">
        <div class="flex-shrink-0">
            <i class="fas fa-info-circle text-primary-600 text-xl"></i>
        </div>
        <div class="ml-3">
            <h3 class="text-lg font-medium text-primary-800">¡Bienvenido al Panel de Administración!</h3>
            <p class="text-primary-700 mt-1">
                Desde aquí puedes gestionar todos los aspectos de tu sistema de torneos TCG. 
                Usa las opciones del menú lateral para navegar entre las diferentes secciones.
            </p>
        </div>
    </div>
</div>
@endsection
