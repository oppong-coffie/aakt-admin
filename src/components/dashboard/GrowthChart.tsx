const GrowthChart = () => {
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
    <div className="bg-white rounded-2xl p-6 shadow-sm md:col-span-2 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-semibold text-gray-900">User & Company Growth</h3>
        <div className="flex items-center gap-6 text-[13px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#b8cbf2]"></span>
            <span className="text-gray-600">Input</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
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

export default GrowthChart;
