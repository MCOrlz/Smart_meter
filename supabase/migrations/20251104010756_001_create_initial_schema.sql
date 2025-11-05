/*
  # Smart Metering System Database Schema

  1. New Tables
    - `users` - System users (managed by auth.users but we track settings)
    - `sensor_readings` - Raw sensor data from three PZEM-004T sensors
    - `daily_summary` - Daily aggregated data for performance
    - `settings` - User settings (cost rate, etc.)
    - `data_exports` - Track data download requests

  2. Security
    - Enable RLS on all tables
    - Users can only access their own data
    - Service role can insert sensor readings from Raspberry Pi

  3. Indexes
    - Created on timestamp for efficient queries
    - Created on user_id for filtering
*/

-- Create sensor readings table
CREATE TABLE IF NOT EXISTS sensor_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  timestamp timestamptz DEFAULT now(),
  
  -- Circuit 1
  voltage_1 decimal(10,2),
  current_1 decimal(10,2),
  power_1 decimal(10,2),
  energy_1 decimal(10,2),
  power_factor_1 decimal(5,3),
  
  -- Circuit 2
  voltage_2 decimal(10,2),
  current_2 decimal(10,2),
  power_2 decimal(10,2),
  energy_2 decimal(10,2),
  power_factor_2 decimal(5,3),
  
  -- Circuit 3
  voltage_3 decimal(10,2),
  current_3 decimal(10,2),
  power_3 decimal(10,2),
  energy_3 decimal(10,2),
  power_factor_3 decimal(5,3),
  
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sensor_readings_user_timestamp 
  ON sensor_readings(user_id, timestamp DESC);

ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sensor readings"
  ON sensor_readings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert sensor readings"
  ON sensor_readings FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Create daily summary table for performance
CREATE TABLE IF NOT EXISTS daily_summary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  
  -- Totals
  total_energy decimal(10,2) DEFAULT 0,
  total_power_max decimal(10,2) DEFAULT 0,
  total_cost decimal(10,2) DEFAULT 0,
  
  -- Circuit 1
  energy_1 decimal(10,2) DEFAULT 0,
  -- Circuit 2
  energy_2 decimal(10,2) DEFAULT 0,
  -- Circuit 3
  energy_3 decimal(10,2) DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_summary_user_date 
  ON daily_summary(user_id, date);

ALTER TABLE daily_summary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily summary"
  ON daily_summary FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create user settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  cost_rate_php_per_kwh decimal(10,4) DEFAULT 12.50,
  timezone text DEFAULT 'Asia/Manila',
  display_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create audit log for data exports
CREATE TABLE IF NOT EXISTS data_exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  export_type text NOT NULL,
  export_date_from date,
  export_date_to date,
  file_format text DEFAULT 'csv',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE data_exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own exports"
  ON data_exports FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create exports"
  ON data_exports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
