
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useFiles } from '../../contexts/FileContext';
import { useHistory } from '../../contexts/HistoryContext';
import { AppScreen } from '../../types';
import { Button } from './Button';

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link to={to} className="text-white hover:text-sky-light px-3 py-2 rounded-md text-sm font-medium transition-colors">
    {children}
  </Link>
);

export const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { clearFiles } = useFiles();
  const { clearHistory, addHistoryEntry } = useHistory();
  const navigate = useNavigate();

  const handleLogout = () => {
    addHistoryEntry("Usuário deslogado");
    logout();
    clearFiles();
    clearHistory(); // Clear history on logout
    navigate(AppScreen.Login);
  };

  if (!currentUser) return null;

  return (
    <nav className="bg-sky-dark shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={AppScreen.Home} className="flex-shrink-0 text-white text-xl font-bold">
              FileZip
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <NavLink to={AppScreen.FileManagement}>Gerenciar Arquivos</NavLink>
                <NavLink to={AppScreen.ZipDownload}>Gerar ZIP</NavLink>
                <NavLink to={AppScreen.History}>Histórico</NavLink>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sky-light mr-4">Olá, {currentUser.username}!</span>
            <Button onClick={handleLogout} variant="ghost" className="text-white hover:bg-sky-deep !bg-sky-accent">
              Sair
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
