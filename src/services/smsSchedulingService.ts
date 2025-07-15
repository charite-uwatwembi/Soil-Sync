import { supabase } from '../lib/supabase';
import { proactiveSmsService } from './proactiveSmsService';

interface NotificationSchedule {
  id: string;
  farmer_phone: string;
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
  crop_type: string;
  field_id: string;
  next_notification: string;
  enabled: boolean;
  notification_type: 'proactive' | 'reminder' | 'seasonal';
}

interface WeatherAlert {
  type: 'rain' | 'drought' | 'frost' | 'storm';
  severity: 'low' | 'medium' | 'high';
  location: string;
  start_time: string;
  end_time: string;
  message: string;
}

interface SeasonalReminder {
  crop_type: string;
  growth_stage: string;
  days_after_planting: number;
  message: string;
  action_required: boolean;
}

class SmsSchedulingService {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;

  // Start the scheduling service
  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('SMS Scheduling Service started');
    
    // Run every 30 minutes
    this.intervalId = setInterval(() => {
      this.processScheduledNotifications();
    }, 30 * 60 * 1000);
    
    // Run immediately on start
    this.processScheduledNotifications();
  }

  // Stop the scheduling service
  stop(): void {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('SMS Scheduling Service stopped');
  }

  // Main processing function
  private async processScheduledNotifications(): Promise<void> {
    try {
      console.log('Processing scheduled notifications...');
      
      // Process different types of notifications
      await Promise.all([
        this.processProactiveNotifications(),
        this.processWeatherAlerts(),
        this.processSeasonalReminders(),
        this.processSubscriptionReminders()
      ]);
      
      console.log('Scheduled notifications processed successfully');
    } catch (error) {
      console.error('Error processing scheduled notifications:', error);
    }
  }

  // Process proactive IoT-based notifications
  private async processProactiveNotifications(): Promise<void> {
    try {
      // Use the proactive SMS service
      await proactiveSmsService.processProactiveNotifications();
    } catch (error) {
      console.error('Error processing proactive notifications:', error);
    }
  }

  // Process weather-based alerts
  private async processWeatherAlerts(): Promise<void> {
    try {
      const weatherAlerts = await this.getWeatherAlerts();
      
      for (const alert of weatherAlerts) {
        await this.sendWeatherAlert(alert);
        await this.delay(1000); // Rate limiting
      }
    } catch (error) {
      console.error('Error processing weather alerts:', error);
    }
  }

  // Get weather alerts from API
  private async getWeatherAlerts(): Promise<WeatherAlert[]> {
    try {
      // Mock weather alerts - replace with actual weather API
      const mockAlerts: WeatherAlert[] = [
        {
          type: 'rain',
          severity: 'medium',
          location: 'Kigali',
          start_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
          end_time: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
          message: 'Heavy rain expected in 2 hours. Avoid fertilizer application.'
        }
      ];
      
      return mockAlerts;
    } catch (error) {
      console.error('Failed to get weather alerts:', error);
      return [];
    }
  }

  // Send weather alert to relevant farmers
  private async sendWeatherAlert(alert: WeatherAlert): Promise<void> {
    try {
      const farmers = await this.getFarmersInLocation(alert.location);
      
      const alertMessage = this.formatWeatherAlert(alert);
      
      for (const farmer of farmers) {
        await this.sendSMS(farmer.phone_number, alertMessage);
        await this.delay(500); // Rate limiting
      }
    } catch (error) {
      console.error('Error sending weather alert:', error);
    }
  }

  // Format weather alert message
  private formatWeatherAlert(alert: WeatherAlert): string {
    const icons = {
      rain: '🌧️',
      drought: '☀️',
      frost: '❄️',
      storm: '⛈️'
    };
    
    const severityText = {
      low: 'Watch',
      medium: 'Warning',
      high: 'Alert'
    };
    
    let message = `${icons[alert.type]} Weather ${severityText[alert.severity]}\n\n`;
    message += `📍 Location: ${alert.location}\n`;
    message += `⏰ Time: ${new Date(alert.start_time).toLocaleString()}\n`;
    message += `💡 ${alert.message}\n\n`;
    
    // Add specific advice based on alert type
    switch (alert.type) {
      case 'rain':
        message += `🚫 Don't apply fertilizer before rain\n`;
        message += `✅ Perfect for watering crops naturally\n`;
        break;
      case 'drought':
        message += `💧 Increase watering frequency\n`;
        message += `🌿 Apply mulch to retain moisture\n`;
        break;
      case 'frost':
        message += `🔥 Protect sensitive plants\n`;
        message += `⏰ Harvest mature crops before frost\n`;
        break;
      case 'storm':
        message += `🏠 Secure loose materials\n`;
        message += `🌿 Stake tall plants\n`;
        break;
    }
    
    message += `\n📞 Help: +250-789-951-064`;
    
    return message;
  }

  // Process seasonal reminders
  private async processSeasonalReminders(): Promise<void> {
    try {
      const reminders = await this.getSeasonalReminders();
      
      for (const reminder of reminders) {
        await this.sendSeasonalReminder(reminder);
        await this.delay(1000); // Rate limiting
      }
    } catch (error) {
      console.error('Error processing seasonal reminders:', error);
    }
  }

  // Get seasonal reminders based on crop calendars
  private async getSeasonalReminders(): Promise<SeasonalReminder[]> {
    try {
      const { data: crops, error } = await supabase
        .from('farmer_crops')
        .select(`
          *,
          farmer_profiles (
            phone_number,
            name
          )
        `)
        .not('planting_date', 'is', null);
      
      if (error) throw error;
      
      const reminders: SeasonalReminder[] = [];
      const now = new Date();
      
      for (const crop of crops || []) {
        const plantingDate = new Date(crop.planting_date);
        const daysAfterPlanting = Math.floor((now.getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24));
        
        const seasonalReminder = this.getSeasonalReminderForCrop(crop.crop_type, daysAfterPlanting);
        
        if (seasonalReminder) {
          reminders.push({
            ...seasonalReminder,
            crop_type: crop.crop_type
          });
        }
      }
      
      return reminders;
    } catch (error) {
      console.error('Failed to get seasonal reminders:', error);
      return [];
    }
  }

  // Get seasonal reminder for specific crop and growth stage
  private getSeasonalReminderForCrop(cropType: string, daysAfterPlanting: number): SeasonalReminder | null {
    const reminders: Record<string, SeasonalReminder[]> = {
      maize: [
        {
          crop_type: 'maize',
          growth_stage: 'seedling',
          days_after_planting: 7,
          message: 'Maize seedlings should be emerging. Check for pests and ensure adequate moisture.',
          action_required: true
        },
        {
          crop_type: 'maize',
          growth_stage: 'vegetative',
          days_after_planting: 21,
          message: 'Time for first fertilizer application. Apply nitrogen-rich fertilizer.',
          action_required: true
        },
        {
          crop_type: 'maize',
          growth_stage: 'tasseling',
          days_after_planting: 60,
          message: 'Maize is tasseling. Ensure adequate water and watch for armyworms.',
          action_required: true
        }
      ],
      rice: [
        {
          crop_type: 'rice',
          growth_stage: 'tillering',
          days_after_planting: 30,
          message: 'Rice is tillering. Apply nitrogen and maintain water level.',
          action_required: true
        },
        {
          crop_type: 'rice',
          growth_stage: 'heading',
          days_after_planting: 60,
          message: 'Rice is heading. Reduce nitrogen and ensure adequate phosphorus.',
          action_required: true
        }
      ]
    };
    
    const cropReminders = reminders[cropType.toLowerCase()] || [];
    
    // Find the most relevant reminder
    return cropReminders.find(reminder => 
      daysAfterPlanting >= reminder.days_after_planting && 
      daysAfterPlanting <= reminder.days_after_planting + 7
    ) || null;
  }

  // Send seasonal reminder
  private async sendSeasonalReminder(reminder: SeasonalReminder): Promise<void> {
    try {
      const farmers = await this.getFarmersWithCrop(reminder.crop_type);
      
      const reminderMessage = this.formatSeasonalReminder(reminder);
      
      for (const farmer of farmers) {
        await this.sendSMS(farmer.phone_number, reminderMessage);
        await this.delay(500); // Rate limiting
      }
    } catch (error) {
      console.error('Error sending seasonal reminder:', error);
    }
  }

  // Format seasonal reminder message
  private formatSeasonalReminder(reminder: SeasonalReminder): string {
    let message = `📅 Seasonal Reminder\n\n`;
    message += `🌽 Crop: ${reminder.crop_type.toUpperCase()}\n`;
    message += `🌱 Stage: ${reminder.growth_stage}\n`;
    message += `📍 Day ${reminder.days_after_planting} after planting\n\n`;
    message += `💡 ${reminder.message}\n\n`;
    
    if (reminder.action_required) {
      message += `⚠️ Action Required: Please check your fields\n\n`;
    }
    
    message += `📞 Help: +250-789-951-064\n`;
    message += `💬 Text HELP for more info`;
    
    return message;
  }

  // Process subscription reminders
  private async processSubscriptionReminders(): Promise<void> {
    try {
      const scheduledNotifications = await this.getScheduledNotifications();
      
      for (const notification of scheduledNotifications) {
        await this.processScheduledNotification(notification);
        await this.delay(1000); // Rate limiting
      }
    } catch (error) {
      console.error('Error processing subscription reminders:', error);
    }
  }

  // Get scheduled notifications that are due
  private async getScheduledNotifications(): Promise<NotificationSchedule[]> {
    try {
      const { data: notifications, error } = await supabase
        .from('notification_schedules')
        .select('*')
        .eq('enabled', true)
        .lte('next_notification', new Date().toISOString());
      
      if (error) throw error;
      return notifications || [];
    } catch (error) {
      console.error('Failed to get scheduled notifications:', error);
      return [];
    }
  }

  // Process individual scheduled notification
  private async processScheduledNotification(notification: NotificationSchedule): Promise<void> {
    try {
      let message: string;
      
      switch (notification.notification_type) {
        case 'proactive':
          message = await this.generateProactiveMessage(notification);
          break;
        case 'reminder':
          message = await this.generateReminderMessage(notification);
          break;
        case 'seasonal':
          message = await this.generateSeasonalMessage(notification);
          break;
        default:
          return;
      }
      
      await this.sendSMS(notification.farmer_phone, message);
      
      // Update next notification time
      await this.updateNextNotificationTime(notification);
      
    } catch (error) {
      console.error('Error processing scheduled notification:', error);
    }
  }

  // Generate proactive message
  private async generateProactiveMessage(notification: NotificationSchedule): Promise<string> {
    return `🌱 SoilSync Weekly Update\n\n🌽 Crop: ${notification.crop_type.toUpperCase()}\n📍 Field: ${notification.field_id}\n\n💡 General care tips for this week:\n• Monitor soil moisture\n• Check for pests\n• Maintain proper spacing\n\n📞 Call +250-788-SOIL for specific advice\n💬 Text your crop condition for recommendations`;
  }

  // Generate reminder message
  private async generateReminderMessage(notification: NotificationSchedule): Promise<string> {
    return `📅 SoilSync Reminder\n\n🌽 Don't forget to check your ${notification.crop_type.toUpperCase()} field today!\n\n✅ Things to check:\n• Soil moisture level\n• Plant health\n• Pest activity\n• Weed growth\n\n📞 Need help? Call +250-788-SOIL\n💬 Text HELP for more info`;
  }

  // Generate seasonal message
  private async generateSeasonalMessage(notification: NotificationSchedule): Promise<string> {
    return `🌱 SoilSync Seasonal Tip\n\n🌽 ${notification.crop_type.toUpperCase()} care for this season:\n\n💡 Current focus:\n• Monitor growth stage\n• Adjust watering schedule\n• Apply appropriate fertilizer\n\n📞 Expert advice: +250-788-SOIL\n💬 Text your field condition for custom advice`;
  }

  // Update next notification time
  private async updateNextNotificationTime(notification: NotificationSchedule): Promise<void> {
    try {
      const nextTime = this.calculateNextNotificationTime(notification.frequency);
      
      await supabase
        .from('notification_schedules')
        .update({ next_notification: nextTime.toISOString() })
        .eq('id', notification.id);
    } catch (error) {
      console.error('Error updating next notification time:', error);
    }
  }

  // Calculate next notification time based on frequency
  private calculateNextNotificationTime(frequency: string): Date {
    const now = new Date();
    
    switch (frequency) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'bi-weekly':
        return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      case 'monthly':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
  }

  // Utility functions
  private async getFarmersInLocation(location: string): Promise<Array<{phone_number: string, name: string}>> {
    try {
      const { data: farmers, error } = await supabase
        .from('farmer_profiles')
        .select('phone_number, name')
        .eq('location->city', location)
        .eq('preferences->notifications_enabled', true);
      
      if (error) throw error;
      return farmers || [];
    } catch (error) {
      console.error('Failed to get farmers in location:', error);
      return [];
    }
  }

  private async getFarmersWithCrop(cropType: string): Promise<Array<{phone_number: string, name: string}>> {
    try {
      const { data: farmers, error } = await supabase
        .from('farmer_crops')
        .select(`
          farmer_profiles (
            phone_number,
            name
          )
        `)
        .eq('crop_type', cropType);
      
      if (error) throw error;
      return farmers?.map(f => f.farmer_profiles).filter(Boolean) || [];
    } catch (error) {
      console.error('Failed to get farmers with crop:', error);
      return [];
    }
  }

  private async sendSMS(phoneNumber: string, message: string): Promise<boolean> {
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

      return response.ok;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      return false;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const smsSchedulingService = new SmsSchedulingService(); 