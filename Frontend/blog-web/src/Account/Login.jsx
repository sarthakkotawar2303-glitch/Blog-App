import { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { API } from "../service/api";
import { DataContext } from "../context/DataProvider";
import { setAccessToken } from "../utils/common-utils";
import { FiBookOpen } from "react-icons/fi";

const Login = ({ setisAuthenticated }) => {
  const navigate = useNavigate();
  const context = useContext(DataContext);

  const signUpInitialValues = { username: "", email: "", password: "" };
  const loginInitialValues = { email: "", password: "" };

  const [signUp, setSignUp] = useState(signUpInitialValues);
  const [login, setLogin] = useState(loginInitialValues);
  const [isLogin, setIsLogin] = useState('login');
  const [error, setError] = useState('');

  // Handlers
  const onSignUpChange = (e) => setSignUp({ ...signUp, [e.target.name]: e.target.value });
  const onLoginChange = (e) => setLogin({ ...login, [e.target.name]: e.target.value });

  const toggle = () => {
    setSignUp(signUpInitialValues);
    setLogin(loginInitialValues);
    setIsLogin(!isLogin);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const response = await API.userSignup(signUp);
    if (response.isSuccess) {
      setError('');
      setSignUp(signUpInitialValues);
      setIsLogin('login');
    } else {
      setError('Something went wrong! Please try');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await API.userLogin(login);
    if (response.isSuccess) {
      setError('');
      sessionStorage.setItem("accessToken", response.data.accessToken);
      sessionStorage.setItem('refreshToken', `Bearer ${response.data.refreshToken}`);
      setAccessToken(response.data.accessToken);

      context.setAccount({
        id: response.data.user._id,
        username: response.data.user.username,
        email: response.data.user.email
      });

      setisAuthenticated(true);
      navigate('/');
    } else {
      setError("Something went wrong! Please try again later");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm rounded-xl bg-gray-900 p-8 shadow-2xl">
        {/* Logo */}
        <div className="mb-6 text-center">
          <FiBookOpen className="mx-auto h-10 w-10 text-blue-500" />
          <span className="text-lg font-Lora font-bold text-white hover:text-green-400 transition">
            ScribleSpace
          </span>
          <br />
          <span className="text-gray-400 text-sm">Turn your words into impact.</span>
        </div>

        {isLogin ? (
          // LOGIN FORM
          <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
            <div>
              <label className="text-sm text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={login.email}
                onChange={onLoginChange}
                required
                className="mt-1 w-full rounded-md bg-gray-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Password</label>
              <input
                type="password"
                name="password"
                value={login.password}
                onChange={onLoginChange}
                required
                className="mt-1 w-full rounded-md bg-gray-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button className="w-full rounded-md bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-500 transition">
              Sign In
            </button>

            <p className="text-center text-sm text-gray-400">
              Don't have an account?
              <button type="button" onClick={toggle} className="ml-1 text-indigo-400 hover:underline">
                Sign Up
              </button>
            </p>
          </form>
        ) : (
          // SIGNUP FORM
          <form onSubmit={handleSignup} className="space-y-5" autoComplete="off">
            <div>
              <label className="text-sm text-gray-300">Username</label>
              <input
                type="text"
                name="username"
                value={signUp.username}
                onChange={onSignUpChange}
                required
                className="mt-1 w-full rounded-md bg-gray-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={signUp.email}
                onChange={onSignUpChange}
                required
                className="mt-1 w-full rounded-md bg-gray-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Password</label>
              <input
                type="password"
                name="password"
                value={signUp.password}
                onChange={onSignUpChange}
                required
                className="mt-1 w-full rounded-md bg-gray-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button className="w-full rounded-md bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-500 transition">
              Sign Up
            </button>

            <p className="text-center text-sm text-gray-400">
              Already have an account?
              <button type="button" onClick={toggle} className="ml-1 text-indigo-400 hover:underline">
                Sign In
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
