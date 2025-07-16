
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, UserType } from '@/types';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  userType: UserType | null;
  isOnboarded: boolean;
  login: (email: string, password: string, type: UserType) => void;
  register: (name: string, email: string, password: string, type: UserType) => void;
  logout: () => void;
  completeOnboarding: (profileData: any) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userType: null,
  isOnboarded: false,
  login: () => {},
  register: () => {},
  logout: () => {},
  completeOnboarding: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(true);
  const [initialLoadDone, setInitialLoadDone] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mock login function - in a real app, this would call an API
  const login = (email: string, password: string, type: UserType) => {
    // Mock user for demo purposes
    const mockUser = {
      id: '123',
      name: type === 'sparky' ? 'Demo Sparky' : 'Demo Client',
      email,
      type,
      createdAt: new Date().toISOString(),
    };
    
    setUser(mockUser);
    setUserType(type);
    
    // Check if user is onboarded
    const isUserOnboarded = localStorage.getItem(`${mockUser.id}-onboarded`) === 'true';
    setIsOnboarded(isUserOnboarded || type === 'client');
    
    // In a real app, you would store authentication token in localStorage
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('authenticated', 'true');
    
    // Redirect based on user type and onboarding status
    if (type === 'sparky' && !isUserOnboarded) {
      navigate('/sparkies/onboarding');
    } else if (type === 'sparky') {
      navigate('/sparkies/profile');
    } else {
      navigate('/clients/profile');
    }
  };

  // Mock register function
  const register = (name: string, email: string, password: string, type: UserType) => {
    // Mock user creation
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      type,
      createdAt: new Date().toISOString(),
    };
    
    setUser(newUser);
    setUserType(type);
    
    // New sparkies need onboarding
    if (type === 'sparky') {
      setIsOnboarded(false);
    }
    
    // In a real app, you would store authentication token in localStorage
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('authenticated', 'true');
    
    // Redirect based on user type
    if (type === 'sparky') {
      navigate('/sparkies/onboarding');
    } else {
      navigate('/clients/profile');
    }
  };

  const completeOnboarding = (profileData: any) => {
    if (user) {
      // In a real app, this would update the user profile in the database
      localStorage.setItem(`${user.id}-onboarded`, 'true');
      setIsOnboarded(true);
      
      // Store profile data
      localStorage.setItem(`${user.id}-profile`, JSON.stringify(profileData));
      
      // Redirect to profile page after onboarding
      navigate('/sparkies/profile');
    }
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    setIsOnboarded(true);
    localStorage.removeItem('user');
    localStorage.removeItem('authenticated');
    navigate('/');
  };

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUserType(parsedUser.type);
      
      // Check if user is onboarded
      const isUserOnboarded = localStorage.getItem(`${parsedUser.id}-onboarded`) === 'true';
      setIsOnboarded(isUserOnboarded || parsedUser.type === 'client');
      
      // Redirect if on landing page
      if (location.pathname === '/' && parsedUser.type) {
        const redirectPath = parsedUser.type === 'sparky' ? '/sparkies/profile' : '/clients/profile';
        navigate(redirectPath);
      } else if (location.pathname === '/login' || location.pathname === '/register') {
        const redirectPath = parsedUser.type === 'sparky' ? '/sparkies/profile' : '/clients/profile';
        navigate(redirectPath);
      } else if (parsedUser.type === 'sparky' && !isUserOnboarded && location.pathname !== '/sparkies/onboarding') {
        navigate('/sparkies/onboarding');
      }
    }
    setInitialLoadDone(true);
  }, [location.pathname, navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        userType,
        isOnboarded,
        login,
        register,
        logout,
        completeOnboarding,
        isAuthenticated: !!user,
      }}
    >
      {initialLoadDone ? children : null}
    </AuthContext.Provider>
  );
};
