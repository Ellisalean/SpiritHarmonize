import { useState } from 'react';
import { songs, Song } from '../lib/songs';
import { ChevronLeft, ChevronRight, Music, Play, Pause, X } from 'lucide-react';

export default function MusicPlayer({ onBack }: { onBack: () => void }) {
    const [selectedSong, setSelectedSong] = useState<Song>(songs[0]);
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <header className="relative h-64 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-b-[3rem] px-6 pt-10 flex flex-col items-center">
                <div className="w-full flex justify-between items-center text-white">
                    <button onClick={onBack} className="p-2 bg-white/20 rounded-full hover:bg-white/30 backdrop-blur-sm transition">
                        <ChevronLeft />
                    </button>
                    <h1 className="text-xl font-bold">Laboratorio Musical</h1>
                    <div className="w-10"></div>
                </div>

                <div className="mt-8 bg-white/20 p-6 rounded-full shadow-lg backdrop-blur-md">
                    <Music size={48} className="text-white" />
                </div>
            </header>

            <div className="flex-1 overflow-y-auto px-6 pt-6">
                <h3 className="font-extrabold text-slate-800 mb-4 tracking-tight">Repertorio</h3>
                <div className="space-y-4 pb-12">
                    {songs.map(song => (
                        <button 
                            key={song.id}
                            onClick={() => {
                                setSelectedSong(song);
                                setShowModal(true);
                            }}
                            className="w-full flex items-center gap-4 p-4 rounded-3xl border transition shadow-sm bg-white border-transparent hover:border-indigo-100"
                        >
                            <div className="p-3 bg-indigo-50 rounded-2xl">
                                <Play size={20} className="text-indigo-600" />
                            </div>
                            <div className="flex-1 text-left">
                                <div className="font-bold text-slate-900">{song.title}</div>
                                <div className="text-xs text-slate-500 font-medium">{song.artist}</div>
                            </div>
                            <ChevronRight size={20} className="text-slate-400" />
                        </button>
                    ))}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="w-full max-w-sm bg-white rounded-3xl p-4 shadow-2xl flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-lg">{selectedSong.title}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
                        <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${selectedSong.youtubeUrl.split('v=')[1]}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
