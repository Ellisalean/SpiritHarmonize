import { ArrowLeft } from 'lucide-react';

interface Announcement {
    id: string;
    date: string;
    time: string;
    title: string;
    content: string;
}

const mockAnnouncements: Announcement[] = [
    { id: '1', date: 'May 31, 2026', time: '3:00 PM', title: 'Rehearsal time changed', content: 'Rehearsal time changed, and access day rehearsal time changed.' },
    { id: '2', date: 'Apr 31, 2026', time: '3:00 AM', title: 'Rehearsal time changed', content: 'Rehearsal time changed, and access day rehearsal time changed.' },
    { id: '3', date: 'Sep 21, 2026', time: '2:00 PM', title: 'Rehearsal time changed', content: 'Rehearsal time changed, and access day rehearsal time changed.' },
];

export default function Announcements({ onBack }: { onBack: () => void }) {
    return (
        <div className="flex flex-col h-full bg-white text-gray-900 rounded-3xl overflow-hidden">
            <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 pb-12 rounded-b-[3rem] relative">
                <button onClick={onBack} className="mb-4">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-3xl font-bold">Announcements</h2>
            </header>
            
            <div className="flex-grow p-6 -mt-4 bg-white rounded-t-[2rem] shadow-lg">
                {mockAnnouncements.map((a) => (
                    <div key={a.id} className="mb-6 border-b border-gray-100 pb-4">
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                            <span>{a.date}</span>
                            <span>{a.time}</span>
                        </div>
                        <h4 className="font-bold text-lg mb-1">{a.title}</h4>
                        <p className="text-gray-500 text-sm">{a.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
