import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { authApi } from '../services/api';
import { toast } from '../components/Toast';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authApi.adminLogin(email, password);
            const account = response.data || response.user || response.admin || null;
            const token = response.token || response.accessToken || account?.token || account?.accessToken;
            const role = response.role || account?.role;
            const isAdmin =
                role === 'admin' ||
                response.isAdmin === true ||
                response.is_admin === true ||
                account?.isAdmin === true ||
                account?.is_admin === true;

            if (!token) {
                throw new Error('Admin login succeeded, but no access token was returned.');
            }

            if (role && role !== 'admin' && !isAdmin) {
                throw new Error('Access denied. Admin privileges required.');
            }

            localStorage.setItem('auth_token', token);
            localStorage.setItem('is_admin', 'true');
            localStorage.setItem('user_role', 'admin');

            if (account) {
                localStorage.setItem('user', JSON.stringify(account));
            }
            if (account?.email || email) {
                localStorage.setItem('user_email', account?.email || email);
            }

            toast.success('Welcome, Admin!');
            navigate('/');
        } catch (err) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('is_admin');
            localStorage.removeItem('user_role');
            toast.error(err instanceof Error ? err.message : 'Admin login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f6f6f7] flex items-center justify-center px-5 py-10">
            <div className="w-full max-w-[402px] rounded-2xl border border-gray-200 bg-white px-5 py-5 shadow-[0_1px_3px_rgba(15,23,42,0.12)]">
                <div className="flex justify-center mb-4">
                    <div className="rounded-md bg-[#2563ff] px-2.5 py-1 text-white text-lg font-bold leading-6">
                        AAKT
                    </div>
                </div>

                <h1 className="text-center text-xl font-bold text-black mb-3">Welcome</h1>

                <p className="text-center text-sm text-gray-500 mb-8">
                    Don't have an account?{' '}
                    <button
                        type="button"
                        onClick={() => toast.error('Ask an existing admin to create an account.')}
                        className="font-medium text-[#003cff] hover:text-blue-700"
                    >
                        Sign Up
                    </button>
                </p>

                <form onSubmit={handleLogin}>
                    <div className="space-y-3">
                        <div className="relative">
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                                className="h-[30px] w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                className="h-[30px] w-full rounded-lg border border-gray-300 bg-white px-3 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 my-7 text-xs text-gray-300">
                        <div className="h-px flex-1 bg-gray-200"></div>
                        <span>Or</span>
                        <div className="h-px flex-1 bg-gray-200"></div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="h-9 w-full rounded-lg bg-[#aab8fb] text-white text-base font-bold transition-colors hover:bg-[#92a3fb] disabled:cursor-not-allowed disabled:bg-[#b8c4fb]"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-6 text-center text-[10px] text-gray-400">
                    By continuing, you agree with our{' '}
                    <span className="font-medium text-[#003cff]">Terms &amp; Services</span>
                    {' '}and{' '}
                    <span className="font-medium text-[#003cff]">Privacy Policy</span>.
                </p>
            </div>
        </div>
    );
};

export default Login;
