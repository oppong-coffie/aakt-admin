import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { authApi } from '../services/api';
import { toast } from '../components/Toast';

const Register = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'register' | 'otp'>('register');
    const [otpData, setOtpData] = useState({ email: '', otp: '' });
    const [otpLoading, setOtpLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            toast.error('Name is required');
            return;
        }
        if (!formData.email.trim()) {
            toast.error('Email is required');
            return;
        }
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            if (isAdmin) {
                // Admin registration - no OTP needed
                await authApi.adminRegister(formData.name, formData.email, formData.password);
                toast.success('Admin account created successfully! Please login.');
                navigate('/login');
            } else {
                // User registration - requires OTP
                const response = await authApi.register(formData.email, formData.password, formData.name);

                // Store token in localStorage so subsequent auth requests (like sendOtp) succeed
                if (response && (response.token || response.accessToken)) {
                    localStorage.setItem('auth_token', response.token || response.accessToken);
                }

                // Send OTP to email
                await authApi.sendOtp(formData.email);
                setOtpData({ email: formData.email, otp: '' });
                setStep('otp');
                toast.success('Registration successful! Please check your email for OTP.');
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!otpData.otp.trim()) {
            toast.error('OTP is required');
            return;
        }

        setOtpLoading(true);
        try {
            const response = await authApi.verifyOtp(otpData.otp);
            // Store token if provided
            if (response.token) {
                localStorage.setItem('auth_token', response.token);
            }
            if (response.accessToken) {
                localStorage.setItem('auth_token', response.accessToken);
            }
            toast.success('Email verified successfully!');
            // Navigate to dashboard
            navigate('/');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'OTP verification failed. Please try again.');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        // This would integrate with Google OAuth
        // For now, showing a placeholder
        toast.info('Google registration will be available soon');
    };

    if (step === 'otp') {
        return (
            <div className="min-h-screen flex bg-white dark:bg-gray-900">
                {/* Left Side - Image */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    <img 
                        src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=800&fit=crop" 
                        alt="Workspace" 
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 to-black/95"></div>
                    
                    <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
                        <div className="max-w-md">
                            <div className="mb-8">
                                <h1 className="text-5xl font-bold mb-4">Verify Email</h1>
                                <p className="text-xl text-blue-100">Enter the OTP sent to your email to complete registration</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - OTP Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
                    <div className="w-full max-w-md">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Check Your Email</h2>
                            <p className="text-gray-600 dark:text-gray-400">We sent a 6-digit code to {otpData.email}</p>
                        </div>

                        <form onSubmit={handleVerifyOtp} className="space-y-5">
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    One-Time Password
                                </label>
                                <input
                                    id="otp"
                                    type="text"
                                    value={otpData.otp}
                                    onChange={(e) => setOtpData(prev => ({ ...prev, otp: e.target.value }))}
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={otpLoading}
                                className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer"
                            >
                                {otpLoading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
                                Didn't receive code?{' '}
                                <button
                                    onClick={() => {
                                        setOtpLoading(true);
                                        authApi.sendOtp(otpData.email).finally(() => setOtpLoading(false));
                                    }}
                                    className="text-gray-900 hover:text-black font-semibold"
                                >
                                    Resend OTP
                                </button>
                            </p>
                        </div>

                        <div className="mt-8 space-y-3">
                            <button
                                onClick={() => setStep('register')}
                                className="w-full text-center text-gray-900 hover:text-black font-semibold"
                            >
                                ← Back to Registration
                            </button>
                            <button
                                onClick={() => navigate('/landing')}
                                className="w-full text-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Image */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=800&fit=crop" 
                    alt="Workspace" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 to-black/95"></div>
                
                <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
                    <div className="max-w-md">
                        <div className="mb-8">
                            <h1 className="text-5xl font-bold mb-4">
                                {isAdmin ? 'Admin Portal' : 'Join AAKT'}
                            </h1>
                            <p className="text-xl text-blue-100">
                                {isAdmin 
                                    ? 'Create admin account to manage the platform' 
                                    : 'Create your account and start managing your business efficiently'}
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <span className="text-blue-50">Quick Setup in Minutes</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <span className="text-blue-50">Secure & Private</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </div>
                                <span className="text-blue-50">Powerful Dashboard</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            {isAdmin ? 'Create Admin Account' : 'Create Account'}
                        </h2>
                        <p className="text-gray-600">
                            {isAdmin ? 'Register with admin credentials' : 'Join AAKT and start managing your business'}
                        </p>
                    </div>

                    {/* Toggle Switch */}
                    <div className="mb-8 p-1 bg-gray-100 rounded-xl">
                        <div className="grid grid-cols-2 gap-1">
                            <button
                                type="button"
                                onClick={() => setIsAdmin(false)}
                                className={`py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                                    !isAdmin 
                                        ? 'bg-white text-gray-900 shadow-sm' 
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                User Register
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAdmin(true)}
                                className={`py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                                    isAdmin 
                                        ? 'bg-white text-gray-900 shadow-sm' 
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Admin Register
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder={isAdmin ? "Admin User" : "John Doe"}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder={isAdmin ? "admin@example.com" : "you@example.com"}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Register Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors mt-6 cursor-pointer"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-center text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-gray-900 hover:text-black font-semibold">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Terms */}
                    <p className="mt-6 text-center text-xs text-gray-600">
                        By registering, you agree to our{' '}
                        <a href="#" className="text-gray-900 hover:text-black font-semibold">
                            Terms of Service
                        </a>
                        {' '}and{' '}
                        <a href="#" className="text-gray-900 hover:text-black font-semibold">
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
