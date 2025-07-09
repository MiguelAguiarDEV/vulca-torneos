<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    @vite('resources/css/app.css')
    <title>@yield('title', 'Admin - Vulca Torneos')</title>

    @stack('styles')
</head>

<body class="bg-gray-50">
    <div class="flex h-screen">
        <!-- Sidebar -->
        <div
            class="sidebar bg-gray-900 text-white w-64 min-h-screen fixed lg:relative lg:flex flex-col transform lg:transform-none transition-transform duration-200 ease-in-out -translate-x-full lg:translate-x-0 z-50">
            <!-- Logo -->
            <div class="flex items-center justify-center h-16 bg-gray-800 border-b border-gray-700">
                <a href="{{ route('index.welcome') }}" class="flex items-center space-x-2">
                    <span class="text-xl font-bold text-white">Vulca Torneos</span>
                </a>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 px-4 py-4 space-y-2">
                <!-- Juegos -->
                <a href="{{ route('admin.games.index') }}"
                    class="flex items-center px-4 py-3 text-sm font-medium {{ request()->routeIs('admin.games.*') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white' }} rounded-lg transition-colors duration-200" >
                    Juegos
                </a>

                <!-- Torneos -->
                <a href="{{ route('admin.tournaments.index') }}"
                    class="flex items-center px-4 py-3 text-sm font-medium {{ request()->routeIs('admin.tournaments.*') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white' }} rounded-lg transition-colors duration-200" >
                    Torneos
                </a>

                <!-- Usuarios -->
                <a href="#"
                    class="flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200" >
                    Usuarios
                </a>

                <!-- Inscripciones -->
                <a href="{{ route('admin.registrations.index') }}"
                    class="flex items-center px-4 py-3 text-sm font-medium {{ request()->routeIs('admin.registrations.*') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white' }} rounded-lg transition-colors duration-200">
                    Inscripciones
                </a>
            </nav>

            <!-- User Info -->
            <div class="border-t border-gray-700 p-4">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <span class="text-sm font-medium text-white">
                                {{ substr(auth()->user()->name, 0, 1) }}
                            </span>
                        </div>
                    </div>
                    <div class="ml-3 flex-1">
                        <p class="text-sm font-medium text-white">{{ auth()->user()->name }}</p>
                        <p class="text-xs text-gray-400">{{ auth()->user()->email }}</p>
                    </div>
                    <div class="ml-3">
                        <form method="POST" action="{{ route('logout') }}">
                            @csrf
                            <button type="submit"
                                class="text-gray-400 hover:text-white p-1 rounded-md transition-colors duration-200"
                                title="Cerrar Sesión">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1">
                                    </path>
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Top Bar -->
            <div
                class="bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6 py-4 lg:hidden">
                <button class="sidebar-toggle text-gray-500 hover:text-gray-700">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
                <h1 class="text-lg font-semibold text-gray-900">@yield('page-title', 'Dashboard')</h1>
                <div></div>
            </div>

            <!-- Main Content Area -->
            <main class="flex-1 overflow-y-auto">
                @yield('content')
            </main>
        </div>
    </div>

    <!-- Overlay for mobile -->
    <div class="sidebar-overlay fixed inset-0 bg-black opacity-50 z-40 lg:hidden hidden"></div>

    <!-- Scripts -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const sidebarToggle = document.querySelector('.sidebar-toggle');
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.querySelector('.sidebar-overlay');

            if (sidebarToggle) {
                sidebarToggle.addEventListener('click', function() {
                    sidebar.classList.toggle('-translate-x-full');
                    overlay.classList.toggle('hidden');
                });
            }

            if (overlay) {
                overlay.addEventListener('click', function() {
                    sidebar.classList.add('-translate-x-full');
                    overlay.classList.add('hidden');
                });
            }

            // Close sidebar on window resize if screen is large
            window.addEventListener('resize', function() {
                if (window.innerWidth >= 1024) {
                    sidebar.classList.remove('-translate-x-full');
                    overlay.classList.add('hidden');
                }
            });
        });
    </script>

    @stack('scripts')
</body>

</html>
