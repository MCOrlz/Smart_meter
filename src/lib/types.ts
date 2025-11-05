export interface SensorReading {
  id: string;
  user_id: string;
  timestamp: string;
  voltage_1: number;
  current_1: number;
  power_1: number;
  energy_1: number;
  power_factor_1: number;
  voltage_2: number;
  current_2: number;
  power_2: number;
  energy_2: number;
  power_factor_2: number;
  voltage_3: number;
  current_3: number;
  power_3: number;
  energy_3: number;
  power_factor_3: number;
  created_at: string;
}

export interface DailySummary {
  id: string;
  user_id: string;
  date: string;
  total_energy: number;
  total_power_max: number;
  total_cost: number;
  energy_1: number;
  energy_2: number;
  energy_3: number;
}

export interface UserSettings {
  id: string;
  user_id: string;
  cost_rate_php_per_kwh: number;
  timezone: string;
  display_name: string;
}

export interface CurrentReadings {
  totalEnergy: number;
  totalPower: number;
  totalCurrent: number;
  totalVoltage: number;
  avgPowerFactor: number;
  circuit1: CircuitReading;
  circuit2: CircuitReading;
  circuit3: CircuitReading;
}

export interface CircuitReading {
  voltage: number;
  current: number;
  power: number;
  energy: number;
  powerFactor: number;
}
