import { useState, useEffect } from 'react';
import { Search, Plus, X, FolderOpen } from 'lucide-react';
import { portfolioApi } from '../services/api';
import { toast } from '../components/Toast';

const Business = () => {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: ''
  });

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const data = await portfolioApi.getAllBusinesses();
      const list = Array.isArray(data) ? data : (data.businesses || data.data || []);
      setBusinesses(list);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch businesses');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Please enter a business name');
      return;
    }

    try {
      setCreating(true);
      await portfolioApi.createBusiness(formData);
      toast.success('Business created successfully');
      setShowCreateModal(false);
      setFormData({ name: '', description: '', industry: '' });
      await fetchBusinesses();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create business');
    } finally {
      setCreating(false);
    }
  };

  const filteredBusinesses = businesses.filter((b: any) => {
    const name = (b.name || '').toLowerCase();
    const industry = (b.industry || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || industry.includes(query);
  });

  return (
    <div className="p-8 bg-white min-h-full">
      <h1 className="text-[28px] font-semibold text-gray-900 mb-6">Projects</h1>

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
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
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Business
        </button>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 min-h-[500px]">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Business List</h3>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
          </div>
        ) : filteredBusinesses.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <div className="grid grid-cols-4 gap-4 pb-4 text-[13px] font-semibold text-gray-900 border-b border-gray-200 min-w-[600px]">
              <div>Name</div>
              <div>Industry</div>
              <div>Description</div>
              <div>Created</div>
            </div>

            <div className="flex flex-col min-w-[600px]">
              {filteredBusinesses.map((b: any, index: number) => (
                <div
                  key={b._id || b.id || index}
                  className="grid grid-cols-4 gap-4 py-4 text-[13px] text-gray-600 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">{b.name || 'N/A'}</div>
                  <div>{b.industry || 'N/A'}</div>
                  <div className="truncate">{b.description || 'N/A'}</div>
                  <div className="text-[11px] text-gray-500">
                    {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FolderOpen className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-gray-500">No businesses found.</p>
          </div>
        )}
      </div>

      {/* Create Business Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Create New Business</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateBusiness} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter business name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  placeholder="e.g., Technology, Finance"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Business description"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors cursor-pointer"
                >
                  {creating ? 'Creating...' : 'Create Business'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Business;
