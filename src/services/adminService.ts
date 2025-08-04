import { supabase } from '../lib/supabase';
import { virtualSensorService } from './virtualSensorService';

class AdminService {
  async getTotalUsers(): Promise<number> {
    const { data, error } = await supabase.rpc('total_auth_users');
    if (error) return 0;
    return data as number;
  }

  async getSmsSent(): Promise<number> {
    // Fallback to 0 if table missing
    const { count, error } = await supabase
      .from('sms_logs')
      .select('*', { count: 'exact', head: true });
    if (error) return 0;
    return count || 0;
  }

  async getSmsStats(): Promise<{sent:number;delivered:number;failed:number;recent:any[]}> {
    const { data } = await supabase.from('sms_logs').select('*').order('sent_at',{ascending:false}).limit(20);
    const sent = data?.length||0;
    const delivered = data?.filter((r:any)=>r.status==='delivered').length||0;
    const failed = data?.filter((r:any)=>r.status==='failed').length||0;
    return {sent,delivered,failed,recent:data||[]};
  }

  async getPredictionStats(): Promise<{ count24: number; total: number; avgLatency: number; errorRate: number }> {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Pull success flag so we can calculate failure ratio
    const { data, error } = await supabase
      .from('ml_predictions')
      .select('processing_time_ms, success')
      .gte('created_at', since);

    if (error) {
      console.error('getPredictionStats error', error);
      return { count24: 0, total: 0, avgLatency: 0, errorRate: 0 };
    }

    const count = data?.length || 0;
    const latencyArr = (data || []).map((d: any) => Number(d.processing_time_ms) || 0);
    const avgLatency = latencyArr.length ? latencyArr.reduce((a, b) => a + b, 0) / latencyArr.length : 0;

    const failures = (data || []).filter((r: any) => r.success === false).length;
    const errorRate = count ? Number(((failures / count) * 100).toFixed(1)) : 0;

    // Get total count of predictions (head query for performance)
    // Separate lightweight count query (head:true returns only count in Supabase)
    let { count: totalCount } = await supabase
      .from('ml_predictions')
      .select('id', { count: 'exact', head: true });

    // Fallback: some PostgREST versions return null with head:true under RLS
    if (totalCount === null) {
      const { count } = await supabase
        .from('ml_predictions')
        .select('id', { count: 'exact' });
      totalCount = count ?? 0;
    }

    return { count24: count, total: totalCount || 0, avgLatency: Math.round(avgLatency), errorRate };
  }

  async getActiveSensorCount(): Promise<number> {
    try {
      return virtualSensorService.getSensors().filter(s => s.enabled).length;
    } catch (e) {
      return 0;
    }
  }

  async uploadModel(file: File): Promise<string> {
    const bucket = 'ml-models';
    const path = `model_${Date.now()}.pkl`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      contentType: 'application/octet-stream',
      upsert: false
    });
    if (error) throw error;
    return path;
  }

  // Fetch recent predictions (default 100) ordered by newest first
  async getPredictionHistory(limit: number = 100): Promise<any[]> {
    const { data, error } = await supabase
      .from('ml_predictions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('getPredictionHistory error', error);
      return [];
    }

    return data || [];
  }
}

export const adminService = new AdminService(); 