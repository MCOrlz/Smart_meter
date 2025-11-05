import { SensorReading } from '../../lib/types';

interface Slide4Props {
  readings: SensorReading | null;
}

export function Slide4Circuit2({ readings }: Slide4Props) {
  return (
    <div className="p-8 bg-gradient-to-br from-yellow-50 to-amber-50 min-h-96 flex flex-col justify-center">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900">Circuit 2</h2>
        <p className="text-gray-600">Individual Readings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-md border-2 border-yellow-200">
          <p className="text-gray-500 text-xs font-medium uppercase mb-2">Voltage</p>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-4xl font-bold text-yellow-600">
              {readings?.voltage_2.toFixed(2) || '—'}
            </span>
            <span className="text-lg text-gray-600">V</span>
          </div>
          <div className="h-1 bg-yellow-200 rounded-full"></div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border-2 border-yellow-200">
          <p className="text-gray-500 text-xs font-medium uppercase mb-2">Current</p>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-4xl font-bold text-yellow-600">
              {readings?.current_2.toFixed(2) || '—'}
            </span>
            <span className="text-lg text-gray-600">A</span>
          </div>
          <div className="h-1 bg-yellow-200 rounded-full"></div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border-2 border-yellow-200">
          <p className="text-gray-500 text-xs font-medium uppercase mb-2">Power</p>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-4xl font-bold text-yellow-600">
              {readings?.power_2.toFixed(2) || '—'}
            </span>
            <span className="text-lg text-gray-600">W</span>
          </div>
          <div className="h-1 bg-yellow-200 rounded-full"></div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border-2 border-amber-200">
          <p className="text-gray-500 text-xs font-medium uppercase mb-2">Energy</p>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-4xl font-bold text-amber-600">
              {readings?.energy_2.toFixed(2) || '—'}
            </span>
            <span className="text-lg text-gray-600">kWh</span>
          </div>
          <div className="h-1 bg-amber-200 rounded-full"></div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border-2 border-amber-200">
          <p className="text-gray-500 text-xs font-medium uppercase mb-2">Power Factor</p>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-4xl font-bold text-amber-600">
              {readings?.power_factor_2.toFixed(3) || '—'}
            </span>
          </div>
          <div className="h-1 bg-amber-200 rounded-full"></div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border-2 border-amber-200">
          <p className="text-gray-500 text-xs font-medium uppercase mb-2">Last Update</p>
          <p className="text-2xl font-bold text-amber-600">
            {readings ? new Date(readings.timestamp).toLocaleTimeString() : '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
