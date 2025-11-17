// resources/js/components/Admin/Calendar/CalendarModal.tsx
import { Dialog, DialogContent } from '@/components/UI/Dialog';
import axios from 'axios';
import { format, getDay, parse, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarModal.css'; // Estilos personalizados

interface CalendarEvent extends Event {
    id: number;
    title: string;
    start: Date;
    end: Date;
    status: string;
    game?: { id: number; name: string } | null;
    image?: string;
    color: string;
}

interface CalendarModalProps {
    open: boolean;
    onClose: () => void;
    onCreateTournament: (date: Date) => void;
    onSelectTournament: (tournamentId: number) => void;
}

// Configuración del localizador para español
const locales = {
    es: es,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

// Mensajes en español
const messages = {
    allDay: 'Todo el día',
    previous: 'Anterior',
    next: 'Siguiente',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'No hay torneos en este rango',
    showMore: (total: number) => `+ Ver más (${total})`,
};

export function CalendarModal({ open, onClose, onCreateTournament, onSelectTournament }: CalendarModalProps) {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
    const [date, setDate] = useState(new Date());

    // Cargar eventos del calendario
    const loadEvents = async () => {
        setLoading(true);
        try {
            const response = await axios.get(route('admin.calendar.events'));
            const formattedEvents = response.data.map((event: any) => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end),
            }));
            setEvents(formattedEvents);
        } catch (error) {
            console.error('Error loading calendar events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            loadEvents();
        }
    }, [open]);

    // Manejar clic en un evento (torneo)
    const handleSelectEvent = (event: CalendarEvent) => {
        onSelectTournament(event.id);
    };

    // Manejar clic en un slot vacío (crear torneo)
    const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
        onCreateTournament(slotInfo.start);
    };

    // Estilo personalizado para eventos según su estado
    const eventStyleGetter = (event: CalendarEvent) => {
        return {
            style: {
                backgroundColor: event.color,
                borderRadius: '6px',
                opacity: 0.9,
                color: 'white',
                border: '0px',
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '500',
            },
        };
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-h-[90vh] max-w-6xl overflow-hidden p-0">
                {/* <DialogHeader className="border-border-primary bg-secondary border-b px-6 py-4">
                    <DialogTitle className="text-t-primary text-xl font-semibold">Calendario de Torneos</DialogTitle>
                    <p className="text-t-muted text-sm">Haz clic en un día para crear un nuevo torneo o en un torneo existente para ver detalles</p>
                </DialogHeader> */}

                <div className="calendar-container p-6">
                    {loading ? (
                        <div className="flex h-96 items-center justify-center">
                            <div className="text-t-muted">Cargando calendario...</div>
                        </div>
                    ) : (
                        <BigCalendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 600 }}
                            messages={messages}
                            culture="es"
                            view={view}
                            onView={setView}
                            date={date}
                            onNavigate={setDate}
                            onSelectEvent={handleSelectEvent}
                            onSelectSlot={handleSelectSlot}
                            selectable
                            eventPropGetter={eventStyleGetter}
                            popup
                            views={['month', 'week', 'day', 'agenda']}
                        />
                    )}
                </div>

                {/* Leyenda de estados */}
                <div className="border-border-primary bg-secondary border-t px-6 py-4">
                    <div className="flex flex-wrap gap-4 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded" style={{ backgroundColor: '#6B7280' }} />
                            <span className="text-t-secondary">Borrador</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded" style={{ backgroundColor: '#3B82F6' }} />
                            <span className="text-t-secondary">Publicado</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded" style={{ backgroundColor: '#10B981' }} />
                            <span className="text-t-secondary">Inscripciones Abiertas</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded" style={{ backgroundColor: '#F59E0B' }} />
                            <span className="text-t-secondary">Inscripciones Cerradas</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded" style={{ backgroundColor: '#F4A52E' }} />
                            <span className="text-t-secondary">En Curso</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded" style={{ backgroundColor: '#EF4444' }} />
                            <span className="text-t-secondary">Cancelado</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
