import React from 'react';
import { Leaf, Pickaxe, CheckCircle2, Clock, CalendarDays } from 'lucide-react';

const Restoration = ({ timeline }) => {
  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-sm ring-1 ring-slate-900/5">
      <div className="flex items-center gap-4 mb-10 border-b border-slate-200/50 pb-6">
        <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-600 ring-1 ring-inset ring-emerald-500/20">
          <Leaf size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-800">Project Timeline</h2>
          <p className="text-sm font-semibold text-emerald-600 tracking-wide uppercase">Restoration Progress</p>
        </div>
      </div>

      <div className="relative border-l-2 border-slate-100 ml-6 space-y-12 pb-8">
        {timeline && timeline.map((event, i) => (
          <div key={event.id} className="relative pl-8 group">
            
            {/* Timeline Dot */}
            <div className={`absolute -left-[17px] top-1 p-1 rounded-full border-4 border-white ${
              event.status === 'completed' ? 'bg-emerald-500' :
              event.status === 'in-progress' ? 'bg-amber-400' :
              'bg-slate-200'
            }`}>
              {event.status === 'completed' ? <CheckCircle2 size={16} className="text-white" /> :
               event.status === 'in-progress' ? <Pickaxe size={16} className="text-white" /> :
               <Clock size={16} className="text-white" />}
            </div>

            {/* Content */}
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm group-hover:border-emerald-200/60 group-hover:bg-emerald-50/40 group-hover:shadow-md transition-all duration-300">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                 <CalendarDays size={14} className="text-slate-300" />
                 {event.year} 
                 {event.month && <span className="bg-slate-200/50 text-slate-500 px-2 py-0.5 rounded-sm">{event.month}</span>}
              </div>
              <h3 className="text-xl font-display font-bold text-slate-800 mb-2">{event.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {event.description}
              </p>
              
              <div className="mt-4 pt-3 border-t border-slate-200/60 inline-block">
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                   event.status === 'completed' ? 'text-emerald-500' :
                   event.status === 'in-progress' ? 'text-amber-500' :
                   'text-slate-400'
                }`}>
                  Status: {event.status.replace('-', ' ')}
                </span>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default Restoration;
