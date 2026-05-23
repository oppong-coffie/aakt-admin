import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex flex-col items-center justify-center px-6">
            <div className="max-w-2xl text-center">
                <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                    AAKT Admin
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12">
                    Powerful admin dashboard for managing your business with ease
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                    <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="px-8 py-4 border-2 border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-semibold rounded-lg transition-colors"
                    >
                        Create Account
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <div className="text-3xl mb-3">📊</div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Analytics</h3>
                        <p className="text-gray-600 dark:text-gray-400">Real-time insights into your business metrics</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <div className="text-3xl mb-3">👥</div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Users</h3>
                        <p className="text-gray-600 dark:text-gray-400">Manage and monitor user activity effortlessly</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <div className="text-3xl mb-3">⚙️</div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Settings</h3>
                        <p className="text-gray-600 dark:text-gray-400">Configure your preferences and system options</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
