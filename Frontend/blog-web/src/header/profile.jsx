import { useEffect, useState, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataProvider";
import { FiLogOut } from "react-icons/fi";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const { account, setAccount } = useContext(DataContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setAccount(null);
    localStorage.removeItem("user");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    navigate("/login");
  };

  const avatarLetter = account?.username ? account.username.charAt(0).toUpperCase() : "U";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center font-semibold hover:ring-2 hover:ring-blue-500 transition"
      >
        {avatarLetter}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-gray-800 rounded-xl shadow-xl border border-gray-700 z-50 transition-all duration-200 overflow-hidden">
          {/* User Info */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center font-semibold text-gray-700 text-lg shadow-sm">
                {avatarLetter}
              </div>
              <div className="flex flex-col">
                <span className="text-white font-semibold truncate">
                  {account?.username || "Guest User"}
                </span>
                <span className="text-gray-300 text-sm truncate">
                  {account?.email || "guest@email.com"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col divide-y divide-gray-700">
            {account ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-blue-500 hover:bg-gray-700 transition font-medium"
              >
                <FiLogOut className="text-blue-500" /> Logout
              </button>
            ) : (
              <Link to="/login">
                <button className="w-full px-4 py-3 text-left text-gray-200 hover:bg-gray-700 transition font-medium flex items-center gap-3">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
