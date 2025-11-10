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

            {/* Fondo principal con degradado */}
            <div className="from-secondary via-secondary to-primary relative min-h-dvh overflow-hidden bg-gradient-to-br">
                {/* Brillos decorativos */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="bg-accent/10 absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl" />
                    <div className="bg-accent/10 absolute -right-24 -bottom-24 h-72 w-72 rounded-full blur-3xl" />
                </div>

                {/* Contenido centrado */}
                <div className="relative mx-auto grid min-h-dvh max-w-6xl place-items-center px-4">
                    <div className="w-full max-w-lg">
                        {/* Header compacto */}
                        <div className="mb-6 flex items-center justify-between">
                            <h1 className="text-t-primary text-2xl font-bold drop-shadow">Vulca Torneos</h1>

                            <div className="flex items-center gap-2 text-sm">
                                <Link
                                    href={route('login')}
                                    className="border-border-primary bg-tertiary text-t-secondary hover:bg-highlight-hover hover:text-t-primary rounded-lg border px-3 py-1.5 transition-all"
                                >
                                    Iniciar Sesión
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={route('register')}
                                        className="bg-accent hover:bg-accent-hover shadow-accent rounded-lg px-3 py-1.5 font-semibold text-white transition-all"
                                    >
                                        Registrarse
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Card principal */}
                        <div className="border-border-primary bg-secondary rounded-xl border p-6 shadow-xl backdrop-blur">
                            <div className="mx-auto mb-6 text-center">
                                <h2 className="text-t-primary text-3xl font-extrabold drop-shadow">Iniciar Sesión</h2>
                                <p className="text-t-secondary mt-1 text-sm">Accede con tu cuenta para gestionar torneos</p>
                            </div>

                            {/* Mensaje de estado */}
                            {status && <div className="border-info bg-info/10 text-t-primary mb-4 rounded-lg border px-4 py-2 text-sm">{status}</div>}

                            {/* Formulario */}
                            <div className="max-h-[70vh] overflow-auto px-1.5">
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
                                                className="text-t-secondary hover:bg-highlight-hover absolute inset-y-0 right-2 my-1 inline-flex items-center rounded-md px-2 text-xs transition-colors"
                                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                            >
                                                {showPassword ? 'Ocultar' : 'Mostrar'}
                                            </button>
                                        </div>
                                    </FormField>

                                    <div className="flex items-center justify-between">
                                        <label className="text-t-secondary inline-flex cursor-pointer items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                className="border-border-primary text-accent focus:ring-accent h-4 w-4 rounded"
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                            />
                                            Recordarme
                                        </label>

                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="text-accent hover:text-accent-light text-sm font-medium"
                                            >
                                                ¿Olvidaste tu contraseña?
                                            </Link>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-accent hover:bg-accent-hover shadow-accent-lg mt-2 w-full rounded-lg px-6 py-3 font-semibold text-white transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-75"
                                    >
                                        {processing ? 'Entrando...' : 'Iniciar Sesión'}
                                    </button>
                                </form>

                                {canRegister && (
                                    <p className="text-t-secondary mt-6 text-center text-sm">
                                        ¿No tienes cuenta?{' '}
                                        <Link href={route('register')} className="text-accent hover:text-accent-light font-semibold">
                                            Regístrate aquí
                                        </Link>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <p className="text-t-muted mt-4 text-center text-xs">
                            © {new Date().getFullYear()} Vulca Torneos — Todos los derechos reservados
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
