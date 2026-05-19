import { ChevronUp, Ticket, Tag } from 'lucide-react';

const TopStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Card 1 */}
      <div className="bg-[#f0f6ff] rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <h3 className="text-[13px] font-medium text-gray-700 mb-3">Total Users</h3>
        <p className="text-[40px] leading-none font-semibold text-gray-900">248</p>
        <div className="absolute top-6 right-6 text-blue-600">
          <ChevronUp className="w-5 h-5" />
        </div>
      </div>
      
      {/* Card 2 */}
      <div className="bg-[#f0f6ff] rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <h3 className="text-[13px] font-medium text-gray-700 mb-3">Active Free Trials</h3>
        <p className="text-[40px] leading-none font-semibold text-gray-900">300</p>
        <div className="absolute top-6 right-6 text-blue-600">
          <Tag className="w-5 h-5" />
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-[#f0f6ff] rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <h3 className="text-[13px] font-medium text-gray-700 mb-3">Open Support Ticked</h3>
        <p className="text-[40px] leading-none font-semibold text-gray-900">23</p>
        <div className="absolute top-6 right-6 text-blue-600">
          <Ticket className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default TopStats;
