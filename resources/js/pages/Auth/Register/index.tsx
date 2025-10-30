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
            <div className="from-secondary-dark via-secondary to-secondary-dark relative min-h-dvh overflow-hidden bg-gradient-to-br">
                {/* Brillos decorativos controlados (sin provocar scroll) */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="bg-primary/10 absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl" />
                    <div className="bg-primary/10 absolute -right-24 -bottom-24 h-72 w-72 rounded-full blur-3xl" />
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
                                        className="border-primary/30 bg-primary/10 text-text-primary hover:border-primary hover:bg-primary/20 rounded-lg border px-3 py-1.5 transition-all"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                )}
                                <Link
                                    href={route('register')}
                                    className="bg-primary text-secondary hover:bg-primary-dark rounded-lg px-3 py-1.5 font-semibold shadow"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        </div>

                        {/* Card de registro (con scroll interno en pantallas muy pequeñas) */}
                        <div className="border-primary/30 bg-secondary/95 rounded-xl border-2 p-6 shadow-xl backdrop-blur">
                            <div className="mx-auto mb-6 text-center">
                                <h2 className="text-3xl font-extrabold text-white drop-shadow">Crear Cuenta</h2>
                                <p className="text-text-primary/70 mt-1 text-sm">Únete para participar en torneos</p>
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
                                                className="text-text-primary/80 hover:bg-secondary/60 absolute inset-y-0 right-2 my-1 inline-flex items-center rounded-md px-2 text-xs"
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
                                                className="text-text-primary/80 hover:bg-secondary/60 absolute inset-y-0 right-2 my-1 inline-flex items-center rounded-md px-2 text-xs"
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
                                        className="bg-primary text-secondary hover:bg-primary-dark mt-2 w-full rounded-lg px-6 py-3 font-semibold shadow-lg transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-75"
                                    >
                                        {processing ? 'Creando cuenta...' : 'Crear Cuenta'}
                                    </button>

                                    {/* Link a login */}
                                    {canLogin && (
                                        <p className="text-text-primary/80 text-center text-sm">
                                            ¿Ya tienes cuenta?{' '}
                                            <Link href={route('login')} className="text-primary hover:text-primary/80 font-semibold">
                                                Inicia sesión aquí
                                            </Link>
                                        </p>
                                    )}
                                </form>
                            </div>
                        </div>

                        {/* Footer mini */}
                        <p className="text-text-primary/60 mt-4 text-center text-xs">
                            © {new Date().getFullYear()} Vulca Torneos — Todos los derechos reservados
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
