import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ORSData {
  date: string;
  self: number;
  interpersonal: number;
  social: number;
  overall: number;
}

type PeriodOption = '1w' | '2w' | '1m' | '3m';

interface PeriodConfig {
  label: string;
  days: number;
  limit: number;
}

const PERIOD_OPTIONS: Record<PeriodOption, PeriodConfig> = {
  '1w': { label: '1 Week', days: 7, limit: 7 },
  '2w': { label: '2 Weeks', days: 14, limit: 14 },
  '1m': { label: '1 Month', days: 30, limit: 30 },
  '3m': { label: '3 Months', days: 90, limit: 90 }
};

export function ORSChart() {
  const [data, setData] = useState<ORSData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('2w');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const periodConfig = PERIOD_OPTIONS[selectedPeriod];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - periodConfig.days);

        const q = query(
          collection(db, 'entries'),
          where('date', '>=', startDate),
          orderBy('date', 'desc'),
          limit(periodConfig.limit)
        );

        const snapshot = await getDocs(q);
        const orsData: ORSData[] = snapshot.docs
          .map(doc => {
            const data = doc.data();
            return {
              date: new Date(data.date.toDate()).toLocaleDateString(),
              self: data.self,
              interpersonal: data.interpersonal,
              social: data.social,
              overall: data.overall,
            };
          })
          .reverse(); // 날짜순 정렬

        setData(orsData);
      } catch (error) {
        console.error('Error fetching ORS data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod]);

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Self',
        data: data.map(d => d.self),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      },
      {
        label: 'Interpersonal',
        data: data.map(d => d.interpersonal),
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1
      },
      {
        label: 'Social',
        data: data.map(d => d.social),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Overall',
        data: data.map(d => d.overall),
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `ORS Score Trends - ${PERIOD_OPTIONS[selectedPeriod].label}`
      }
    },
    scales: {
      y: {
        min: 0,
        max: 10
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* 기간 선택 필터 */}
      <div className="flex justify-end space-x-2">
        {Object.entries(PERIOD_OPTIONS).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setSelectedPeriod(key as PeriodOption)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              selectedPeriod === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 로딩 상태 */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          No data available for the selected period
        </div>
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
} 