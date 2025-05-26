
import React from 'react';
import { useHistory } from '../../contexts/HistoryContext';
import { PageLayout } from '../ui/PageLayout';
import { HistoryEntry } from '../../types';
import { Button } from '../ui/Button';

const HistoryItem: React.FC<{ entry: HistoryEntry }> = ({ entry }) => (
  <div className="p-4 bg-sky-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <p className="font-medium text-sky-dark">{entry.action}</p>
    {entry.details && <p className="text-sm text-slate-600 mt-1">Detalhes: {entry.details}</p>}
    <p className="text-xs text-slate-400 mt-1">
      {new Date(entry.timestamp).toLocaleString('pt-BR')}
    </p>
  </div>
);

export const HistoryScreen: React.FC = () => {
  const { historyEntries, clearHistory, addHistoryEntry } = useHistory();

  const handleClearHistory = () => {
    const confirmed = window.confirm("Tem certeza que deseja limpar todo o histórico?");
    if (confirmed) {
        clearHistory();
        addHistoryEntry("Histórico de atividades limpo.");
        alert("Histórico limpo com sucesso!");
    }
  };

  return (
    <PageLayout title="Histórico de Atividades">
      {historyEntries.length > 0 ? (
        <>
        <div className="mb-6 text-right">
            <Button onClick={handleClearHistory} variant="danger">
                Limpar Histórico
            </Button>
        </div>
        <div className="space-y-4">
          {historyEntries.map((entry) => (
            <HistoryItem key={entry.id} entry={entry} />
          ))}
        </div>
        </>
      ) : (
        <div className="text-center py-10">
            <img src="https://picsum.photos/300/200?random=history" alt="Empty history illustration" className="mx-auto rounded-lg shadow-md mb-6" />
            <p className="text-slate-500 text-lg">Seu histórico de atividades está vazio.</p>
            <p className="text-slate-400">As ações que você realizar no aplicativo aparecerão aqui.</p>
        </div>
      )}
    </PageLayout>
  );
};
