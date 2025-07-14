import { supabase } from '../lib/supabase';
import { mlModelService } from './mlModelService';

interface FarmerProfile {
  id: string;
  phone_number: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  fields: Field[];
  preferences: {
    sms_frequency: 'daily' | 'weekly' | 'bi-weekly';
    language: 'en' | 'rw' | 'fr';
    notifications_enabled: boolean;
  };
}

interface Field {
  id: string;
  name: string;
  crop_type: string;
  area_hectares: number;
  planting_date: string;
  sensor_device_id?: string;
  soil_type: string;
}

interface SensorReading {
  device_id: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  soil_moisture: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  field_id: string;
}

interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  precipitation_forecast: {
    next_24h: number;
    next_48h: number;
    next_72h: number;
  };
  wind_speed: number;
}

class ProactiveSmsService {
  // Get farmers who should receive proactive SMS
  async getFarmersForNotification(): Promise<FarmerProfile[]> {
    try {
      const { data: farmers, error } = await supabase
        .from('farmer_profiles')
        .select(`
          id,
          phone_number,
          name,
          location,
          preferences,
          fields (
            id,
            name,
            crop_type,
            area_hectares,
            planting_date,
            sensor_device_id,
            soil_type
          )
        `)
        .eq('preferences->notifications_enabled', true);

      if (error) throw error;
      return farmers || [];
    } catch (error) {
      console.error('Failed to get farmers for notification:', error);
      return [];
    }
  }

  // Get latest sensor readings for a field
  async getLatestSensorData(deviceId: string): Promise<SensorReading | null> {
    try {
      const { data: sensorData, error } = await supabase
        .from('iot_sensor_data')
        .select('*')
        .eq('device_id', deviceId)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return sensorData;
    } catch (error) {
      console.error('Failed to get sensor data:', error);
      return null;
    }
  }

  // Get weather forecast for farmer's location
  async getWeatherForecast(latitude: number, longitude: number): Promise<WeatherData | null> {
    try {
      // Replace with actual weather API (OpenWeatherMap, etc.)
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_API_KEY}&units=metric`
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      
      // Process weather data
      return {
        location: data.city.name,
        temperature: data.list[0].main.temp,
        humidity: data.list[0].main.humidity,
        precipitation_forecast: {
          next_24h: data.list.slice(0, 8).reduce((acc: number, item: any) => acc + (item.rain?.['3h'] || 0), 0),
          next_48h: data.list.slice(0, 16).reduce((acc: number, item: any) => acc + (item.rain?.['3h'] || 0), 0),
          next_72h: data.list.slice(0, 24).reduce((acc: number, item: any) => acc + (item.rain?.['3h'] || 0), 0)
        },
        wind_speed: data.list[0].wind.speed
      };
    } catch (error) {
      console.error('Failed to get weather forecast:', error);
      return null;
    }
  }

  // Generate proactive recommendation
  async generateProactiveRecommendation(
    farmer: FarmerProfile,
    field: Field,
    sensorData: SensorReading,
    weather: WeatherData | null
  ): Promise<string> {
    try {
      // Use ML model to get fertilizer recommendation
      const mlInput = {
        Temparature: sensorData.temperature,
        Humidity: sensorData.humidity,
        Moisture: sensorData.soil_moisture,
        Soil_Type: field.soil_type,
        Crop_Type: field.crop_type,
        Nitrogen: sensorData.nitrogen,
        Phosphorous: sensorData.phosphorus,
        Potassium: sensorData.potassium
      };

      const prediction = await mlModelService.predict(mlInput);
      
      // Calculate crop growth stage
      const growthStage = this.calculateGrowthStage(field.planting_date, field.crop_type);
      
      // Build recommendation message
      let message = `🌱 SoilSync Alert - ${field.name}\n`;
      message += `👨‍🌾 Hello ${farmer.name}!\n\n`;
      
      message += `📊 Field Status:\n`;
      message += `🌽 Crop: ${field.crop_type.toUpperCase()} (${growthStage})\n`;
      message += `🌡️ Soil: ${sensorData.temperature}°C, ${sensorData.soil_moisture}% moisture\n`;
      message += `🧪 Nutrients: N:${sensorData.nitrogen}, P:${sensorData.phosphorus}, K:${sensorData.potassium}\n\n`;
      
      message += `💡 Recommendation:\n`;
      message += `🧪 Fertilizer: ${prediction.fertilizer}\n`;
      message += `📏 Rate: ${prediction.applicationRate}kg/ha\n`;
      message += `📈 Expected yield: +${prediction.expectedYieldIncrease}%\n`;
      message += `🎯 Confidence: ${prediction.confidenceScore}%\n\n`;
      
      // Add weather-based timing advice
      if (weather) {
        if (weather.precipitation_forecast.next_24h > 5) {
          message += `⛈️ Rain expected (${weather.precipitation_forecast.next_24h}mm)\n`;
          message += `⏰ Apply fertilizer AFTER rain stops\n\n`;
        } else if (weather.precipitation_forecast.next_48h > 10) {
          message += `🌧️ Rain forecast in 48h\n`;
          message += `⏰ Apply fertilizer TODAY for best results\n\n`;
        } else {
          message += `☀️ Good weather for application\n`;
          message += `⏰ Apply fertilizer within next 2 days\n\n`;
        }
      }
      
      message += `📞 Need help? Call: +250-788-SOIL\n`;
      message += `💬 Reply STOP to unsubscribe`;
      
      return message;
    } catch (error) {
      console.error('Failed to generate proactive recommendation:', error);
      return `🌱 SoilSync: Unable to generate recommendation. Please try again later or call +250-788-SOIL for assistance.`;
    }
  }

  // Calculate crop growth stage
  private calculateGrowthStage(plantingDate: string, cropType: string): string {
    const planted = new Date(plantingDate);
    const now = new Date();
    const daysAfterPlanting = Math.floor((now.getTime() - planted.getTime()) / (1000 * 60 * 60 * 24));
    
    // Growth stages by crop type (simplified)
    const stages: Record<string, Array<{days: number, stage: string}>> = {
      maize: [
        { days: 0, stage: 'Seedling' },
        { days: 21, stage: 'Vegetative' },
        { days: 60, stage: 'Tasseling' },
        { days: 90, stage: 'Grain filling' },
        { days: 120, stage: 'Maturity' }
      ],
      rice: [
        { days: 0, stage: 'Seedling' },
        { days: 30, stage: 'Tillering' },
        { days: 60, stage: 'Heading' },
        { days: 90, stage: 'Flowering' },
        { days: 120, stage: 'Maturity' }
      ],
      wheat: [
        { days: 0, stage: 'Seedling' },
        { days: 30, stage: 'Tillering' },
        { days: 60, stage: 'Stem elongation' },
        { days: 90, stage: 'Flowering' },
        { days: 120, stage: 'Maturity' }
      ]
    };
    
    const cropStages = stages[cropType.toLowerCase()] || stages.maize;
    
    // Find current stage
    for (let i = cropStages.length - 1; i >= 0; i--) {
      if (daysAfterPlanting >= cropStages[i].days) {
        return cropStages[i].stage;
      }
    }
    
    return 'Seedling';
  }

  // Send proactive SMS to farmer
  async sendProactiveSMS(phoneNumber: string, message: string): Promise<boolean> {
    try {
      // Use existing SMS service
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: message,
          from: 'SoilSync'
        })
      });

      const success = response.ok;
      
      // Log proactive SMS
      await this.logProactiveSMS(phoneNumber, message, success);
      
      return success;
    } catch (error) {
      console.error('Failed to send proactive SMS:', error);
      return false;
    }
  }

  // Log proactive SMS interaction
  private async logProactiveSMS(phoneNumber: string, message: string, success: boolean) {
    try {
      await supabase
        .from('proactive_sms_log')
        .insert({
          phone_number: phoneNumber,
          message: message,
          status: success ? 'delivered' : 'failed',
          message_type: 'proactive_recommendation',
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to log proactive SMS:', error);
    }
  }

  // Main function to process all farmers and send proactive SMS
  async processProactiveNotifications(): Promise<void> {
    try {
      const farmers = await this.getFarmersForNotification();
      console.log(`Processing proactive notifications for ${farmers.length} farmers`);
      
      for (const farmer of farmers) {
        for (const field of farmer.fields) {
          // Skip fields without sensors
          if (!field.sensor_device_id) continue;
          
          // Get latest sensor data
          const sensorData = await this.getLatestSensorData(field.sensor_device_id);
          if (!sensorData) continue;
          
          // Check if data is recent (within last 24 hours)
          const dataAge = Date.now() - new Date(sensorData.timestamp).getTime();
          if (dataAge > 24 * 60 * 60 * 1000) continue; // Skip old data
          
          // Get weather forecast
          const weather = await this.getWeatherForecast(
            farmer.location.latitude,
            farmer.location.longitude
          );
          
          // Generate recommendation
          const recommendation = await this.generateProactiveRecommendation(
            farmer,
            field,
            sensorData,
            weather
          );
          
          // Send SMS
          const success = await this.sendProactiveSMS(farmer.phone_number, recommendation);
          
          console.log(`Proactive SMS ${success ? 'sent' : 'failed'} to ${farmer.phone_number} for field ${field.name}`);
          
          // Add delay between SMS sends to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      console.error('Failed to process proactive notifications:', error);
    }
  }
}

export const proactiveSmsService = new ProactiveSmsService(); 