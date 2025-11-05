import { useState, memo } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const PasswordInput = memo(({ 
  name = "password",
  value, 
  onChange, 
  error,
  placeholder = "Enter your password" 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        id={name}
        name={name}
        type={showPassword ? "text" : "password"}
        required
        value={value}
        onChange={onChange}
        className={`block w-full rounded-xl border ${
          error ? 'border-red-300' : 'border-gray-300'
        } px-4 py-2 text-gray-900 shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-200 pr-12`}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 hover:text-gray-900 transition-colors"
        tabIndex="-1"
      >
        {showPassword ? (
          <FiEyeOff className="w-5 h-5" aria-hidden="true" />
        ) : (
          <FiEye className="w-5 h-5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;