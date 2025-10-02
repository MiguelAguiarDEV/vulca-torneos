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
            className="flex h-full cursor-pointer flex-col rounded-lg border-2 border-primary/30 bg-secondary/95 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-primary hover:shadow-xl"
            onClick={onClick}
        >
            {/* Imagen del juego */}
            <div className="relative h-48 overflow-hidden rounded-t-lg bg-secondary-dark">
                {game.image ? (
                    <img
                        src={game.image}
                        alt={game.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                    />
                ) : null}

                <div className={`absolute inset-0 flex items-center justify-center ${game.image ? 'hidden' : ''}`}>
                    <div className="text-center">
                        <Gamepad2 className="mx-auto mb-2 h-12 w-12 text-text-primary/50" />
                        <span className="text-sm text-text-primary/50">Sin imagen</span>
                    </div>
                </div>

                <div className="absolute top-3 right-3">
                    <div className="rounded-md bg-success px-2 py-1 text-xs font-medium text-text-primary shadow-lg">Activo</div>
                </div>
            </div>

            {/* Contenido */}
            <div className="flex flex-grow flex-col p-4">
                <div className="mb-4">
                    <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-text-primary">{game.name}</h3>
                    {game.description && <p className="line-clamp-2 text-sm leading-relaxed text-text-primary/70">{game.description}</p>}
                </div>
                <div className="flex-grow"></div>
            </div>

            {/* Actions */}
            <div className="border-t-2 border-primary bg-secondary-dark/80 px-4 py-3">
                <div className="flex items-center justify-end space-x-2">
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
    );
}
