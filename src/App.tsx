import React, { useState } from 'react';
import DailyReflectionForm from './components/DailyReflectionForm';
import { ORSChart } from './components/ORSChart';

type TabType = 'form' | 'chart';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('form');

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
    </div>
  );
}

export default App;
