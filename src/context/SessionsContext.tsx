import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { sessionAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import type { SessionItem } from '@/types';

interface SessionsContextType {
  sessions: SessionItem[];
  isLoading: boolean;
  bookSession: (sparkyId: string, sparkyName: string, skillName: string, scheduledAt: Date, credits: number, duration?: number) => Promise<boolean>;
  cancelSession: (sessionId: string) => Promise<void>;
  completeSession: (sessionId: string, rating?: number, comment?: string) => Promise<void>;
  refreshSessions: () => Promise<void>;
}

const SessionsContext = createContext<SessionsContextType>({
  sessions: [],
  isLoading: false,
  bookSession: async () => false,
  cancelSession: async () => {},
  completeSession: async () => {},
  refreshSessions: async () => {},
});

export const useSessions = () => useContext(SessionsContext);

export const SessionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  // Fetch sessions when user is authenticated
  useEffect(() => {
    if (user) {
      refreshSessions();
    } else {
      setSessions([]);
    }
  }, [user?.id]);

  const refreshSessions = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await sessionAPI.getMySessions();
      setSessions(res.data.sessions.map((s: SessionItem) => ({
        ...s,
        id: s._id || s.id,
      })));
    } catch {
      // silent fail
    } finally {
      setIsLoading(false);
    }
  };

  const bookSession = async (
    sparkyId: string,
    sparkyName: string,
    skillName: string,
    scheduledAt: Date,
    credits: number,
    duration = 60
  ): Promise<boolean> => {
    try {
      const res = await sessionAPI.bookSession({ sparkyId, sparkyName, skillName, scheduledAt: scheduledAt.toISOString(), credits, duration });
      const newSession = { ...res.data.session, id: res.data.session._id || res.data.session.id };
      setSessions((prev) => [newSession, ...prev]);

      // Update credits in user context
      if (res.data.clientCredits !== undefined) {
        updateUser({ credits: res.data.clientCredits });
      }

      toast({
        title: '🎉 Session Booked!',
        description: `Your session with ${sparkyName} has been booked for ${scheduledAt.toLocaleDateString()}`,
      });
      return true;
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to book session.';
      toast({ title: 'Booking Failed', description: msg, variant: 'destructive' });
      return false;
    }
  };

  const cancelSession = async (sessionId: string) => {
    try {
      const res = await sessionAPI.cancelSession(sessionId);
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId || s._id === sessionId ? { ...s, status: 'cancelled' } : s))
      );
      // Refund credits
      if (res.data.session?.credits) {
        updateUser({ credits: (user?.credits || 0) + res.data.session.credits });
      }
      toast({ title: 'Session Cancelled', description: 'Credits have been refunded to your account.' });
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to cancel.';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    }
  };

  const completeSession = async (sessionId: string, rating?: number, comment?: string) => {
    try {
      await sessionAPI.completeSession(sessionId, { rating, comment });
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId || s._id === sessionId
            ? { ...s, status: 'completed', clientReview: { rating, comment } }
            : s
        )
      );
      toast({ title: 'Session Completed!', description: rating ? 'Thank you for your review.' : 'Session marked as complete.' });
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to complete session.';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    }
  };

  return (
    <SessionsContext.Provider value={{ sessions, isLoading, bookSession, cancelSession, completeSession, refreshSessions }}>
      {children}
    </SessionsContext.Provider>
  );
};
