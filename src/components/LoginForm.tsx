import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const roles = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Participant', value: 'PARTICIPANT' },
];

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  // Login state
  const [emailLogin, setEmailLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);  
  // Register state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [role, setRole] = useState('ADMIN');
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);
    setRegisterSuccess(null);
    try {
      const response = await api.post('/auth/login', { email: emailLogin, password });
      login(response.data.token);
    } catch (err: any) {
      setLoginError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRegisterError(null);
    setRegisterSuccess(null);
    try {
      const body: any = {
        name,
        email,
        password: registerPassword,
        role,
      };
      const response = await api.post('/auth/register', body);
      setRegisterSuccess(response.data.message || 'Registration successful!');
      setTab('login');
    } catch (err: any) {
      setRegisterError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 font-semibold rounded-l ${tab === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTab('login')}
            type="button"
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 font-semibold rounded-r ${tab === 'register' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTab('register')}
            type="button"
          >
            Register
          </button>
        </div>
        {tab === 'login' && (
          <form onSubmit={handleLogin}>
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            {loginError && <div className="mb-4 text-red-500 text-center">{loginError}</div>}
            {registerSuccess && <div className="mb-4 text-green-600 text-center">{registerSuccess}</div>}
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Email</label>
              <input
                type="email"
                value={emailLogin}
                onChange={e => setEmailLogin(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-1 font-semibold">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}
        {tab === 'register' && (
          <form onSubmit={handleRegister}>
            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
            {registerError && <div className="mb-4 text-red-500 text-center">{registerError}</div>}
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Password</label>
              <input
                type="password"
                value={registerPassword}
                onChange={e => setRegisterPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              >
                {roles.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginForm; 