import { corsHeaders } from '../_shared/cors.ts';

interface SoilData {
  phosphorus: number;
  potassium: number;
  nitrogen: number;
  crop_type: string;
}

interface SMSRequest {
  from: string;
  to: string;
  text: string;
  messageId: string;
  timestamp: string;
}

// Enhanced prediction logic for SMS
function predictFertilizerFromSMS(soilData: SoilData): string {
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

// Parse SMS message
function parseSoilDataFromSMS(message: string): SoilData | null {
  // Expected format: SOIL 15 120 0.25 MAIZE
  // or: SOIL P15 K120 N0.25 MAIZE
  const text = message.trim().toUpperCase();
  
  // Check if message starts with SOIL
  if (!text.startsWith('SOIL')) {
    return null;
  }

  // Remove SOIL prefix and split
  const parts = text.substring(4).trim().split(/\s+/);
  
  if (parts.length < 4) {
    return null;
  }

  try {
    let phosphorus: number;
    let potassium: number;
    let nitrogen: number;
    let crop_type: string;

    // Handle different formats
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

// Send SMS using MTN Rwanda API
async function sendSMS(to: string, message: string): Promise<boolean> {
  try {
    // MTN Rwanda SMS API endpoint
    const mtnApiUrl = 'https://api.mtn.co.rw/v1/sms/send';
    
    const response = await fetch(mtnApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('MTN_API_TOKEN')}`,
        'X-API-Key': Deno.env.get('MTN_API_KEY') || '',
      },
      body: JSON.stringify({
        from: 'SoilSync',
        to: to,
        text: message,
        type: 'text'
      })
    });

    if (!response.ok) {
      console.error('MTN API Error:', await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('SMS sending error:', error);
    return false;
  }
}

// Generate help message
function getHelpMessage(): string {
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

// Log SMS interaction
async function logSMSInteraction(from: string, message: string, response: string, success: boolean) {
  try {
    // You can store this in Supabase or another database
    console.log('SMS Interaction:', {
      from,
      message,
      response,
      success,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Logging error:', error);
  }
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const smsData: SMSRequest = await req.json();
    
    const { from, text } = smsData;
    let responseMessage: string;
    let success = false;

    // Check for help request
    if (text.trim().toUpperCase().includes('HELP')) {
      responseMessage = getHelpMessage();
      success = true;
    } else {
      // Try to parse soil data
      const soilData = parseSoilDataFromSMS(text);
      
      if (soilData) {
        // Generate fertilizer recommendation
        responseMessage = predictFertilizerFromSMS(soilData);
        success = true;
      } else {
        // Invalid format
        responseMessage = `Invalid format. Send HELP for instructions.

Example: SOIL 15 120 0.25 MAIZE

SoilSync - Smart Agriculture`;
        success = false;
      }
    }

    // Send response SMS
    const smsSent = await sendSMS(from, responseMessage);
    
    // Log the interaction
    await logSMSInteraction(from, text, responseMessage, smsSent && success);

    return new Response(
      JSON.stringify({ 
        success: smsSent,
        message: 'SMS processed',
        response: responseMessage 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('SMS webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});