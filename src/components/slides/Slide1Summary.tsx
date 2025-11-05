import { SensorReading, UserSettings } from '../../lib/types';
import { Wifi } from 'lucide-react';

interface Slide1Props {
  readings: SensorReading | null;
  settings: UserSettings | null;
}

export function Slide1Summary({ readings, settings }: Slide1Props) {
  const monthlyBill = readings
    ? ((readings.energy_1 + readings.energy_2 + readings.energy_3) * (settings?.cost_rate_php_per_kwh || 12.50))
    : 0;

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' });

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-96 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Energy Monitor</h1>
          <p className="text-gray-600">Monthly Bill & Cost Summary</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Wifi className="w-5 h-5" />
            <span className="text-sm">Connected</span>
          </div>
          <div className="text-xl font-semibold text-gray-900">{timeStr}</div>
          <div className="text-sm text-gray-600">{dateStr}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
        <div className="bg-white rounded-lg p-8 shadow-sm border-2 border-gray-200">
          <p className="text-gray-500 text-sm font-medium mb-3 uppercase tracking-wide">Monthly Bill</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl md:text-6xl font-bold text-blue-600">
              {monthlyBill.toFixed(2)}
            </span>
            <span className="text-2xl font-semibold text-gray-700">PHP</span>
          </div>
          <p className="text-gray-500 text-sm mt-4">Based on current consumption</p>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-sm border-2 border-gray-200">
          <p className="text-gray-500 text-sm font-medium mb-3 uppercase tracking-wide">Total Energy</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl md:text-6xl font-bold text-green-600">
              {readings ? (readings.energy_1 + readings.energy_2 + readings.energy_3).toFixed(2) : '—'}
            </span>
            <span className="text-2xl font-semibold text-gray-700">kWh</span>
          </div>
          <p className="text-gray-500 text-sm mt-4">All circuits combined</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-500 text-xs font-medium uppercase">Cost Rate</p>
            <p className="text-2xl font-bold text-gray-900">
              {settings?.cost_rate_php_per_kwh.toFixed(2) || '12.50'}
            </p>
            <p className="text-gray-600 text-xs">PHP/kWh</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium uppercase">Circuit 1</p>
            <p className="text-2xl font-bold text-gray-900">
              {readings?.energy_1.toFixed(2) || '—'}
            </p>
            <p className="text-gray-600 text-xs">kWh</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium uppercase">Circuit 2</p>
            <p className="text-2xl font-bold text-gray-900">
              {readings?.energy_2.toFixed(2) || '—'}
            </p>
            <p className="text-gray-600 text-xs">kWh</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium uppercase">Circuit 3</p>
            <p className="text-2xl font-bold text-gray-900">
              {readings?.energy_3.toFixed(2) || '—'}
            </p>
            <p className="text-gray-600 text-xs">kWh</p>
          </div>
        </div>
      </div>
    </div>
  );
}
