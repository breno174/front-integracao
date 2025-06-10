
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useHistory } from '../../contexts/HistoryContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { AuthPageLayout } from '../ui/PageLayout';
import { AppScreen } from '../../types';

export const RegisterScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addHistoryEntry } = useHistory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Nome de usuário é obrigatório.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    // Simplified registration
    register(username, password);
    addHistoryEntry(`Novo usuário '${username}' registrado.`);
    navigate(AppScreen.FileManagement);
  };

  return (
    <AuthPageLayout title="Cadastro">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nome de Usuário"
          id="username"
          type="text"
          value={username}
          onChange={(e) => {setUsername(e.target.value); setError('');}}
          placeholder="Escolha um nome de usuário"
          required
        />
        <Input
          label="Senha"
          id="password"
          type="password"
          value={password}
          onChange={(e) => {setPassword(e.target.value); setError('');}}
          placeholder="Crie uma senha"
          required
        />
        <Input
          label="Confirmar Senha"
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => {setConfirmPassword(e.target.value); setError('');}}
          placeholder="Confirme sua senha"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" variant="primary" className="w-full">
          Cadastrar
        </Button>
        <p className="text-sm text-center text-slate-600">
          Já tem uma conta?{' '}
          <Link to={AppScreen.Login} className="font-medium text-sky-dark hover:text-sky-deep">
            Faça login
          </Link>
        </p>
      </form>
    </AuthPageLayout>
  );
};
