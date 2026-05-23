import { useState } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';

interface Devotional {
    id: string;
    date: string;
    title: string;
    content: string;
}

const mockSavedDevotionals: Devotional[] = [
    { id: 's1', date: 'May 23, 2026', title: 'Saved Devotional 1', content: 'Content of saved devotional...' },
];

const mockTodayDevotionals: Devotional[] = [
    { id: '1', date: 'Today', title: 'Faithfulness', content: 'God is faithful in all things, even when we least expect it. Trust in His plan today.' },
    { id: '2', date: 'Today', title: 'Strength', content: 'Find your strength in the Lord, for He is the rock upon which we stand.' },
];

export default function Devotionals({ onBack }: { onBack: () => void }) {
    const [activeTab, setActiveTab] = useState<'saved' | 'today'>('today');
    const devotionals = activeTab === 'saved' ? mockSavedDevotionals : mockTodayDevotionals;

    return (
        <div className="flex flex-col h-full bg-slate-50 text-slate-900 rounded-3xl overflow-hidden shadow-2xl">
            <header className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white p-6 pb-12 rounded-b-[2.5rem] relative">
                <button onClick={onBack} className="mb-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-extrabold tracking-tight">Devotionals</h2>
                    <BookOpen size={24} className="text-white/80" />
                </div>
            </header>

            <div className="flex-grow p-4 -mt-4 bg-white rounded-t-[2rem] shadow-xl">
                <div className="bg-slate-100 p-1 rounded-full flex gap-1 mb-6">
                    <button 
                        onClick={() => setActiveTab('saved')}
                        className={`flex-1 py-2 font-semibold rounded-full transition ${activeTab === 'saved' ? 'bg-white shadow' : 'text-slate-500'}`}
                    >
                        Saved
                    </button>
                    <button 
                        onClick={() => setActiveTab('today')}
                        className={`flex-1 py-2 font-semibold rounded-full transition ${activeTab === 'today' ? 'bg-white shadow' : 'text-slate-500'}`}
                    >
                        Today
                    </button>
                </div>

                <div className="space-y-4">
                    {devotionals.map((d) => (
                        <div key={d.id} className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
                            <div className="text-xs text-slate-400 font-bold mb-1">{d.date}</div>
                            <h4 className="font-bold text-lg text-slate-900 mb-2">{d.title}</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">{d.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
