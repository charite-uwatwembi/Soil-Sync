/*
  # Backend Support Tables

  1. New Tables
    - `iot_sensor_data` - Store IoT sensor readings
    - `iot_alerts` - Store IoT alerts and notifications
    - `sms_interactions` - Store SMS interactions
    - `news_articles` - Store cached news articles
    - `ml_predictions` - Store ML model predictions
    - `user_preferences` - Store user preferences

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- IoT Sensor Data Table
CREATE TABLE IF NOT EXISTS iot_sensor_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  device_id text NOT NULL,
  timestamp timestamptz NOT NULL,
  processed_at timestamptz DEFAULT now(),
  
  -- Environmental readings
  temperature numeric,
  humidity numeric,
  soil_moisture numeric,
  ph numeric,
  
  -- Nutrient readings
  nitrogen numeric,
  phosphorus numeric,
  potassium numeric,
  
  -- Device metadata
  location jsonb,
  battery_level numeric,
  signal_strength numeric,
  quality_score numeric DEFAULT 1.0,
  anomaly_detected boolean DEFAULT false
);

-- IoT Alerts Table
CREATE TABLE IF NOT EXISTS iot_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  device_id text NOT NULL,
  alert_type text NOT NULL,
  message text NOT NULL,
  severity text DEFAULT 'medium',
  sensor_data_id uuid REFERENCES iot_sensor_data(id),
  resolved boolean DEFAULT false,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES users(id)
);

-- SMS Interactions Table
CREATE TABLE IF NOT EXISTS sms_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  phone_number text NOT NULL,
  incoming_message text NOT NULL,
  outgoing_response text NOT NULL,
  interaction_type text DEFAULT 'recommendation',
  status text DEFAULT 'sent',
  confidence_score numeric,
  fertilizer_recommended text,
  application_rate numeric
);

-- News Articles Cache Table
CREATE TABLE IF NOT EXISTS news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  excerpt text,
  content text,
  author text,
  published_date timestamptz,
  image_url text,
  category text,
  tags text[],
  source text,
  url text,
  cached_at timestamptz DEFAULT now()
);

-- ML Predictions Table
CREATE TABLE IF NOT EXISTS ml_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES users(id),
  soil_analysis_id uuid REFERENCES soil_analyses(id),
  model_version text NOT NULL,
  input_features jsonb NOT NULL,
  prediction_result jsonb NOT NULL,
  confidence_score numeric,
  processing_time_ms integer,
  model_type text DEFAULT 'joblib'
);

-- User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES users(id) UNIQUE,
  
  -- Notification preferences
  email_notifications boolean DEFAULT true,
  sms_notifications boolean DEFAULT false,
  push_notifications boolean DEFAULT true,
  
  -- Dashboard preferences
  default_crop_type text DEFAULT 'maize',
  preferred_units text DEFAULT 'metric',
  dashboard_layout jsonb DEFAULT '{}',
  
  -- Privacy preferences
  data_sharing boolean DEFAULT false,
  analytics_tracking boolean DEFAULT true
);

-- Enable RLS
ALTER TABLE iot_sensor_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- IoT Sensor Data Policies
CREATE POLICY "Public read access to sensor data"
  ON iot_sensor_data FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Service role can manage sensor data"
  ON iot_sensor_data FOR ALL
  TO service_role
  USING (true);

-- IoT Alerts Policies
CREATE POLICY "Users can read alerts"
  ON iot_alerts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can manage alerts"
  ON iot_alerts FOR ALL
  TO service_role
  USING (true);

-- SMS Interactions Policies
CREATE POLICY "Service role can manage SMS interactions"
  ON sms_interactions FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Authenticated users can read SMS stats"
  ON sms_interactions FOR SELECT
  TO authenticated
  USING (true);

-- News Articles Policies
CREATE POLICY "Public read access to news"
  ON news_articles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Service role can manage news"
  ON news_articles FOR ALL
  TO service_role
  USING (true);

-- ML Predictions Policies
CREATE POLICY "Users can read own predictions"
  ON ml_predictions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create predictions"
  ON ml_predictions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage predictions"
  ON ml_predictions FOR ALL
  TO service_role
  USING (true);

-- User Preferences Policies
CREATE POLICY "Users can manage own preferences"
  ON user_preferences FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS iot_sensor_data_device_id_idx ON iot_sensor_data(device_id);
CREATE INDEX IF NOT EXISTS iot_sensor_data_timestamp_idx ON iot_sensor_data(timestamp DESC);
CREATE INDEX IF NOT EXISTS iot_alerts_device_id_idx ON iot_alerts(device_id);
CREATE INDEX IF NOT EXISTS iot_alerts_resolved_idx ON iot_alerts(resolved);
CREATE INDEX IF NOT EXISTS sms_interactions_phone_idx ON sms_interactions(phone_number);
CREATE INDEX IF NOT EXISTS sms_interactions_created_idx ON sms_interactions(created_at DESC);
CREATE INDEX IF NOT EXISTS news_articles_category_idx ON news_articles(category);
CREATE INDEX IF NOT EXISTS news_articles_published_idx ON news_articles(published_date DESC);
CREATE INDEX IF NOT EXISTS ml_predictions_user_id_idx ON ml_predictions(user_id);
CREATE INDEX IF NOT EXISTS ml_predictions_created_idx ON ml_predictions(created_at DESC);