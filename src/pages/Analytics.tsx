import { Search, Download } from 'lucide-react';

const CompanyGrowthChart = () => {
  const bars = [
    { type: 'dark', h: '60%' }, { type: 'light', h: '25%' }, { type: 'light', h: '25%' },
    { type: 'dark', h: '25%' }, { type: 'light', h: '25%' }, { type: 'dark', h: '25%' },
    { type: 'light', h: '25%' }, { type: 'dark', h: '60%' }, { type: 'light', h: '65%' },
    { type: 'light', h: '65%' }, { type: 'dark', h: '25%' }, { type: 'light', h: '65%' },
    { type: 'light', h: '65%' }, { type: 'dark', h: '60%' }, { type: 'light', h: '35%' },
    { type: 'dark', h: '25%' }, { type: 'light', h: '35%' }, { type: 'dark', h: '60%' },
    { type: 'light', h: '45%' }, { type: 'dark', h: '60%' }, { type: 'light', h: '45%' },
    { type: 'dark', h: '25%' }, { type: 'light', h: '25%' }, { type: 'dark', h: '25%' },
    { type: 'light', h: '25%' }, { type: 'light', h: '40%' }, { type: 'dark', h: '60%' },
    { type: 'light', h: '35%' }, { type: 'light', h: '35%' }, { type: 'dark', h: '60%' },
    { type: 'light', h: '45%' }, { type: 'light', h: '65%' }, { type: 'light', h: '65%' },
    { type: 'dark', h: '25%' }, { type: 'light', h: '65%' }, { type: 'dark', h: '25%' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-semibold text-gray-900">Company Growth</h3>
        <div className="flex items-center gap-6 text-[13px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#b8cbf2]"></span>
            <span className="text-gray-600">Input</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#002df3]"></span>
            <span className="text-gray-600">Output</span>
          </div>
          <span className="text-blue-500 font-medium ml-2">Avg Growth (69%)</span>
        </div>
      </div>
      
      {/* Mock Chart Area */}
      <div className="flex-1 min-h-[220px] flex items-end justify-between gap-1 mt-4 pt-10">
        {bars.map((bar, i) => (
          <div 
            key={i} 
            className={`w-full max-w-[6px] rounded-t-[2px] ${bar.type === 'dark' ? 'bg-[#002df3]' : 'bg-[#abc4ff]'}`} 
            style={{ height: bar.h }}
          ></div>
        ))}
      </div>
    </div>
  );
};

const UserMetricsChart = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-semibold text-gray-900">User Metrics</h3>
        <div className="flex items-center gap-6 text-[13px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-gray-600">Input</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#002df3]"></span>
            <span className="text-gray-600">Output</span>
          </div>
          <span className="text-green-500 font-medium ml-2">Avg Growth (60%)</span>
        </div>
      </div>
      
      {/* Mock SVG Line Chart */}
      <div className="flex-1 min-h-[220px] mt-4 pt-10 relative">
        <svg viewBox="0 0 400 150" className="w-full h-full preserve-3d overflow-visible" preserveAspectRatio="none">
          {/* Solid Light Blue Line */}
          <path 
            d="M 0 100 C 50 60, 80 160, 150 140 C 200 120, 220 30, 270 20 C 330 10, 350 70, 400 140" 
            fill="none" 
            stroke="#abc4ff" 
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          {/* Dashed Dark Blue Line */}
          <path 
            d="M 10 70 C 60 180, 150 180, 180 90 C 210 0, 280 0, 310 100 C 340 200, 380 90, 400 50" 
            fill="none" 
            stroke="#002df3" 
            strokeWidth="2" 
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
};

const Analytics = () => {
  const features = [
    { name: 'Block', value: '50%', color: 'bg-[#002df3] text-white' },
    { name: 'Process', value: '30%', color: 'bg-[#abc4ff] text-gray-800' },
    { name: 'Projects', value: '25%', color: 'bg-gray-200 text-gray-700' },
    { name: 'Block', value: '10%', color: 'bg-gray-200 text-gray-700' },
    { name: 'Block', value: '10%', color: 'bg-gray-200 text-gray-700' },
    { name: 'Block', value: '10%', color: 'bg-gray-200 text-gray-700' },
  ];

  return (
    <div className="p-8 bg-[#f4f5f9] min-h-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[28px] font-semibold text-gray-900">Analytics</h1>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="search" 
              className="pl-9 pr-4 py-2.5 bg-white rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 w-[300px] shadow-sm text-sm"
            />
          </div>
          
          <button className="flex items-center gap-2 bg-[#002df3] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[14px] font-medium transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <CompanyGrowthChart />
        <UserMetricsChart />
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-8">Most Used Features</h3>
        <div className="flex flex-col gap-6">
          {features.map((item, i) => (
            <div key={i} className="flex justify-between items-center text-[14px]">
              <span className="text-gray-700">{item.name}</span>
              <span className={`px-4 py-1.5 rounded-full font-medium text-[13px] ${item.color}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
