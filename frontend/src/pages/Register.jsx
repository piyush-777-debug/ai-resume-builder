import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(formData); // ✅ correct state
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className='w-screen h-screen bg-[#f5f7fa] flex justify-center items-center'>
      <form
        onSubmit={handleSubmit}
        className='w-[400px] h-[500px] bg-white rounded-md p-7 flex flex-col gap-3.5'
      >
        <h3 className='text-3xl font-bold text-center'>Create Account</h3>
        <p className='text-[18px] text-center text-[#a3a3a3]'>
          Please enter your details
        </p>

        {error && <p className='text-red-500'>{error}</p>}

        <input
          type="text"
          name="fullname"
          placeholder='Enter full name'
          value={formData.fullname}
          onChange={handleChange}
          className='w-[300px] p-2.5 rounded-md border'
        />

        <input
          type="text"
          name="username"
          placeholder='Username'
          value={formData.username}
          onChange={handleChange}
          className='w-[300px] p-2.5 rounded-md border'
        />

        <input
          type="email"
          name="email"
          placeholder='Email'
          value={formData.email}
          onChange={handleChange}
          className='w-[300px] p-2.5 rounded-md border'
        />

        <input
          type="password"
          name="password"
          placeholder='Password'
          value={formData.password}
          onChange={handleChange}
          className='w-[300px] p-2.5 rounded-md border'
        />

        <button
          type='submit'
          className='h-[40px] w-[200px] text-white rounded-md bg-blue-500 hover:bg-blue-600'
        >
          Sign Up
        </button>

        <p className='text-center text-[#a3a3a3]'>
          Already have an account?{" "}
          <Link to='/login' className='text-blue-600 underline font-bold'>
            Sign In
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Register;
