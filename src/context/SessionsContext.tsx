
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useCredits } from './CreditsContext';
import { useToast } from '@/hooks/use-toast';

interface Session {
  id: string;
  clientId: string;
  sparkyId: string;
  sparkyName: string;
  title: string;
  date: string;
  credits: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
}

interface SessionsContextType {
  sessions: Session[];
  bookSession: (sparkyId: string, sparkyName: string, title: string, date: Date, credits: number) => boolean;
  cancelSession: (sessionId: string) => void;
  completeSession: (sessionId: string) => void;
  getUserSessions: () => Session[];
}

const SessionsContext = createContext<SessionsContextType>({
  sessions: [],
  bookSession: () => false,
  cancelSession: () => {},
  completeSession: () => {},
  getUserSessions: () => [],
});

export const useSessions = () => useContext(SessionsContext);

export const SessionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const { user } = useAuth();
  const { spendCredits } = useCredits();
  const { toast } = useToast();

  const bookSession = (sparkyId: string, sparkyName: string, title: string, date: Date, credits: number): boolean => {
    if (!user) return false;

    if (spendCredits(credits)) {
      const newSession: Session = {
        id: Date.now().toString(),
        clientId: user.id,
        sparkyId,
        sparkyName,
        title,
        date: date.toISOString(),
        credits,
        status: 'upcoming',
        createdAt: new Date().toISOString(),
      };

      setSessions(prev => [...prev, newSession]);
      
      toast({
        title: "Session Booked Successfully",
        description: `Your session with ${sparkyName} has been booked for ${date.toLocaleDateString()}`,
      });

      return true;
    }

    return false;
  };

  const cancelSession = (sessionId: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, status: 'cancelled' as const }
        : session
    ));
    
    toast({
      title: "Session Cancelled",
      description: "Your session has been cancelled successfully.",
    });
  };

  const completeSession = (sessionId: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, status: 'completed' as const }
        : session
    ));
  };

  const getUserSessions = (): Session[] => {
    if (!user) return [];
    return sessions.filter(session => session.clientId === user.id);
  };

  return (
    <SessionsContext.Provider value={{
      sessions,
      bookSession,
      cancelSession,
      completeSession,
      getUserSessions,
    }}>
      {children}
    </SessionsContext.Provider>
  );
};
