import React, { useState, useEffect } from 'react';
import DailyReflectionForm from './components/DailyReflectionForm';
import { ORSChart } from './components/ORSChart';
import Auth from './components/Auth';

type TabType = 'form' | 'chart';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('form');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <Auth onAuth={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      {/* 탭 네비게이션 */}
      <div className="w-full max-w-md mb-6" style={{ position: 'relative' }}>
        {/* 토스트 메시지 */}
        {message && (
          <div
            className={`
              absolute top-0 left-0 w-full h-full z-10
              flex items-center justify-center
              px-6 py-3 rounded-lg shadow-lg
              transition-all duration-300
              ${message.includes('성공')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'}
            `}
            role="alert"
            aria-live="assertive"
          >
            {message}
          </div>
        )}
        <div className="flex rounded-lg overflow-hidden bg-white shadow-md">
          <button
            className={`flex-1 py-3 px-4 text-center ${
              activeTab === 'form'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            } transition-colors duration-200`}
            onClick={() => setActiveTab('form')}
          >
            Daily Input
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center ${
              activeTab === 'chart'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            } transition-colors duration-200`}
            onClick={() => setActiveTab('chart')}
          >
            Trends
          </button>
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="w-full max-w-4xl px-4">
        {activeTab === 'form' ? (
          <DailyReflectionForm setMessage={setMessage} />
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <ORSChart />
          </div>
        )}
      </div>

      {/* 로그아웃 버튼 */}
      <button
        onClick={() => {
          localStorage.removeItem('isAuthenticated');
          setIsAuthenticated(false);
        }}
        className="mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
      >
        Logout
      </button>
    </div>
  );
}

export default App;
