import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';
import { toast } from '../components/Toast';

const Login = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = isAdmin 
                ? await authApi.adminLogin(email, password)
                : await authApi.login(email, password);
            
            // Store token if provided
            if (response.token) {
                localStorage.setItem('auth_token', response.token);
            }
            if (response.accessToken) {
                localStorage.setItem('auth_token', response.accessToken);
            }
            
            // If admin login, check role
            if (isAdmin) {
                const isAdminUser = response.role === 'admin' || response.isAdmin === true;
                if (isAdminUser) {
                    localStorage.setItem('is_admin', 'true');
                    toast.success('Welcome, Admin!');
                    navigate('/');
                } else {
                    toast.error('Access denied. Admin privileges required.');
                    localStorage.removeItem('auth_token');
                }
            } else {
                toast.success('Welcome back!');
                navigate('/');
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white dark:bg-gray-900">
            {/* Left Side - Image/Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
                    <div className="max-w-md">
                        <div className="mb-8">
                            <h1 className="text-5xl font-bold mb-4">AAKT Admin</h1>
                            <p className="text-xl text-blue-100">
                                {isAdmin 
                                    ? 'Manage your platform with powerful admin tools' 
                                    : 'Access your dashboard and manage your workloads'}
                            </p>
                        </div>
                        
                        {/* Feature List */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <span className="text-blue-50">Fast & Secure Access</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <span className="text-blue-50">Enterprise-Grade Security</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </div>
                                <span className="text-blue-50">Comprehensive Dashboard</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {isAdmin ? 'Admin Portal' : 'Welcome Back'}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            {isAdmin ? 'Sign in with admin credentials' : 'Sign in to your account'}
                        </p>
                    </div>

                    {/* Toggle Switch */}
                    <div className="mb-8 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                        <div className="grid grid-cols-2 gap-1">
                            <button
                                type="button"
                                onClick={() => setIsAdmin(false)}
                                className={`py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                                    !isAdmin 
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                User Login
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAdmin(true)}
                                className={`py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                                    isAdmin 
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                Admin Login
                            </button>
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
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
                                placeholder={isAdmin ? "admin@example.com" : "you@example.com"}
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

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                Forgot password?
                            </a>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#002df3] hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer"
                        >
                            {loading ? 'Signing in...' : (isAdmin ? 'Sign In as Admin' : 'Sign In')}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-center space-y-3">
                            {!isAdmin && (
                                <p className="text-gray-600 dark:text-gray-400">
                                    Don't have an account?{' '}
                                    <Link to="/register" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold">
                                        Sign up
                                    </Link>
                                </p>
                            )}
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                <Link to="/landing" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold">
                                    ← Back to home
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
