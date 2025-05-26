
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FileProvider } from './contexts/FileContext';
import { HistoryProvider } from './contexts/HistoryContext';
import { LoginScreen } from './components/screens/LoginScreen';
import { RegisterScreen } from './components/screens/RegisterScreen';
import { FileManagementScreen } from './components/screens/FileManagementScreen';
import { ZipScreen } from './components/screens/ZipScreen';
import { HistoryScreen } from './components/screens/HistoryScreen';
import { Navbar } from './components/ui/Navbar';
import { ProtectedRoute } from './components/ui/ProtectedRoute';
import { AppScreen } from './types';

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  return (
    <div className="flex flex-col min-h-screen">
      {currentUser && <Navbar />}
      <div className="flex-grow">
        <Routes>
          <Route path={AppScreen.Login} element={<LoginScreen />} />
          <Route path={AppScreen.Register} element={<RegisterScreen />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path={AppScreen.FileManagement} element={<FileManagementScreen />} />
            <Route path={AppScreen.ZipDownload} element={<ZipScreen />} />
            <Route path={AppScreen.History} element={<HistoryScreen />} />
            <Route path={AppScreen.Home} element={<Navigate to={AppScreen.FileManagement} replace />} />
          </Route>
          
          {/* Fallback route - if logged in, go to files, else to login */}
          <Route 
            path="*" 
            element={currentUser ? <Navigate to={AppScreen.FileManagement} replace /> : <Navigate to={AppScreen.Login} replace />} 
          />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <FileProvider> {/* Depends on AuthProvider for currentUser */}
          <HistoryProvider> {/* Depends on AuthProvider for currentUser */}
            <AppContent />
          </HistoryProvider>
        </FileProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
