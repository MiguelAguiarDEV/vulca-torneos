// components/Admin/Games/GameCard.tsx - MEJORADO VISUALMENTE
import { ActionButton } from '@/components/Admin/Shared/ActionButton';
import { Gamepad2, Pencil, Sparkles, Trash2 } from 'lucide-react';

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
            className="group to-secondary-dark/95 border-primary/30 from-secondary/95 hover:border-primary relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border-2 bg-gradient-to-br shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            onClick={onClick}
        >
            {/* Efecto de brillo al hover */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="bg-primary/20 absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl" />
                <div className="bg-primary/10 absolute -bottom-20 -left-20 h-40 w-40 rounded-full blur-3xl" />
            </div>

            {/* Imagen del juego */}
            <div className="from-secondary-dark to-secondary relative h-56 overflow-hidden bg-gradient-to-br">
                {game.image ? (
                    <>
                        <img
                            src={game.image}
                            alt={game.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                        {/* Overlay gradiente */}
                        <div className="from-secondary-dark/80 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
                    </>
                ) : null}

                {/* Placeholder cuando no hay imagen */}
                <div className={`absolute inset-0 flex items-center justify-center ${game.image ? 'hidden' : ''}`}>
                    <div className="text-center">
                        <div className="relative">
                            <Gamepad2 className="text-primary/50 group-hover:text-primary mx-auto mb-3 h-16 w-16 transition-all duration-300 group-hover:scale-110" />
                            <Sparkles className="text-primary/30 absolute -top-1 -right-1 h-5 w-5 animate-pulse" />
                        </div>
                        <span className="text-text-primary/50 text-sm font-medium">Sin imagen</span>
                    </div>
                </div>

                {/* Badge de estado */}
                <div className="absolute top-3 right-3">
                    <div className="bg-success/90 flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
                        Activo
                    </div>
                </div>

                {/* Nombre del juego superpuesto */}
                <div className="from-secondary-dark/95 absolute right-0 bottom-0 left-0 bg-gradient-to-t to-transparent p-4">
                    <h3 className="group-hover:text-primary line-clamp-2 text-xl font-bold text-white drop-shadow-lg transition-all duration-300">
                        {game.name}
                    </h3>
                </div>
            </div>

            {/* Contenido */}
            <div className="relative flex flex-grow flex-col p-5">
                {game.description ? (
                    <div className="mb-4 flex-grow">
                        <p className="text-text-primary/70 line-clamp-3 text-sm leading-relaxed">{game.description}</p>
                    </div>
                ) : (
                    <div className="mb-4 flex-grow">
                        <p className="text-text-primary/40 text-sm italic">Sin descripción</p>
                    </div>
                )}

                {/* Separador decorativo */}
                <div className="via-primary/30 h-px w-full bg-gradient-to-r from-transparent to-transparent" />
            </div>

            {/* Actions - Mejoradas */}
            <div className="bg-secondary-dark/80 border-primary/20 relative border-t-2 px-5 py-3 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 rounded-full px-3 py-1">
                            <span className="text-primary text-xs font-medium">ID: {game.id}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
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

            {/* Indicador de click */}
            <div className="ring-primary/0 group-hover:ring-primary/20 pointer-events-none absolute inset-0 rounded-xl ring-4 transition-all duration-300" />
        </div>
    );
}
