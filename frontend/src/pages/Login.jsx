import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/authServices';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) =>
      setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      try {
        await login(form);
        navigate('/dashboard');
      } catch (error) {
        setError(error.response?.data?.message || "Login failed");
      }
    };
    
  return (
    <div className='w-screen h-screen bg-[#f5f7fa] flex justify-center items-center'>
      <form onSubmit={handleSubmit} className='w-[400px] h-[400px] bg-white border-0 rounded-md p-7 flex justify-center items-center flex-col gap-3.5'>
        <h2 className='text-4xl  font-bold'>Login Here</h2>
        {error && <p className='text-red-500'>{error}</p>}
        <p className='text-[18px] text-left text-[#a3a3a3] mt-[10px]'>Please enter your details</p>
        <input type="text"
            name='username'
            placeholder='Username'
            value={form.username} 
            className='w-[300px] p-2.5 rounded-md border-1'
            onChange={handleChange}/>
        <input type="password"
            name='password'
            placeholder='Password'
            value={form.password}
            className='w-[300px] p-2.5 rounded-md border-1'
            onChange={handleChange}/>
        <button type='submit' className='text-center h-[40px] w-[200px] text-white rounded-md bg-blue-500 hover:bg-blue-600 cursor-pointer'>Login</button>
        <p className='text-center text-[#a3a3a3]'>Don't have an account? <Link to = '/register' className=' text-blue-600 underline font-bold'>Sign Up</Link></p>
      </form>
    </div>
  )
}

export default Login
