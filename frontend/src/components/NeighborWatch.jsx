import React from 'react';
import { ShieldAlert, Flame, FileWarning } from 'lucide-react';

const NeighborWatch = ({ neighborWatch }) => {

  const getAlertIcon = (type) => {
    switch (type) {
      case 'FIRE': return <Flame size={20} className="text-red-500" />;
      case 'POLICY': return <FileWarning size={20} className="text-amber-500" />;
      default: return <ShieldAlert size={20} className="text-blue-500" />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'FIRE': return 'border-red-200 bg-red-50';
      case 'POLICY': return 'border-amber-200 bg-amber-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in space-y-8">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <div className="bg-red-100 p-3 rounded-xl text-red-600">
          <ShieldAlert size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Neighbor Watch</h2>
          <p className="text-sm font-semibold text-red-600 tracking-wide uppercase">Local Alerts & Safety</p>
        </div>
      </div>

      {/* Alerts Grid */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
           Active Alerts
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {neighborWatch && neighborWatch.length > 0 ? (
            neighborWatch.map((alert) => (
              <div key={alert.id} className={`p-6 rounded-2xl border ${getAlertColor(alert.type)}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {getAlertIcon(alert.type)}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white px-2 py-1 rounded-md text-slate-600 border border-slate-100">
                    {alert.type}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">{alert.title}</h4>
                <p className="text-sm text-slate-600 font-medium">{alert.description}</p>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-slate-400 bg-white border border-slate-200 rounded-2xl">
              No active alerts at this time.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default NeighborWatch;
