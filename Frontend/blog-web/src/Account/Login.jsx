import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../service/api";
import { FiBookOpen, FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import backgroundImage from "../assets/image.png";

const Login = ({ setisAuthenticated }) => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [leaving, setLeaving] = useState(false); // ✅ controls exit animation

  const [signUp, setSignUp] = useState({ username: "", email: "", password: "" });
  const [login, setLogin] = useState({ email: "", password: "" });

  const onSignUpChange = (e) => {
    setSignUp(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const onLoginChange = (e) => {
    setLogin(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const toggle = () => {
    setError("");
    setShowPassword(false);
    setIsLogin(prev => !prev);
  };

  // ✅ shared helper — plays exit animation then runs a callback
  const animateAndLeave = (callback) => {
    setLeaving(true);
    setTimeout(callback, 300);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      const response = await API.userSignup(signUp);

      if (response?.isSuccess) {
        const accessToken = response.data?.accessToken;
        const user = response.data?.user;

        if (accessToken && user) {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("user", JSON.stringify(user));
          setSignUp({ username: "", email: "", password: "" });

          // ✅ exit animation then navigate
          animateAndLeave(() => {
            setisAuthenticated(true);
            navigate("/", { replace: true });
          });
        } else {
          setError("Signup successful but login data missing");
        }
      } else {
        setError(response?.msg || "User already exists");
      }

    } catch (err) {
      if (err?.response?.status === 409) {
        setError("User already exists. Please login.");
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      const response = await API.userLogin(login);

      if (response?.isSuccess) {
        const accessToken = response.data?.accessToken;
        const user = response.data?.user;

        if (!accessToken || !user) {
          setError("Login failed. Please try again.");
          return;
        }

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));

        animateAndLeave(() => {
          setisAuthenticated(true);
          navigate("/", { replace: true });
        });

      } else {
        setError(response?.msg || "Invalid email or password");
      }

    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${leaving ? "animate-page-out" : "animate-page-in"} relative min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] font-sans px-4 py-8`}>

      <div
        className="absolute inset-0 z-0 bg-cover bg-center brightness-[0.25]"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      <div className="relative z-10 w-full max-w-md bg-[#111827]/40 backdrop-blur-2xl border border-white/5 rounded-[2.2rem] p-8 shadow-2xl overflow-hidden">

        <div className="absolute -top-20 -left-20 w-56 h-56 bg-blue-600/10 blur-[90px] rounded-full" />

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 mb-4">
            <FiBookOpen className="h-7 w-7 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">ScribleSpace</h1>
          <p className="text-gray-400 text-sm mt-1">Publish your passion.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-xs font-bold uppercase tracking-widest text-center">
              {error}
            </p>
          </div>
        )}

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email" name="email" value={login.email}
                onChange={onLoginChange} required placeholder="Email address"
                className="w-full bg-black/40 border border-white/5 text-white rounded-xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-600/40 transition"
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                name="password" value={login.password}
                onChange={onLoginChange} required placeholder="Password"
                className="w-full bg-black/40 border border-white/5 text-white rounded-xl pl-12 pr-12 py-3.5 outline-none focus:ring-2 focus:ring-blue-600/40 transition"
              />
              <button type="button" onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition">
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white hover:bg-blue-500 transition active:scale-[0.99] shadow-lg disabled:opacity-50">
              {loading ? "Signing In..." : "Sign In to Account"}
            </button>

            <div className="text-center text-sm text-gray-500 m-2 p-1">
              <span>New to ScribleSpace?</span>
              <button type="button" onClick={toggle}
                className="ml-2 text-blue-500 font-bold hover:text-blue-400 underline-offset-4 hover:underline m-2">
                Create Account
              </button>
            </div>
          </form>

        ) : (

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text" name="username" value={signUp.username}
                onChange={onSignUpChange} required placeholder="Username"
                className="w-full bg-black/40 border border-white/5 text-white rounded-xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-600/40 transition"
              />
            </div>

            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email" name="email" value={signUp.email}
                onChange={onSignUpChange} required placeholder="Email"
                className="w-full bg-black/40 border border-white/5 text-white rounded-xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-600/40 transition"
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                name="password" value={signUp.password}
                onChange={onSignUpChange} required placeholder="Password"
                className="w-full bg-black/40 border border-white/5 text-white rounded-xl pl-12 pr-12 py-3.5 outline-none focus:ring-2 focus:ring-blue-600/40 transition"
              />
              <button type="button" onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition">
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white hover:bg-blue-500 transition active:scale-[0.99] disabled:opacity-50">
              {loading ? "Processing..." : "Start Your Journey"}
            </button>

            <div className="text-center text-sm text-gray-500 m-2">
              <span>Already a member?</span>
              <button type="button" onClick={toggle}
                className="ml-2 text-blue-500 font-bold hover:text-blue-400 underline-offset-4 hover:underline m-2">
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;