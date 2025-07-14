import { supabase } from '../lib/supabase';

interface VirtualSensorConfig {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    city: string;
    district: string;
  };
  crop_type: string;
  soil_type: string;
  farmer_phone: string;
  farmer_name: string;
  field_name: string;
  planting_date: string;
  area_hectares: number;
  enabled: boolean;
  reading_frequency: number; // minutes between readings
  last_reading: string;
}

interface VirtualSensorReading {
  device_id: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  soil_moisture: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  battery_level: number;
  signal_strength: number;
  quality_score: number;
}

interface SimulationScenario {
  name: string;
  description: string;
  conditions: {
    temperature_range: [number, number];
    humidity_range: [number, number];
    moisture_range: [number, number];
    ph_range: [number, number];
    nutrient_depletion_rate: number;
    weather_influence: boolean;
  };
}

class VirtualSensorService {
  private sensors: VirtualSensorConfig[] = [];
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private simulationScenarios: SimulationScenario[] = [];
  private enableRealSMS: boolean; // Flag to enable real SMS sending (persistent)
  // NEW: Track last time an SMS was sent to each sensor & seasonal frequency
  private lastSmsTimestamps: Record<string, number> = {};
  private smsFrequencyDays = 90; // Default seasonal frequency (approx. 3 months)

  constructor() {
    this.initializeSimulationScenarios();

    // Load preference from localStorage (if available) or default to TRUE
    if (typeof window !== 'undefined') {
      const storedPref = localStorage.getItem('realSmsEnabled');
      this.enableRealSMS = storedPref !== null ? storedPref === 'true' : true;
    } else {
      this.enableRealSMS = true; // SSR / tests – default ON
    }
  }

  // Enable or disable real SMS sending
  setRealSMSMode(enabled: boolean): void {
    this.enableRealSMS = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('realSmsEnabled', String(enabled));
    }
    console.log(`📱 Real SMS mode ${enabled ? 'ENABLED' : 'DISABLED'}`);
  }

  // Initialize different farming scenarios
  private initializeSimulationScenarios() {
    this.simulationScenarios = [
      {
        name: 'drought_stress',
        description: 'Simulates drought conditions with low moisture and nutrients',
        conditions: {
          temperature_range: [28, 35],
          humidity_range: [30, 50],
          moisture_range: [15, 30],
          ph_range: [6.0, 7.2],
          nutrient_depletion_rate: 0.8,
          weather_influence: true
        }
      },
      {
        name: 'optimal_conditions',
        description: 'Ideal growing conditions with balanced nutrients',
        conditions: {
          temperature_range: [22, 28],
          humidity_range: [60, 80],
          moisture_range: [45, 65],
          ph_range: [6.2, 7.0],
          nutrient_depletion_rate: 0.3,
          weather_influence: true
        }
      },
      {
        name: 'nutrient_deficiency',
        description: 'Low nutrient levels requiring fertilizer application',
        conditions: {
          temperature_range: [20, 30],
          humidity_range: [50, 70],
          moisture_range: [35, 55],
          ph_range: [5.8, 6.8],
          nutrient_depletion_rate: 1.2,
          weather_influence: false
        }
      },
      {
        name: 'rainy_season',
        description: 'High moisture conditions with nutrient leaching',
        conditions: {
          temperature_range: [18, 26],
          humidity_range: [80, 95],
          moisture_range: [70, 90],
          ph_range: [6.0, 7.5],
          nutrient_depletion_rate: 0.9,
          weather_influence: true
        }
      },
      {
        name: 'early_growth',
        description: 'Seedling stage with specific nutrient needs',
        conditions: {
          temperature_range: [20, 25],
          humidity_range: [65, 85],
          moisture_range: [40, 60],
          ph_range: [6.0, 7.0],
          nutrient_depletion_rate: 0.4,
          weather_influence: true
        }
      }
    ];
  }

  // Create virtual sensor configurations for different farming scenarios
  async createVirtualSensorNetwork(): Promise<void> {
    const virtualSensors: VirtualSensorConfig[] = [
      // Kigali District - Maize Fields
      {
        id: 'VIRTUAL_MAIZE_001',
        name: 'Kigali Maize Field A',
        location: { latitude: -1.9441, longitude: 30.0619, city: 'Kigali', district: 'Nyarugenge' },
        crop_type: 'maize',
        soil_type: 'Loamy',
        farmer_phone: '+250788123456',
        farmer_name: 'Jean Baptiste',
        field_name: 'North Field',
        planting_date: '2024-01-15',
        area_hectares: 2.5,
        enabled: true,
        reading_frequency: 60, // Every hour
        last_reading: new Date().toISOString()
      },
      {
        id: 'VIRTUAL_MAIZE_002',
        name: 'Kigali Maize Field B',
        location: { latitude: -1.9506, longitude: 30.0588, city: 'Kigali', district: 'Gasabo' },
        crop_type: 'maize',
        soil_type: 'Sandy',
        farmer_phone: '+250789951064', // Marie Claire's actual phone number
        farmer_name: 'Marie Claire',
        field_name: 'Maize Field B',
        planting_date: '2024-01-20',
        area_hectares: 1.8,
        enabled: true,
        reading_frequency: 120, // Every 2 hours
        last_reading: new Date().toISOString()
      },
      // Rice paddies
      {
        id: 'VIRTUAL_RICE_001',
        name: 'Huye Rice Paddy A',
        location: { latitude: -2.5958, longitude: 29.7392, city: 'Huye', district: 'Huye' },
        crop_type: 'rice',
        soil_type: 'Clay',
        farmer_phone: '+250788345678',
        farmer_name: 'Paul Uwimana',
        field_name: 'Main Paddy',
        planting_date: '2024-02-01',
        area_hectares: 3.2,
        enabled: true,
        reading_frequency: 90, // Every 1.5 hours
        last_reading: new Date().toISOString()
      },
      // Potato fields
      {
        id: 'VIRTUAL_POTATO_001',
        name: 'Musanze Potato Field',
        location: { latitude: -1.4987, longitude: 29.6359, city: 'Musanze', district: 'Musanze' },
        crop_type: 'potato',
        soil_type: 'Sandy',
        farmer_phone: '+250788456789',
        farmer_name: 'Agnes Mukamana',
        field_name: 'Highland Field',
        planting_date: '2024-01-25',
        area_hectares: 1.5,
        enabled: true,
        reading_frequency: 75, // Every 1.25 hours
        last_reading: new Date().toISOString()
      },
      // Bean cultivation
      {
        id: 'VIRTUAL_BEANS_001',
        name: 'Rubavu Bean Field',
        location: { latitude: -1.6792, longitude: 29.2664, city: 'Rubavu', district: 'Rubavu' },
        crop_type: 'beans',
        soil_type: 'Loamy',
        farmer_phone: '+250788567890',
        farmer_name: 'Emmanuel Habimana',
        field_name: 'Valley Field',
        planting_date: '2024-02-10',
        area_hectares: 2.0,
        enabled: true,
        reading_frequency: 180, // Every 3 hours
        last_reading: new Date().toISOString()
      }
    ];

    this.sensors = virtualSensors;
    
    // Register farmers in database
    for (const sensor of virtualSensors) {
      await this.registerVirtualFarmer(sensor);
    }
    
    console.log(`Created virtual sensor network with ${virtualSensors.length} sensors`);
  }

  // Register virtual farmer in database
  private async registerVirtualFarmer(sensor: VirtualSensorConfig): Promise<void> {
    try {
      // Check if we can access the database, if not, skip registration
      if (!supabase) {
        console.log('📝 Skipping database registration - Supabase not available');
        return;
      }

      // Register farmer profile (handle gracefully if table doesn't exist)
      try {
        await supabase
          .from('farmer_profiles')
          .upsert({
            phone_number: sensor.farmer_phone,
            name: sensor.farmer_name,
            location: sensor.location,
            preferences: {
              sms_frequency: 'daily',
              language: 'en',
              notifications_enabled: true
            }
          });
      } catch (error) {
        console.log('📝 farmer_profiles table not found, skipping registration');
      }

      // Register farmer field (handle gracefully if table doesn't exist)
      try {
        await supabase
          .from('farmer_fields')
          .upsert({
            name: sensor.field_name,
            crop_type: sensor.crop_type,
            area_hectares: sensor.area_hectares,
            planting_date: sensor.planting_date,
            sensor_device_id: sensor.id,
            soil_type: sensor.soil_type
          });
      } catch (error) {
        console.log('📝 farmer_fields table not found, skipping registration');
      }

      console.log(`📝 Virtual farmer registered: ${sensor.farmer_name} (${sensor.farmer_phone})`);
    } catch (error) {
      console.log('📝 Database registration failed, continuing without persistence');
    }
  }

  // Generate realistic sensor reading based on crop type and growth stage
  private generateSensorReading(sensor: VirtualSensorConfig, scenario?: string): VirtualSensorReading {
    const activeScenario = scenario ? 
      this.simulationScenarios.find(s => s.name === scenario) : 
      this.simulationScenarios.find(s => s.name === 'optimal_conditions');

    if (!activeScenario) {
      throw new Error(`Scenario ${scenario} not found`);
    }

    const conditions = activeScenario.conditions;
    
    // Calculate days since planting
    const plantingDate = new Date(sensor.planting_date);
    const daysSincePlanting = Math.floor((Date.now() - plantingDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Base nutrient levels that deplete over time
    const baseNitrogen = Math.max(0.1, 0.5 - (daysSincePlanting * 0.01 * conditions.nutrient_depletion_rate));
    const basePhosphorus = Math.max(5, 25 - (daysSincePlanting * 0.3 * conditions.nutrient_depletion_rate));
    const basePotassium = Math.max(50, 150 - (daysSincePlanting * 1.5 * conditions.nutrient_depletion_rate));

    // Add realistic variations
    const reading: VirtualSensorReading = {
      device_id: sensor.id,
      timestamp: new Date().toISOString(),
      temperature: this.randomInRange(conditions.temperature_range[0], conditions.temperature_range[1]),
      humidity: this.randomInRange(conditions.humidity_range[0], conditions.humidity_range[1]),
      soil_moisture: this.randomInRange(conditions.moisture_range[0], conditions.moisture_range[1]),
      ph: this.randomInRange(conditions.ph_range[0], conditions.ph_range[1]),
      nitrogen: Math.max(0.05, baseNitrogen + this.randomInRange(-0.05, 0.05)),
      phosphorus: Math.max(3, basePhosphorus + this.randomInRange(-3, 3)),
      potassium: Math.max(30, basePotassium + this.randomInRange(-10, 10)),
      battery_level: this.randomInRange(85, 100),
      signal_strength: this.randomInRange(70, 100),
      quality_score: this.randomInRange(0.8, 1.0)
    };

    // Crop-specific adjustments
    switch (sensor.crop_type) {
      case 'rice':
        reading.soil_moisture = Math.max(reading.soil_moisture, 60); // Rice needs more water
        break;
      case 'potato':
        reading.potassium = Math.max(reading.potassium, 100); // Potatoes need more K
        break;
      case 'beans':
        reading.nitrogen = Math.max(reading.nitrogen, 0.15); // Legumes fix nitrogen
        break;
    }

    return reading;
  }

  // Generate random number in range
  private randomInRange(min: number, max: number): number {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100;
  }

  // Store sensor reading in database
  private async storeSensorReading(reading: VirtualSensorReading): Promise<void> {
    try {
      // Check if we can access the database, if not, skip storage
      if (!supabase) {
        console.log('📊 Skipping sensor data storage - Supabase not available');
        return;
      }

      // Store sensor reading (handle gracefully if table doesn't exist)
      try {
        const { error } = await supabase
          .from('iot_sensor_data')
          .insert({
            device_id: reading.device_id,
            timestamp: reading.timestamp,
            temperature: reading.temperature,
            humidity: reading.humidity,
            soil_moisture: reading.soil_moisture,
            ph: reading.ph,
            nitrogen: reading.nitrogen,
            phosphorus: reading.phosphorus,
            potassium: reading.potassium,
            battery_level: reading.battery_level,
            signal_strength: reading.signal_strength,
            quality_score: reading.quality_score
          });

        if (error) {
          console.log('📊 iot_sensor_data table not found, skipping storage');
        }
      } catch (error) {
        console.log('📊 iot_sensor_data table not found, skipping storage');
      }
    } catch (error) {
      console.log('📊 Database storage failed, continuing without persistence');
    }
  }

  // Check if sensor should trigger SMS notification
  private shouldTriggerNotification(reading: VirtualSensorReading): boolean {
    // Trigger SMS if:
    // 1. Low nutrients (needs fertilizer)
    // 2. Extreme moisture levels
    // 3. pH out of range
    // 4. Temperature stress
    
    return (
      reading.nitrogen < 0.2 || // Low nitrogen
      reading.phosphorus < 10 || // Low phosphorus
      reading.potassium < 80 || // Low potassium
      reading.soil_moisture < 25 || // Too dry
      reading.soil_moisture > 80 || // Too wet
      reading.ph < 5.5 || reading.ph > 7.5 || // pH issues
      reading.temperature > 32 || reading.temperature < 15 // Temperature stress
    );
  }

  // Send proactive SMS via Twilio
  private async sendProactiveSMS(sensor: VirtualSensorConfig, reading: VirtualSensorReading): Promise<void> {
    try {
      // Generate ML-based recommendation
      const mlInput = {
        Temparature: reading.temperature,
        Humidity: reading.humidity,
        Moisture: reading.soil_moisture,
        Soil_Type: sensor.soil_type,
        Crop_Type: sensor.crop_type,
        Nitrogen: reading.nitrogen,
        Phosphorous: reading.phosphorus,
        Potassium: reading.potassium
      };

      // Calculate growth stage
      const plantingDate = new Date(sensor.planting_date);
      const daysSincePlanting = Math.floor((Date.now() - plantingDate.getTime()) / (1000 * 60 * 60 * 24));
      const growthStage = this.calculateGrowthStage(sensor.crop_type, daysSincePlanting);

      // Generate message (either with ML model or fallback)
      const generateMessage = async (): Promise<string> => {
        // Use your existing ML model service
        try {
          const { mlModelService } = await import('./mlModelService');
          const prediction = await mlModelService.predict(mlInput);
          
          // Build SMS message with ML prediction (ULTRA-SHORT for SMS limits)
          let message = `🌱 ${sensor.farmer_name}: `;
          message += `Apply ${prediction.fertilizer} ${prediction.applicationRate}kg/ha. `;
          message += `📞 +250-788-SOIL`;
          
          // Ensure message is under 160 characters
          if (message.length > 160) {
            message = message.substring(0, 157) + '...';
          }
          
          console.log(`📱 SMS Length: ${message.length} characters (limit: 160)`);
          
          return message;
        } catch (error) {
          console.error('ML model service unavailable, using fallback recommendation:', error);
          
          // Fallback recommendation without ML model (ULTRA-SHORT for SMS limits)
          let message = `🌱 ${sensor.farmer_name}: `;
          
          // Simple rule-based recommendation (ULTRA-SHORTENED to <160 chars)
          if (reading.nitrogen < 0.2) {
            message += `Low Nitrogen! Apply Urea ${Math.round(100 + Math.random() * 50)}kg/ha. `;
          } else if (reading.phosphorus < 10) {
            message += `Low Phosphorus! Apply DAP ${Math.round(80 + Math.random() * 40)}kg/ha. `;
          } else if (reading.potassium < 80) {
            message += `Low Potassium! Apply KCl ${Math.round(60 + Math.random() * 40)}kg/ha. `;
          } else {
            message += `Balanced nutrients. Apply NPK 100kg/ha. `;
          }
          
          message += `📞 +250-788-SOIL`;
          
          // Ensure message is under 160 characters
          if (message.length > 160) {
            message = message.substring(0, 157) + '...';
          }
          
          console.log(`📱 SMS Length: ${message.length} characters (limit: 160)`);
          
          return message;
        }
      };

      // Get the message
      let message = await generateMessage();
      
      // Skip urgency messages to keep under 160 character limit
      // if (reading.soil_moisture < 25) {
      //   message += `\n💧 URGENT: Irrigate first!`;
      // } else if (reading.nitrogen < 0.15) {
      //   message += `\n⚠️ URGENT: Apply fertilizer NOW!`;
      // }

      // Send via SMS simulation
      await this.sendTwilioSMS(sensor.farmer_phone, message);

      // Log the SMS
      await this.logProactiveSMS(sensor, reading, message);

      console.log(`📱 Proactive SMS sent to ${sensor.farmer_name} (${sensor.farmer_phone})`);
    } catch (error) {
      console.error('Failed to send proactive SMS:', error);
    }
  }

  /* NEW: Decide if it is time to send a seasonal recommendation SMS */
  private shouldSendSeasonalSMS(sensor: VirtualSensorConfig): boolean {
    const last = this.lastSmsTimestamps[sensor.id];
    if (!last) return true; // never sent before
    const diffDays = (Date.now() - last) / (1000 * 60 * 60 * 24);
    return diffDays >= this.smsFrequencyDays;
  }

  /* NEW: Generate and dispatch a seasonal fertilizer recommendation SMS */
  private async sendSeasonalSMS(sensor: VirtualSensorConfig, reading: VirtualSensorReading): Promise<void> {
    try {
      const mlInput = {
        Temparature: reading.temperature,
        Humidity: reading.humidity,
        Moisture: reading.soil_moisture,
        Soil_Type: sensor.soil_type,
        Crop_Type: sensor.crop_type,
        Nitrogen: reading.nitrogen,
        Phosphorous: reading.phosphorus,
        Potassium: reading.potassium
      };

      const { mlModelService } = await import('./mlModelService');
      const prediction = await mlModelService.predict(mlInput);

      let message = `🌱 ${sensor.farmer_name}: Apply ${prediction.fertilizer} ${prediction.applicationRate}kg/ha for ${sensor.crop_type}. 📞 +250-788-SOIL`;
      if (message.length > 160) {
        message = message.substring(0, 157) + '...';
      }

      await this.sendTwilioSMS(sensor.farmer_phone, message);
      await this.logProactiveSMS(sensor, reading, message);

      // Update timestamp
      this.lastSmsTimestamps[sensor.id] = Date.now();
      console.log(`📱 Seasonal recommendation SMS sent to ${sensor.farmer_name} (${sensor.farmer_phone})`);
    } catch (error) {
      console.error('Failed to send seasonal SMS:', error);
    }
  }

  // Send SMS via Twilio
  private async sendTwilioSMS(phoneNumber: string, message: string): Promise<void> {
    try {
      if (this.enableRealSMS) {
        // Send real SMS through your local Python server
        console.log(`📱 REAL SMS - Sending to ${phoneNumber}...`);
        
        const response = await fetch('http://127.0.0.1:8000/send-sms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: phoneNumber,
            body: message
          })
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ Real SMS sent successfully!', result);
          if (typeof window !== 'undefined' && (window as any).addNotification) {
            (window as any).addNotification({
              title: 'SMS Sent',
              message: `Message delivered to ${phoneNumber}`,
              type: 'success'
            });
          }
          console.log(`📱 Check your phone (${phoneNumber}) for the message!`);
        } else {
          const errorText = await response.text();
          throw new Error(`SMS sending failed: ${response.status} ${errorText}`);
        }
      } else {
        // SMS simulation mode
        console.log(`📱 SMS SIMULATION - Would send to ${phoneNumber}:`);
        console.log(`📄 Message: ${message}`);
        
        // For demonstration, let's also try to send a browser notification
        if ('Notification' in window) {
          if (Notification.permission === 'granted') {
            new Notification('SoilSync SMS Sent', {
              body: `SMS sent to ${phoneNumber}: ${message.substring(0, 50)}...`,
              icon: '/favicon.ico'
            });
          } else if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
              if (permission === 'granted') {
                new Notification('SoilSync SMS Sent', {
                  body: `SMS sent to ${phoneNumber}: ${message.substring(0, 50)}...`,
                  icon: '/favicon.ico'
                });
              }
            });
          }
        }
        
        // Log success
        console.log(`✅ SMS simulated successfully to ${phoneNumber}`);
        if (typeof window !== 'undefined' && (window as any).addNotification) {
          (window as any).addNotification({
            title: 'SMS Simulated',
            message: `Simulated message for ${phoneNumber}`,
            type: 'info'
          });
        }
      }
      
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw error;
    }
  }

  // Test function to send real SMS (call from browser console)
  async testRealSMS(phoneNumber: string, message: string): Promise<void> {
    try {
      // This would be for testing real SMS through your Python server
      const response = await fetch('https://soil-sync-nq0s.onrender.com/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phoneNumber,
          body: message
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Real SMS sent successfully:', result);
      } else {
        console.error('❌ SMS sending failed:', await response.text());
      }
    } catch (error) {
      console.error('❌ SMS test failed:', error);
    }
  }

  // Log proactive SMS
  private async logProactiveSMS(sensor: VirtualSensorConfig, reading: VirtualSensorReading, message: string): Promise<void> {
    try {
      // Check if we can access the database, if not, skip logging
      if (!supabase) {
        console.log('📝 Skipping SMS logging - Supabase not available');
        return;
      }

      // Log proactive SMS (handle gracefully if table doesn't exist)
      try {
        await supabase
          .from('proactive_sms_log')
          .insert({
            device_id: sensor.id,
            farmer_phone: sensor.farmer_phone,
            farmer_name: sensor.farmer_name,
            field_name: sensor.field_name,
            crop_type: sensor.crop_type,
            message: message,
            trigger_conditions: {
              temperature: reading.temperature,
              humidity: reading.humidity,
              soil_moisture: reading.soil_moisture,
              ph: reading.ph,
              nitrogen: reading.nitrogen,
              phosphorus: reading.phosphorus,
              potassium: reading.potassium
            },
            timestamp: new Date().toISOString(),
            status: 'sent'
          });
      } catch (error) {
        console.log('📝 proactive_sms_log table not found, skipping logging');
      }
    } catch (error) {
      console.log('📝 SMS logging failed, continuing without persistence');
    }
  }

  // Calculate growth stage based on days since planting
  private calculateGrowthStage(cropType: string, daysSincePlanting: number): string {
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
      potato: [
        { days: 0, stage: 'Sprouting' },
        { days: 14, stage: 'Vegetative' },
        { days: 45, stage: 'Tuber initiation' },
        { days: 75, stage: 'Tuber bulking' },
        { days: 105, stage: 'Maturity' }
      ],
      beans: [
        { days: 0, stage: 'Germination' },
        { days: 10, stage: 'Vegetative' },
        { days: 35, stage: 'Flowering' },
        { days: 50, stage: 'Pod filling' },
        { days: 80, stage: 'Maturity' }
      ]
    };
    
    const cropStages = stages[cropType.toLowerCase()] || stages.maize;
    
    for (let i = cropStages.length - 1; i >= 0; i--) {
      if (daysSincePlanting >= cropStages[i].days) {
        return cropStages[i].stage;
      }
    }
    
    return 'Seedling';
  }

  // Start the virtual sensor simulation
  async startSimulation(scenario: string = 'optimal_conditions'): Promise<void> {
    if (this.isRunning) {
      console.log('Virtual sensor simulation already running');
      return;
    }

    if (this.sensors.length === 0) {
      await this.createVirtualSensorNetwork();
    }

    this.isRunning = true;
    console.log(`🌱 Starting virtual sensor simulation with scenario: ${scenario}`);
    console.log(`📊 Monitoring ${this.sensors.length} virtual sensors`);

    // Run simulation every 5 minutes (adjust as needed)
    this.intervalId = setInterval(async () => {
      await this.runSimulationCycle(scenario);
    }, 5 * 60 * 1000);

    // Run first cycle immediately
    await this.runSimulationCycle(scenario);
  }

  // Run a single simulation cycle
  private async runSimulationCycle(scenario: string): Promise<void> {
    try {
      for (const sensor of this.sensors) {
        if (!sensor.enabled) continue;

        // Check if it's time for this sensor to generate a reading
        const lastReading = new Date(sensor.last_reading);
        const timeSinceLastReading = Date.now() - lastReading.getTime();
        const readingInterval = sensor.reading_frequency * 60 * 1000; // Convert to milliseconds

        if (timeSinceLastReading >= readingInterval) {
          // Generate new reading
          const reading = this.generateSensorReading(sensor, scenario);
          
          // Store in database
          await this.storeSensorReading(reading);

          // NEW: Send seasonal fertilizer recommendation if due
          if (this.shouldSendSeasonalSMS(sensor)) {
            await this.sendSeasonalSMS(sensor, reading);
          }

          // Update last reading time
          sensor.last_reading = new Date().toISOString();

          console.log(`📡 Generated reading for ${sensor.name}: T:${reading.temperature}°C, M:${reading.soil_moisture}%, N:${reading.nitrogen}`);
        }
      }
    } catch (error) {
      console.error('Error in simulation cycle:', error);
    }
  }

  // Stop the simulation
  stopSimulation(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    console.log('🛑 Virtual sensor simulation stopped');
  }

  // Trigger manual SMS for testing
  async triggerManualSMS(deviceId: string): Promise<void> {
    const sensor = this.sensors.find(s => s.id === deviceId);
    if (!sensor) {
      throw new Error(`Sensor ${deviceId} not found`);
    }

    // Generate critical reading that will trigger SMS
    const criticalReading = this.generateSensorReading(sensor, 'nutrient_deficiency');
    criticalReading.nitrogen = 0.1; // Force low nitrogen
    criticalReading.phosphorus = 5; // Force low phosphorus

    await this.storeSensorReading(criticalReading);
    await this.sendProactiveSMS(sensor, criticalReading);
  }

  // Get simulation status
  getSimulationStatus(): {
    isRunning: boolean;
    totalSensors: number;
    activeSensors: number;
    scenarios: string[];
  } {
    return {
      isRunning: this.isRunning,
      totalSensors: this.sensors.length,
      activeSensors: this.sensors.filter(s => s.enabled).length,
      scenarios: this.simulationScenarios.map(s => s.name)
    };
  }

  // Change simulation scenario
  changeScenario(newScenario: string): void {
    if (!this.simulationScenarios.find(s => s.name === newScenario)) {
      throw new Error(`Scenario ${newScenario} not found`);
    }

    console.log(`🔄 Changing simulation scenario to: ${newScenario}`);
    // The new scenario will be applied in the next simulation cycle
  }

  // Get all sensors
  getSensors(): VirtualSensorConfig[] {
    return this.sensors;
  }

  // Toggle sensor enabled/disabled
  toggleSensor(deviceId: string): void {
    const sensor = this.sensors.find(s => s.id === deviceId);
    if (sensor) {
      sensor.enabled = !sensor.enabled;
      console.log(`📡 Sensor ${deviceId} ${sensor.enabled ? 'enabled' : 'disabled'}`);
    }
  }
}

export const virtualSensorService = new VirtualSensorService();

// Global helper for testing real SMS (accessible from browser console)
(window as any).testRealSMS = async (phoneNumber: string, message: string = "🌱 SoilSync Test Message\n\nHello! This is a test SMS from your virtual sensor system.\n\n📞 Call +250-788-SOIL if you received this.") => {
  try {
    console.log(`🧪 Testing real SMS to ${phoneNumber}...`);
    
    const response = await fetch('http://127.0.0.1:8000/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: phoneNumber,
        body: message
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Real SMS sent successfully!', result);
      console.log(`📱 Check your phone (${phoneNumber}) for the message!`);
      return result;
    } else {
      const errorText = await response.text();
      console.error('❌ SMS sending failed:', response.status, errorText);
      return { error: errorText, status: response.status };
    }
  } catch (error) {
    console.error('❌ SMS test failed:', error);
    return { error: error.message };
  }
};

// Global helper to enable real SMS mode (accessible from browser console)
(window as any).enableRealSMS = () => {
  virtualSensorService.setRealSMSMode(true);
  console.log('🚀 Real SMS mode enabled! Virtual sensors will now send actual SMS messages.');
  console.log('📱 To test: Click the phone icon next to Marie Claire\'s sensor or trigger manual SMS.');
};

// Global helper to disable real SMS mode (accessible from browser console)
(window as any).disableRealSMS = () => {
  virtualSensorService.setRealSMSMode(false);
  console.log('🛑 Real SMS mode disabled! Virtual sensors will now simulate SMS messages.');
}; 