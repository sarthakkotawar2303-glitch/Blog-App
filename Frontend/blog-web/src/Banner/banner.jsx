import { Link } from "react-router-dom";
import bannerImage from '../assets/bannerImage.png';

const Banner = () => {
  return (
    <section className="w-full py-12 px-6 flex items-center justify-center">
      <div className="relative w-full max-w-7xl overflow-hidden rounded-[3.5rem] bg-[#0b0f1a] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[3000ms] hover:scale-105 opacity-40"
          style={{ backgroundImage: `url(${bannerImage})` }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f1a]/60 via-[#0b0f1a]/80 to-[#0b0f1a]/60" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center py-24 px-10 md:px-24 mx-auto max-w-4xl">
          
          <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter mb-8">
            Share Your Story <br /> With The World
          </h1>

          <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed mb-12 opacity-80 max-w-2xl">
            A decentralized ecosystem where your insights connect with a global audience of innovators. Turn your words into impact today.
          </p>

          <Link to={'/create'}>
            <button className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase text-[12px] tracking-widest rounded-full transition-all duration-300 shadow-xl shadow-blue-900/40 hover:scale-105 active:scale-95">
              Start Writing
            </button>
          </Link>
        </div>

        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>
    </section>
  );
};

export default Banner;
