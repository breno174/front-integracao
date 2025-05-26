
import React from 'react';
import { useFiles } from '../../contexts/FileContext';
import { useHistory } from '../../contexts/HistoryContext';
import { Button } from '../ui/Button';
import { PageLayout } from '../ui/PageLayout';

export const ZipScreen: React.FC = () => {
  const { files, generateZip } = useFiles();
  const { addHistoryEntry } = useHistory();

  const handleGenerateAndDownload = () => {
    if (files.length > 0) {
      generateZip(); // This function now handles the alert itself
      addHistoryEntry("Tentativa de geração de ZIP.", `Arquivos incluídos: ${files.length}`);
    } else {
       alert("Nenhum arquivo disponível para criar um ZIP. Faça upload de alguns arquivos primeiro.");
       addHistoryEntry("Tentativa de geração de ZIP falhou.", "Nenhum arquivo disponível.");
    }
  };

  return (
    <PageLayout title="Gerar e Baixar ZIP">
      <div className="text-center space-y-6">
        <p className="text-slate-600">
          Clique no botão abaixo para gerar um arquivo ZIP (simulado) contendo todos os seus arquivos enviados.
        </p>
        <div className="flex justify-center">
            <img src="https://picsum.photos/300/200?random=zip" alt="Zip illustration" className="rounded-lg shadow-md mb-6" />
        </div>
        <Button 
          onClick={handleGenerateAndDownload} 
          variant="primary"
          className="px-8 py-3 text-lg"
          disabled={files.length === 0}
        >
          {files.length > 0 ? "Gerar e Baixar ZIP" : "Nenhum arquivo para zipar"}
        </Button>
        {files.length === 0 && (
             <p className="text-sm text-red-500 mt-2">
            Você precisa ter arquivos enviados para gerar um ZIP.
          </p>
        )}
         <p className="text-xs text-slate-500 mt-4">
            (Nota: Esta é uma simulação. Um arquivo de texto listando seus arquivos será baixado.)
        </p>
      </div>
    </PageLayout>
  );
};
