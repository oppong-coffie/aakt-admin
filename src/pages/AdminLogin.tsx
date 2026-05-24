import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';
import { toast } from '../components/Toast';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authApi.adminLogin(email, password);
            
            // Store token and user role
            if (response.token) {
                localStorage.setItem('auth_token', response.token);
            }
            if (response.accessToken) {
                localStorage.setItem('auth_token', response.accessToken);
            }
            
            // Store user role if provided
            if (response.role) {
                localStorage.setItem('user_role', response.role);
            }
            
            // Check if admin role
            const isAdmin = response.role === 'admin' || response.isAdmin === true;
            
            if (isAdmin) {
                localStorage.setItem('is_admin', 'true');
                toast.success('Welcome, Admin!');
                navigate('/');
            } else {
                toast.error('Access denied. Admin privileges required.');
                localStorage.removeItem('auth_token');
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f5f9] dark:bg-gray-900 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Admin Portal</h1>
                    <p className="text-gray-600 dark:text-gray-400">Sign in with admin credentials</p>
                </div>

                {/* Login Form */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#002df3] hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer"
                        >
                            {loading ? 'Signing in...' : 'Sign In as Admin'}
                        </button>
                    </form>

                    {/* Back Link */}
                    <div className="text-center mt-6">
                        <Link to="/login" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold">
                            ← Back to user login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
