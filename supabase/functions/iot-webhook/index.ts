import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

interface IoTSensorData {
  device_id: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  soil_moisture: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  battery_level?: number;
  signal_strength?: number;
}

interface ProcessedSensorData extends IoTSensorData {
  id: string;
  processed_at: string;
  quality_score: number;
  anomaly_detected: boolean;
}

class IoTDataProcessor {
  private supabase;

  constructor() {
    this.supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
  }

  async processSensorData(rawData: IoTSensorData): Promise<ProcessedSensorData> {
    // Validate sensor data
    const validationResult = this.validateSensorData(rawData);
    if (!validationResult.isValid) {
      throw new Error(`Invalid sensor data: ${validationResult.errors.join(', ')}`);
    }

    // Detect anomalies
    const anomalyDetected = this.detectAnomalies(rawData);

    // Calculate quality score
    const qualityScore = this.calculateQualityScore(rawData);

    // Process and normalize data
    const processedData: ProcessedSensorData = {
      ...rawData,
      id: crypto.randomUUID(),
      processed_at: new Date().toISOString(),
      quality_score: qualityScore,
      anomaly_detected: anomalyDetected,
      // Normalize values
      temperature: Math.round(rawData.temperature * 10) / 10,
      humidity: Math.round(rawData.humidity * 10) / 10,
      soil_moisture: Math.round(rawData.soil_moisture * 10) / 10,
      ph: Math.round(rawData.ph * 100) / 100,
      nitrogen: Math.round(rawData.nitrogen * 1000) / 1000,
      phosphorus: Math.round(rawData.phosphorus * 10) / 10,
      potassium: Math.round(rawData.potassium * 10) / 10
    };

    // Store in database
    await this.storeSensorData(processedData);

    // Trigger alerts if necessary
    if (anomalyDetected || qualityScore < 0.7) {
      await this.triggerAlert(processedData);
    }

    return processedData;
  }

  private validateSensorData(data: IoTSensorData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields
    if (!data.device_id) errors.push('device_id is required');
    if (!data.timestamp) errors.push('timestamp is required');

    // Value ranges
    if (data.temperature < -10 || data.temperature > 60) {
      errors.push('temperature out of range (-10 to 60°C)');
    }
    if (data.humidity < 0 || data.humidity > 100) {
      errors.push('humidity out of range (0 to 100%)');
    }
    if (data.soil_moisture < 0 || data.soil_moisture > 100) {
      errors.push('soil_moisture out of range (0 to 100%)');
    }
    if (data.ph < 0 || data.ph > 14) {
      errors.push('ph out of range (0 to 14)');
    }
    if (data.nitrogen < 0 || data.nitrogen > 5) {
      errors.push('nitrogen out of range (0 to 5%)');
    }
    if (data.phosphorus < 0 || data.phosphorus > 500) {
      errors.push('phosphorus out of range (0 to 500 ppm)');
    }
    if (data.potassium < 0 || data.potassium > 2000) {
      errors.push('potassium out of range (0 to 2000 ppm)');
    }

    return { isValid: errors.length === 0, errors };
  }

  private detectAnomalies(data: IoTSensorData): boolean {
    // Simple anomaly detection rules
    const anomalies = [
      data.temperature > 45 || data.temperature < 5, // Extreme temperatures
      data.humidity > 95 || data.humidity < 10, // Extreme humidity
      data.ph < 4 || data.ph > 9, // Extreme pH
      data.soil_moisture < 5 || data.soil_moisture > 90, // Extreme moisture
      data.nitrogen > 3, // Very high nitrogen
      data.phosphorus > 300, // Very high phosphorus
      data.potassium > 1500 // Very high potassium
    ];

    return anomalies.some(condition => condition);
  }

  private calculateQualityScore(data: IoTSensorData): number {
    let score = 1.0;

    // Reduce score for missing optional data
    if (!data.location) score -= 0.1;
    if (!data.battery_level) score -= 0.05;
    if (!data.signal_strength) score -= 0.05;

    // Reduce score for low battery or signal
    if (data.battery_level && data.battery_level < 20) score -= 0.2;
    if (data.signal_strength && data.signal_strength < 30) score -= 0.1;

    // Reduce score for extreme values (but not anomalies)
    if (data.temperature > 40 || data.temperature < 10) score -= 0.1;
    if (data.humidity > 90 || data.humidity < 20) score -= 0.1;

    return Math.max(0, Math.min(1, score));
  }

  private async storeSensorData(data: ProcessedSensorData): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('iot_sensor_data')
        .insert({
          id: data.id,
          device_id: data.device_id,
          timestamp: data.timestamp,
          processed_at: data.processed_at,
          temperature: data.temperature,
          humidity: data.humidity,
          soil_moisture: data.soil_moisture,
          ph: data.ph,
          nitrogen: data.nitrogen,
          phosphorus: data.phosphorus,
          potassium: data.potassium,
          location: data.location,
          battery_level: data.battery_level,
          signal_strength: data.signal_strength,
          quality_score: data.quality_score,
          anomaly_detected: data.anomaly_detected
        });

      if (error) {
        console.error('Database storage error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to store sensor data:', error);
      // Don't throw here - we still want to return the processed data
    }
  }

  private async triggerAlert(data: ProcessedSensorData): Promise<void> {
    try {
      // Create alert record
      const alertMessage = this.generateAlertMessage(data);
      
      const { error } = await this.supabase
        .from('iot_alerts')
        .insert({
          device_id: data.device_id,
          alert_type: data.anomaly_detected ? 'anomaly' : 'quality',
          message: alertMessage,
          severity: data.anomaly_detected ? 'high' : 'medium',
          sensor_data_id: data.id,
          resolved: false
        });

      if (error) {
        console.error('Alert creation error:', error);
      }

      // You could also send notifications here (email, SMS, etc.)
    } catch (error) {
      console.error('Failed to trigger alert:', error);
    }
  }

  private generateAlertMessage(data: ProcessedSensorData): string {
    if (data.anomaly_detected) {
      return `Anomaly detected in sensor ${data.device_id}. Please check device status and readings.`;
    } else {
      return `Low data quality (${Math.round(data.quality_score * 100)}%) detected for sensor ${data.device_id}.`;
    }
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const sensorData: IoTSensorData = await req.json();
    
    const processor = new IoTDataProcessor();
    const processedData = await processor.processSensorData(sensorData);

    return new Response(
      JSON.stringify({
        success: true,
        data: processedData,
        message: 'Sensor data processed successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('IoT webhook error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to process sensor data'
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});