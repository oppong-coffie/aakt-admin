import { Search, Download } from 'lucide-react';

const Head = () => {
  return (
    <div className="flex justify-between items-center mb-1">
      <h1 className="text-[21px] font-semibold text-gray-900">Dashboard</h1>
      
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="search" 
            className="pl-9 pr-4 py-[5px] bg-white rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 w-[300px] shadow-sm text-sm"
          />
        </div>
        
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-[5px] rounded-lg text-sm transition-colors shadow-sm">
          <Download className=" w-4 h-4" />
          Export
        </button>
      </div>
    </div>
  );
};

export default Head;