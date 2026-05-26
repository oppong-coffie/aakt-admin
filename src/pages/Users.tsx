import { useEffect, useMemo, useState } from 'react';
import { Search, User } from 'lucide-react';
import { adminApi } from '../services/api';

type UserItem = {
  _id?: string;
  id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  role?: string;
  createdAt?: string;
};

type UsersResponse = {
  users?: UserItem[];
  data?: UserItem[];
};

const getUserList = (response: unknown): UserItem[] => {
  if (Array.isArray(response)) {
    return response as UserItem[];
  }

  if (response && typeof response === 'object') {
    const payload = response as UsersResponse;
    return payload.users || payload.data || [];
  }

  return [];
};

const Users = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    try {
      const response: unknown = await adminApi.getAllUsers();
      setUsers(getUserList(response));
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchUsers();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return users;

    return users.filter((user) => {
      const name = user.fullName || user.name || '';
      const email = user.email || '';
      const role = user.role || '';
      return (
        name.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        role.toLowerCase().includes(query)
      );
    });
  }, [users, searchQuery]);

  return (
    <div className="p-8 bg-white min-h-full">
      <div className="mb-6">
        <h1 className="text-[28px] font-semibold text-gray-900 mb-6">Users</h1>

        <div className="flex items-center mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="search by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-[300px] shadow-sm text-[14px] text-gray-800"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 min-h-[500px]">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">List of users</h3>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <div className="grid grid-cols-4 gap-4 pb-4 text-[13px] font-semibold text-gray-900 border-b border-gray-200 min-w-[620px]">
              <div>Name</div>
              <div>Email</div>
              <div>Role</div>
              <div>Date Joined</div>
            </div>

            <div className="flex flex-col min-w-[620px]">
              {filteredUsers.map((user, index) => (
                <div
                  key={user._id || user.id || user.email || index}
                  className="grid grid-cols-4 gap-4 py-4 text-[13px] text-gray-600 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    {user.fullName || user.name || 'N/A'}
                  </div>
                  <div>{user.email || 'N/A'}</div>
                  <div className="capitalize">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        user.role === 'admin'
                          ? 'bg-purple-50 text-purple-600'
                          : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {user.role || 'user'}
                    </span>
                  </div>
                  <div>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</div>
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
    </div>
  );
};

export default Users;
