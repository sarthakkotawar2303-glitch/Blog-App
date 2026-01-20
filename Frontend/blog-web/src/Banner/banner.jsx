import { Link } from "react-router-dom";

const Banner = () => {
  const imageUrl =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBjcc0etEoEnQFGfogr1ySkkV3Vatwvi8qCg&s";

  return (
    <div className="relative w-full h-[45vh] md:h-[70vh] lg:h-[80vh]">
      {/* Background Image */}
      <img
        src={imageUrl}
        alt="Blog Banner"
        className="w-full h-full object-cover brightness-90"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70"></div>

      {/* Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-12">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg mb-4 animate-fadeIn">
          Share Your Story With The World
        </h1>

        <p className="text-base md:text-lg lg:text-xl text-gray-200 max-w-2xl mb-6 animate-fadeIn delay-200">
          Write. Publish. Inspire. Connect with readers and express your ideas.
        </p>

      <Link to={'/create'}>
       <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
          Start Writing
        </button>
      </Link>
      </div>
    </div>
  );
};

export default Banner;
