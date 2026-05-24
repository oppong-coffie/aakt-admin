import { useState, useEffect } from 'react';
import { Search, User } from 'lucide-react';
import { adminApi } from '../services/api';

const Onboardings = () => {
  const [onboardings, setOnboardings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchOnboardings = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await adminApi.getAllOnboardings();
        console.log('Onboardings response:', res);
        
        let list: any[] = [];
        if (Array.isArray(res)) {
          list = res;
        } else if (res && typeof res === 'object') {
          list = (res as any).onboardings || (res as any).data || [];
        }
        
        setOnboardings(list);
      } catch (err: any) {
        console.error('Error fetching onboardings:', err);
        setError(err?.message || 'Failed to fetch onboardings');
      } finally {
        setLoading(false);
      }
    };

    fetchOnboardings();
  }, []);

  const filteredOnboardings = onboardings.filter((o: any) => {
    const userid = o?.userid || '';
    const country = o?.country || '';
    const stage = o?.stage || '';
    const query = searchQuery.toLowerCase();
    return userid.toLowerCase().includes(query) ||
           country.toLowerCase().includes(query) ||
           stage.toLowerCase().includes(query);
  });

  return (
    <div className="p-8 bg-[#f4f5f9] dark:bg-gray-900 min-h-screen">
      <div className="mb-6">
        <h1 className="text-[28px] font-semibold text-gray-900 dark:text-white mb-6">Onboardings</h1>
        
        {/* Search Bar */}
        <div className="flex gap-4 items-center mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="search by user ID, country, or stage..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 w-[320px] shadow-sm text-[14px] text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm min-h-[500px]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">User Onboarding Profiles</h3>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
            Error: {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
          </div>
        ) : filteredOnboardings.length > 0 ? (
          <div className="w-full overflow-x-auto">
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 pb-4 text-[13px] font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 min-w-[700px]">
              <div>User ID</div>
              <div>Country</div>
              <div>Stage</div>
              <div>Team Size</div>
              <div>Businesses</div>
              <div>Created</div>
            </div>
            
            {/* Table Body */}
            <div className="flex flex-col min-w-[700px]">
              {filteredOnboardings.map((o: any, index: number) => (
                <div 
                  key={o._id || o.userid || index} 
                  className="grid grid-cols-6 gap-4 py-4 text-[13px] text-gray-600 dark:text-gray-350 border-b border-gray-50 dark:border-gray-700/50 items-center hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <div className="font-mono text-[11px] text-blue-600 dark:text-blue-400">{o.userid || 'N/A'}</div>
                  <div>{o.country || 'N/A'}</div>
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 capitalize">
                      {o.stage || 'Not set'}
                    </span>
                  </div>
                  <div>{o.teamsize || '1'}</div>
                  <div>{o.numberofbusinesses || 0}</div>
                  <div className="text-[11px] text-gray-500">
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <User className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-gray-500 dark:text-gray-400">
              {error ? 'Failed to load onboardings. Check console for details.' : 'No onboardings found.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboardings;
