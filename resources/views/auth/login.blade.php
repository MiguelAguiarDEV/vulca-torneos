@extends('layouts.web')

@section('title', 'Iniciar Sesión - Vulca Torneos')

@section('content')
<div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
        <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Iniciar Sesión
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600">
                Accede a tu cuenta para participar en torneos
            </p>
        </div>
        
        <form class="mt-8 space-y-6" method="POST" action="{{ route('login') }}">
            @csrf
            
            <!-- Email -->
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700">
                    Correo Electrónico
                </label>
                <input id="email" 
                       name="email" 
                       type="email" 
                       autocomplete="email" 
                       required 
                       value="{{ old('email') }}"
                       class="mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm @error('email') border-red-300 @else border-gray-300 @enderror" 
                       placeholder="tu@email.com">
                @error('email')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <!-- Password -->
            <div>
                <label for="password" class="block text-sm font-medium text-gray-700">
                    Contraseña
                </label>
                <input id="password" 
                       name="password" 
                       type="password" 
                       autocomplete="current-password" 
                       required 
                       class="mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm @error('password') border-red-300 @else border-gray-300 @enderror" 
                       placeholder="Tu contraseña">
                @error('password')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <!-- Remember Me -->
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <input id="remember_me" 
                           name="remember" 
                           type="checkbox" 
                           class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                    <label for="remember_me" class="ml-2 block text-sm text-gray-900">
                        Recordarme
                    </label>
                </div>

                <div class="text-sm">
                    <a href="{{ route('password.request') }}" class="font-medium text-blue-600 hover:text-blue-500">
                        ¿Olvidaste tu contraseña?
                    </a>
                </div>
            </div>

            <div>
                <button type="submit" 
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out">
                    Iniciar Sesión
                </button>
            </div>

            <div class="text-center">
                <p class="text-sm text-gray-600">
                    ¿No tienes cuenta? 
                    <a href="{{ route('register') }}" class="font-medium text-blue-600 hover:text-blue-500">
                        Regístrate aquí
                    </a>
                </p>
            </div>
        </form>
    </div>
</div>
@endsection
