import { Activity, CheckCircle, Mail, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';

interface Props { isDarkMode:boolean; }

const AdminHealthPanel: React.FC<Props> = ({ isDarkMode }) => {
  const [predStats, setPredStats] = useState<any>(null);
  const [smsStats, setSmsStats] = useState<any>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [sensorCount, setSensorCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState<any[]>([]);

  useEffect(()=>{
    const load=async()=>{
      const [p, s, u, sensors, preds] = await Promise.all([
        adminService.getPredictionStats(),
        adminService.getSmsStats(),
        adminService.getTotalUsers(),
        adminService.getActiveSensorCount(),
        adminService.getPredictionHistory(100)
      ]);
      setPredStats(p);
      setSmsStats(s);
      setUserCount(u);
      setSensorCount(sensors);
      setLoading(false);
      setPredictions(preds);
    };
    load();
  },[]);

  const card=(title:string,value:any,icon:JSX.Element)=> (
    <div className={`p-4 rounded-lg border ${isDarkMode?'bg-gray-800 border-gray-700':'bg-white border-gray-200'}`}>
      <div className="flex items-center gap-2 mb-2">{icon}<h4 className="font-medium">{title}</h4></div>
      <p className="text-2xl font-bold">{loading?'…':value}</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Activity className="h-5 w-5 text-blue-600"/>Pipeline Health (24 h)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {card('Total Predictions', predStats ? `${predStats.total}` : null, <Activity className="h-4 w-4" />)}
        {card('Avg Latency', predStats ? `${predStats.avgLatency} ms` : null, <Activity className="h-4 w-4" />)}
        {card('Error Rate', predStats ? `${predStats.errorRate}%` : null, <XCircle className="h-4 w-4 text-red-600" />)}
        {card('Active Sensors', sensorCount, <Activity className="h-4 w-4" />)}
        {card('Total Users', userCount, <Activity className="h-4 w-4" />)}
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-2 flex items-center gap-2"><Mail className="h-5 w-5 text-green-600"/>SMS Delivery (today)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {card('Sent', smsStats?.sent, <Mail className="h-4 w-4"/>) }
        {card('Delivered', smsStats?.delivered, <CheckCircle className="h-4 w-4 text-green-600"/>) }
        {card('Failed', smsStats?.failed, <XCircle className="h-4 w-4 text-red-600"/>) }
      </div>

      {/* Prediction history */}
      <h3 className="text-lg font-semibold mt-8 mb-2 flex items-center gap-2">
        <Activity className="h-5 w-5 text-purple-600" />Latest Predictions
      </h3>

      <div className="overflow-x-auto rounded-lg border max-h-[400px] overflow-y-auto">
        <table className={`min-w-full text-sm ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white'}`}>
          <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} sticky top-0`}>
            <tr>
              <th className="px-3 py-2 text-left">Time</th>
              <th className="px-3 py-2 text-left">Crop</th>
              <th className="px-3 py-2 text-left">Fertilizer</th>
              <th className="px-3 py-2 text-left">Rate (kg/ha)</th>
              <th className="px-3 py-2 text-left">Confidence</th>
              <th className="px-3 py-2 text-left">Success</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-3 py-4" colSpan={6}>Loading…</td></tr>
            ) : predictions.length === 0 ? (
              <tr><td className="px-3 py-4" colSpan={6}>No predictions found.</td></tr>
            ) : (
              predictions.map((p:any)=> (
                <tr key={p.id} className="border-t">
                  <td className="px-3 py-2 whitespace-nowrap">{new Date(p.created_at).toLocaleString()}</td>
                  <td className="px-3 py-2">{p.input_features?.Crop_Type || p.input_features?.crop_type || '-'}</td>
                  <td className="px-3 py-2">{p.prediction_result?.fertilizer || p.prediction_result?.fertilizer_name || '-'}</td>
                  <td className="px-3 py-2">{p.prediction_result?.application_rate ?? p.prediction_result?.applicationRate ?? '-'}</td>
                  <td className="px-3 py-2">{p.prediction_result?.confidence_score ?? p.prediction_result?.confidenceScore ?? '-'}</td>
                  <td className="px-3 py-2">
                    {p.success === false ? (
                      <XCircle className="h-4 w-4 text-red-600 inline" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-600 inline" />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
export default AdminHealthPanel; 