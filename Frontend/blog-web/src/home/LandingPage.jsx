import { Link } from "react-router-dom";
import backgroundImage from '../assets/backgroundImage.png';
import { FiArrowRight, FiFeather, FiBookOpen } from "react-icons/fi";

const LandingPage = () => {
  return (
    <div 
      className="animate-page-in min-h-screen bg-fixed bg-cover bg-center flex flex-col relative overflow-hidden"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f1a]/80 via-[#0b0f1a]/60 to-[#0b0f1a]/90 z-0"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-grow px-6 py-20 text-center">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-sm font-semibold tracking-wide uppercase">Welcome to the future of blogging</span>
        </div>

        {/* Hero Text */}
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter max-w-4xl leading-[1.1] mb-6">
          Share your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">ideas</span> with the world.
        </h1>
        
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-12 leading-relaxed">
          Join a community of writers and thinkers. Read captivating stories, share your own knowledge, and engage with beautiful, modern content.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            to="/login"
            className="group relative flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:-translate-y-1 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.7)]"
          >
            Start Your Journey
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            to="/login"
            className="group flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 backdrop-blur-md"
          >
            Explore Blogs
          </Link>
        </div>

      </div>

      {/* Feature Highlights Grid at bottom */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-6 px-6 pb-20 opacity-80">
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-6 rounded-3xl flex items-center gap-4 hover:bg-slate-900/60 transition-colors">
          <div className="p-4 bg-blue-500/20 text-blue-400 rounded-2xl">
            <FiFeather size={24} />
          </div>
          <div className="text-left">
            <h3 className="text-white font-bold text-lg">Write Beautifully</h3>
            <p className="text-slate-400 text-sm">Craft your stories with our modern editor.</p>
          </div>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-6 rounded-3xl flex items-center gap-4 hover:bg-slate-900/60 transition-colors">
          <div className="p-4 bg-indigo-500/20 text-indigo-400 rounded-2xl">
            <FiBookOpen size={24} />
          </div>
          <div className="text-left">
            <h3 className="text-white font-bold text-lg">Read Endlessly</h3>
            <p className="text-slate-400 text-sm">Discover content curated just for you.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
