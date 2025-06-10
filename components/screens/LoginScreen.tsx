
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useHistory } from '../../contexts/HistoryContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { AuthPageLayout } from '../ui/PageLayout';
import { AppScreen } from '../../types';

export const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addHistoryEntry } = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Nome de usuário é obrigatório.');
      return;
    }
    // Simplified login, no password check
    await login(username, password);
    addHistoryEntry(`Usuário '${username}' logado.`);
    navigate(AppScreen.FileManagement);
  };

  return (
    <AuthPageLayout title="Login">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nome de Usuário"
          id="username"
          type="text"
          value={username}
          onChange={(e) => { setUsername(e.target.value); setError(''); }}
          placeholder="Digite seu nome de usuário"
          required
        />
        <Input
          label="Senha"
          id="password"
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(''); }}
          placeholder="Digite sua senha"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" variant="primary" className="w-full">
          Entrar
        </Button>
        <p className="text-sm text-center text-slate-600">
          Não tem uma conta?{' '}
          <Link to={AppScreen.Register} className="font-medium text-sky-dark hover:text-sky-deep">
            Cadastre-se
          </Link>
        </p>
      </form>
    </AuthPageLayout>
  );
};
