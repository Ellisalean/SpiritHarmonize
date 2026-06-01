import { useState } from 'react';
import UserManagement from './admin/UserManagement';
import ContentManagement from './admin/ContentManagement';

export default function AdminDashboard({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'content' | 'users'>('content');

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="bg-white px-4 py-2 rounded-xl font-bold shadow-sm border">← Atrás</button>
        <h1 className="text-3xl font-extrabold">Panel de Administración</h1>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => setActiveTab('content')}
          className={`flex-1 p-3 rounded-xl font-bold ${activeTab === 'content' ? 'bg-blue-600 text-white' : 'bg-white'}`}
        >
          Contenido
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`flex-1 p-3 rounded-xl font-bold ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-white'}`}
        >
          Usuarios
        </button>
      </div>

      {activeTab === 'content' ? <ContentManagement /> : <UserManagement />}
    </div>
  );
}
