// components/Admin/Tournaments/TournamentHeader.tsx
import { FormModal } from '@/components/Admin/Shared/FormModal';
import { TournamentForm } from '@/components/Admin/Tournaments/TournamentForm';
import { useCRUD } from '@/hooks/useCRUD';
import type { Tournament } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Gamepad, Trophy } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { route } from 'ziggy-js';

/* ------------ props ------------ */
interface TournamentHeaderProps {
    tournament: Tournament;
    onEdit: () => void;
    // añade este prop si tienes la lista de juegos en la página padre
    games?: Array<{ id: number; name: string }>;
}

/* ------------ helpers ------------ */
const getStatusColor = (status: string) =>
    ({
        draft: 'bg-secondary text-text-primary',
        published: 'bg-info text-text-primary',
        registration_open: 'bg-success text-text-primary',
        registration_closed: 'bg-warning text-secondary',
        ongoing: 'bg-primary text-secondary',
        finished: 'bg-secondary text-text-primary',
        cancelled: 'bg-error text-text-primary',
    })[status] ?? 'bg-secondary text-text-primary';

const getStatusText = (status: string) =>
    ({
        draft: 'Borrador',
        published: 'Publicado',
        registration_open: 'Inscripciones Abiertas',
        registration_closed: 'Inscripciones Cerradas',
        ongoing: 'En Curso',
        finished: 'Finalizado',
        cancelled: 'Cancelado',
    })[status] ?? status;

/* ------------ hook imagen adaptado al TournamentForm ------------ */
function useImageForForm(initialPreview = '') {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>(initialPreview);

    const handleFileChange = useCallback((f: File | null) => {
        setFile(f);
        if (!f) {
            setPreview('');
            return;
        }
        setPreview(URL.createObjectURL(f));
    }, []);

    const reset = useCallback(() => {
        setFile(null);
        setPreview('');
    }, []);

    return { file, preview, handleFileChange, reset };
}

/* ------------ componente ------------ */
export function TournamentHeader({ tournament, games = [] }: TournamentHeaderProps) {
    const { update } = useCRUD({
        resourceName: 'torneo',
        routePrefix: 'admin.tournaments',
    });

    const editImage = useImageForForm(tournament.image || '');

    // estado simple del modal
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    // valores del form, alineados con TournamentFormValues
    const [formValues, setFormValues] = useState({
        name: tournament.name ?? '',
        description: tournament.description ?? '',
        game_id: tournament.game_id ?? '',
        start_date: (tournament.start_date ?? '').split('T')[0],
        end_date: (tournament.end_date ?? '').split('T')[0],
        registration_start: (tournament.registration_start as string | undefined)?.split('T')?.[0] ?? '',
        registration_end: (tournament.registration_end as string | undefined)?.split('T')?.[0] ?? '',
        entry_fee: tournament.entry_fee != null ? String(tournament.entry_fee) : '',
        has_registration_limit: Boolean((tournament as any).has_registration_limit),
        registration_limit: (tournament as any).registration_limit ? String((tournament as any).registration_limit) : '',
        status: tournament.status as 'draft' | 'published' | 'registration_open' | 'registration_closed' | 'ongoing' | 'finished' | 'cancelled',
    });

    const setValue = <K extends keyof typeof formValues>(key: K, value: (typeof formValues)[K]) => {
        setFormValues((v) => ({ ...v, [key]: value }));
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();

        const data = new FormData();
        data.append('_method', 'PUT');
        data.append('name', formValues.name.trim());
        if (formValues.description) data.append('description', formValues.description.trim());
        if (formValues.game_id) data.append('game_id', String(formValues.game_id));
        if (formValues.start_date) data.append('start_date', formValues.start_date);
        if (formValues.end_date) data.append('end_date', formValues.end_date);
        if (formValues.registration_start) data.append('registration_start', formValues.registration_start);
        if (formValues.registration_end) data.append('registration_end', formValues.registration_end);
        if (formValues.entry_fee) data.append('entry_fee', formValues.entry_fee);
        data.append('status', formValues.status);
        data.append('has_registration_limit', formValues.has_registration_limit ? '1' : '0');
        if (formValues.has_registration_limit && formValues.registration_limit) {
            data.append('registration_limit', formValues.registration_limit);
        }
        if (editImage.file) data.append('image', editImage.file);

        update(tournament.id as number, data, () => {
            closeModal();
            editImage.reset();
        });
    };

    const gameName = useMemo(() => tournament?.game?.name ?? 'Sin juego', [tournament]);

    return (
        <div className="mb-8">
            <div className="rounded-lg border-2 border-primary/30 bg-secondary/95 p-6 shadow-lg backdrop-blur-sm">
                <div className="flex items-center">
                    <Link
                        href={route('admin.tournaments.index')}
                        className="mr-6 rounded-lg border border-primary/30 p-3 text-text-primary transition-all duration-200 hover:scale-110 hover:border-primary hover:bg-primary/20"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </Link>

                    <div className="flex flex-grow items-center">
                        {tournament.image ? (
                            <img
                                src={tournament.image}
                                alt={tournament.name}
                                className="mr-8 h-24 w-24 rounded-lg border-2 border-primary object-cover shadow-xl transition-transform hover:scale-105"
                            />
                        ) : (
                            <div className="mr-8 flex h-24 w-24 items-center justify-center rounded-lg border-2 border-primary bg-secondary/80 shadow-xl">
                                <Trophy className="h-12 w-12 text-primary" />
                            </div>
                        )}

                        <div className="flex-grow">
                            <div className="mb-3 flex items-center gap-4">
                                <h1 className="text-5xl font-bold text-white drop-shadow-lg">{tournament.name}</h1>
                                <span className={`rounded-full px-4 py-2 text-sm font-medium shadow-lg ${getStatusColor(tournament.status)}`}>
                                    {getStatusText(tournament.status)}
                                </span>
                            </div>

                            {tournament.description && (
                                <p className="mb-3 rounded-lg border border-primary/20 bg-secondary/50 px-4 py-2 text-xl text-white backdrop-blur-sm">
                                    {tournament.description}
                                </p>
                            )}

                            <div className="flex items-center justify-between">
                                <div className="flex items-center rounded-lg border border-primary/30 bg-primary/20 px-3 py-2 backdrop-blur-sm">
                                    <Gamepad className="mr-2 h-5 w-5 text-primary" />
                                    <span className="font-medium text-white">{gameName}</span>
                                </div>

                                <button
                                    onClick={() => {
                                        openModal();
                                    }}
                                    className="flex items-center rounded-lg bg-primary px-4 py-2 font-semibold text-secondary shadow-lg transition-all hover:scale-105 hover:bg-primary-dark"
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar Torneo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal: Editar Torneo */}
            <FormModal show={isOpen} title="Editar Torneo" onClose={closeModal} onSubmit={handleSubmit} submitText="Guardar Cambios">
                <TournamentForm
                    values={formValues}
                    errors={{}}
                    onChange={setValue}
                    image={{
                        file: editImage.file,
                        preview: editImage.preview, // string, como espera TournamentForm
                        handleFileChange: editImage.handleFileChange,
                    }}
                    games={games}
                />
            </FormModal>
        </div>
    );
}
