import { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../api/auth.api';
import { useAuth } from '../context/authContextUtils';

const Login = () => {
  const { Login: setAuthUser } = useAuth();
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      if (!username || !password) return alert("Please fill in all fields");

      const response = await loginUser({ username, password });

      // Assuming the response structure contains data.user and data.accessToken or similar
      // Adjust based on your actual API response structure.
      // Common pattern: response.data.user or just response.user

      console.log("Logged in successfully", response);

      if (response?.data?.user) {
        setAuthUser(response.data.user);
      } else if (response?.user) {
        setAuthUser(response.user);
      } else {
        // Fallback if structure is different
        setAuthUser(response.data || response);
      }

    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed! Please check your credentials.");
    }
  };
  return (
    <div className='flex justify-center items-center h-screen bg-[#0f0f0f] text-white'>
      <div className='flex flex-col gap-6 p-10 bg-[#1e1e1e] border border-[#303030] rounded-xl shadow-2xl w-full max-w-md'>

        <div className="text-center">
          <h1 className="text-2xl font-bold mb-1">Sign in</h1>
          <p className="text-sm text-gray-400">to continue to YouTube</p>
        </div>

        <form onSubmit={handleLogin} className='flex flex-col gap-4'>
          <div className="flex flex-col gap-1">
            <input
              type="text"
              placeholder="Username or Email"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className='bg-[#121212] border border-[#303030] focus:border-blue-500 rounded p-3 text-white outline-none transition-colors'
            />
          </div>

          <div className="flex flex-col gap-1">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='bg-[#121212] border border-[#303030] focus:border-blue-500 rounded p-3 text-white outline-none transition-colors'
            />
          </div>

          <button type="submit" className='bg-blue-600 hover:bg-blue-700 text-white font-medium p-2.5 rounded transition-colors mt-2'>
            Sign in
          </button>
        </form>

        <div className="flex justify-between items-center text-sm mt-2">
          <a href="#" className="text-blue-400 hover:text-blue-300">Forgot email?</a>
          <p className="text-gray-400">
            Not your computer? Use Guest mode to sign in privately. <a href="#" className="text-blue-400">Learn more</a>
          </p>
        </div>

        <div className="text-center mt-4">
          <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">Create account</Link>
        </div>
      </div>
    </div>
  );
}
export default Login;
