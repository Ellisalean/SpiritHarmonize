import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Trash2, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

interface CalendarEvent {
    id: string;
    date: Date;
    title: string;
    time: string;
    type: 'rehearsal' | 'event';
}

export default function Calendar({ onBack }: { onBack: () => void }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [newTitle, setNewTitle] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            const querySnapshot = await getDocs(collection(db, 'events'));
            const fetchedEvents = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date.toDate()
            } as CalendarEvent));
            setEvents(fetchedEvents);
        };
        fetchEvents();
    }, []);

    const addEvent = async () => {
        if (!newTitle) return;
        const docRef = await addDoc(collection(db, 'events'), {
            date: selectedDate,
            title: newTitle,
            time: '9:00 am - 10:00 am',
            type: 'event'
        });
        setEvents([...events, { id: docRef.id, date: selectedDate, title: newTitle, time: '9:00 am - 10:00 am', type: 'event' }]);
        setNewTitle('');
    };

    const deleteEvent = async (id: string) => {
        await deleteDoc(doc(db, 'events', id));
        setEvents(events.filter(e => e.id !== id));
    };

    const days = eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentDate)),
        end: endOfWeek(endOfMonth(currentDate))
    });

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    return (
        <div className="flex flex-col h-full bg-slate-50 text-slate-900 rounded-3xl overflow-hidden shadow-2xl">
            <header className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 text-white p-6 pb-12 rounded-b-[2.5rem] relative">
                <button onClick={onBack} className="mb-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-extrabold tracking-tight">Calendar</h2>
                    <CalendarIcon size={24} className="text-white/80" />
                </div>
            </header>

            <div className="flex-grow p-4 -mt-4 bg-white rounded-t-[2rem] shadow-xl">
                <div className="flex justify-between items-center mb-6 px-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full"><ChevronLeft className="text-slate-600"/></button>
                    <h3 className="font-bold text-lg text-slate-800">{format(currentDate, 'MMMM yyyy')}</h3>
                    <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full"><ChevronRight className="text-slate-600"/></button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                    {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="text-slate-400 font-medium pb-2">{d}</div>)}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, i) => {
                        const dayEvents = events.filter(e => isSameDay(e.date, day));
                        const isEvent = dayEvents.length > 0;
                        const isRehearsal = dayEvents.some(e => e.type === 'rehearsal');
                        const isSelected = isSameDay(day, selectedDate);
                        
                        return (
                            <button 
                                key={i} 
                                onClick={() => setSelectedDate(day)}
                                className={`aspect-square flex items-center justify-center rounded-2xl text-sm font-semibold transition
                                    ${!isSameMonth(day, currentDate) ? 'text-slate-300' : 'text-slate-700'}
                                    ${isSelected ? 'bg-indigo-100 text-indigo-700' : ''}
                                    ${isEvent ? 'relative' : ''}
                                `}
                            >
                                {format(day, 'd')}
                                {isEvent && <div className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isRehearsal ? 'bg-teal-500' : 'bg-rose-500'}`}></div>}
                            </button>
                        )
                    })}
                </div>

                <div className="mt-8 flex gap-4 text-xs font-semibold px-2">
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span> Rehearsals</div>
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Events</div>
                </div>

                <div className="mt-4 flex gap-2 flex-col">
                  <p className="text-sm text-slate-600 font-medium">Add event for {format(selectedDate, 'MMM d, yyyy')}</p>
                  <div className="flex gap-2">
                    <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Add event title..." className="flex-grow p-2 border rounded-xl" />
                    <button onClick={addEvent} className="px-4 py-2 bg-indigo-600 text-white rounded-xl">Add</button>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4">
                    {events.filter(e => isSameMonth(e.date, currentDate)).map(e => (
                        <div key={e.id} className="p-4 mb-2 bg-slate-50 rounded-2xl flex items-center justify-between gap-4">
                            <div className="flex gap-4 items-center">
                                <div className={`w-1 h-10 rounded ${e.type === 'rehearsal' ? 'bg-teal-500' : 'bg-rose-500'}`}></div>
                                <div>
                                    <h4 className="font-bold text-slate-800">{e.title}</h4>
                                    <p className="text-xs text-slate-500 font-medium">{e.time} • {format(e.date, 'MMM d')}</p>
                                </div>
                            </div>
                            <button onClick={() => deleteEvent(e.id)} className="text-rose-400 p-2"><Trash2 size={16} /></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
