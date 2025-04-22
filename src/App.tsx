import React, { useState, useEffect } from 'react';
import DailyReflectionForm from './components/DailyReflectionForm';
import { ORSChart } from './components/ORSChart';
import Auth from './components/Auth';

type TabType = 'form' | 'chart';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('form');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
      <div className="w-full max-w-md mb-6">
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
          <DailyReflectionForm />
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
