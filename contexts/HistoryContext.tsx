
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { HistoryEntry } from '../types';
import { useAuth } from './AuthContext'; // To namespace history per user


interface HistoryContextType {
  historyEntries: HistoryEntry[];
  addHistoryEntry: (action: string, details?: string) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>(() => {
    if (!currentUser) return [];
    const storedHistory = localStorage.getItem(`history_${currentUser.id}`);
    return storedHistory ? JSON.parse(storedHistory) : [];
  });

  React.useEffect(() => {
    if (currentUser) {
      const storedHistory = localStorage.getItem(`history_${currentUser.id}`);
      setHistoryEntries(storedHistory ? JSON.parse(storedHistory) : []);
    } else {
      setHistoryEntries([]);
    }
  }, [currentUser]);

  const updateStoredHistory = useCallback((updatedHistory: HistoryEntry[]) => {
    if (currentUser) {
      localStorage.setItem(`history_${currentUser.id}`, JSON.stringify(updatedHistory));
    }
  },[currentUser]);


  const addHistoryEntry = useCallback((action: string, details?: string) => {
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      action,
      details,
      timestamp: new Date(),
    };
    setHistoryEntries(prevEntries => {
      const updated = [newEntry, ...prevEntries]; // Add to the beginning
      updateStoredHistory(updated);
      return updated;
    });
  }, [updateStoredHistory]);

  const clearHistory = useCallback(() => {
    setHistoryEntries([]);
    if (currentUser) {
      localStorage.removeItem(`history_${currentUser.id}`);
    }
  }, [currentUser]);

  return (
    <HistoryContext.Provider value={{ historyEntries, addHistoryEntry, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within an HistoryProvider');
  }
  return context;
};
