import { supabase } from '../lib/supabase';

export interface DashboardStats {
  totalAnalyses: number;
  avgConfidence: number;
  yieldImprovement: number; // placeholder computation
  activeFarmers: number;
}

class AnalyticsService {
  async getStats(userId?: string): Promise<DashboardStats> {
    // total analyses
    const baseAnalyses = supabase.from('soil_analyses').select('*', { count: 'exact', head: true });
    if (userId) baseAnalyses.eq('user_id', userId);
    const { count: totalAnalyses } = await baseAnalyses;

    // average confidence
    const basePred = supabase.from('ml_predictions').select('confidence');
    if (userId) basePred.eq('user_id', userId);
    const { data: confData } = await basePred;
    const avgConfidence = confData && confData.length ? confData.reduce((a,c)=>a+Number(c.confidence||0),0)/confData.length : 0;

    // active farmers - distinct user_ids in soil_analyses
    const { data: farmerRows } = await supabase
      .from('soil_analyses')
      .select('user_id');
    const activeFarmers = new Set((farmerRows||[]).map((r:any)=>r.user_id)).size;

    return {
      totalAnalyses: totalAnalyses||0,
      avgConfidence: Number(avgConfidence.toFixed(1)),
      yieldImprovement: 0,
      activeFarmers
    };
  }
}

export const analyticsService = new AnalyticsService(); 