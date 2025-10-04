// pages/Auth/Login.tsx
import { FormField } from '@/components/Admin/Shared/FormField';
import { TextInput } from '@/components/Admin/Shared/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { route } from 'ziggy-js';

interface LoginProps {
    status?: string | null;
    canResetPassword?: boolean;
    canRegister?: boolean;
}

const Login: React.FC<LoginProps> = ({ status, canResetPassword = true, canRegister = true }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Iniciar Sesión" />

            {/* Contenedor a viewport completo sin desbordes */}
            <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-secondary-dark via-secondary to-secondary-dark">
                {/* Brillos decorativos SIN overflow */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                    <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                </div>

                {/* Grid para centrar perfecto y limitar ancho general */}
                <div className="relative mx-auto grid min-h-dvh max-w-6xl place-items-center px-4">
                    {/* Columna central con ancho razonable */}
                    <div className="w-full max-w-lg">
                        {/* Header compacto */}
                        <div className="mb-6 flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-white drop-shadow">Vulca Torneos</h1>

                            <div className="flex items-center gap-2 text-sm">
                                <Link
                                    href={route('login')}
                                    className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-text-primary transition-all hover:border-primary hover:bg-primary/20"
                                >
                                    Iniciar Sesión
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={route('register')}
                                        className="rounded-lg bg-primary px-3 py-1.5 font-semibold text-secondary shadow hover:bg-primary-dark"
                                    >
                                        Registrarse
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Card: limitada en altura para pantallas pequeñas, sin romper layout */}
                        <div className="rounded-xl border-2 border-primary/30 bg-secondary/95 p-6 shadow-xl backdrop-blur">
                            <div className="mx-auto mb-6 text-center">
                                <h2 className="text-3xl font-extrabold text-white drop-shadow">Iniciar Sesión</h2>
                                <p className="mt-1 text-sm text-text-primary/70">Accede con tu cuenta para gestionar torneos</p>
                            </div>

                            {/* Si hay mensaje de estado, que no rompa el alto */}
                            {status && (
                                <div className="mb-4 rounded-lg border border-info/30 bg-info/10 px-4 py-2 text-sm text-text-primary">{status}</div>
                            )}

                            {/* En pantallas muy pequeñas, permite scroll solo dentro de la card */}
                            <div className="max-h-[70vh] overflow-auto pr-1">
                                <form onSubmit={submit} className="space-y-5">
                                    <FormField label="Correo Electrónico" error={errors.email} fullWidth>
                                        <TextInput
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="tu@email.com"
                                            autoComplete="username"
                                            error={!!errors.email}
                                            autoFocus
                                        />
                                    </FormField>

                                    <FormField label="Contraseña" error={errors.password} fullWidth>
                                        <div className="relative">
                                            <TextInput
                                                type={showPassword ? 'text' : 'password'}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Tu contraseña"
                                                autoComplete="current-password"
                                                error={!!errors.password}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((v) => !v)}
                                                className="absolute inset-y-0 right-2 my-1 inline-flex items-center rounded-md px-2 text-xs text-text-primary/80 hover:bg-secondary/60"
                                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                            >
                                                {showPassword ? 'Ocultar' : 'Mostrar'}
                                            </button>
                                        </div>
                                    </FormField>

                                    <div className="flex items-center justify-between">
                                        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-text-primary">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary"
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                            />
                                            Recordarme
                                        </label>

                                        {canResetPassword && (
                                            <Link href={route('password.request')} className="text-sm font-medium text-primary hover:text-primary/80">
                                                ¿Olvidaste tu contraseña?
                                            </Link>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="mt-2 w-full rounded-lg bg-primary px-6 py-3 font-semibold text-secondary shadow-lg transition-all hover:scale-[1.01] hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-75"
                                    >
                                        {processing ? 'Entrando...' : 'Iniciar Sesión'}
                                    </button>
                                </form>

                                {canRegister && (
                                    <p className="mt-6 text-center text-sm text-text-primary/80">
                                        ¿No tienes cuenta?{' '}
                                        <Link href={route('register')} className="font-semibold text-primary hover:text-primary/80">
                                            Regístrate aquí
                                        </Link>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Footer mini (opcional) */}
                        <p className="mt-4 text-center text-xs text-text-primary/60">
                            © {new Date().getFullYear()} Vulca Torneos — Todos los derechos reservados
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
