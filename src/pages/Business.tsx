import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { adminApi } from '../services/api';
import { toast } from '../components/Toast';

type BusinessItem = {
  _id?: string;
  id?: string;
  businessName?: string;
  name?: string;
  product?: string;
  industry?: string;
  customer?: string;
  description?: string;
  createdAt?: string;
};
// fake git

const Business = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [businesses, setBusinesses] = useState<BusinessItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBusinesses = async () => {
    try {
      const data = await adminApi.getAllBusinesses();
      const list = Array.isArray(data) ? data : (data.businesses || data.data || []);
      setBusinesses(list);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to fetch businesses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchBusinesses();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const filteredBusinesses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return businesses;

    return businesses.filter((business) => {
      const name = (business.businessName || business.name || '').toLowerCase();
      const product = (business.product || business.industry || '').toLowerCase();
      const customer = (business.customer || business.description || '').toLowerCase();
      return name.includes(query) || product.includes(query) || customer.includes(query);
    });
  }, [businesses, searchQuery]);

  return (
    <div className="p-8 bg-white min-h-full">
      <h1 className="text-[28px] font-semibold text-gray-900 mb-6">Business</h1>

      <div className="flex items-center mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="search businesses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] w-80"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 min-h-[500px]">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
          </div>
        )}

        {!loading && filteredBusinesses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-500">No businesses found.</p>
          </div>
        )}

        {!loading && filteredBusinesses.length > 0 && (
          <div className="w-full overflow-x-auto">
            <div className="grid grid-cols-4 gap-4 pb-4 text-[13px] font-semibold text-gray-900 border-b border-gray-200 min-w-[700px]">
              <div>Name</div>
              <div>Industry / Product</div>
              <div>Description / Customer</div>
              <div>Created</div>
            </div>

            <div className="flex flex-col min-w-[700px]">
              {filteredBusinesses.map((business, index) => (
                <div
                  key={business._id || business.id || index}
                  className="grid grid-cols-4 gap-4 py-4 text-[13px] text-gray-600 border-b border-gray-100 items-center hover:bg-gray-50"
                >
                  <div className="font-medium text-gray-900">
                    {business.businessName || business.name || 'N/A'}
                  </div>
                  <div>{business.product || business.industry || 'N/A'}</div>
                  <div className="truncate">{business.customer || business.description || 'N/A'}</div>
                  <div className="text-[11px] text-gray-500">
                    {business.createdAt ? new Date(business.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Business;
