import { useState } from 'react';
import { ArrowLeft, BookOpen, X } from 'lucide-react';

interface Devotional {
    id: string;
    date: string;
    title: string;
    verse: string;
    reflection: string;
}

const mockSavedDevotionals: Devotional[] = [
    { id: 's1', date: '23 May, 2026', title: 'Perseverancia en la Fe', verse: 'Hebreos 12:1', reflection: 'Corramos con paciencia la carrera que tenemos por delante, puestos los ojos en Jesús, el autor y consumador de la fe...' },
];

const mockTodayDevotionals: Devotional[] = [
    { 
        id: '1', 
        date: 'Hoy', 
        title: 'La Fidelidad de Dios', 
        verse: 'Lamentaciones 3:22-23',
        reflection: 'Dios es fiel en todas las cosas. Mañana tras mañana, Su misericordia se renueva. No te centres en tus circunstancias actuales, sino en la inmutable fidelidad de tu Creador. Confía en Su plan hoy, incluso cuando no entiendas el panorama completo. Él está obrando en ti, transformándote a Su imagen por la obra del Espíritu Santo.'
    },
    { 
        id: '2', 
        date: 'Hoy', 
        title: 'Fortaleza en el Señor', 
        verse: 'Isaías 40:31',
        reflection: 'Encuentra tu verdadera fortaleza en el Señor. Esperar en Él no es pasividad; es una confianza activa. Cuando nos apoyamos en Él, Él renueva nuestras fuerzas. Deja que el Espíritu Santo sea hoy tu guía y tu fuente de energía espiritual, superando cualquier debilidad humana.'
    },
];

export default function Devotionals({ onBack }: { onBack: () => void }) {
    const [activeTab, setActiveTab] = useState<'saved' | 'today'>('today');
    const [selectedDevotional, setSelectedDevotional] = useState<Devotional | null>(null);
    const devotionals = activeTab === 'saved' ? mockSavedDevotionals : mockTodayDevotionals;

    return (
        <div className="flex flex-col h-full bg-slate-50 text-slate-900 rounded-3xl overflow-hidden shadow-2xl relative">
            <header className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white p-6 pb-12 rounded-b-[2.5rem] relative">
                <button onClick={onBack} className="mb-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-extrabold tracking-tight">Devocionales</h2>
                    <BookOpen size={24} className="text-white/80" />
                </div>
            </header>

            <div className="flex-grow p-4 -mt-4 bg-white rounded-t-[2rem] shadow-xl">
                <div className="bg-slate-100 p-1 rounded-full flex gap-1 mb-6">
                    <button 
                        onClick={() => setActiveTab('saved')}
                        className={`flex-1 py-2 font-bold rounded-full transition ${activeTab === 'saved' ? 'bg-white shadow' : 'text-slate-500'}`}
                    >
                        Guardados
                    </button>
                    <button 
                        onClick={() => setActiveTab('today')}
                        className={`flex-1 py-2 font-bold rounded-full transition ${activeTab === 'today' ? 'bg-white shadow' : 'text-slate-500'}`}
                    >
                        Hoy
                    </button>
                </div>

                <div className="space-y-4">
                    {devotionals.map((d) => (
                        <button 
                            key={d.id} 
                            onClick={() => setSelectedDevotional(d)}
                            className="w-full text-left p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:border-indigo-200 transition"
                        >
                            <div className="text-xs text-slate-400 font-bold mb-1">{d.date}</div>
                            <h4 className="font-bold text-lg text-slate-900 mb-1">{d.title}</h4>
                            <div className="text-xs italic text-indigo-600 mb-2">{d.verse}</div>
                            <p className="text-sm text-slate-600 line-clamp-2">{d.reflection}</p>
                        </button>
                    ))}
                </div>
            </div>

            {selectedDevotional && (
                <div className="absolute inset-0 bg-white p-6 z-10 flex flex-col pt-12 overflow-y-auto">
                    <button onClick={() => setSelectedDevotional(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full">
                        <X size={20} />
                    </button>
                    <div className="text-sm text-indigo-600 font-bold mb-2">{selectedDevotional.date}</div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">{selectedDevotional.title}</h2>
                    <div className="text-md font-bold text-indigo-800 mb-6 bg-indigo-50 p-3 rounded-lg">{selectedDevotional.verse}</div>
                    <p className="text-lg text-slate-700 leading-relaxed">{selectedDevotional.reflection}</p>
                </div>
            )}
        </div>
    );
}
