import type { SoilModelInput } from '../components/SoilForm';
import type { Database } from '../lib/supabase';
import { supabase } from '../lib/supabase';
import type { AuthUser } from './authService';
import { mlModelService } from './mlModelService';

type SoilAnalysis = Database['public']['Tables']['soil_analyses']['Insert'];
type SoilAnalysisRow = Database['public']['Tables']['soil_analyses']['Row'];

export interface SoilData extends SoilModelInput {}

export interface Recommendation {
  fertilizer: string;
  rate: number | string;
  confidence: number | string;
  expectedYield: number | string;
  cropName?: string;
  modelVersion?: string;
  predictionId?: string;
}

export interface AnalysisResult extends Recommendation {
  id: string;
  createdAt: string;
  soilData: SoilData;
}

class SoilAnalysisService {
  // Call the ML model prediction service
  async predictFertilizer(soilData: SoilModelInput): Promise<Recommendation> {
    try {
      const prediction = await mlModelService.predict(soilData);
      return {
        fertilizer: prediction.fertilizer,
        rate: prediction.applicationRate,
        confidence: prediction.confidenceScore,
        expectedYield: prediction.expectedYieldIncrease,
        cropName: prediction.cropName,
        modelVersion: prediction.modelVersion,
        predictionId: prediction.predictionId
      };
    } catch (error) {
      console.error('ML prediction service error:', error);
      // Fallback to rule-based prediction
      return this.fallbackPrediction(soilData);
    }
  }

  // Enhanced fallback prediction logic
  private fallbackPrediction(soilData: SoilModelInput): Recommendation {
    const { Phosphorous, Potassium, Nitrogen, Soil_Type, Crop_Type } = soilData;
    // Use default values for organicCarbon and cationExchange if needed
    const organicCarbon = 2.0; // default
    const cationExchange = 15; // default
    let fertilizer = "NPK 17-17-17";
    let rate = 150;
    let confidence = 85;
    let expectedYield = 15;
    // Enhanced decision logic
    if (Nitrogen < 0.15) {
      fertilizer = "Urea";
      rate = 120;
      confidence = 94;
      expectedYield = 25;
    } else if (Nitrogen < 0.25 && Phosphorous < 12) {
      fertilizer = "DAP";
      rate = 110;
      confidence = 91;
      expectedYield = 22;
    } else if (Phosphorous < 10) {
      fertilizer = "NPK 10-26-26";
      rate = 100;
      confidence = 89;
      expectedYield = 20;
    } else if (Potassium < 80) {
      fertilizer = "NPK 14-35-14";
      rate = 140;
      confidence = 87;
      expectedYield = 18;
    } else if (Potassium < 120 && Nitrogen > 0.3) {
      fertilizer = "NPK 20-20";
      rate = 130;
      confidence = 90;
      expectedYield = 17;
    } else if (Phosphorous > 30) {
      fertilizer = "NPK 28-28";
      rate = 110;
      confidence = 88;
      expectedYield = 19;
    }
    // Organic matter adjustments
    if (organicCarbon < 1.0) {
      rate *= 1.15;
      expectedYield += 3;
    } else if (organicCarbon > 3.0) {
      rate *= 0.9;
      confidence += 5;
    }
    // CEC adjustments
    if (cationExchange < 5) {
      rate *= 0.85;
      confidence -= 5;
    } else if (cationExchange > 25) {
      rate *= 1.1;
      confidence += 3;
    }
    // Crop-specific adjustments
    switch ((Crop_Type || '').toLowerCase()) {
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
        expectedYield += 3;
        confidence += 7;
        break;
      case 'potato':
        rate *= 1.15;
        expectedYield += 6;
        break;
      case 'cassava':
        rate *= 0.8;
        expectedYield += 4;
        break;
      case 'banana':
        rate *= 1.3;
        expectedYield += 7;
        break;
    }
    // Add realistic variance
    const variance = (Math.random() - 0.5) * 0.1;
    rate *= (1 + variance);
    confidence += (Math.random() - 0.5) * 8;
    // Ensure reasonable bounds
    rate = Math.max(50, Math.min(300, rate));
    confidence = Math.max(70, Math.min(98, confidence));
    expectedYield = Math.max(5, Math.min(35, expectedYield));
    return {
      fertilizer,
      rate: Math.round(rate),
      confidence: Math.round(confidence * 10) / 10,
      expectedYield: Math.round(expectedYield),
      modelVersion: 'fallback-v1.0.0',
      predictionId: crypto.randomUUID()
    };
  }

  // Save analysis to database
  async saveAnalysis(soilData: SoilData, recommendation: Recommendation): Promise<string> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('SoilAnalysisService: Error getting user for save:', userError.message);
        throw userError;
      }

      if (!user) {
        console.warn('SoilAnalysisService: No authenticated user found for saving analysis. Skipping save.');
        throw new Error('No authenticated user');
      }

      const analysisData: SoilAnalysis = {
        user_id: user.id,
        phosphorus: soilData.Phosphorous,
        potassium: soilData.Potassium,
        nitrogen: soilData.Nitrogen,
        organic_carbon: 0, // Assuming default or placeholder
        cation_exchange: 0, // Assuming default or placeholder
        sand_percent: 0, // Assuming default or placeholder
        clay_percent: 0, // Assuming default or placeholder
        silt_percent: 0, // Assuming default or placeholder
        rainfall: 0, // Assuming default or placeholder
        elevation: 0, // Assuming default or placeholder
        crop_type: soilData.Crop_Type,
        recommended_fertilizer: recommendation.fertilizer,
        application_rate: Number(recommendation.rate),
        confidence_score: Number(recommendation.confidence),
        expected_yield_increase: Number(recommendation.expectedYield)
      };

      console.log('SoilAnalysisService: Attempting to save analysis with data:', analysisData);

      const { data, error } = await supabase
        .from('soil_analyses')
        .insert([analysisData])
        .select();

      if (error) {
        console.error('SoilAnalysisService: Failed to save analysis to database:', error);
        throw error;
      }

      console.log('SoilAnalysisService: Analysis saved successfully:', data);
      return data?.[0]?.id || '';
    } catch (error) {
      console.error('SoilAnalysisService: Error in saveAnalysis function:', error);
      // Ensure loadUserData is called only if save was successful and user is logged in, or handle its error separately
      // For now, let's keep it here but note its dependency on App.tsx's loadUserData being correctly passed/accessible.
      // Assuming loadUserData is available globally or passed correctly.
      // Since this is in the service, it won't have direct access to App.tsx's loadUserData unless passed.
      // The App.tsx handles the loadUserData() call after successful submit.
      return '';
    }
  }

  // Get user's analysis history
  async getAnalysisHistory(limit: number = 50): Promise<AnalysisResult[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      let query = supabase
        .from('soil_analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (user?.id) {
        query = query.eq('user_id', user.id);
      }
      const { data, error } = await query;
      if (error) {
        throw new Error(`Failed to fetch analysis history: ${error.message}`);
      }
      return data.map(this.dbRowToAnalysisResult);
    } catch (error) {
      console.error('Failed to fetch from Supabase:', error);
      throw error;
    }
  }

  private dbRowToAnalysisResult = (row: SoilAnalysisRow): AnalysisResult => ({
    id: row.id,
    createdAt: row.created_at,
    fertilizer: row.recommended_fertilizer,
    rate: row.application_rate,
    confidence: row.confidence_score,
    expectedYield: row.expected_yield_increase,
    cropName: row.crop_type,
    soilData: {
      Phosphorous: row.phosphorus,
      Potassium: row.potassium,
      Nitrogen: row.nitrogen,
      Soil_Type: '',
      Crop_Type: row.crop_type || '',
      Temparature: 0,
      Humidity: 0,
      Moisture: 0
    }
  });

  // Get analytics data
  async getAnalytics() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      let query = supabase
        .from('soil_analyses')
        .select('*');
      if (user?.id) {
        query = query.eq('user_id', user.id);
      }
      const { data, error } = await query;
      if (error) {
        throw new Error(`Failed to fetch analytics: ${error.message}`);
      }
      const totalAnalyses = data.length;
      const avgConfidence = data.reduce((sum: number, item: any) => sum + item.confidence_score, 0) / totalAnalyses || 0;
      const avgYieldIncrease = data.reduce((sum: number, item: any) => sum + item.expected_yield, 0) / totalAnalyses || 0;
      const fertilizerUsage = data.reduce((acc: Record<string, number>, item: any) => {
        acc[item.recommended_fertilizer] = (acc[item.recommended_fertilizer] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const cropAnalysis = data.reduce((acc: Record<string, number>, item: any) => {
        acc[item.crop_type] = (acc[item.crop_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return {
        totalAnalyses,
        avgConfidence: Math.round(avgConfidence),
        avgYieldIncrease: Math.round(avgYieldIncrease),
        fertilizerUsage,
        cropAnalysis,
        recentAnalyses: data.slice(0, 10)
      };
    } catch (error) {
      console.error('Failed to fetch analytics from Supabase:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
      return {
      id: user.id,
      email: user.email!,
      fullName: user.user_metadata?.full_name || undefined,
      avatarUrl: user.user_metadata?.avatar_url || undefined,
      planType: 'free'
    };
  }
}

export const soilAnalysisService = new SoilAnalysisService();