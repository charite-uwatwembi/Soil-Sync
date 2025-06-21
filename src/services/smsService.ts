import { supabase, isDemoMode } from '../lib/supabase';

export interface SMSMessage {
  id: string;
  phoneNumber: string;
  message: string;
  response: string;
  status: 'sent' | 'delivered' | 'failed';
  timestamp: string;
  type: 'recommendation' | 'help' | 'error';
}

export interface SoilDataSMS {
  phosphorus: number;
  potassium: number;
  nitrogen: number;
  crop_type: string;
}

class SMSService {
  // Parse SMS message to extract soil data
  parseSoilDataFromSMS(message: string): SoilDataSMS | null {
    const text = message.trim().toUpperCase();
    
    if (!text.startsWith('SOIL')) {
      return null;
    }

    const parts = text.substring(4).trim().split(/\s+/);
    
    if (parts.length < 4) {
      return null;
    }

    try {
      let phosphorus: number;
      let potassium: number;
      let nitrogen: number;
      let crop_type: string;

      if (parts[0].startsWith('P')) {
        // Format: SOIL P15 K120 N0.25 MAIZE
        phosphorus = parseFloat(parts[0].substring(1));
        potassium = parseFloat(parts[1].substring(1));
        nitrogen = parseFloat(parts[2].substring(1));
        crop_type = parts[3];
      } else {
        // Format: SOIL 15 120 0.25 MAIZE
        phosphorus = parseFloat(parts[0]);
        potassium = parseFloat(parts[1]);
        nitrogen = parseFloat(parts[2]);
        crop_type = parts[3];
      }

      // Validate values
      if (isNaN(phosphorus) || isNaN(potassium) || isNaN(nitrogen)) {
        return null;
      }

      if (phosphorus < 0 || phosphorus > 200 || 
          potassium < 0 || potassium > 1000 || 
          nitrogen < 0 || nitrogen > 2) {
        return null;
      }

      return {
        phosphorus,
        potassium,
        nitrogen,
        crop_type: crop_type.toLowerCase()
      };
    } catch (error) {
      return null;
    }
  }

  // Generate fertilizer recommendation from SMS data
  generateRecommendation(soilData: SoilDataSMS): string {
    const { phosphorus, potassium, nitrogen, crop_type } = soilData;
    
    let fertilizer = "NPK 17-17-17";
    let rate = 150;
    let confidence = 85;
    let expectedYield = 15;

    // Decision logic
    if (nitrogen < 0.15) {
      fertilizer = "Urea";
      rate = 120;
      confidence = 94;
      expectedYield = 25;
    } else if (nitrogen < 0.25 && phosphorus < 12) {
      fertilizer = "DAP";
      rate = 110;
      confidence = 91;
      expectedYield = 22;
    } else if (phosphorus < 10) {
      fertilizer = "TSP";
      rate = 100;
      confidence = 89;
      expectedYield = 20;
    } else if (potassium < 80) {
      fertilizer = "NPK 15-15-15";
      rate = 140;
      confidence = 87;
      expectedYield = 18;
    }

    // Crop-specific adjustments
    switch (crop_type.toLowerCase()) {
      case 'rice':
        rate *= 1.25;
        expectedYield += 8;
        break;
      case 'maize':
        rate *= 1.1;
        expectedYield += 5;
        break;
      case 'beans':
        rate *= 0.7;
        fertilizer = "NPK 10-20-10";
        expectedYield += 3;
        break;
      case 'potato':
        rate *= 1.15;
        if (potassium < 150) {
          fertilizer = "NPK 15-15-20";
        }
        expectedYield += 6;
        break;
    }

    rate = Math.round(rate);
    expectedYield = Math.round(expectedYield);

    return `SoilSync Recommendation:
Crop: ${crop_type.toUpperCase()}
Fertilizer: ${fertilizer}
Rate: ${rate}kg/ha
Expected yield increase: +${expectedYield}%
Confidence: ${confidence}%

For help: Reply HELP
For more info: Call 0788-SOIL-RW`;
  }

  // Generate help message
  getHelpMessage(): string {
    return `SoilSync SMS Help:

Format: SOIL [P] [K] [N] [CROP]

Example: SOIL 15 120 0.25 MAIZE

Where:
P = Phosphorus (ppm, 0-200)
K = Potassium (ppm, 0-1000) 
N = Nitrogen (%, 0-2)
CROP = maize, rice, beans, potato, cassava, banana

Alternative format:
SOIL P15 K120 N0.25 MAIZE

For support: Call 0788-SOIL-RW
Website: soilsync.rw`;
  }

  // Process incoming SMS
  async processSMS(phoneNumber: string, message: string): Promise<string> {
    try {
      let response: string;
      let type: 'recommendation' | 'help' | 'error' = 'error';

      // Check for help request
      if (message.trim().toUpperCase().includes('HELP')) {
        response = this.getHelpMessage();
        type = 'help';
      } else {
        // Try to parse soil data
        const soilData = this.parseSoilDataFromSMS(message);
        
        if (soilData) {
          response = this.generateRecommendation(soilData);
          type = 'recommendation';
        } else {
          response = `Invalid format. Send HELP for instructions.

Example: SOIL 15 120 0.25 MAIZE

SoilSync - Smart Agriculture`;
          type = 'error';
        }
      }

      // Log the SMS interaction
      await this.logSMSInteraction(phoneNumber, message, response, type);

      return response;
    } catch (error) {
      console.error('SMS processing error:', error);
      return `Service temporarily unavailable. Please try again later.

SoilSync - Smart Agriculture`;
    }
  }

  // Log SMS interaction to database
  private async logSMSInteraction(
    phoneNumber: string, 
    message: string, 
    response: string, 
    type: 'recommendation' | 'help' | 'error'
  ) {
    if (isDemoMode) {
      // Store in local storage for demo
      const logs = JSON.parse(localStorage.getItem('sms_logs') || '[]');
      logs.unshift({
        id: Date.now().toString(),
        phoneNumber,
        message,
        response,
        type,
        timestamp: new Date().toISOString(),
        status: 'delivered'
      });
      localStorage.setItem('sms_logs', JSON.stringify(logs.slice(0, 100))); // Keep last 100
      return;
    }

    try {
      // Store in Supabase (you might want to create a separate table for SMS logs)
      const { error } = await supabase
        .from('sms_interactions')
        .insert({
          phone_number: phoneNumber,
          incoming_message: message,
          outgoing_response: response,
          interaction_type: type,
          status: 'delivered'
        });

      if (error) {
        console.error('Failed to log SMS interaction:', error);
      }
    } catch (error) {
      console.error('SMS logging error:', error);
    }
  }

  // Get SMS interaction history
  async getSMSHistory(limit: number = 50): Promise<SMSMessage[]> {
    if (isDemoMode) {
      const logs = JSON.parse(localStorage.getItem('sms_logs') || '[]');
      return logs.slice(0, limit);
    }

    try {
      const { data, error } = await supabase
        .from('sms_interactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data.map(row => ({
        id: row.id,
        phoneNumber: row.phone_number,
        message: row.incoming_message,
        response: row.outgoing_response,
        type: row.interaction_type,
        status: row.status,
        timestamp: row.created_at
      }));
    } catch (error) {
      console.error('Failed to fetch SMS history:', error);
      return [];
    }
  }

  // Send SMS via MTN Rwanda API (for production)
  async sendSMS(phoneNumber: string, message: string): Promise<boolean> {
    try {
      if (isDemoMode) {
        // Simulate SMS sending in demo mode
        console.log(`SMS to ${phoneNumber}: ${message}`);
        return true;
      }

      // MTN Rwanda SMS API integration
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

      return response.ok;
    } catch (error) {
      console.error('SMS sending error:', error);
      return false;
    }
  }

  // Validate phone number format
  isValidPhoneNumber(phoneNumber: string): boolean {
    // Rwanda phone number validation
    const rwandaPhoneRegex = /^(\+250|250)?[0-9]{9}$/;
    return rwandaPhoneRegex.test(phoneNumber.replace(/\s/g, ''));
  }

  // Format phone number to international format
  formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\s/g, '');
    if (cleaned.startsWith('+250')) {
      return cleaned;
    } else if (cleaned.startsWith('250')) {
      return '+' + cleaned;
    } else if (cleaned.length === 9) {
      return '+250' + cleaned;
    }
    return phoneNumber;
  }
}

export const smsService = new SMSService();