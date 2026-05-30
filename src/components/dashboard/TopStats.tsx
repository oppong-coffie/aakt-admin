import { ChevronUp, Tag, Shield } from 'lucide-react';

interface TopStatsProps {
  stats: any;
  loading: boolean;
}

const TopStats = ({ stats, loading }: TopStatsProps) => {
  const displayUsers = stats?.totalUsers ?? 248;
  const displayBusinesses = stats?.totalBusiness ?? 15;
  const displayAdmins = stats?.totalAdmins ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Card 1 */}
      <div className="bg-[#f0f6ff] rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <h3 className="text-[13px] font-medium text-gray-750 mb-3">Total Users</h3>
        {loading ? (
          <p className="text-[40px] leading-none font-semibold text-gray-400 animate-pulse">...</p>
        ) : (
          <p className="text-[40px] leading-none font-semibold text-gray-900">
            {displayUsers}
          </p>
        )}
        <div className="absolute top-6 right-6 text-blue-600">
          <ChevronUp className="w-5 h-5" />
        </div>
      </div>
      
      {/* Card 2 */}
      <div className="bg-[#f0f6ff] rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <h3 className="text-[13px] font-medium text-gray-750 mb-3">Total Businesses</h3>
        {loading ? (
          <p className="text-[40px] leading-none font-semibold text-gray-400 animate-pulse">...</p>
        ) : (
          <p className="text-[40px] leading-none font-semibold text-gray-900">
            {displayBusinesses}
          </p>
        )}
        <div className="absolute top-6 right-6 text-blue-600">
          <Tag className="w-5 h-5" />
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-[#f0f6ff] rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <h3 className="text-[13px] font-medium text-gray-750 mb-3">Total Admin</h3>
        {loading ? (
          <p className="text-[40px] leading-none font-semibold text-gray-400 animate-pulse">...</p>
        ) : (
          <p className="text-[40px] leading-none font-semibold text-gray-900">
            {displayAdmins}
          </p>
        )}
        <div className="absolute top-6 right-6 text-blue-600">
          <Shield className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default TopStats;

