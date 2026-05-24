import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronDown, Plus, MoreHorizontal, Building, X, Check } from 'lucide-react';
import { adminApi, portfolioApi } from '../services/api';

interface BusinessItem {
  _id: string;
  businessName: string;
  bizConcept?: {
    product: string;
    customer: string;
    goToMarket: string[];
    culture: string;
  };
  product?: string;
  customer?: string;
  goToMarket?: string[];
  culture?: string;
  createdAt?: string;
  userid?: string;
}

const Business = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeActionRow, setActiveActionRow] = useState<string | null>(null);
  const [modalState, setModalState] = useState<'none' | 'create' | 'success'>('none');
  
  // Data State
  const [businesses, setBusinesses] = useState<BusinessItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    businessName: '',
    product: '',
    customer: '',
    culture: '',
    goToMarket: [] as string[]
  });

  const filterRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (actionRef.current && !actionRef.current.contains(event.target as Node)) {
        setActiveActionRow(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAllBusinesses();
      const list = Array.isArray(res) ? res : (res?.businesses || res?.data || []);
      setBusinesses(list);
    } catch (err) {
      console.error('Error fetching businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const openModal = (type: 'create') => {
    setModalState(type);
    setActiveActionRow(null);
  };

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName.trim()) return;
    
    try {
      setCreating(true);
      await portfolioApi.createBusiness({
        businessName: formData.businessName,
        bizConcept: {
          product: formData.product || 'General',
          customer: formData.customer || 'All markets',
          goToMarket: formData.goToMarket.length > 0 ? formData.goToMarket : ['online_store'],
          culture: formData.culture || 'Customer-centric'
        }
      });
      setModalState('success');
      setFormData({
        businessName: '',
        product: '',
        customer: '',
        culture: '',
        goToMarket: []
      });
      fetchBusinesses();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create business');
    } finally {
      setCreating(false);
    }
  };

  const toggleGoToMarket = (strategy: string) => {
    setFormData(prev => {
      const alreadySelected = prev.goToMarket.includes(strategy);
      return {
        ...prev,
        goToMarket: alreadySelected 
          ? prev.goToMarket.filter(s => s !== strategy)
          : [...prev.goToMarket, strategy]
      };
    });
  };

  const filteredBusinesses = businesses.filter(b => 
    b.businessName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 bg-white min-h-full">
      <div className="mb-6">
        <h1 className="text-[28px] font-semibold text-gray-900 mb-6">Companies</h1>
        
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="search by name..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-[240px] shadow-sm text-[14px] text-gray-800"
              />
            </div>
            
            {/* Filter Dropdown */}
            <div className="relative" ref={filterRef}>
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm text-gray-600 text-[14px] hover:bg-gray-50 border border-gray-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
              
              {isFilterOpen && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                  {['Active', 'Pending'].map((opt) => (
                    <button key={opt} className="w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={() => openModal('create')}
            className="flex items-center gap-2 bg-[#002df3] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[14px] font-medium transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create New Company
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 min-h-[500px]">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">List of companies</h3>
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
          </div>
        ) : filteredBusinesses.length > 0 ? (
          <div className="w-full overflow-x-auto">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 pb-4 text-[13px] font-semibold text-gray-900 border-b border-gray-200 min-w-[600px]">
              <div>Company Name</div>
              <div>Product Focus</div>
              <div>Target Customers</div>
              <div>Date Created</div>
              <div className="text-right">Action</div>
            </div>
            
            {/* Table Body */}
            <div className="flex flex-col min-w-[600px]">
              {filteredBusinesses.map((company) => (
                <div 
                  key={company._id} 
                  onClick={() => navigate(`/business/${company._id}`)}
                  className="grid grid-cols-5 gap-4 py-4 text-[13px] text-gray-600 border-b border-gray-100 relative items-center hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-500" />
                    {company.businessName}
                  </div>
                  <div className="truncate">{company.bizConcept?.product || company.product || 'General'}</div>
                  <div className="truncate">{company.bizConcept?.customer || company.customer || 'All markets'}</div>
                  <div>{company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}</div>
                  <div className="relative text-right" onClick={e => e.stopPropagation()}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveActionRow(activeActionRow === company._id ? null : company._id);
                      }}
                      className="inline-flex w-8 h-6 bg-[#002df3] text-white rounded-md items-center justify-center hover:bg-blue-700 cursor-pointer"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    
                    {activeActionRow === company._id && (
                      <div ref={actionRef} className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-20 text-left">
                        <button 
                          onClick={() => navigate(`/business/${company._id}`)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        >
                          <Building className="w-4 h-4 text-gray-400" />
                          View Company Profile
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Building className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-gray-500">No companies found.</p>
          </div>
        )}
      </div>

      {/* Modals Overlay */}
      {modalState !== 'none' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          
          {/* Create Company Modal */}
          {modalState === 'create' && (
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative animate-in fade-in zoom-in duration-200">
              <form onSubmit={handleCreateBusiness} className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Create New Company</h3>
                  <button type="button" onClick={() => setModalState('none')} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-gray-500">Business Name</label>
                    <input 
                      type="text" 
                      placeholder="My Awesome Business" 
                      required
                      value={formData.businessName}
                      onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] text-gray-900" 
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-gray-500">Product / Concept</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Software as a Service" 
                      value={formData.product}
                      onChange={e => setFormData({ ...formData, product: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] text-gray-900" 
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-gray-500">Target Customer</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Small businesses, Enterprise" 
                      value={formData.customer}
                      onChange={e => setFormData({ ...formData, customer: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] text-gray-900" 
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-gray-500">Company Culture</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Innovative and fast-paced" 
                      value={formData.culture}
                      onChange={e => setFormData({ ...formData, culture: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] text-gray-900" 
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-bold text-gray-500">Go-To-Market Strategies</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'online_store', label: 'Online Store' },
                        { id: 'direct_sales', label: 'Direct Sales' },
                        { id: 'retail', label: 'Retail' },
                        { id: 'subscription', label: 'Subscription' },
                        { id: 'freemium', label: 'Freemium' },
                        { id: 'marketplace', label: 'Marketplace' },
                        { id: 'consulting', label: 'Consulting' },
                        { id: 'partnerships', label: 'Partnerships' }
                      ].map(strategy => (
                        <button
                          type="button"
                          key={strategy.id}
                          onClick={() => toggleGoToMarket(strategy.id)}
                          className={`px-3 py-2 rounded-xl text-[12px] font-semibold border text-left transition-colors flex items-center justify-between ${
                            formData.goToMarket.includes(strategy.id)
                              ? 'bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {strategy.label}
                          {formData.goToMarket.includes(strategy.id) && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  disabled={creating}
                  className="w-full mt-6 bg-[#002df3] hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-medium transition-colors text-[14px] cursor-pointer"
                >
                  {creating ? 'Creating...' : 'Create New Company'}
                </button>
              </form>
            </div>
          )}

          {/* Success Modal */}
          {modalState === 'success' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl w-full max-w-sm overflow-hidden relative p-8 flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 bg-[#d1f5d3] rounded-full flex items-center justify-center mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 leading-snug">
                You have created new<br/>company successfully
              </h3>
              
              <button 
                onClick={() => setModalState('none')}
                className="w-full bg-[#002df3] hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors text-[14px] cursor-pointer"
              >
                Ok
              </button>
            </div>
          )}
          
        </div>
      )}
    </div>
  );
};

export default Business;
