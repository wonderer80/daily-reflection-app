import React, { useState } from 'react';

interface AuthProps {
  onAuth: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuth }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = process.env.REACT_APP_PASSWORD;
    
    if (!correctPassword) {
      console.error('Password environment variable is not set!');
      return;
    }

    if (password === correctPassword) {
      onAuth();
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Daily Reflection</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm mb-4">Incorrect password</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth; 