import { useState } from 'react';
import ReactPlayer from 'react-player';
import { songs, Song } from '../lib/songs';
import { ChevronLeft, ChevronRight, Music, Play, Pause } from 'lucide-react';

export default function MusicPlayer({ onBack }: { onBack: () => void }) {
    const [selectedSong, setSelectedSong] = useState<Song>(songs[0]);
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <header className="relative h-64 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-b-[3rem] px-6 pt-10 flex flex-col items-center">
                <div className="w-full flex justify-between items-center text-white">
                    <button onClick={onBack} className="p-2 bg-white/20 rounded-full hover:bg-white/30 backdrop-blur-sm transition">
                        <ChevronLeft />
                    </button>
                    <h1 className="text-xl font-bold">Your Music Hub</h1>
                    <div className="w-10"></div>
                </div>

                <div className="mt-8 bg-white/20 p-6 rounded-full shadow-lg backdrop-blur-md">
                    <Music size={48} className="text-white" />
                </div>
            </header>

            <div className="flex-1 overflow-y-auto pt-20 px-6">
                <h3 className="font-extrabold text-slate-800 mb-4 tracking-tight">Repertorio</h3>
                <div className="space-y-4 pb-20">
                    {songs.map(song => (
                        <button 
                            key={song.id}
                            onClick={() => {
                                setSelectedSong(song);
                                setIsPlaying(true);
                            }}
                            className={`w-full flex items-center gap-4 p-4 rounded-3xl border transition shadow-sm ${selectedSong.id === song.id ? 'bg-white border-indigo-200' : 'bg-white border-transparent hover:border-indigo-100'}`}
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
            
            {/* Simple player overlay or integrated player would go here, omitting for now to stick strictly to the requested "layout emulation" */}
        </div>
    );
}
