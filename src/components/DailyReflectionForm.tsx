import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp, query, where, getDocs, updateDoc } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DailyReflectionFormProps {
  setMessage: (msg: string) => void;
}

/**
 * 일일 반성 입력 폼 컴포넌트
 * 사용자가 날짜별로 자신의 상태를 기록하고 저장할 수 있습니다.
 */
const DailyReflectionForm: React.FC<DailyReflectionFormProps> = ({ setMessage }) => {
  /**
   * 한국 시간대(KST) 기준으로 현재 날짜를 반환합니다.
   * @returns {Date} KST 기준의 현재 날짜
   */
  const getCurrentDate = () => {
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000; // KST는 UTC+9
    const kstDate = new Date(now.getTime() + kstOffset);
    return kstDate;
  };

  const [selectedDate, setSelectedDate] = useState<Date>(getCurrentDate());
  const [self, setSelf] = useState<number>(5);
  const [interpersonal, setInterpersonal] = useState<number>(5);
  const [social, setSocial] = useState<number>(5);
  const [overall, setOverall] = useState<number>(5);
  const [journal, setJournal] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * 날짜를 지정된 일수만큼 이동합니다.
   * @param days 이동할 일수 (음수: 과거, 양수: 미래)
   */
  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  useEffect(() => {
    const fetchEntry = async () => {
      setIsLoading(true);
      setMessage('');

      try {
        const dayStart = new Date(selectedDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(selectedDate);
        dayEnd.setHours(23, 59, 59, 999);

        const q = query(
          collection(db, 'entries'),
          where('date', ">=", Timestamp.fromDate(dayStart)),
          where('date', "<=", Timestamp.fromDate(dayEnd))
        );

        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          setSelf(data.self);
          setInterpersonal(data.interpersonal);
          setSocial(data.social);
          setOverall(data.overall);
          setJournal(data.journal);
        } else {
          setSelf(5);
          setInterpersonal(5);
          setSocial(5);
          setOverall(5);
          setJournal('');
        }
      } catch (error) {
        console.error('Error fetching entry:', error);
        setMessage('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntry();
  }, [selectedDate, setMessage]);

  /**
   * 폼 제출을 처리하는 함수
   * 현재 입력된 데이터를 Firebase에 저장합니다.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    try {
      // 1. 해당 날짜에 이미 데이터가 있는지 확인
      const dayStart = new Date(selectedDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(selectedDate);
      dayEnd.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, 'entries'),
        where('date', ">=", Timestamp.fromDate(dayStart)),
        where('date', "<=", Timestamp.fromDate(dayEnd))
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        // 이미 있으면 update
        const docRef = snapshot.docs[0].ref;
        await updateDoc(docRef, {
          self,
          interpersonal,
          social,
          overall,
          journal,
          updatedAt: Timestamp.now(),
        });
        setMessage('성공적으로 업데이트되었습니다!');
      } else {
        // 없으면 add
        await addDoc(collection(db, 'entries'), {
          date: Timestamp.fromDate(selectedDate),
          self,
          interpersonal,
          social,
          overall,
          journal,
          createdAt: Timestamp.now(),
        });
        setMessage('성공적으로 저장되었습니다!');
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving entry:', error);
      setMessage('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      <h1 className="text-2xl font-bold mb-4">Daily Reflection</h1>
      
      {/* 날짜 선택 UI */}
      <div className="flex items-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => handleDateChange(-1)}
          className="shrink-0 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          ←
        </button>
        
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => date && setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          className="w-full border rounded-lg px-3 py-2 text-center cursor-pointer"
          showPopperArrow={false}
          wrapperClassName="flex-1"
        />
        
        <button
          type="button"
          onClick={() => handleDateChange(1)}
          className="shrink-0 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          →
        </button>
      </div>

      <label className="block mt-2">Self</label>
      <input type="range" min="0" max="10" value={self} onChange={(e) => setSelf(Number(e.target.value))} className="w-full" />
      <span>{self}</span>

      <label className="block mt-2">Interpersonal</label>
      <input type="range" min="0" max="10" value={interpersonal} onChange={(e) => setInterpersonal(Number(e.target.value))} className="w-full" />
      <span>{interpersonal}</span>

      <label className="block mt-2">Social</label>
      <input type="range" min="0" max="10" value={social} onChange={(e) => setSocial(Number(e.target.value))} className="w-full" />
      <span>{social}</span>

      <label className="block mt-2">Overall</label>
      <input type="range" min="0" max="10" value={overall} onChange={(e) => setOverall(Number(e.target.value))} className="w-full" />
      <span>{overall}</span>

      <label className="block mt-4">Journal</label>
      <textarea 
        value={journal} 
        onChange={(e) => setJournal(e.target.value)} 
        className="w-full border rounded px-3 py-2 mt-1 mb-4" 
        rows={4} 
        placeholder="Write your reflections here..." 
      />

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Submit</button>
    </form>
  );
};

export default DailyReflectionForm;