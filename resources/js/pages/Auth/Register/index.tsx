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
            onFinish: () => reset('password', 'password_confirmation'),
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Registrarse - Vulca Torneos" />

            <div className="from-secondary via-secondary to-primary relative min-h-dvh overflow-hidden bg-gradient-to-br">
                {/* Brillos decorativos */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="bg-accent/10 absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl" />
                    <div className="bg-accent/10 absolute -right-24 -bottom-24 h-72 w-72 rounded-full blur-3xl" />
                </div>

                {/* Contenido central */}
                <div className="relative mx-auto grid min-h-dvh max-w-6xl place-items-center px-4">
                    <div className="w-full max-w-lg">
                        {/* Header */}
                        <div className="mb-6 flex items-center justify-between">
                            <h1 className="text-t-primary text-2xl font-bold drop-shadow">Vulca Torneos</h1>

                            <div className="flex items-center gap-2 text-sm">
                                {canLogin && (
                                    <Link
                                        href={route('login')}
                                        className="border-border-primary bg-tertiary text-t-secondary hover:bg-highlight-hover hover:text-t-primary rounded-lg border px-3 py-1.5 transition-all"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                )}
                                <Link
                                    href={route('register')}
                                    className="bg-accent hover:bg-accent-hover shadow-accent rounded-lg px-3 py-1.5 font-semibold text-white transition-all"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        </div>

                        {/* Card principal */}
                        <div className="border-border-primary bg-secondary rounded-xl border p-6 shadow-xl backdrop-blur">
                            <div className="mx-auto mb-6 text-center">
                                <h2 className="text-t-primary text-3xl font-extrabold drop-shadow">Crear Cuenta</h2>
                                <p className="text-t-secondary mt-1 text-sm">Únete para participar en torneos</p>
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

                                    {/* Correo */}
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
                                                className="text-t-secondary hover:bg-highlight-hover absolute inset-y-0 right-2 my-1 inline-flex items-center rounded-md px-2 text-xs transition-colors"
                                                aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                            >
                                                {showPwd ? 'Ocultar' : 'Mostrar'}
                                            </button>
                                        </div>
                                    </FormField>

                                    {/* Confirmación */}
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
                                                className="text-t-secondary hover:bg-highlight-hover absolute inset-y-0 right-2 my-1 inline-flex items-center rounded-md px-2 text-xs transition-colors"
                                                aria-label={showPwd2 ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                            >
                                                {showPwd2 ? 'Ocultar' : 'Mostrar'}
                                            </button>
                                        </div>
                                    </FormField>

                                    {/* Botón de registro */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-accent hover:bg-accent-hover shadow-accent-lg mt-2 w-full rounded-lg px-6 py-3 font-semibold text-white transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-75"
                                    >
                                        {processing ? 'Creando cuenta...' : 'Crear Cuenta'}
                                    </button>

                                    {/* Enlace a login */}
                                    {canLogin && (
                                        <p className="text-t-secondary text-center text-sm">
                                            ¿Ya tienes cuenta?{' '}
                                            <Link href={route('login')} className="text-accent hover:text-accent-light font-semibold">
                                                Inicia sesión aquí
                                            </Link>
                                        </p>
                                    )}
                                </form>
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

export default Register;
