<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Admin') - Vulca Torneos</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    
    <style>
        /* Custom animations - solo colores y bordes */
        * {
            transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        
        body {
            font-family: 'Inter', sans-serif;
        }
        
        .font-mono {
            font-family: 'JetBrains Mono', monospace;
        }
        
        /* Smooth color transitions only */
        .smooth-hover {
            transition: color 0.3s ease, 
                        background-color 0.3s ease,
                        border-color 0.3s ease,
                        box-shadow 0.3s ease;
        }
        
        /* Glow effect on hover - solo bordes */
        .glow-on-hover:hover {
            box-shadow: 0 0 0 2px rgba(253, 201, 0, 0.5);
        }
        
        /* Sidebar animation improvements */
        .sidebar-transition {
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Smooth fade in */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .fade-in-up {
            animation: fadeInUp 0.6s ease-out;
        }
        
        /* Icon color transition only */
        .icon-hover {
            transition: color 0.3s ease;
        }
    </style>
</head>
<body class="font-sans antialiased">
    <div 
        class="flex h-screen relative bg-[#1F1F1F]"
        style="background-image: url(/assets/fondo2.png); background-attachment: fixed;"
    >
        <!-- Sidebar -->
        <div
            id="sidebar"
            class="bg-[#1F1F1F] text-white w-64 min-h-screen fixed lg:relative lg:flex flex-col transform lg:transform-none sidebar-transition -translate-x-full lg:translate-x-0 z-50 shadow-2xl border-r-2 border-[#FDC900] glow-on-hover"
            style="backdrop-filter: blur(10px); background-color: rgba(31, 31, 31, 0.95);"
        >
            <!-- Logo -->
            <div class="flex items-center justify-between h-16 border-b-2 border-[#FDC900] px-4 bg-[#212121]">
                <a href="/" class="flex items-center justify-center w-full">
                    <img 
                        src="/assets/vulca-logo.png"
                        alt="Vulca Torneos"
                        class="h-12 mx-auto"
                    />
                </a>
                
                <!-- Close button for mobile -->
                <button
                    class="sidebar-close text-[#FDC900] hover:text-white lg:hidden smooth-hover"
                    onclick="toggleSidebar()"
                >
                    <svg class="w-6 h-6 icon-hover" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path d="m18 6-12 12"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </button>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 px-4 py-6 space-y-2">
                <!-- Dashboard -->
                <a href="{{ route('dashboard.index') }}">
                    Dashboard
                </a>

                <!-- Juegos -->
                <a href="{{ route('admin.games.index') }}">
                    Juegos
                </a>

                <!-- Torneos -->
                <a href="{{ route('admin.tournaments.index') }}">
                    Torneos
                </a>

                <!-- Inscripciones -->
                <a href="{{ route('admin.registrations.index') }}">
                    Inscripciones
                </a>
            </nav>

            <!-- User Info -->
            <div class="border-t-2 border-[#FDC900] p-4 bg-[#212121]">
                <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                        <div class="w-10 h-10 bg-[#FDC900] rounded-full flex items-center justify-center ring-2 ring-[#F5F5F5] border-2 border-[#212121]">
                            <span class="text-sm font-bold text-[#212121]">
                                {{ substr(auth()->user()->name, 0, 1) }}
                            </span>
                        </div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-bold text-[#F5F5F5] truncate" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">
                            {{ auth()->user()->name }}
                        </p>
                        <p class="text-xs text-[#FDC900] truncate font-semibold">
                            {{ auth()->user()->email }}
                        </p>
                    </div>
                    <div class="flex-shrink-0">
                        <form method="POST" action="{{ route('logout') }}" class="inline">
                            @csrf
                            <button
                                type="submit"
                                class="text-[#F5F5F5] hover:text-[#FDC900] p-2 rounded-lg smooth-hover hover:bg-[#FDC900]/20 border-2 border-transparent hover:border-[#FDC900] cursor-pointer"
                                title="Cerrar Sesión"
                            >
                                <svg class="w-5 h-5 icon-hover" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                    <polyline points="16,17 21,12 16,7"/>
                                    <line x1="21" x2="9" y1="12" y2="12"/>
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div
            class="flex-1 flex flex-col overflow-hidden relative z-10 bg-[#1F1F1F]"
            style="background-color: rgba(31, 31, 31, 0.9); backdrop-filter: blur(5px);"
        >
            <!-- Top Bar - Solo visible en móvil -->
            <div class="lg:hidden border-b-2 border-[#FDC900] flex items-center justify-between px-6 py-4 bg-[#212121]"
                 style="background-color: rgba(33, 33, 33, 0.95);">
                <button 
                    onclick="toggleSidebar()"
                    class="text-[#F5F5F5] hover:text-[#FDC900] smooth-hover"
                >
                    <svg class="w-6 h-6 icon-hover" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <line x1="4" x2="20" y1="6" y2="6"/>
                        <line x1="4" x2="20" y1="12" y2="12"/>
                        <line x1="4" x2="20" y1="18" y2="18"/>
                    </svg>
                </button>
                <h1 class="text-lg font-bold text-[#FDC900]" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">
                    @yield('page-title', 'Dashboard')
                </h1>
                <div class="w-6"></div>
            </div>

            <!-- Main Content Area -->
            <main class="flex-1 overflow-y-auto p-6">
                <div class="max-w-7xl mx-auto">
                    @if(session('success'))
                        <div class="mb-6 bg-green-500 border border-green-600 text-white px-4 py-3 rounded-lg">
                            {{ session('success') }}
                        </div>
                    @endif
                    
                    @if(session('error'))
                        <div class="mb-6 bg-red-500 border border-red-600 text-white px-4 py-3 rounded-lg">
                            {{ session('error') }}
                        </div>
                    @endif

                    @yield('content')
                </div>
            </main>
        </div>

        <!-- Overlay for mobile -->
        <div 
            id="sidebar-overlay"
            class="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm hidden"
            onclick="toggleSidebar()"
        ></div>
    </div>

    <script>
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            
            sidebar.classList.toggle('-translate-x-full');
            overlay.classList.toggle('hidden');
        }

        // Cerrar sidebar en pantallas grandes
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 1024) {
                const sidebar = document.getElementById('sidebar');
                const overlay = document.getElementById('sidebar-overlay');
                
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            }
        });
    </script>
</body>
</html>
