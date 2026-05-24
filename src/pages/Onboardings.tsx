import { useState, useEffect } from 'react';
import { Search, User, Plus, X } from 'lucide-react';
import { adminApi } from '../services/api';
import { toast } from '../components/Toast';

const Onboardings = () => {
  const [onboardings, setOnboardings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    country: '',
    numberofbusinesses: 1,
    teamsize: '1-10',
    referralcode: '',
    otp: 1,
    stage: 'Idea',
    product: '',
    strategy: '',
    team: '',
    finance: '',
    growth: ''
  });

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

  const handleCreateOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.country || !formData.stage || !formData.product) {
      toast.error('Please fill in required fields (Country, Stage, Product)');
      return;
    }

    try {
      setCreating(true);
      await adminApi.createOnboarding(formData);
      toast.success('Onboarding created successfully');
      setShowCreateModal(false);
      setFormData({
        country: '',
        numberofbusinesses: 1,
        teamsize: '1-10',
        referralcode: '',
        otp: 1,
        stage: 'Idea',
        product: '',
        strategy: '',
        team: '',
        finance: '',
        growth: ''
      });
      // Refresh list
      const res = await adminApi.getAllOnboardings();
      const list = Array.isArray(res) ? res : (res as any).onboardings || (res as any).data || [];
      setOnboardings(list);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create onboarding');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-[28px] font-semibold text-gray-900 mb-6">Onboardings</h1>
        
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="search by user ID, country, or stage..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-[320px] shadow-sm text-[14px] text-gray-800"
              />
            </div>
          </div>

          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-[#002df3] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[14px] font-medium transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Onboarding
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 min-h-[500px]">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">User Onboarding Profiles</h3>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
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
            <div className="grid grid-cols-6 gap-4 pb-4 text-[13px] font-semibold text-gray-900 border-b border-gray-200 min-w-[700px]">
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
                  className="grid grid-cols-6 gap-4 py-4 text-[13px] text-gray-600 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="font-mono text-[11px] text-blue-600">{o.userid || 'N/A'}</div>
                  <div>{o.country || 'N/A'}</div>
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-600 capitalize">
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
            <User className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-gray-500">
              {error ? 'Failed to load onboardings. Check console for details.' : 'No onboardings found.'}
            </p>
          </div>
        )}
      </div>

      {/* Create Onboarding Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Create New Onboarding</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <form onSubmit={handleCreateOnboarding}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    placeholder="USA"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stage *
                  </label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({...formData, stage: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Idea">Idea</option>
                    <option value="Seed">Seed</option>
                    <option value="Growth">Growth</option>
                    <option value="Scale">Scale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product *
                  </label>
                  <input
                    type="text"
                    value={formData.product}
                    onChange={(e) => setFormData({...formData, product: e.target.value})}
                    placeholder="SaaS Platform"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Size
                  </label>
                  <select
                    value={formData.teamsize}
                    onChange={(e) => setFormData({...formData, teamsize: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1-10">1-10</option>
                    <option value="10-50">10-50</option>
                    <option value="50-100">50-100</option>
                    <option value="100+">100+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Businesses
                  </label>
                  <input
                    type="number"
                    value={formData.numberofbusinesses}
                    onChange={(e) => setFormData({...formData, numberofbusinesses: parseInt(e.target.value)})}
                    min="1"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Strategy
                  </label>
                  <input
                    type="text"
                    value={formData.strategy}
                    onChange={(e) => setFormData({...formData, strategy: e.target.value})}
                    placeholder="B2B"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team
                  </label>
                  <input
                    type="text"
                    value={formData.team}
                    onChange={(e) => setFormData({...formData, team: e.target.value})}
                    placeholder="In-house"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Finance
                  </label>
                  <input
                    type="text"
                    value={formData.finance}
                    onChange={(e) => setFormData({...formData, finance: e.target.value})}
                    placeholder="Bootstrap"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Growth Focus
                  </label>
                  <input
                    type="text"
                    value={formData.growth}
                    onChange={(e) => setFormData({...formData, growth: e.target.value})}
                    placeholder="High"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referral Code
                  </label>
                  <input
                    type="text"
                    value={formData.referralcode}
                    onChange={(e) => setFormData({...formData, referralcode: e.target.value})}
                    placeholder="REF123"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleCreateOnboarding}
                disabled={creating}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors cursor-pointer"
              >
                {creating ? 'Creating...' : 'Create Onboarding'}
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboardings;