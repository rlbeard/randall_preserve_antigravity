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
      case 'FIRE': return 'border-red-400/30 bg-red-500/5 backdrop-blur-md ring-1 ring-inset ring-red-500/20';
      case 'POLICY': return 'border-amber-400/30 bg-amber-500/5 backdrop-blur-md ring-1 ring-inset ring-amber-500/20';
      default: return 'border-blue-400/30 bg-blue-500/5 backdrop-blur-md ring-1 ring-inset ring-blue-500/20';
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in space-y-8">
      
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-sm flex items-center gap-4 ring-1 ring-slate-900/5">
        <div className="bg-red-500/10 p-3 rounded-xl text-red-600 ring-1 ring-inset ring-red-500/20">
          <ShieldAlert size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-800">Neighbor Watch</h2>
          <p className="text-sm font-semibold text-red-600 tracking-wide uppercase">Local Alerts & Safety</p>
        </div>
      </div>

      {/* Alerts Grid */}
      <div>
        <h3 className="text-lg font-display font-bold text-slate-800 mb-4 flex items-center gap-2 px-2">
           <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
           Active Alerts
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 shadow-sm">
          {neighborWatch && neighborWatch.length > 0 ? (
            neighborWatch.map((alert) => (
              <div key={alert.id} className={`p-6 rounded-3xl border hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/5 ${getAlertColor(alert.type)}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-white/60 backdrop-blur-sm rounded-lg border border-white/80 shadow-sm">
                    {getAlertIcon(alert.type)}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white/60 backdrop-blur-sm px-2 py-1 rounded-md text-slate-600 border border-white/80 shadow-sm">
                    {alert.type}
                  </span>
                </div>
                <h4 className="text-lg font-display font-bold text-slate-800 mb-2">{alert.title}</h4>
                <p className="text-sm text-slate-600 font-medium">{alert.description}</p>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-slate-400 bg-white/70 backdrop-blur-md border border-white/60 rounded-3xl shadow-sm ring-1 ring-slate-900/5">
              No active alerts at this time.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default NeighborWatch;
