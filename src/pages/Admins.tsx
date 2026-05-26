import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, ShieldCheck, X } from 'lucide-react';
import { adminApi } from '../services/api';
import { toast } from '../components/Toast';

type AdminItem = {
  _id?: string;
  id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  role?: string;
  isAdmin?: boolean;
  is_admin?: boolean;
  createdAt?: string;
};

type AdminsResponse = {
  admins?: AdminItem[];
  users?: AdminItem[];
  data?: AdminItem[];
};

const getAdminList = (response: unknown): AdminItem[] => {
  if (Array.isArray(response)) {
    return response as AdminItem[];
  }

  if (response && typeof response === 'object') {
    const payload = response as AdminsResponse;
    return payload.admins || payload.users || payload.data || [];
  }

  return [];
};

const isAdminAccount = (admin: AdminItem) =>
  admin.role === 'admin' || admin.isAdmin === true || admin.is_admin === true;

const Admins = () => {
  const [admins, setAdmins] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const fetchAdmins = async () => {
    try {
      const response: unknown = await adminApi.getAllAdmins();
      setAdmins(getAdminList(response).filter(isAdminAccount));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchAdmins();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const filteredAdmins = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return admins;

    return admins.filter((admin) => {
      const name = admin.fullName || admin.name || '';
      const email = admin.email || '';
      return name.toLowerCase().includes(query) || email.toLowerCase().includes(query);
    });
  }, [admins, searchQuery]);

  const handleCreateAdmin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error('Please fill in all admin fields');
      return;
    }

    try {
      setCreating(true);
      await adminApi.register(formData.email.trim(), formData.password, formData.name.trim());
      toast.success('Admin created successfully');
      setFormData({ name: '', email: '', password: '' });
      setShowCreateModal(false);
      await fetchAdmins();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create admin');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-8 bg-white min-h-full">
      <div className="mb-6">
        <h1 className="text-[28px] font-semibold text-gray-900 mb-6">Admins</h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="search by name or email..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-9 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-[280px] shadow-sm text-[14px] text-gray-800"
            />
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[14px] font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Admin
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 min-h-[500px]">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">List of admins</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
            </div>
          ) : filteredAdmins.length > 0 ? (
            <div className="w-full overflow-x-auto">
              <div className="grid grid-cols-4 gap-4 pb-4 text-[13px] font-semibold text-gray-900 border-b border-gray-200 min-w-[620px]">
                <div>Name</div>
                <div>Email</div>
                <div>Role</div>
                <div>Date Joined</div>
              </div>

              <div className="flex flex-col min-w-[620px]">
                {filteredAdmins.map((admin, index) => (
                  <div
                    key={admin._id || admin.id || admin.email || index}
                    className="grid grid-cols-4 gap-4 py-4 text-[13px] text-gray-600 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-purple-500" />
                      {admin.fullName || admin.name || 'N/A'}
                    </div>
                    <div>{admin.email || 'N/A'}</div>
                    <div className="capitalize">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 text-purple-600">
                        {admin.role || 'admin'}
                      </span>
                    </div>
                    <div>{admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShieldCheck className="w-12 h-12 text-gray-300 mb-2" />
              <p className="text-gray-500">No admins found.</p>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Create Admin</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin}>
              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="admin-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="admin-name"
                    type="text"
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                    placeholder="Admin name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    value={formData.email}
                    onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                    placeholder="admin@example.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    value={formData.password}
                    onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                    placeholder="Password"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  {creating ? 'Creating...' : 'Create Admin'}
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

export default Admins;
