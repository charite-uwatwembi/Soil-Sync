import { Activity, CheckCircle, Mail, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';

interface Props { isDarkMode:boolean; }

const AdminHealthPanel:React.FC<Props> = ({isDarkMode})=>{
  const [predStats,setPredStats]=useState<any>(null);
  const [smsStats,setSmsStats]=useState<any>(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    const load=async()=>{
      const [p,s]=await Promise.all([
        adminService.getPredictionStats(),
        adminService.getSmsStats()
      ]);
      setPredStats(p); setSmsStats(s); setLoading(false);
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
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Activity className="h-5 w-5 text-blue-600"/>Pipeline Health (24h)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {card('Predictions', predStats?.count24, <Activity className="h-4 w-4"/>) }
        {card('Avg Latency', predStats?`${predStats.avgLatency} ms`:null, <Activity className="h-4 w-4"/>) }
        {card('Error Rate', predStats?`${predStats.errorRate}%`:null, <XCircle className="h-4 w-4 text-red-600"/>) }
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-2 flex items-center gap-2"><Mail className="h-5 w-5 text-green-600"/>SMS Delivery (today)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {card('Sent', smsStats?.sent, <Mail className="h-4 w-4"/>) }
        {card('Delivered', smsStats?.delivered, <CheckCircle className="h-4 w-4 text-green-600"/>) }
        {card('Failed', smsStats?.failed, <XCircle className="h-4 w-4 text-red-600"/>) }
      </div>
    </div>
  );
};
export default AdminHealthPanel; 