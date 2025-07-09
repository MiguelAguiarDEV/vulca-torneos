@extends('layouts.web')

@section('title', 'Registro - Vulca Torneos')

@section('content')
<div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
        <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Crear Cuenta
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600">
                Únete para participar en torneos
            </p>
        </div>
        
        <form class="mt-8 space-y-6" method="POST" action="{{ route('register') }}">
            @csrf
            
            <!-- Name -->
            <div>
                <label for="name" class="block text-sm font-medium text-gray-700">
                    Nombre Completo
                </label>
                <input id="name" 
                       name="name" 
                       type="text" 
                       autocomplete="name" 
                       required 
                       value="{{ old('name') }}"
                       class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                       placeholder="Tu nombre completo">
                @error('name')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

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
                       class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
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
                       autocomplete="new-password" 
                       required 
                       class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                       placeholder="Mínimo 8 caracteres">
                @error('password')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <!-- Confirm Password -->
            <div>
                <label for="password_confirmation" class="block text-sm font-medium text-gray-700">
                    Confirmar Contraseña
                </label>
                <input id="password_confirmation" 
                       name="password_confirmation" 
                       type="password" 
                       autocomplete="new-password" 
                       required 
                       class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                       placeholder="Repite tu contraseña">
            </div>

            <div>
                <button type="submit" 
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out">
                    Crear Cuenta
                </button>
            </div>

            <div class="text-center">
                <p class="text-sm text-gray-600">
                    ¿Ya tienes cuenta? 
                    <a href="{{ route('login') }}" class="font-medium text-blue-600 hover:text-blue-500">
                        Inicia sesión aquí
                    </a>
                </p>
            </div>
        </form>
    </div>
</div>
@endsection
