import { useState, useRef, useEffect } from 'react';
import { Search, Filter, ChevronDown, Megaphone, FileText, Users, X, Send } from 'lucide-react';

const mockTickets = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  company: 'M-234',
  tier: i % 3 === 0 ? 'Premium' : i % 3 === 1 ? 'Enterprise' : 'Free Tier',
  status: i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Critical' : 'Low',
}));

const mockChat = [
  { sender: 'user', name: 'Tech Mo Company', text: 'Hi, we tried running the weekly operational report using the AI assistant, but it keeps throwing a timeout error. We need this for our board meeting in an hour!' },
  { sender: 'admin', name: 'Admin', text: 'We will take care of that please' },
  { sender: 'user', name: 'Tech Mo Company', text: 'Hi, we tried running the weekly operational report using the AI assistant, but it keeps throwing a timeout error. We need this for our board meeting in an hour!' },
  { sender: 'admin', name: 'Admin', text: 'We will take care of that please' },
  { sender: 'user', name: 'Tech Mo Company', text: 'Hi, we tried running the weekly operational report using the AI assistant, but it keeps throwing a timeout error. We need this for our board meeting in an hour!' },
  { sender: 'admin', name: 'Admin', text: 'We will take care of that please' },
];

const Support = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [modalState, setModalState] = useState<'none' | 'broadcast'>('none');
  const [activeTab, setActiveTab] = useState('open');
  
  const filterRef = useRef<HTMLDivElement>(null);
  const broadcastRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (broadcastRef.current && !broadcastRef.current.contains(event.target as Node)) {
        setIsBroadcastOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="p-8 bg-[#f4f5f9] min-h-full">
      <div className="mb-6">
        <h1 className="text-[28px] font-semibold text-gray-900 mb-6">Support</h1>
        
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
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

          {/* Broadcast Announcement */}
          <div className="relative" ref={broadcastRef}>
            <button 
              onClick={() => setIsBroadcastOpen(!isBroadcastOpen)}
              className="flex items-center gap-2 bg-[#002df3] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[14px] font-medium transition-colors shadow-sm"
            >
              <Megaphone className="w-4 h-4" />
              Broadcast Announcement
            </button>

            {isBroadcastOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                <button 
                  onClick={() => { setIsBroadcastOpen(false); setModalState('broadcast'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                >
                  <FileText className="w-4 h-4 text-gray-400" />
                  All Companies
                </button>
                <button 
                  className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                >
                  <Users className="w-4 h-4 text-gray-400" />
                  Early Testers
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setActiveTab('open')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[14px] font-semibold transition-colors ${activeTab === 'open' ? 'bg-gray-100 border-2 border-blue-600 text-gray-900' : 'bg-gray-100 border-2 border-transparent text-gray-600 hover:bg-gray-200'}`}
          >
            Open 
            <span className="px-2 py-0.5 rounded-full bg-green-200 text-green-800 text-[12px]">30</span>
          </button>
          <button 
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[14px] font-semibold transition-colors ${activeTab === 'pending' ? 'bg-gray-100 border-2 border-blue-600 text-gray-900' : 'bg-gray-100 border-2 border-transparent text-gray-600 hover:bg-gray-200'}`}
          >
            Pending 
            <span className="px-2 py-0.5 rounded-full bg-orange-200 text-orange-800 text-[12px]">30</span>
          </button>
          <button 
            onClick={() => setActiveTab('closed')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[14px] font-semibold transition-colors ${activeTab === 'closed' ? 'bg-gray-100 border-2 border-blue-600 text-gray-900' : 'bg-gray-100 border-2 border-transparent text-gray-600 hover:bg-gray-200'}`}
          >
            Closed 
            <span className="px-2 py-0.5 rounded-full bg-green-200 text-green-800 text-[12px]">30</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
        {/* Ticket List */}
        <div className="bg-white rounded-2xl p-6 shadow-sm overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Ticket List</h3>
          
          <div className="w-full">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 pb-4 text-[13px] font-semibold text-gray-900 border-b border-gray-100">
              <div className="flex justify-center"><div className="w-4 h-4 border-2 border-gray-300 rounded-sm"></div></div>
              <div className="col-span-1">Company</div>
              <div className="col-span-2">Current Tier</div>
              <div className="col-span-1">Status</div>
            </div>
            
            {/* Table Body */}
            <div className="flex flex-col">
              {mockTickets.map((ticket) => (
                <div key={ticket.id} className="grid grid-cols-5 gap-4 py-4 text-[13px] text-gray-600 border-b border-gray-50 items-center hover:bg-gray-50/50 transition-colors cursor-pointer">
                  <div className="flex justify-center"><div className="w-4 h-4 border-2 border-gray-300 rounded-sm"></div></div>
                  <div className="col-span-1 font-medium">{ticket.company}</div>
                  <div className="col-span-2 text-gray-500">{ticket.tier}</div>
                  <div className="col-span-1 text-gray-500">{ticket.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col relative h-full">
          <div className="flex justify-between items-center pb-6 border-b border-gray-50 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tech Mo Company</h3>
            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-6 pr-2 mb-4">
            {mockChat.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'admin' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.sender === 'admin' ? 'bg-[#00d084]' : 'bg-[#40b0d3]'}`}>
                  </div>
                  <div className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                    <span className="text-[13px] font-semibold text-gray-900 mb-1">{msg.name}</span>
                    <p className={`text-[13px] leading-relaxed text-gray-500 ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                      {msg.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Input Area */}
          <div className="relative mt-auto">
            <input 
              type="text" 
              placeholder="Message..." 
              className="w-full px-5 py-3.5 bg-gray-100 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] text-gray-700 pr-14"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#a394f9] text-white flex items-center justify-center hover:bg-purple-500 transition-colors">
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals Overlay */}
      {modalState !== 'none' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          
          {/* Broadcast Modal */}
          {modalState === 'broadcast' && (
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden relative animate-in fade-in zoom-in duration-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">All Companies</h3>
                <button onClick={() => setModalState('none')} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100">
                  <X className="w-3 h-3" />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-[13px] font-semibold text-gray-900 mb-2">Announcement message</p>
                <textarea 
                  placeholder="Message" 
                  className="w-full px-4 py-3 bg-gray-200 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] resize-none h-32" 
                ></textarea>
              </div>

              <div className="mb-6">
                <p className="text-[13px] font-semibold text-gray-900 mb-3">Select platform</p>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-4 h-4 rounded-full border border-gray-400 group-hover:border-blue-500 flex items-center justify-center relative">
                      {/* Active state example: <div className="w-2 h-2 rounded-full bg-blue-600"></div> */}
                    </div>
                    <span className="text-[14px] text-gray-700">Email</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-4 h-4 rounded-full border border-gray-400 group-hover:border-blue-500 flex items-center justify-center relative"></div>
                    <span className="text-[14px] text-gray-700">Sms</span>
                  </label>
                </div>
              </div>
              
              <button 
                onClick={() => setModalState('none')}
                className="w-full bg-[#002df3] hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors text-[14px]"
              >
                Send Broadcast
              </button>
            </div>
          )}
          
        </div>
      )}
    </div>
  );
};

export default Support;
