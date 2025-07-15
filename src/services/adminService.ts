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

  async getPredictionStats():Promise<{count24:number;avgLatency:number;errorRate:number}> {
    const since = new Date(Date.now()-24*60*60*1000).toISOString();
    const { data } = await supabase
      .from('ml_predictions')
      .select('processing_time_ms')
      .gte('created_at',since);
    const count=data?.length||0;
    const latencyArr=(data||[]).map((d:any)=>Number(d.processing_time_ms)||0);
    const avgLatency = latencyArr.length? latencyArr.reduce((a,b)=>a+b,0)/latencyArr.length:0;
    // Error rate is not tracked yet; set to 0
    const errorRate = 0;
    return {count24:count,avgLatency:Math.round(avgLatency),errorRate};
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
}

export const adminService = new AdminService(); 