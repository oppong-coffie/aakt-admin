import { useState, useRef, useEffect } from 'react';
import { Search, Filter, ChevronDown, Plus, MoreHorizontal, Building, CreditCard, Ban, X, Check } from 'lucide-react';

const mockCompanies = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  company: 'M-234',
  plan: 'Prepaid',
  lastActive: 'F-0003',
  status: i % 2 === 0 ? 'Investigative' : 'Critical',
}));

const Business = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeActionRow, setActiveActionRow] = useState<number | null>(null);
  const [modalState, setModalState] = useState<'none' | 'create' | 'adjust' | 'success'>('none');
  
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

  const openModal = (type: 'create' | 'adjust') => {
    setModalState(type);
    setActiveActionRow(null);
  };

  return (
    <div className="p-8 bg-[#f4f5f9] min-h-full">
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
                placeholder="search" 
                className="pl-9 pr-4 py-2.5 bg-white rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 w-[240px] shadow-sm text-[14px]"
              />
            </div>
            
            {/* Filter Dropdown */}
            <div className="relative" ref={filterRef}>
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm text-gray-600 text-[14px] hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
              
              {isFilterOpen && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                  {['Active', 'Suspended', 'Free Trial', 'Pending'].map((opt) => (
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
            className="flex items-center gap-2 bg-[#002df3] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[14px] font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create New Company
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-2xl p-6 shadow-sm min-h-[500px]">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">List of companies</h3>
        
        <div className="w-full">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 pb-4 text-[13px] font-semibold text-gray-900 border-b border-gray-100">
            <div className="flex justify-center"><div className="w-4 h-4 border-2 border-gray-300 rounded-sm"></div></div>
            <div>Company</div>
            <div>Plan</div>
            <div>Last Active</div>
            <div>Status</div>
            <div>Action</div>
          </div>
          
          {/* Table Body */}
          <div className="flex flex-col">
            {mockCompanies.map((company, idx) => (
              <div key={company.id} className="grid grid-cols-6 gap-4 py-4 text-[13px] text-gray-600 border-b border-gray-50 relative items-center hover:bg-gray-50/50 transition-colors">
                <div className="flex justify-center"><div className="w-4 h-4 border-2 border-gray-300 rounded-sm"></div></div>
                <div>{company.company}</div>
                <div>{company.plan}</div>
                <div>{company.lastActive}</div>
                <div>{company.status}</div>
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveActionRow(activeActionRow === company.id ? null : company.id);
                    }}
                    className="w-8 h-6 bg-[#002df3] text-white rounded-md flex items-center justify-center hover:bg-blue-700"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  
                  {activeActionRow === company.id && (
                    <div ref={actionRef} className="absolute right-full top-0 mr-2 w-52 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-20">
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                        <Building className="w-4 h-4 text-gray-400" />
                        View Company Profile
                      </button>
                      <button onClick={() => openModal('adjust')} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        Adjust Subscription
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 hover:text-red-600">
                        <Ban className="w-4 h-4 text-gray-400" />
                        Deactivate Company
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals Overlay */}
      {modalState !== 'none' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          
          {/* Create Company Modal */}
          {modalState === 'create' && (
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Create New Company</h3>
                  <button onClick={() => setModalState('none')} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex flex-col gap-4">
                  <input type="text" placeholder="Business Name" className="w-full px-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px]" />
                  <input type="text" placeholder="Business Owner name" className="w-full px-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px]" />
                  <input type="text" placeholder="Plan" className="w-full px-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px]" />
                  <input type="text" placeholder="Last Active" className="w-full px-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px]" />
                  <div className="relative">
                    <select className="w-full px-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] appearance-none text-gray-500">
                      <option value="">Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                <button 
                  onClick={() => setModalState('success')}
                  className="w-full mt-6 bg-[#002df3] hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors text-[14px]"
                >
                  Create New Company
                </button>
              </div>
            </div>
          )}

          {/* Adjust Subscription Modal */}
          {modalState === 'adjust' && (
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden relative animate-in fade-in zoom-in duration-200">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Adjust Subscription</h3>
                  <button onClick={() => setModalState('none')} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="relative mb-6">
                  <select className="w-full px-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] appearance-none text-gray-700">
                    <option value="free">Free Tier</option>
                    <option value="pro">Pro Tier</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                
                <button 
                  onClick={() => setModalState('none')}
                  className="w-full bg-[#002df3] hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors text-[14px]"
                >
                  Apply Changes
                </button>
              </div>
            </div>
          )}

          {/* Success Modal */}
          {modalState === 'success' && (
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden relative p-8 flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 bg-[#d1f5d3] rounded-full flex items-center justify-center mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-6 leading-snug">
                You have created new<br/>company successfully
              </h3>
              
              <button 
                onClick={() => setModalState('none')}
                className="w-full bg-[#002df3] hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors text-[14px]"
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
