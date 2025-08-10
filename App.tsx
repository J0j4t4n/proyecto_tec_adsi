import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import { View, ModalType, AppActions, GoogleUser } from './types';
import { ADMIN_PASSWORD } from './constants';
import * as googleAuth from './googleAuthService';

const App: React.FC = () => {
  const [view, setView] = useState<View>('public');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<GoogleUser | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [quoteContent, setQuoteContent] = useState<string>('');
  
  // Load persisted state on initial mount
  useEffect(() => {
    const savedUser = googleAuth.getCurrentUser();
    if (savedUser) {
        setCurrentUser(savedUser);
        setView('admin');
    } else {
        const savedIsAuthenticated = localStorage.getItem('pet-tech-auth') === 'true';
        if (savedIsAuthenticated) {
            setIsAuthenticated(true);
            setView('admin');
        } else {
            setView('public');
        }
    }
  }, []);

  const handleLogin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('pet-tech-auth', 'true');
      setView('admin');
      return true;
    }
    return false;
  };

  const handleGoogleLogin = () => {
    const user = googleAuth.signIn();
    setCurrentUser(user);
    setView('admin');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    googleAuth.signOut();
    localStorage.removeItem('pet-tech-auth');
    setView('public');
    localStorage.removeItem('pet-tech-chat');
  };
  
  const showAdminPanel = () => {
      if (isAuthenticated || currentUser) {
          setView('admin');
      } else {
          setView('login');
      }
  };

  const showPublicSite = () => {
      setView('public');
  }

  const appActions: AppActions = {
    navigateTo: (sectionId) => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    },
    openModal: (modal) => {
      setActiveModal(modal);
    },
    attemptLogin: (password) => {
      const success = handleLogin(password);
      if(success) {
          setActiveModal(null); // Close chat on successful login
      }
      return success;
    },
  };

  const renderContent = () => {
    switch (view) {
      case 'public':
        return <LandingPage 
                    onAdminPanel={showAdminPanel} 
                    activeModal={activeModal}
                    setActiveModal={setActiveModal}
                    quoteContent={quoteContent}
                    setQuoteContent={setQuoteContent}
                    appActions={appActions}
                />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} onBack={showPublicSite} />;
      case 'admin':
        return <DashboardPage onLogout={handleLogout} />;
      default:
        return <LandingPage 
                    onAdminPanel={showAdminPanel}
                    activeModal={activeModal}
                    setActiveModal={setActiveModal}
                    quoteContent={quoteContent}
                    setQuoteContent={setQuoteContent}
                    appActions={appActions}
                />;
    }
  };

  return <>{renderContent()}</>;
};

export default App;