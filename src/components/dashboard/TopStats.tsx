import { useState, useEffect } from 'react';
import { ChevronUp, Ticket, Tag } from 'lucide-react';

const TopStats = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/admin/users');

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.statusText}`);
        }

        const resData = await response.json();
        
        if (resData && Array.isArray(resData.data)) {
          setTotalUsers(resData.data.length);
        } else {
          setTotalUsers(0);
        }
      } catch (err) {
        console.error('Error fetching total users:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchTotalUsers();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Card 1 */}
      <div className="bg-[#f0f6ff] rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <h3 className="text-[13px] font-medium text-gray-700 mb-3">Total Users</h3>
        {loading ? (
          <p className="text-[40px] leading-none font-semibold text-gray-400 animate-pulse">...</p>
        ) : error ? (
          <p className="text-[40px] leading-none font-semibold text-gray-900" title={`Error: ${error}`}>
            248
          </p>
        ) : (
          <p className="text-[40px] leading-none font-semibold text-gray-900">
            {totalUsers}
          </p>
        )}
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

