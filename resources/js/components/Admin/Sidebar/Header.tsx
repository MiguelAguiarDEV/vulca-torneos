import { X } from 'lucide-react';

interface HeaderProps {
    toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
    return (
        <div className="bg-diagonal-lines relative flex h-16 items-center justify-center border-b-4 border-ink bg-paper px-4 pl-6">
            <div className="flex items-center space-x-2">
                {/* <div className="rounded-lg border-[3px] border-ink bg-canvas p-2 shadow-[inset_2px_2px_0_rgba(255,255,255,0.4),inset_-2px_-2px_0_rgba(10,10,10,0.2),2px_2px_0_var(--color-ink)]">
                    <img src="/images/vulcalogo.svg" alt="" className="h-5 w-5" />
                </div> */}
                <p className="text-xl font-black tracking-tight text-brand capitalize">vulca comics</p>
            </div>
            <button
                onClick={toggleSidebar}
                className="ml-auto flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-ink bg-danger text-white shadow-[inset_2px_2px_0_rgba(255,255,255,0.3),inset_-2px_-2px_0_rgba(0,0,0,0.2),2px_2px_0_var(--color-ink)] transition-all duration-200 hover:translate-y-[1px] hover:shadow-[inset_2px_2px_0_rgba(0,0,0,0.3)] lg:hidden"
            >
                <X className="h-3 w-3" strokeWidth={3} />
            </button>
        </div>
    );
}
