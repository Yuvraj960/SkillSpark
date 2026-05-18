import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { userAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface CreditsContextType {
  credits: number;
  addCredits: (amount: number) => Promise<void>;
  updateCredits: (newAmount: number) => void;
  refreshCredits: () => Promise<void>;
}

const CreditsContext = createContext<CreditsContextType>({
  credits: 0,
  addCredits: async () => {},
  updateCredits: () => {},
  refreshCredits: async () => {},
});

export const useCredits = () => useContext(CreditsContext);

export const CreditsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [credits, setCredits] = useState(0);
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  // Sync credits from user object whenever user changes
  useEffect(() => {
    if (user) {
      setCredits(user.credits || 0);
    } else {
      setCredits(0);
    }
  }, [user]);

  const addCredits = async (amount: number) => {
    try {
      const res = await userAPI.addCredits(amount);
      const newCredits = res.data.credits;
      setCredits(newCredits);
      updateUser({ credits: newCredits });
      toast({
        title: 'Credits Added!',
        description: `${amount} credits have been added to your account.`,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to add credits.';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  };

  const updateCredits = (newAmount: number) => {
    setCredits(newAmount);
    updateUser({ credits: newAmount });
  };

  const refreshCredits = async () => {
    try {
      const res = await userAPI.getUserProfile(user!.id);
      const freshCredits = res.data.user.credits;
      setCredits(freshCredits);
    } catch {
      // silent fail
    }
  };

  return (
    <CreditsContext.Provider value={{ credits, addCredits, updateCredits, refreshCredits }}>
      {children}
    </CreditsContext.Provider>
  );
};
