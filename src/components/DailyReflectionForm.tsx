import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';

function DailyReflectionForm() {
  // 한국 시간대(KST) 기준으로 현재 날짜를 설정
  const getCurrentDate = () => {
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000; // KST는 UTC+9
    const kstDate = new Date(now.getTime() + kstOffset);
    return kstDate.toISOString().split('T')[0];
  };

  const [date, setDate] = useState<string>(getCurrentDate());
  const [self, setSelf] = useState<number>(5);
  const [interpersonal, setInterpersonal] = useState<number>(5);
  const [social, setSocial] = useState<number>(5);
  const [overall, setOverall] = useState<number>(5);
  const [journal, setJournal] = useState<string>('');

  useEffect(() => {
    const fetchEntry = async () => {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
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
    };

    fetchEntry();
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'entries'), {
        date: Timestamp.fromDate(new Date(date)),
        self,
        interpersonal,
        social,
        overall,
        journal,
        createdAt: Timestamp.now(),
      });
      alert('Entry saved!');
    } catch (error) {
      console.error('Error saving entry: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
      <h1 className="text-2xl font-bold mb-4">Daily Reflection</h1>
      <label className="block mb-2">Date</label>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mb-4 w-full border rounded px-3 py-2" />

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
      <textarea value={journal} onChange={(e) => setJournal(e.target.value)} className="w-full border rounded px-3 py-2 mt-1 mb-4" rows={4} placeholder="Write your reflections here..." />

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Submit</button>
    </form>
  );
}

export default DailyReflectionForm;