// pages/Auth/Register/Index.tsx
import { FormField } from '@/components/Admin/Shared/FormField';
import { TextInput } from '@/components/Admin/Shared/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { route } from 'ziggy-js';

interface RegisterProps {
    canLogin?: boolean;
}

const Register: React.FC<RegisterProps> = ({ canLogin = true }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPwd, setShowPwd] = useState(false);
    const [showPwd2, setShowPwd2] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => {
                reset('password', 'password_confirmation');
            },
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Registro" />

            {/* Wrapper a viewport completo, sin overflow global */}
            <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-secondary-dark via-secondary to-secondary-dark">
                {/* Brillos decorativos controlados (sin provocar scroll) */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                    <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                </div>

                {/* Centro perfecto */}
                <div className="relative mx-auto grid min-h-dvh max-w-6xl place-items-center px-4">
                    <div className="w-full max-w-lg">
                        {/* Header compacto */}
                        <div className="mb-6 flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-white drop-shadow">Vulca Torneos</h1>

                            <div className="flex items-center gap-2 text-sm">
                                {canLogin && (
                                    <Link
                                        href={route('login')}
                                        className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-text-primary transition-all hover:border-primary hover:bg-primary/20"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                )}
                                <Link
                                    href={route('register')}
                                    className="rounded-lg bg-primary px-3 py-1.5 font-semibold text-secondary shadow hover:bg-primary-dark"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        </div>

                        {/* Card de registro (con scroll interno en pantallas muy pequeñas) */}
                        <div className="rounded-xl border-2 border-primary/30 bg-secondary/95 p-6 shadow-xl backdrop-blur">
                            <div className="mx-auto mb-6 text-center">
                                <h2 className="text-3xl font-extrabold text-white drop-shadow">Crear Cuenta</h2>
                                <p className="mt-1 text-sm text-text-primary/70">Únete para participar en torneos</p>
                            </div>

                            <div className="max-h-[70vh] overflow-auto pr-1">
                                <form onSubmit={submit} className="space-y-5" noValidate>
                                    {/* Nombre */}
                                    <FormField label="Nombre Completo" error={errors.name} fullWidth>
                                        <TextInput
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Tu nombre completo"
                                            autoComplete="name"
                                            autoFocus
                                            error={!!errors.name}
                                        />
                                    </FormField>

                                    {/* Email */}
                                    <FormField label="Correo Electrónico" error={errors.email} fullWidth>
                                        <TextInput
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="tu@email.com"
                                            autoComplete="email"
                                            error={!!errors.email}
                                        />
                                    </FormField>

                                    {/* Contraseña */}
                                    <FormField label="Contraseña" error={errors.password} fullWidth>
                                        <div className="relative">
                                            <TextInput
                                                type={showPwd ? 'text' : 'password'}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Mínimo 8 caracteres"
                                                autoComplete="new-password"
                                                error={!!errors.password}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPwd((v) => !v)}
                                                className="absolute inset-y-0 right-2 my-1 inline-flex items-center rounded-md px-2 text-xs text-text-primary/80 hover:bg-secondary/60"
                                                aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                            >
                                                {showPwd ? 'Ocultar' : 'Mostrar'}
                                            </button>
                                        </div>
                                    </FormField>

                                    {/* Confirmar contraseña */}
                                    <FormField label="Confirmar Contraseña" fullWidth>
                                        <div className="relative">
                                            <TextInput
                                                type={showPwd2 ? 'text' : 'password'}
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Repite tu contraseña"
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPwd2((v) => !v)}
                                                className="absolute inset-y-0 right-2 my-1 inline-flex items-center rounded-md px-2 text-xs text-text-primary/80 hover:bg-secondary/60"
                                                aria-label={showPwd2 ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                            >
                                                {showPwd2 ? 'Ocultar' : 'Mostrar'}
                                            </button>
                                        </div>
                                    </FormField>

                                    {/* Botón */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="mt-2 w-full rounded-lg bg-primary px-6 py-3 font-semibold text-secondary shadow-lg transition-all hover:scale-[1.01] hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-75"
                                    >
                                        {processing ? 'Creando cuenta...' : 'Crear Cuenta'}
                                    </button>

                                    {/* Link a login */}
                                    {canLogin && (
                                        <p className="text-center text-sm text-text-primary/80">
                                            ¿Ya tienes cuenta?{' '}
                                            <Link href={route('login')} className="font-semibold text-primary hover:text-primary/80">
                                                Inicia sesión aquí
                                            </Link>
                                        </p>
                                    )}
                                </form>
                            </div>
                        </div>

                        {/* Footer mini */}
                        <p className="mt-4 text-center text-xs text-text-primary/60">
                            © {new Date().getFullYear()} Vulca Torneos — Todos los derechos reservados
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
