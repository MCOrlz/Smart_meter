import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { LogOut, Menu, X, Download, RotateCcw, Settings } from 'lucide-react';
import { SettingsModal } from './SettingsModal';

export function Header() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  const handleDownloadData = async () => {
    try {
      const { data, error } = await supabase
        .from('sensor_readings')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10000);

      if (error) throw error;

      const csv = [
        ['Timestamp', 'V1', 'I1', 'P1', 'E1', 'PF1', 'V2', 'I2', 'P2', 'E2', 'PF2', 'V3', 'I3', 'P3', 'E3', 'PF3'],
        ...data.map(r => [
          new Date(r.timestamp).toLocaleString(),
          r.voltage_1, r.current_1, r.power_1, r.energy_1, r.power_factor_1,
          r.voltage_2, r.current_2, r.power_2, r.energy_2, r.power_factor_2,
          r.voltage_3, r.current_3, r.power_3, r.energy_3, r.power_factor_3,
        ])
      ]
        .map(row => row.join(','))
        .join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sensor_readings_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (err) {
      console.error('Error downloading data:', err);
    }
  };

  const handleResetData = async () => {
    if (confirm('Are you sure? This will delete all sensor data.')) {
      try {
        await supabase.from('sensor_readings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        alert('All data has been reset.');
      } catch (err) {
        console.error('Error resetting data:', err);
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Smart Metering System</h1>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleDownloadData}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Download Data"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleResetData}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Reset Data"
            >
              <RotateCcw className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-2">
            <button
              onClick={() => {
                setSettingsOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded transition flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button
              onClick={() => {
                handleDownloadData();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Data
            </button>
            <button
              onClick={() => {
                handleResetData();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Data
            </button>
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded transition flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </header>
  );
}
