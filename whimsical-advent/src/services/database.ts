import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { AdventDay, AdventCalendar, EmailLog } from '@/types/advent';

// Collection names
const COLLECTIONS = {
  CALENDAR: 'calendar',
  DAYS: 'days',
  EMAIL_LOGS: 'emailLogs'
};

// Calendar operations
export const createCalendar = async (calendarData: Omit<AdventCalendar, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = Timestamp.now();
  const calendar: Omit<AdventCalendar, 'id'> = {
    ...calendarData,
    createdAt: now.toDate(),
    updatedAt: now.toDate()
  };

  const docRef = await addDoc(collection(db, COLLECTIONS.CALENDAR), calendar);
  return { id: docRef.id, ...calendar };
};

export const getCalendar = async (calendarId: string): Promise<AdventCalendar | null> => {
  const docRef = doc(db, COLLECTIONS.CALENDAR, calendarId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      startDate: data.startDate.toDate(),
      endDate: data.endDate.toDate(),
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    } as AdventCalendar;
  }
  return null;
};

// Days operations
export const createDay = async (dayData: Omit<AdventDay, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = Timestamp.now();
  const day: Omit<AdventDay, 'id'> = {
    ...dayData,
    createdAt: now.toDate(),
    updatedAt: now.toDate()
  };

  const docRef = await addDoc(collection(db, COLLECTIONS.DAYS), day);
  return { id: docRef.id, ...day };
};

export const getDay = async (dayId: string): Promise<AdventDay | null> => {
  const docRef = doc(db, COLLECTIONS.DAYS, dayId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    } as AdventDay;
  }
  return null;
};

export const getDayByNumber = async (dayNumber: number): Promise<AdventDay | null> => {
  const q = query(
    collection(db, COLLECTIONS.DAYS),
    where('day', '==', dayNumber)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    } as AdventDay;
  }
  return null;
};

export const getAllDays = async (): Promise<AdventDay[]> => {
  const q = query(collection(db, COLLECTIONS.DAYS), orderBy('day', 'asc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    } as AdventDay;
  });
};

export const updateDay = async (dayId: string, updates: Partial<AdventDay>) => {
  const docRef = doc(db, COLLECTIONS.DAYS, dayId);
  const now = Timestamp.now();
  await updateDoc(docRef, { ...updates, updatedAt: now });
};

// Email logs operations
export const logEmailSent = async (logData: Omit<EmailLog, 'id'>) => {
  const docRef = await addDoc(collection(db, COLLECTIONS.EMAIL_LOGS), {
    ...logData,
    sentAt: Timestamp.fromDate(logData.sentAt)
  });
  return docRef.id;
};

export const getEmailLogs = async (): Promise<EmailLog[]> => {
  const q = query(collection(db, COLLECTIONS.EMAIL_LOGS), orderBy('sentAt', 'desc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      sentAt: data.sentAt.toDate()
    } as EmailLog;
  });
};
