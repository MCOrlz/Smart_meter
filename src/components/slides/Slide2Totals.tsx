import { SensorReading } from '../../lib/types';

interface Slide2Props {
  readings: SensorReading | null;
}

export function Slide2Totals({ readings }: Slide2Props) {
  const totalPower = readings
    ? readings.power_1 + readings.power_2 + readings.power_3
    : 0;

  const totalCurrent = readings
    ? readings.current_1 + readings.current_2 + readings.current_3
    : 0;

  const avgVoltage = readings
    ? (readings.voltage_1 + readings.voltage_2 + readings.voltage_3) / 3
    : 0;

  const avgPowerFactor = readings
    ? (readings.power_factor_1 + readings.power_factor_2 + readings.power_factor_3) / 3
    : 0;

  const totalEnergy = readings
    ? readings.energy_1 + readings.energy_2 + readings.energy_3
    : 0;

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-96 flex flex-col justify-center">
      <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">System Totals</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm font-medium uppercase mb-3">Total Power</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-blue-600">
              {totalPower.toFixed(2)}
            </span>
            <span className="text-lg text-gray-600">W</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500">
          <p className="text-gray-500 text-sm font-medium uppercase mb-3">Total Energy</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-green-600">
              {totalEnergy.toFixed(2)}
            </span>
            <span className="text-lg text-gray-600">kWh</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-orange-500">
          <p className="text-gray-500 text-sm font-medium uppercase mb-3">Total Current</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-orange-600">
              {totalCurrent.toFixed(2)}
            </span>
            <span className="text-lg text-gray-600">A</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-purple-500">
          <p className="text-gray-500 text-sm font-medium uppercase mb-3">Avg Voltage</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-purple-600">
              {avgVoltage.toFixed(2)}
            </span>
            <span className="text-lg text-gray-600">V</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-red-500">
          <p className="text-gray-500 text-sm font-medium uppercase mb-3">Power Factor</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-red-600">
              {avgPowerFactor.toFixed(3)}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-indigo-500">
          <p className="text-gray-500 text-sm font-medium uppercase mb-3">Last Update</p>
          <p className="text-2xl font-bold text-indigo-600">
            {readings ? new Date(readings.timestamp).toLocaleTimeString() : '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
