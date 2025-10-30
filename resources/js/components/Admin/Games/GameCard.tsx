// components/Admin/Games/GameCard.tsx
import { ActionButton } from '@/components/Admin/Shared/ActionButton';
import { Gamepad2, Pencil, Trash2 } from 'lucide-react';

interface Game {
    id: number;
    name: string;
    description: string | null;
    image: string;
}

interface GameCardProps {
    game: Game;
    onEdit: () => void;
    onDelete: () => void;
    onClick: () => void;
}

export function GameCard({ game, onEdit, onDelete, onClick }: GameCardProps) {
    return (
        <div
            className="group border-border-primary bg-secondary relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md"
            onClick={onClick}
        >
            {/* Imagen del juego */}
            <div className="bg-tertiary relative h-48 overflow-hidden">
                {game.image ? (
                    <>
                        <img
                            src={game.image}
                            alt={game.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                        <div className="from-secondary/80 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
                    </>
                ) : null}

                {/* Placeholder cuando no hay imagen */}
                <div className={`absolute inset-0 flex items-center justify-center ${game.image ? 'hidden' : ''}`}>
                    <Gamepad2 className="text-t-muted group-hover:text-accent h-16 w-16 transition-colors" strokeWidth={1.5} />
                </div>

                {/* Badge de estado */}
                <div className="absolute top-3 right-3">
                    <div className="border-border-primary bg-success flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium text-white shadow-sm">
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                        Activo
                    </div>
                </div>

                {/* Nombre del juego superpuesto */}
                <div className="from-secondary absolute right-0 bottom-0 left-0 bg-gradient-to-t to-transparent p-4">
                    <h3 className="text-t-primary group-hover:text-accent line-clamp-1 text-lg font-semibold transition-colors">{game.name}</h3>
                </div>
            </div>

            {/* Contenido */}
            <div className="flex flex-grow flex-col p-4">
                {game.description ? (
                    <p className="text-t-secondary line-clamp-2 flex-grow text-sm">{game.description}</p>
                ) : (
                    <p className="text-t-muted flex-grow text-sm italic">Sin descripción</p>
                )}
            </div>

            {/* Actions */}
            <div className="border-border-primary bg-tertiary border-t px-4 py-3">
                <div className="flex items-center justify-between">
                    <span className="text-t-muted text-xs font-medium">ID: {game.id}</span>
                    <div className="flex items-center gap-1">
                        <ActionButton
                            icon={Pencil}
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit();
                            }}
                            title="Editar juego"
                            variant="primary"
                        />
                        <ActionButton
                            icon={Trash2}
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            title="Eliminar juego"
                            variant="danger"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
