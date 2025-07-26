import axios from 'axios';

const BASE_URL = import.meta.env.VITE_ML_SERVER_URL || 'http://localhost:8000';

interface SimStepResponse {
  state: number[];
  goal: number[]; // [x,y]
  obstacles: number[][]; // [[x,y],...]
  reward: number;
  terminated: boolean;
  truncated: boolean;
  action: number;
}

class RLSimulationService {
  async reset(seed?: number): Promise<SimStepResponse> {
    const res = await axios.post(`${BASE_URL}/sim/reset`, { seed });
    return res.data;
  }

  async step(action: number): Promise<SimStepResponse> {
    const res = await axios.post<SimStepResponse>(`${BASE_URL}/sim/step`, { action });
    return res.data;
  }

  async stepPolicy(): Promise<SimStepResponse> {
    const res = await axios.post<SimStepResponse>(`${BASE_URL}/sim/step`, { policy: true });
    return res.data;
  }

  async getState(): Promise<SimStepResponse> {
    const res = await axios.get(`${BASE_URL}/sim/state`);
    return res.data;
  }
}

export const rlSimulationService = new RLSimulationService(); 