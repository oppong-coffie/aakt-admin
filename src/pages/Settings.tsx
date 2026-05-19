import { useState } from 'react';
import { UserPlus, X } from 'lucide-react';

const Settings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-8 bg-[#f4f5f9] min-h-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[28px] font-semibold text-gray-900">Settings</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#002df3] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[14px] font-medium transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm">
        {/* Profile Banner */}
        <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-pink-200 flex-shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 leading-tight">Arise Company</h2>
            <p className="text-[14px] text-gray-500 mt-0.5">Head Office, Accra</p>
          </div>
        </div>

        {/* Company Information */}
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Company Information</h3>
        
        <div className="border border-gray-200 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-8">
            <div className="flex flex-col gap-2">
              <span className="text-[13px] text-gray-400 font-medium">Business Name</span>
              <span className="text-[14px] font-medium text-gray-900">Arise</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[13px] text-gray-400 font-medium">Role</span>
              <span className="text-[14px] font-medium text-gray-900">Super Admin</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[13px] text-gray-400 font-medium">Access</span>
              <span className="text-[14px] font-medium text-gray-900">Full Access</span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[13px] text-gray-400 font-medium">Business Email</span>
              <span className="text-[14px] font-medium text-gray-900">Abena@gmail.com</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[13px] text-gray-400 font-medium">Address</span>
              <span className="text-[14px] font-medium text-gray-900">23st Accra, Ghana</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[13px] text-gray-400 font-medium">Phone</span>
              <span className="text-[14px] font-medium text-gray-900">+233 349539-39247</span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[13px] text-gray-400 font-medium">City</span>
              <span className="text-[14px] font-medium text-gray-900">Accra</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[13px] text-gray-400 font-medium">Country</span>
              <span className="text-[14px] font-medium text-gray-900">Ghana</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden relative animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add User</h3>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex flex-col gap-4">
                <input 
                  type="text" 
                  placeholder="Full name" 
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[14px] placeholder-gray-400" 
                />
                <input 
                  type="text" 
                  placeholder="Role" 
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[14px] placeholder-gray-400" 
                />
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[14px] placeholder-gray-400" 
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[14px] placeholder-gray-400" 
                />
              </div>
              
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full mt-6 bg-[#002df3] hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors text-[14px]"
              >
                Add user
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
