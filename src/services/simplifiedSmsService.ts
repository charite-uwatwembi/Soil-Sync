import { supabase } from '../lib/supabase';
import { mlModelService } from './mlModelService';

interface SimplifiedSoilData {
  crop_type: string;
  soil_condition: 'dry' | 'wet' | 'normal';
  field_id?: string;
  growth_stage?: 'seedling' | 'vegetative' | 'flowering' | 'mature';
  problem?: 'disease' | 'pest' | 'nutrient' | 'none';
}

interface CommandResponse {
  success: boolean;
  message: string;
  type: 'recommendation' | 'help' | 'error' | 'registration';
}

class SimplifiedSmsService {
  // Parse simple SMS commands
  parseSimpleSMS(message: string, phoneNumber: string): SimplifiedSoilData | null {
    const text = message.trim().toUpperCase();
    
    // Format: CROP CONDITION [FIELD] [STAGE] [PROBLEM]
    // Examples: 
    // "MAIZE DRY"
    // "RICE WET FIELD1"
    // "WHEAT NORMAL FIELD2 FLOWERING"
    // "POTATO DRY FIELD1 VEGETATIVE DISEASE"
    
    const parts = text.split(/\s+/);
    
    if (parts.length < 2) return null;
    
    const [crop, condition, field, stage, problem] = parts;
    
    // Validate crop type
    const validCrops = ['MAIZE', 'RICE', 'WHEAT', 'POTATO', 'BEANS', 'CASSAVA', 'BANANA', 'SUGARCANE', 'COTTON'];
    if (!validCrops.includes(crop)) return null;
    
    // Validate soil condition
    const validConditions = ['DRY', 'WET', 'NORMAL'];
    if (!validConditions.includes(condition)) return null;
    
    // Validate growth stage (optional)
    const validStages = ['SEEDLING', 'VEGETATIVE', 'FLOWERING', 'MATURE'];
    const growthStage = stage && validStages.includes(stage) ? stage.toLowerCase() as SimplifiedSoilData['growth_stage'] : undefined;
    
    // Validate problem (optional)
    const validProblems = ['DISEASE', 'PEST', 'NUTRIENT', 'NONE'];
    const cropProblem = problem && validProblems.includes(problem) ? problem.toLowerCase() as SimplifiedSoilData['problem'] : 'none';
    
    return {
      crop_type: crop.toLowerCase(),
      soil_condition: condition.toLowerCase() as SimplifiedSoilData['soil_condition'],
      field_id: field && field.startsWith('FIELD') ? field.toLowerCase() : undefined,
      growth_stage: growthStage,
      problem: cropProblem
    };
  }

  // Convert simplified data to ML model format
  convertToMLFormat(simpleData: SimplifiedSoilData): any {
    // Use default values based on crop type and soil condition
    const defaults = this.getDefaultValues(simpleData.crop_type, simpleData.soil_condition);
    
    return {
      Temparature: defaults.temperature,
      Humidity: defaults.humidity,
      Moisture: defaults.moisture,
      Soil_Type: defaults.soil_type,
      Crop_Type: simpleData.crop_type,
      Nitrogen: defaults.nitrogen,
      Phosphorous: defaults.phosphorus,
      Potassium: defaults.potassium
    };
  }

  // Get default values based on crop and soil condition
  private getDefaultValues(crop: string, condition: string) {
    const baseValues = {
      temperature: 25,
      humidity: 60,
      moisture: 40,
      soil_type: 'Loamy',
      nitrogen: 0.3,
      phosphorus: 20,
      potassium: 100
    };

    // Adjust based on soil condition
    switch (condition) {
      case 'dry':
        baseValues.moisture = 25;
        baseValues.humidity = 45;
        break;
      case 'wet':
        baseValues.moisture = 60;
        baseValues.humidity = 80;
        break;
      case 'normal':
        // Keep default values
        break;
    }

    // Adjust based on crop type
    switch (crop) {
      case 'rice':
        baseValues.moisture = 70; // Rice needs more water
        baseValues.soil_type = 'Clay';
        break;
      case 'potato':
        baseValues.soil_type = 'Sandy';
        baseValues.potassium = 150; // Potatoes need more K
        break;
      case 'beans':
        baseValues.nitrogen = 0.15; // Legumes need less N
        break;
      case 'sugarcane':
        baseValues.nitrogen = 0.4; // Sugarcane needs more N
        break;
    }

    return baseValues;
  }

  // Generate simple recommendation
  async generateSimpleRecommendation(simpleData: SimplifiedSoilData): Promise<string> {
    try {
      // Convert to ML format
      const mlInput = this.convertToMLFormat(simpleData);
      
      // Get ML prediction
      const prediction = await mlModelService.predict(mlInput);
      
      // Calculate estimated cost (simplified)
      const estimatedCost = this.calculateEstimatedCost(prediction.fertilizer, prediction.applicationRate);
      
      // Build response message
      let message = `🌱 SoilSync Recommendation\n\n`;
      message += `🌽 Crop: ${simpleData.crop_type.toUpperCase()}\n`;
      message += `🌊 Condition: ${simpleData.soil_condition.toUpperCase()}\n`;
      
      if (simpleData.field_id) {
        message += `📍 Field: ${simpleData.field_id.toUpperCase()}\n`;
      }
      
      message += `\n💡 Apply:\n`;
      message += `🧪 ${prediction.fertilizer}\n`;
      message += `📏 ${prediction.applicationRate}kg/ha\n`;
      message += `💰 Cost: ~${estimatedCost} RWF\n`;
      message += `📈 Yield: +${prediction.expectedYieldIncrease}%\n`;
      message += `🎯 Confidence: ${prediction.confidenceScore}%\n\n`;
      
      // Add problem-specific advice
      if (simpleData.problem && simpleData.problem !== 'none') {
        message += this.getProblemAdvice(simpleData.problem);
      }
      
      // Add timing advice
      message += `⏰ Best time: Early morning or evening\n`;
      message += `🌧️ Avoid application before rain\n\n`;
      
      message += `📞 Help: +250-788-SOIL\n`;
      message += `💬 More info: Text HELP`;
      
      return message;
      
    } catch (error) {
      console.error('Failed to generate simple recommendation:', error);
      return `🌱 SoilSync: Unable to process request. Please try again or call +250-788-SOIL for assistance.`;
    }
  }

  // Calculate estimated cost
  private calculateEstimatedCost(fertilizer: string, rate: number): string {
    // Simplified pricing (you should use actual market prices)
    const prices: Record<string, number> = {
      'Urea': 800, // RWF per kg
      'DAP': 1200,
      'NPK': 1000,
      'TSP': 900,
      'CAN': 850
    };
    
    // Find closest match
    let price = 1000; // default
    for (const [name, cost] of Object.entries(prices)) {
      if (fertilizer.includes(name)) {
        price = cost;
        break;
      }
    }
    
    const totalCost = price * rate;
    
    if (totalCost < 1000) {
      return `${totalCost}`;
    } else if (totalCost < 1000000) {
      return `${Math.round(totalCost / 1000)}K`;
    } else {
      return `${Math.round(totalCost / 1000000)}M`;
    }
  }

  // Get problem-specific advice
  private getProblemAdvice(problem: string): string {
    switch (problem) {
      case 'disease':
        return `🦠 Disease detected:\n• Apply fungicide first\n• Ensure good drainage\n• Remove affected plants\n\n`;
      case 'pest':
        return `🐛 Pest management:\n• Apply insecticide if needed\n• Check for beneficial insects\n• Monitor regularly\n\n`;
      case 'nutrient':
        return `🧪 Nutrient deficiency:\n• Soil test recommended\n• Apply fertilizer gradually\n• Monitor plant response\n\n`;
      default:
        return '';
    }
  }

  // Generate help message
  getSimpleHelpMessage(): string {
    return `📱 SoilSync SMS Help\n\n📝 Format: CROP CONDITION [FIELD] [STAGE] [PROBLEM]\n\n🌽 Crops: MAIZE, RICE, WHEAT, POTATO, BEANS, CASSAVA, BANANA, SUGARCANE, COTTON\n\n🌊 Conditions: DRY, WET, NORMAL\n\n📍 Fields: FIELD1, FIELD2, etc (optional)\n\n🌱 Stages: SEEDLING, VEGETATIVE, FLOWERING, MATURE (optional)\n\n🔧 Problems: DISEASE, PEST, NUTRIENT, NONE (optional)\n\n💡 Examples:\n• MAIZE DRY\n• RICE WET FIELD1\n• WHEAT NORMAL FIELD2 FLOWERING\n• POTATO DRY FIELD1 VEGETATIVE DISEASE\n\n📞 Call: +250-788-SOIL\n🌐 Web: soilsync.rw`;
  }

  // Process simple SMS
  async processSimpleSMS(phoneNumber: string, message: string): Promise<CommandResponse> {
    try {
      const trimmedMessage = message.trim().toUpperCase();
      
      // Check for help request
      if (trimmedMessage.includes('HELP')) {
        return {
          success: true,
          message: this.getSimpleHelpMessage(),
          type: 'help'
        };
      }
      
      // Check for stop request
      if (trimmedMessage.includes('STOP')) {
        await this.handleStopRequest(phoneNumber);
        return {
          success: true,
          message: `❌ You have unsubscribed from SoilSync SMS notifications.\n\n📞 To resubscribe, call +250-788-SOIL or visit soilsync.rw`,
          type: 'registration'
        };
      }
      
      // Parse simple SMS
      const simpleData = this.parseSimpleSMS(message, phoneNumber);
      
      if (!simpleData) {
        return {
          success: false,
          message: `❌ Invalid format.\n\n📝 Example: MAIZE DRY\n📱 For help: Text HELP\n📞 Call: +250-788-SOIL`,
          type: 'error'
        };
      }
      
      // Generate recommendation
      const recommendation = await this.generateSimpleRecommendation(simpleData);
      
      // Log interaction
      await this.logSimpleSMSInteraction(phoneNumber, message, recommendation, 'recommendation');
      
      return {
        success: true,
        message: recommendation,
        type: 'recommendation'
      };
      
    } catch (error) {
      console.error('Failed to process simple SMS:', error);
      return {
        success: false,
        message: `🔧 Service temporarily unavailable. Please try again later.\n\n📞 Call: +250-788-SOIL`,
        type: 'error'
      };
    }
  }

  // Handle stop request
  private async handleStopRequest(phoneNumber: string): Promise<void> {
    try {
      await supabase
        .from('sms_preferences')
        .upsert({
          phone_number: phoneNumber,
          notifications_enabled: false,
          unsubscribed_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to handle stop request:', error);
    }
  }

  // Log simple SMS interaction
  private async logSimpleSMSInteraction(
    phoneNumber: string,
    message: string,
    response: string,
    type: string
  ): Promise<void> {
    try {
      await supabase
        .from('sms_interactions')
        .insert({
          phone_number: phoneNumber,
          incoming_message: message,
          outgoing_response: response,
          interaction_type: type,
          status: 'sent',
          service_type: 'simplified'
        });
    } catch (error) {
      console.error('Failed to log simple SMS interaction:', error);
    }
  }

  // Register farmer for simple SMS service
  async registerFarmer(phoneNumber: string, name: string, location?: string): Promise<boolean> {
    try {
      await supabase
        .from('simple_sms_farmers')
        .upsert({
          phone_number: phoneNumber,
          name: name,
          location: location,
          registered_at: new Date().toISOString(),
          notifications_enabled: true
        });
      
      return true;
    } catch (error) {
      console.error('Failed to register farmer:', error);
      return false;
    }
  }

  // Send welcome message to new farmer
  async sendWelcomeMessage(phoneNumber: string, name: string): Promise<boolean> {
    try {
      const welcomeMessage = `🌱 Welcome to SoilSync, ${name}!\n\n✅ You're registered for SMS fertilizer recommendations.\n\n📝 To get advice, text:\nCROP CONDITION\n\nExample: MAIZE DRY\n\n📱 For help: Text HELP\n📞 Call: +250-788-SOIL\n🌐 Web: soilsync.rw`;
      
      // Send SMS (you'll need to implement this)
      // await this.sendSMS(phoneNumber, welcomeMessage);
      
      return true;
    } catch (error) {
      console.error('Failed to send welcome message:', error);
      return false;
    }
  }
}

export const simplifiedSmsService = new SimplifiedSmsService(); 