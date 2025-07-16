
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CreditsContextType {
  credits: number;
  addCredits: (amount: number) => void;
  spendCredits: (amount: number) => boolean;
  donateCredits: (amount: number, projectTitle: string) => boolean;
  refreshCredits: () => void;
}

const CreditsContext = createContext<CreditsContextType>({
  credits: 0,
  addCredits: () => {},
  spendCredits: () => false,
  donateCredits: () => false,
  refreshCredits: () => {},
});

export const useCredits = () => useContext(CreditsContext);

export const CreditsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [credits, setCredits] = useState(100); // Starting credits
  const { user } = useAuth();
  const { toast } = useToast();

  // Load credits from localStorage when user changes
  useEffect(() => {
    if (user) {
      const savedCredits = localStorage.getItem(`credits-${user.id}`);
      if (savedCredits) {
        setCredits(parseInt(savedCredits));
      } else {
        // Set default credits for new users
        const defaultCredits = user.type === 'client' ? 100 : 50;
        setCredits(defaultCredits);
        localStorage.setItem(`credits-${user.id}`, defaultCredits.toString());
      }
    }
  }, [user]);

  // Save credits to localStorage whenever credits change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`credits-${user.id}`, credits.toString());
    }
  }, [credits, user]);

  const addCredits = (amount: number) => {
    setCredits(prev => prev + amount);
    toast({
      title: "Credits Added",
      description: `You received ${amount} credits!`,
    });
  };

  const spendCredits = (amount: number): boolean => {
    if (credits >= amount) {
      setCredits(prev => prev - amount);
      return true;
    }
    toast({
      title: "Insufficient Credits",
      description: `You need ${amount} credits but only have ${credits}.`,
      variant: "destructive",
    });
    return false;
  };

  const donateCredits = (amount: number, projectTitle: string): boolean => {
    if (credits >= amount) {
      setCredits(prev => prev - amount);
      toast({
        title: "Donation Successful",
        description: `You donated ${amount} credits to "${projectTitle}"!`,
      });
      return true;
    }
    toast({
      title: "Insufficient Credits",
      description: `You need ${amount} credits but only have ${credits}.`,
      variant: "destructive",
    });
    return false;
  };

  const refreshCredits = () => {
    if (user) {
      const savedCredits = localStorage.getItem(`credits-${user.id}`);
      if (savedCredits) {
        setCredits(parseInt(savedCredits));
      }
    }
  };

  return (
    <CreditsContext.Provider value={{
      credits,
      addCredits,
      spendCredits,
      donateCredits,
      refreshCredits,
    }}>
      {children}
    </CreditsContext.Provider>
  );
};
