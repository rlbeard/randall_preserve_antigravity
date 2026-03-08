import React, { useState } from 'react';
import { Newspaper, BadgeDollarSign, Users, Megaphone } from 'lucide-react';

const Last30Days = ({ feed }) => {
  const [filter, setFilter] = useState('ALL');

  const filteredFeed = filter === 'ALL' 
    ? feed 
    : feed?.filter(item => item.category === filter);

  const getIcon = (category) => {
    switch (category) {
      case 'OFFICIAL': return <Newspaper size={18} className="text-blue-500" />;
      case 'FUNDING': return <BadgeDollarSign size={18} className="text-green-500" />;
      case 'LOCAL': return <Users size={18} className="text-purple-500" />;
      case 'SOCIAL': return <Megaphone size={18} className="text-orange-500" />;
      default: return <Newspaper size={18} className="text-slate-500" />;
    }
  };

  const getBadgeColor = (category) => {
    switch (category) {
      case 'OFFICIAL': return 'bg-blue-500/10 text-blue-700 ring-1 ring-inset ring-blue-500/20';
      case 'FUNDING': return 'bg-emerald-500/10 text-emerald-700 ring-1 ring-inset ring-emerald-500/20';
      case 'LOCAL': return 'bg-fuchsia-500/10 text-fuchsia-700 ring-1 ring-inset ring-fuchsia-500/20';
      case 'SOCIAL': return 'bg-orange-500/10 text-orange-700 ring-1 ring-inset ring-orange-500/20';
      default: return 'bg-slate-500/10 text-slate-700 ring-1 ring-inset ring-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
      
      {/* Feed Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <Newspaper className="text-blue-600" size={24} />
          <h2 className="text-2xl font-bold text-slate-800">Intelligence Feed</h2>
          <span className="text-[10px] font-black tracking-widest bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md">STATIC</span>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto shadow-inner">
          {['ALL', 'OFFICIAL', 'LOCAL', 'SOCIAL'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                filter === f 
                  ? 'bg-white shadow-sm text-slate-800' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-5">
        {filteredFeed && filteredFeed.length > 0 ? (
          filteredFeed.map((item) => (
            <div key={item.id} className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-sm rounded-3xl p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 hover:bg-white/90 transition-all duration-300 group ring-1 ring-slate-900/5">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold tracking-wider px-2 py-1 rounded-md flex items-center gap-1.5 uppercase ${getBadgeColor(item.category)}`}>
                  {getIcon(item.category)}
                  {item.category}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{item.date}</span>
              </div>
              
              <h4 className="text-xl font-display font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h4>
              <p className="text-slate-600 mb-4 leading-relaxed text-sm">
                {item.summary}
              </p>
              
              <div className="flex justify-between items-center text-xs font-semibold pt-4 border-t border-slate-100">
                <span className="text-slate-400 italic">Source: {item.source}</span>
                <span className={`tracking-widest ${
                  item.sentiment === 'POSITIVE' ? 'text-green-500' :
                  item.sentiment === 'NEGATIVE' ? 'text-red-500' :
                  'text-amber-500'
                }`}>
                  {item.sentiment}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-400 font-medium">
            No intelligence found for this category.
          </div>
        )}
      </div>

    </div>
  );
};

export default Last30Days;
