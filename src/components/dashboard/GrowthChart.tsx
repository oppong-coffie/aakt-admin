interface GrowthChartProps {
  stats: any;
  loading: boolean;
}

const GrowthChart = ({ stats, loading }: GrowthChartProps) => {
  const avg = 69;

  const monthKeys = ['Jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Sensible default mock percentages to maintain the design baseline
  const mockUsers = [40, 20, 25, 30, 25, 40, 45, 50, 45, 55, 60, 65];
  const mockBusinesses = [60, 25, 30, 35, 30, 60, 65, 70, 50, 75, 80, 85];

  const hasBackendData = false;

  // Find max value to scale heights dynamically
  const maxVal = Math.max(
    ...monthKeys.map(key => stats?.usergrowth?.[key] ?? 0),
    ...monthKeys.map(key => stats?.businessgrowth?.[key] ?? 0),
    1
  );

  const getBarHeight = (val: number, isMock: boolean) => {
    if (isMock) return `${val}%`;
    if (val === 0) return '4%';
    return `${Math.min(100, Math.max(12, (val / maxVal) * 100))}%`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm md:col-span-2 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-semibold text-gray-900">Users and Business Growth</h3>
        <div className="flex items-center gap-6 text-[13px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#abc4ff]"></span>
            <span className="text-gray-600">Input</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#002df3]"></span>
            <span className="text-gray-600">Output</span>
          </div>
          <span className="text-blue-500 font-medium ml-2">Avg Growth ({loading ? '...' : `${avg}%`})</span>
        </div>
      </div>

      {/* 12 Months Chart Area */}
      <div className="flex-1 min-h-[220px] flex items-end justify-between gap-2 mt-4 pt-6">
        {monthKeys.map((key, i) => {
          const userVal = hasBackendData ? (stats?.usergrowth?.[key] ?? 0) : mockUsers[i];
          const bizVal = hasBackendData ? (stats?.businessgrowth?.[key] ?? 0) : mockBusinesses[i];

          const userInputHeight = getBarHeight(userVal, !hasBackendData);
          const bizOutputHeight = getBarHeight(bizVal, !hasBackendData);

          return (
            <div key={key} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="w-full flex items-end justify-center gap-[4px] h-[160px]">
                {/* Input / Users (Light Blue) */}
                <div
                  className="w-[6px] rounded-t-[2px] bg-[#abc4ff] transition-all duration-500 hover:opacity-80 cursor-pointer"
                  style={{ height: userInputHeight }}
                  title={`Users: ${userVal}`}
                ></div>
                {/* Output / Businesses (Dark Blue) */}
                <div
                  className="w-[6px] rounded-t-[2px] bg-[#002df3] transition-all duration-500 hover:opacity-80 cursor-pointer"
                  style={{ height: bizOutputHeight }}
                  title={`Businesses: ${bizVal}`}
                ></div>
              </div>
              <span className="text-[11px] text-gray-500 font-medium">{monthLabels[i]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GrowthChart;
