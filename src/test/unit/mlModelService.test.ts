import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mlModelService } from '../../services/mlModelService';

declare global {
  // eslint-disable-next-line no-var
  var fetch: typeof fetch;
}

const fakeResponse = {
  fertilizer_name: 'Urea',
  application_rate: '120 kg/ha',
  confidence: '92%',
  expected_yield_increase: '+25%'
};

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(fakeResponse)
  }) as any;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('mlModelService', () => {
  it('parses backend response correctly', async () => {
    const result = await mlModelService.predict({
      Temparature: 25,
      Humidity: 60,
      Moisture: 30,
      Nitrogen: 0.1,
      Potassium: 50,
      Phosphorous: 10,
      Soil_Type: 'Loamy',
      Crop_Type: 'Maize'
    });

    expect(result.fertilizer).toBe('Urea');
    expect(result.applicationRate).toBe(120);
    expect(result.confidenceScore).toBe(92);
  });
}); 