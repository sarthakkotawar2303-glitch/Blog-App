import { useEffect, useState, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataProvider";
import { FiLogOut } from "react-icons/fi";

const Profile = ({ setisAuthenticated }) => {
  const [open, setOpen] = useState(false);
  const { account, setAccount } = useContext(DataContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && !account?.username) {
      setAccount(JSON.parse(storedUser));
    }
  }, [account, setAccount]);

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
    const wrapper = document.getElementById("page-wrapper");
    if (wrapper) {
      wrapper.classList.remove("animate-page-in");
      wrapper.classList.add("animate-page-out");
    }

    setTimeout(() => {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      setAccount({ id: "", username: "", email: "" });
      setisAuthenticated(false);
      navigate("/login", { replace: true });
    }, 300);
  };

  const avatarLetter = account?.username
    ? account.username.charAt(0).toUpperCase()
    : account?.email
    ? account.email.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="relative" ref={dropdownRef}>

      <button onClick={() => setOpen(!open)} className="rounded-full">
        {avatarLetter}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-gray-800 rounded-xl shadow-xl border border-gray-700 z-50 overflow-hidden">

          <div className="flex items-center gap-3 p-4 border-b border-gray-700">
            <div className="w-12 h-12 flex items-center justify-center rounded-full
                            bg-gradient-to-r from-blue-600 to-indigo-600
                            text-white font-bold text-lg shadow">
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

          <div className="flex flex-col divide-y divide-gray-700">
            {account?.username ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-blue-400 hover:bg-gray-700 transition font-medium"
              >
                <FiLogOut /> Logout
              </button>
            ) : (
              <Link to="/login">
  <button className="w-full px-4 py-3 text-left text-gray-200 transition-colors duration-300 hover:bg-gray-800 font-medium">
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