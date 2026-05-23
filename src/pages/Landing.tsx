import { useNavigate } from 'react-router-dom';
import { Cpu, ArrowRight, ShieldCheck } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="h-screen w-screen overflow-hidden bg-gray-950 text-gray-100 font-sans relative flex flex-col justify-between"
      style={{
        backgroundImage: `linear-gradient(rgba(9, 11, 17, 0.75), rgba(9, 11, 17, 0.85)), url('/hero_bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      
      {/* Immersive Mesh Blur spots for extra depth */}
      <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navigation Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#002df3] to-purple-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">AAKT</span>
            <span className="text-[11px] font-semibold text-blue-500 block leading-none">ADMIN CONTROL</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          SYSTEMS NOMINAL
        </div>
      </header>

      {/* Hero Content (Centered) */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-6 text-center">
        
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[12px] font-medium text-gray-300 mb-8 backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span>V1.0.0 Production Control Portal</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Orchestrate Your <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-450 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Enterprise Operations
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-sm sm:text-md md:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          The unified administration console for AAKT. Track real-time server telemetry, organize company portfolios, model phases, and manage operational workloads inside an integrated environment.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto">
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#002df3] hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl text-[14px] transition-all shadow-lg hover:shadow-blue-900/30 hover:scale-[1.02] cursor-pointer"
          >
            Enter Control Room
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold px-8 py-3.5 rounded-xl text-[14px] transition-all backdrop-blur-md hover:scale-[1.02] cursor-pointer"
          >
            Register Account
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-white/[0.05] flex justify-between items-center text-[12px] text-gray-500">
        <span>© 2026 AAKT operations console.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-300 transition-colors">Documentation</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Support</a>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
