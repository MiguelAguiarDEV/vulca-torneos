// components/Admin/Tournaments/TournamentHeader.tsx
import { ConfirmModal } from '@/components/Admin/Shared/ConfirmModal';
import { FormModal } from '@/components/Admin/Shared/FormModal';
import { TournamentForm } from '@/components/Admin/Tournaments/TournamentForm';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { useCRUD } from '@/hooks/useCRUD';
import { useFormModal } from '@/hooks/useFormModal';
import { useImagePreview } from '@/hooks/useImagePreview';
import type { Game, Registration, Tournament } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Edit, Gamepad2, Trash2, Users } from 'lucide-react';

interface TournamentHeaderProps {
    tournament: Tournament;
    games: Game[];
    registrations: Registration[];
}

export function TournamentHeader({ tournament, games, registrations }: TournamentHeaderProps) {
    const { update, destroy, navigateTo } = useCRUD({
        resourceName: 'torneo',
        routePrefix: 'admin.tournaments',
    });

    // Edit modal
    const editModal = useFormModal<any>({
        initialValues: {},
        onSubmit: (values) => {
            const data = new FormData();
            data.append('_method', 'PUT');
            Object.entries(values).forEach(([key, val]) => {
                if (val !== undefined && val !== null) data.append(key, String(val));
            });
            if (editImage.file) data.append('image', editImage.file);
            update(values.id, data, () => {
                editModal.close();
                editImage.reset();
            });
        },
    });
    const editImage = useImagePreview();

    // Delete modal
    const deleteModal = useConfirmModal<Tournament>();
    const handleDelete = () => destroy(tournament.id, () => navigateTo('admin.tournaments.index'));

    // Inscripciones
    const totalRegs = registrations?.length ?? 0;
    const limit = tournament.registration_limit ?? 0;
    const hasLimit = Boolean(tournament.has_registration_limit && limit > 0);
    const progress = hasLimit ? Math.min(100, Math.round((totalRegs / limit) * 100)) : 0;

    // Estado
    const STATUS_STYLES: Record<string, string> = {
        draft: 'bg-t-muted/20 text-t-muted',
        published: 'bg-accent/10 text-accent',
        registration_open: 'bg-success/10 text-success',
        registration_closed: 'bg-warning/10 text-warning',
        ongoing: 'bg-info/10 text-info',
        finished: 'bg-t-secondary/10 text-t-secondary',
        cancelled: 'bg-danger/10 text-danger',
    };
    const STATUS_LABELS: Record<string, string> = {
        draft: 'Borrador',
        published: 'Publicado',
        registration_open: 'Inscripciones Abiertas',
        registration_closed: 'Inscripciones Cerradas',
        ongoing: 'En Curso',
        finished: 'Finalizado',
        cancelled: 'Cancelado',
    };

    return (
        <>
            <div className="border-border-primary bg-primary relative mb-8 overflow-hidden rounded-xl border shadow-sm">
                {/* Contenido */}
                <div className="relative z-10 flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center">
                    {/* Izquierda */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <Link
                                href={route('admin.tournaments.index')}
                                className="flex h-10 w-10 items-center justify-center rounded-lg border-white/20 bg-white/10 transition-all hover:bg-white/20"
                            >
                                <ArrowLeft className="h-5 w-5" strokeWidth={2} />
                            </Link>
                            <h1 className="text-2xl font-bold drop-shadow-sm">{tournament.name}</h1>
                            <span className={`rounded-lg px-3 py-1 text-xs font-medium ${STATUS_STYLES[tournament.status]}`}>
                                {STATUS_LABELS[tournament.status] ?? tournament.status}
                            </span>
                        </div>

                        {tournament.description && <p className="max-w-3xl text-sm">{tournament.description}</p>}

                        <div className="flex flex-wrap items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" strokeWidth={2} />
                                <span>
                                    {new Date(tournament.start_date).toLocaleDateString('es-ES', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                    {tournament.end_date && (
                                        <>
                                            {' '}
                                            –{' '}
                                            {new Date(tournament.end_date).toLocaleDateString('es-ES', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </>
                                    )}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-white/80" strokeWidth={2} />
                                <span>
                                    {totalRegs}
                                    {hasLimit ? ` / ${limit}` : ''}
                                </span>
                                {hasLimit && (
                                    <span
                                        className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
                                            progress >= 90
                                                ? 'bg-danger/20 text-danger'
                                                : progress >= 70
                                                  ? 'bg-warning/20 text-warning'
                                                  : 'bg-success/20 text-success'
                                        }`}
                                    >
                                        {progress}%
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <Gamepad2 className="h-4 w-4 text-white/80" strokeWidth={2} />
                                <span>{tournament.game?.name ?? 'Sin juego'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => {
                                editModal.open({ id: tournament.id });
                                editImage.setPreview(tournament.image || '');
                            }}
                            className="bg-accent hover:bg-accent-hover flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
                        >
                            <Edit className="h-4 w-4" strokeWidth={2} /> Editar
                        </button>

                        <button
                            onClick={() => deleteModal.open(tournament)}
                            className="bg-danger hover:bg-danger/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
                        >
                            <Trash2 className="h-4 w-4" strokeWidth={2} /> Eliminar
                        </button>
                    </div>
                </div>
            </div>

            {/* Modales */}
            <ConfirmModal
                show={deleteModal.isOpen}
                title="Eliminar Torneo"
                message={`¿Seguro que deseas eliminar "${deleteModal.item?.name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                onConfirm={handleDelete}
                onCancel={deleteModal.close}
                isDestructive
            />

            <FormModal
                show={editModal.isOpen}
                title="Editar Torneo"
                onClose={editModal.close}
                onSubmit={editModal.handleSubmit}
                submitText="Guardar Cambios"
                maxWidth="2xl"
            >
                <TournamentForm values={editModal.values} errors={editModal.errors} onChange={editModal.setValue} image={editImage} games={games} />
            </FormModal>
        </>
    );
}
