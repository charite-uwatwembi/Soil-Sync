import { corsHeaders } from '../_shared/cors.ts';

interface SoilData {
  phosphorus: number;
  potassium: number;
  nitrogen: number;
  organic_carbon: number;
  cation_exchange: number;
  sand_percent: number;
  clay_percent: number;
  silt_percent: number;
  rainfall: number;
  elevation: number;
  crop_type: string;
}

interface PredictionResult {
  fertilizer: string;
  application_rate: number;
  confidence_score: number;
  expected_yield_increase: number;
  model_version: string;
  prediction_id: string;
}

// ML Model prediction service
class MLModelService {
  private modelEndpoint: string;
  
  constructor() {
    // This would be your deployed ML model endpoint
    this.modelEndpoint = Deno.env.get('ML_MODEL_ENDPOINT') || 'http://localhost:8000/predict';
  }

  async predict(soilData: SoilData): Promise<PredictionResult> {
    try {
      // Prepare features for the model
      const features = this.prepareFeatures(soilData);
      
      // Call your ML model API
      const response = await fetch(this.modelEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('ML_API_KEY')}`,
        },
        body: JSON.stringify({
          features: features,
          crop_type: soilData.crop_type
        })
      });

      if (!response.ok) {
        throw new Error(`ML API error: ${response.status}`);
      }

      const prediction = await response.json();
      
      return {
        fertilizer: prediction.fertilizer,
        application_rate: prediction.application_rate,
        confidence_score: prediction.confidence_score,
        expected_yield_increase: prediction.expected_yield_increase,
        model_version: prediction.model_version || 'v1.0.0',
        prediction_id: crypto.randomUUID()
      };
    } catch (error) {
      console.error('ML prediction error:', error);
      // Fallback to rule-based prediction
      return this.fallbackPrediction(soilData);
    }
  }

  private prepareFeatures(soilData: SoilData): number[] {
    // Prepare features in the same order as your trained model
    return [
      soilData.phosphorus,
      soilData.potassium,
      soilData.nitrogen,
      soilData.organic_carbon,
      soilData.cation_exchange,
      soilData.sand_percent,
      soilData.clay_percent,
      soilData.silt_percent,
      soilData.rainfall,
      soilData.elevation,
      this.encodeCropType(soilData.crop_type)
    ];
  }

  private encodeCropType(cropType: string): number {
    const cropMapping: Record<string, number> = {
      'maize': 0,
      'rice': 1,
      'beans': 2,
      'potato': 3,
      'cassava': 4,
      'banana': 5
    };
    return cropMapping[cropType.toLowerCase()] || 0;
  }

  private fallbackPrediction(soilData: SoilData): PredictionResult {
    // Enhanced rule-based fallback
    const { phosphorus, potassium, nitrogen, organic_carbon, crop_type } = soilData;
    
    let fertilizer = "NPK 17-17-17";
    let rate = 150;
    let confidence = 85;
    let expectedYield = 15;

    // Decision logic based on soil chemistry
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

    return {
      fertilizer,
      application_rate: Math.round(rate),
      confidence_score: Math.round(confidence),
      expected_yield_increase: Math.round(expectedYield),
      model_version: 'fallback-v1.0.0',
      prediction_id: crypto.randomUUID()
    };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const soilData: SoilData = await req.json();
    
    // Validate input
    const requiredFields = [
      'phosphorus', 'potassium', 'nitrogen', 'organic_carbon', 'cation_exchange',
      'sand_percent', 'clay_percent', 'silt_percent', 'rainfall', 'elevation', 'crop_type'
    ];

    for (const field of requiredFields) {
      if (soilData[field as keyof SoilData] === undefined) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const mlService = new MLModelService();
    const prediction = await mlService.predict(soilData);

    return new Response(
      JSON.stringify(prediction),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Prediction error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});