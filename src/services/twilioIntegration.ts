// Twilio integration for virtual sensor proactive SMS
// This connects your virtual sensors to your existing Twilio SMS setup

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
  webhookUrl: string;
}

interface TwilioMessage {
  to: string;
  from: string;
  body: string;
  statusCallback?: string;
  messagingServiceSid?: string;
}

interface TwilioResponse {
  sid: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed';
  errorCode?: string;
  errorMessage?: string;
}

class TwilioIntegration {
  private config: TwilioConfig;

  constructor() {
    this.config = {
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
      fromNumber: process.env.TWILIO_PHONE_NUMBER || '+1 856 595 3915',
      webhookUrl: process.env.TWILIO_WEBHOOK_URL || ''
    };
  }

  // Send SMS via Twilio API
  async sendSMS(message: TwilioMessage): Promise<TwilioResponse> {
    try {
      // For development/testing, you can use your existing SMS endpoint
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: message.to,
          body: message.body,
          from: message.from || this.config.fromNumber
        })
      });

      if (!response.ok) {
        throw new Error(`SMS sending failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        sid: result.sid || `mock_${Date.now()}`,
        status: 'queued',
        errorCode: result.errorCode,
        errorMessage: result.errorMessage
      };
    } catch (error) {
      console.error('Twilio SMS error:', error);
      return {
        sid: '',
        status: 'failed',
        errorCode: '500',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Send proactive SMS for virtual sensor alerts
  async sendProactiveSMS(
    phoneNumber: string,
    farmerName: string,
    fieldName: string,
    cropType: string,
    sensorData: {
      temperature: number;
      soil_moisture: number;
      nitrogen: number;
      phosphorus: number;
      potassium: number;
    },
    recommendation: {
      fertilizer: string;
      applicationRate: number;
      expectedYieldIncrease: number;
      confidenceScore: number;
    },
    urgency: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<TwilioResponse> {
    
    // Build the SMS message
    let message = `🌱 SoilSync Alert - ${fieldName}\n`;
    message += `👨‍🌾 Hello ${farmerName}!\n\n`;
    
    // Add urgency indicator
    if (urgency === 'high') {
      message += `🚨 URGENT ALERT 🚨\n`;
    } else if (urgency === 'medium') {
      message += `⚠️ Important Notice\n`;
    }
    
    message += `📊 Field Status:\n`;
    message += `🌽 Crop: ${cropType.toUpperCase()}\n`;
    message += `🌡️ Soil: ${sensorData.temperature}°C, ${sensorData.soil_moisture}% moisture\n`;
    message += `🧪 Nutrients: N:${sensorData.nitrogen.toFixed(2)}, P:${sensorData.phosphorus}, K:${sensorData.potassium}\n\n`;
    
    message += `💡 Recommendation:\n`;
    message += `🧪 Fertilizer: ${recommendation.fertilizer}\n`;
    message += `📏 Rate: ${recommendation.applicationRate}kg/ha\n`;
    message += `📈 Expected yield: +${recommendation.expectedYieldIncrease}%\n`;
    message += `🎯 Confidence: ${recommendation.confidenceScore}%\n\n`;
    
    // Add specific urgency advice
    if (urgency === 'high') {
      if (sensorData.soil_moisture < 25) {
        message += `🚨 CRITICAL: Soil too dry!\n`;
        message += `💧 Irrigate IMMEDIATELY before fertilizer\n\n`;
      } else if (sensorData.nitrogen < 0.15) {
        message += `🚨 CRITICAL: Severe nitrogen deficiency!\n`;
        message += `🧪 Apply nitrogen fertilizer TODAY\n\n`;
      }
    } else if (urgency === 'medium') {
      message += `⏰ Apply fertilizer within next 2-3 days\n`;
      message += `🌧️ Check weather before application\n\n`;
    }
    
    message += `📞 Need help? Call: +250-788-SOIL\n`;
    message += `💬 Reply STOP to unsubscribe`;

    // Send the SMS
    return await this.sendSMS({
      to: phoneNumber,
      from: this.config.fromNumber,
      body: message
    });
  }

  // Send weather alert SMS
  async sendWeatherAlert(
    phoneNumber: string,
    farmerName: string,
    alertType: 'rain' | 'drought' | 'frost' | 'storm',
    message: string,
    location: string
  ): Promise<TwilioResponse> {
    
    const icons = {
      rain: '🌧️',
      drought: '☀️',
      frost: '❄️',
      storm: '⛈️'
    };

    let smsMessage = `${icons[alertType]} Weather Alert\n`;
    smsMessage += `👨‍🌾 Hello ${farmerName}!\n\n`;
    smsMessage += `📍 Location: ${location}\n`;
    smsMessage += `💡 ${message}\n\n`;
    
    // Add specific advice based on alert type
    switch (alertType) {
      case 'rain':
        smsMessage += `🚫 Don't apply fertilizer before rain\n`;
        smsMessage += `✅ Good time for natural watering\n`;
        break;
      case 'drought':
        smsMessage += `💧 Increase watering frequency\n`;
        smsMessage += `🌿 Apply mulch to retain moisture\n`;
        break;
      case 'frost':
        smsMessage += `🔥 Protect sensitive plants\n`;
        smsMessage += `⏰ Harvest mature crops if needed\n`;
        break;
      case 'storm':
        smsMessage += `🏠 Secure loose materials\n`;
        smsMessage += `🌿 Stake tall plants\n`;
        break;
    }
    
    smsMessage += `\n📞 Help: +250-788-SOIL`;

    return await this.sendSMS({
      to: phoneNumber,
      from: this.config.fromNumber,
      body: smsMessage
    });
  }

  // Send seasonal reminder SMS
  async sendSeasonalReminder(
    phoneNumber: string,
    farmerName: string,
    cropType: string,
    growthStage: string,
    daysAfterPlanting: number,
    advice: string
  ): Promise<TwilioResponse> {
    
    let message = `📅 Seasonal Reminder\n`;
    message += `👨‍🌾 Hello ${farmerName}!\n\n`;
    message += `🌽 Crop: ${cropType.toUpperCase()}\n`;
    message += `🌱 Stage: ${growthStage}\n`;
    message += `📍 Day ${daysAfterPlanting} after planting\n\n`;
    message += `💡 ${advice}\n\n`;
    message += `📞 Questions? Call: +250-788-SOIL\n`;
    message += `💬 Text HELP for more info`;

    return await this.sendSMS({
      to: phoneNumber,
      from: this.config.fromNumber,
      body: message
    });
  }

  // Send welcome message to new farmer
  async sendWelcomeMessage(
    phoneNumber: string,
    farmerName: string
  ): Promise<TwilioResponse> {
    
    let message = `🌱 Welcome to SoilSync, ${farmerName}!\n\n`;
    message += `✅ You're now registered for automatic SMS notifications\n\n`;
    message += `🤖 What to expect:\n`;
    message += `• Soil condition alerts\n`;
    message += `• Fertilizer recommendations\n`;
    message += `• Weather warnings\n`;
    message += `• Seasonal reminders\n\n`;
    message += `📞 Support: +250-788-SOIL\n`;
    message += `🌐 Web: soilsync.rw\n`;
    message += `💬 Text STOP to unsubscribe`;

    return await this.sendSMS({
      to: phoneNumber,
      from: this.config.fromNumber,
      body: message
    });
  }

  // Validate phone number format
  isValidPhoneNumber(phoneNumber: string): boolean {
    // Rwanda phone number format: +250XXXXXXXXX
    const rwandaPhoneRegex = /^\+250[0-9]{9}$/;
    return rwandaPhoneRegex.test(phoneNumber);
  }

  // Format phone number for Rwanda
  formatRwandaPhoneNumber(phoneNumber: string): string {
    // Remove all non-digits
    const digits = phoneNumber.replace(/\D/g, '');
    
    // Handle different input formats
    if (digits.startsWith('250')) {
      return `+${digits}`;
    } else if (digits.startsWith('0')) {
      return `+250${digits.slice(1)}`;
    } else if (digits.length === 9) {
      return `+250${digits}`;
    }
    
    return phoneNumber; // Return original if can't format
  }

  // Get SMS delivery status
  async getMessageStatus(messageSid: string): Promise<'queued' | 'sent' | 'delivered' | 'failed'> {
    try {
      // In a real implementation, you would call Twilio's API
      // For now, we'll simulate the status
      return 'delivered';
    } catch (error) {
      console.error('Failed to get message status:', error);
      return 'failed';
    }
  }

  // Test SMS functionality
  async testSMS(phoneNumber: string): Promise<TwilioResponse> {
    const testMessage = `🧪 SoilSync Test Message\n\n`;
    const message = testMessage + `This is a test of your SMS notification system.\n\n`;
    const finalMessage = message + `✅ If you received this, your SMS is working!\n\n`;
    const fullMessage = finalMessage + `📞 Support: +250-788-SOIL`;

    return await this.sendSMS({
      to: phoneNumber,
      from: this.config.fromNumber,
      body: fullMessage
    });
  }

  // Batch SMS sending with rate limiting
  async sendBatchSMS(
    messages: Array<{
      phoneNumber: string;
      farmerName: string;
      message: string;
    }>,
    delayMs: number = 1000
  ): Promise<TwilioResponse[]> {
    const results: TwilioResponse[] = [];
    
    for (const msg of messages) {
      try {
        const result = await this.sendSMS({
          to: msg.phoneNumber,
          from: this.config.fromNumber,
          body: msg.message
        });
        
        results.push(result);
        
        // Add delay to avoid rate limiting
        if (delayMs > 0) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      } catch (error) {
        console.error(`Failed to send SMS to ${msg.phoneNumber}:`, error);
        results.push({
          sid: '',
          status: 'failed',
          errorCode: '500',
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return results;
  }

  // Get configuration status
  getConfigStatus(): {
    isConfigured: boolean;
    missingConfig: string[];
    fromNumber: string;
  } {
    const required = ['accountSid', 'authToken', 'fromNumber'];
    const missing = required.filter(key => !this.config[key as keyof TwilioConfig]);
    
    return {
      isConfigured: missing.length === 0,
      missingConfig: missing,
      fromNumber: this.config.fromNumber
    };
  }
}

// Create and export singleton instance
export const twilioIntegration = new TwilioIntegration();

// Export types for use in other files
export type { TwilioMessage, TwilioResponse };
