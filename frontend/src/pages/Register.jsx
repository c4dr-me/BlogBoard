import { useState, useEffect, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import PasswordInput from '../components/PasswordInput';

const emailRegex = /^[a-zA-Z0-9._-]+@(gmail|yahoo|outlook|hotmail|proton|icloud|msit)\.(com|net|org|edu|io|dev)$/;
const DEBOUNCE_DELAY = 1000;

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const validateField = useCallback((name, value) => {
    if (!value) return ''; 
    switch (name) {
      case 'username':
        return value.length < 3 ? 'Username must be at least 3 characters' : '';
      case 'email':
        return !emailRegex.test(value) ? 'Please enter a valid email address' : '';
      case 'password':
        return value.length < 6 ? 'Password must be at least 6 characters' : '';
      default:
        return '';
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const newErrors = {
        username: validateField('username', formData.username),
        email: validateField('email', formData.email),
        password: validateField('password', formData.password)
      };
      setErrors(newErrors);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [formData, validateField]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const mutation = useMutation({
    mutationFn: (credentials) =>
      authService.register(credentials.username, credentials.email, credentials.password),
    onSuccess: () => {
      navigate('/login');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Registration failed';
      if (errorMessage.includes('Username')) {
        setErrors(prev => ({ ...prev, username: errorMessage }));
      } else if (errorMessage.includes('Email')) {
        setErrors(prev => ({ ...prev, email: errorMessage }));
      } else if (errorMessage.includes('Password')) {
        setErrors(prev => ({ ...prev, password: errorMessage }));
      }
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {
      username: validateField('username', formData.username),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password)
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
          Create Your Account
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-xl border ${
                errors.username ? 'border-red-300' : 'border-gray-300'
              } px-4 py-2 text-gray-900 shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-200`}
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-xl border ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              } px-4 py-2 text-gray-900 shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-200`}
              placeholder="blog@gmail.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isLoading || Object.values(errors).some(error => error)}
            className="w-full flex justify-center py-3 px-6 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isLoading ? <LoadingSpinner /> : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <span
            className="text-indigo-600 hover:text-indigo-800 cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;