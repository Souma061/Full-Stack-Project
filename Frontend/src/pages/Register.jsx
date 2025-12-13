import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth.api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    avatar: null,
    coverImage: null
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('username', formData.username);
      data.append('email', formData.email);
      data.append('password', formData.password);
      if (formData.avatar) data.append('avatar', formData.avatar);
      if (formData.coverImage) data.append('coverImage', formData.coverImage);

      await registerUser(data);
      alert("Registration successful!");
      navigate('/login');
    } catch (error) {
      console.error("Registration failed", error);
      alert("Registration failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-[#0f0f0f] text-white py-10'>
      <div className='flex flex-col gap-6 p-10 bg-[#1e1e1e] border border-[#303030] rounded-xl shadow-2xl w-full max-w-lg'>

        <div className="text-center">
          <h1 className="text-2xl font-bold mb-1">Create your Account</h1>
          <p className="text-sm text-gray-400">to start creating on YouTube</p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

          <div className='flex flex-col gap-1'>
            <input
              required
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className='bg-[#121212] border border-[#303030] focus:border-blue-500 rounded p-3 text-white outline-none transition-colors'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <input
              required
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className='bg-[#121212] border border-[#303030] focus:border-blue-500 rounded p-3 text-white outline-none transition-colors'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <input
              required
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className='bg-[#121212] border border-[#303030] focus:border-blue-500 rounded p-3 text-white outline-none transition-colors'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <input
              required
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className='bg-[#121212] border border-[#303030] focus:border-blue-500 rounded p-3 text-white outline-none transition-colors'
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-sm text-gray-400 font-medium ml-1'>Avatar</label>
            <input
              required
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
              className='block w-full text-sm text-gray-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-[#303030] file:text-white
                                hover:file:bg-[#404040]
                                cursor-pointer'
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-sm text-gray-400 font-medium ml-1'>Cover Image (Optional)</label>
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={handleChange}
              className='block w-full text-sm text-gray-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-[#303030] file:text-white
                                hover:file:bg-[#404040]
                                cursor-pointer'
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded transition-colors mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <div className="text-center mt-2">
            <span className='text-gray-400 text-sm'>Already have an account? </span>
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium text-sm">Sign in</Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Register;
