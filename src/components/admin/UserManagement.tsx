import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Profile {
  id: string;
  email: string | null;
  role: string | null;
}

export default function UserManagement() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role');
    if (!error && data) {
      setProfiles(data);
    }
    setLoading(false);
  }

  async function toggleRole(userId: string, currentRole: string | null) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (!error) {
      fetchProfiles();
    }
  }

  if (loading) return <div>Cargando usuarios...</div>;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-4">Gestión de Usuarios</h2>
      <div className="space-y-2">
        {profiles.map(profile => (
          <div key={profile.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span>{profile.email}</span>
            <button 
              onClick={() => toggleRole(profile.id, profile.role)}
              className={`px-3 py-1 rounded-full text-xs font-bold ${profile.role === 'admin' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            >
              {profile.role || 'user'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
