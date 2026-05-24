import { useState, useRef, useEffect } from 'react';
import { Search, Filter, ChevronDown, Plus, MoreHorizontal, User, Ban, X, Check } from 'lucide-react';
import { adminApi, authApi } from '../services/api';

interface UserItem {
  _id: string;
  fullName?: string;
  name?: string;
  email: string;
  role?: string;
  createdAt?: string;
}

const Users = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeActionRow, setActiveActionRow] = useState<string | null>(null);
  const [modalState, setModalState] = useState<'none' | 'create' | 'success'>('none');
  
  // Data State
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAllUsers();
      const list = Array.isArray(res) ? res : (res?.users || res?.data || []);
      setUsers(list);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (type: 'create') => {
    setModalState(type);
    setActiveActionRow(null);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) return;

    try {
      setCreating(true);
      await authApi.register(formData.email, formData.password, formData.name);
      setModalState('success');
      setFormData({ name: '', email: '', password: '' });
      fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to register new user');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await authApi.deleteUser(userId);
      setActiveActionRow(null);
      fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u => {
    const name = u.fullName || u.name || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="p-8 bg-white min-h-full">
      <div className="mb-6">
        <h1 className="text-[28px] font-semibold text-gray-900 mb-6">Users</h1>
        
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="search by name or email..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-[260px] shadow-sm text-[14px] text-gray-800"
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
                  {['Admin', 'User'].map((opt) => (
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
            Create New User
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 min-h-[500px]">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">List of users</h3>
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="w-full overflow-x-auto">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 pb-4 text-[13px] font-semibold text-gray-900 border-b border-gray-200 min-w-[600px]">
              <div>Name</div>
              <div>Email</div>
              <div>Role</div>
              <div>Date Joined</div>
              <div className="text-right">Action</div>
            </div>
            
            {/* Table Body */}
            <div className="flex flex-col min-w-[600px]">
              {filteredUsers.map((u) => (
                <div key={u._id} className="grid grid-cols-5 gap-4 py-4 text-[13px] text-gray-600 border-b border-gray-100 relative items-center hover:bg-gray-50 transition-colors">
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    {u.fullName || u.name || 'N/A'}
                  </div>
                  <div>{u.email}</div>
                  <div className="capitalize">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      u.role === 'admin' 
                        ? 'bg-purple-50 text-purple-600' 
                        : 'bg-blue-50 text-blue-600'
                    }`}>
                      {u.role || 'user'}
                    </span>
                  </div>
                  <div>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</div>
                  <div className="relative text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveActionRow(activeActionRow === u._id ? null : u._id);
                      }}
                      className="inline-flex w-8 h-6 bg-[#002df3] text-white rounded-md items-center justify-center hover:bg-blue-700 cursor-pointer"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    
                    {activeActionRow === u._id && (
                      <div ref={actionRef} className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-20 text-left">
                        <button 
                          onClick={() => handleDeleteUser(u._id)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Ban className="w-4 h-4 text-red-400" />
                          Delete User
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
            <User className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-gray-500">No users found.</p>
          </div>
        )}
      </div>

      {/* Modals Overlay */}
      {modalState !== 'none' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          
          {/* Create User Modal */}
          {modalState === 'create' && (
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
              <form onSubmit={handleCreateUser} className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Create New User</h3>
                  <button type="button" onClick={() => setModalState('none')} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-gray-500">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] text-gray-900" 
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-gray-500">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] text-gray-900" 
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-gray-500">Initial Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      required
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] text-gray-900" 
                    />
                  </div>
                </div>
                
                <button 
                  type="submit"
                  disabled={creating}
                  className="w-full mt-6 bg-[#002df3] hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-medium transition-colors text-[14px] cursor-pointer"
                >
                  {creating ? 'Registering...' : 'Create New User'}
                </button>
              </form>
            </div>
          )}

          {/* Success Modal */}
          {modalState === 'success' && (
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden relative p-8 flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 bg-[#d1f5d3] rounded-full flex items-center justify-center mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-6 leading-snug">
                You have created new<br/>user successfully
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

export default Users;
