// components/Admin/Games/GameHeader.tsx
import { Link } from '@inertiajs/react';
import { ArrowLeft, Gamepad } from 'lucide-react';

interface Game {
    id: number;
    name: string;
    description: string | null;
    image: string;
}

interface GameHeaderProps {
    game: Game;
}

export function GameHeader({ game }: GameHeaderProps) {
    return (
        <div className="mb-8">
            <div className="border-primary/30 bg-secondary/95 rounded-lg border-2 p-6 shadow-lg backdrop-blur-sm">
                <div className="flex items-center">
                    <Link
                        href={route('admin.games.index')}
                        className="border-primary/30 text-text-primary hover:border-primary hover:bg-primary/20 hover:text-primary mr-6 rounded-lg border p-3 transition-all duration-200 hover:scale-110"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <div className="flex flex-grow items-center">
                        {game.image ? (
                            <img
                                src={game.image}
                                alt={game.name}
                                className="border-primary mr-8 h-24 w-24 rounded-lg border-2 object-cover shadow-xl transition-transform duration-200 hover:scale-105"
                            />
                        ) : (
                            <div className="border-primary bg-secondary/80 mr-8 flex h-24 w-24 items-center justify-center rounded-lg border-2 shadow-xl transition-transform duration-200 hover:scale-105">
                                <Gamepad className="text-primary h-12 w-12" />
                            </div>
                        )}
                        <div className="flex-grow">
                            <h1 className="mb-3 text-5xl font-bold text-white drop-shadow-lg">{game.name}</h1>
                            {game.description && (
                                <p className="border-primary/20 bg-secondary/50 rounded-lg border px-4 py-2 text-xl text-white backdrop-blur-sm">
                                    {game.description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
