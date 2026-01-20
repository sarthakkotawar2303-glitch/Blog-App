import { Link, useNavigate } from "react-router-dom";
import Profile from "./profile";
import { FiBookOpen } from "react-icons/fi";

const Header = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-gray-900 shadow-md">
      {/* Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
        <FiBookOpen size={42} className="text-blue-600 hover:text-blue-400 transition" />
        <h1 className="text-1.5xl font-Lora font-bold text-white tracking-wide hover:text-green-400 transition">
          ScribleSpace
        </h1>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-8">
        <Link to="/" className="no-underline">
          <span className="text-gray-300 hover:text-green-400 font-medium cursor-pointer transition">
            Home
          </span>
        </Link>

        <Link to="/myPosts" className="no-underline">
          <span className="text-gray-300 hover:text-blue-400 font-medium cursor-pointer transition">
            My Posts
          </span>
        </Link>

        {/* Profile Menu */}
        <Profile />
      </div>
    </nav>
  );
};

export default Header;
