// components/Admin/Games/GameHeader.tsx
import { Link } from '@inertiajs/react';
import { ArrowLeft, Gamepad2 } from 'lucide-react';

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
        <div className="mb-6">
            <div className="border-border-primary bg-secondary rounded-xl border p-6 shadow-sm">
                <div className="flex items-center gap-6">
                    <Link
                        href={route('admin.games.index')}
                        className="border-border-primary bg-tertiary text-t-secondary hover:bg-highlight hover:text-t-primary flex h-10 w-10 items-center justify-center rounded-lg border transition-all"
                    >
                        <ArrowLeft className="h-5 w-5" strokeWidth={2} />
                    </Link>

                    {game.image ? (
                        <img src={game.image} alt={game.name} className="border-border-primary h-20 w-20 rounded-lg border object-cover shadow-sm" />
                    ) : (
                        <div className="border-border-primary bg-tertiary flex h-20 w-20 items-center justify-center rounded-lg border shadow-sm">
                            <Gamepad2 className="text-accent h-10 w-10" strokeWidth={2} />
                        </div>
                    )}

                    <div className="flex-grow">
                        <h1 className="text-t-primary text-3xl font-bold">{game.name}</h1>
                        {game.description && <p className="text-t-secondary mt-1 text-sm">{game.description}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
