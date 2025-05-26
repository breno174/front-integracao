import React, { useState, useCallback } from 'react';
import { useFiles } from '../../contexts/FileContext';
import { useHistory } from '../../contexts/HistoryContext';
import { Button } from '../ui/Button';
import { PageLayout } from '../ui/PageLayout';
import { UploadedFile } from '../../types';

// Helper to format bytes
const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const FileItem: React.FC<{ file: UploadedFile }> = ({ file }) => (
  <li className="flex justify-between items-center p-3 bg-sky-50 hover:bg-sky-100 rounded-md shadow-sm transition-colors">
    <div>
      <p className="font-medium text-sky-dark">{file.name}</p>
      <p className="text-sm text-slate-500">
        {file.type} - {formatBytes(file.size)} - {new Date(file.uploadDate).toLocaleDateString()}
      </p>
    </div>
    {/* Add actions like delete in future */}
  </li>
);

export const FileManagementScreen: React.FC = () => {
  const { files, addFile } = useFiles();
  const { addHistoryEntry } = useHistory();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadMessage('');
    }
  };

  const handleFileUpload = useCallback(async () => {
    if (!selectedFile) {
      setUploadMessage('Por favor, selecione um arquivo para enviar.');
      return;
    }

    setIsUploading(true); // <--- Indica que o upload começou
    setUploadMessage(`Enviando '${selectedFile.name}'...`);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('user_id', '4');
    const backendUrl = 'http://localhost:5000/api/files';

    try {
      // 3. Fazer a requisição POST com fetch
      console.log({"formData": formData, "backendUrl": backendUrl});
      const response = await fetch(backendUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Sucesso no upload:', data);
        addFile(selectedFile); 
        addHistoryEntry(`Arquivo '${selectedFile.name}' enviado com sucesso.`);
        setUploadMessage(data.message || `Arquivo '${selectedFile.name}' enviado com sucesso!`);
        setSelectedFile(null);

        // Limpa o input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        let errorMessage = `Falha ao enviar '${selectedFile.name}'.`;
        try {
            const errorData = await response.json();
            console.log({"response": errorData});
            errorMessage += ` Motivo: ${errorData.message || response.statusText}`;
        } catch (e) {
            errorMessage += ` Código: ${response.status} - ${response.statusText}`;
        }
        console.error('Erro no upload:', errorMessage);
        setUploadMessage(errorMessage);
      }
    } catch (error) {
      console.error('Erro de conexão ou requisição:', error);
      setUploadMessage(`Erro de conexão ao enviar '${selectedFile.name}'. Verifique sua rede e tente novamente.`);
    } finally {
      setIsUploading(false); // <--- Indica que o upload terminou (sucesso ou erro)
    }

  }, [selectedFile, addFile, addHistoryEntry]);

  return (
    <PageLayout title="Gerenciar Arquivos">
      <div className="space-y-8">
        {/* Section for uploading new files */}
        <section className="p-6 bg-white rounded-lg border border-sky-light shadow-md">
          <h2 className="text-xl font-semibold text-sky-dark mb-4">Enviar Novo Arquivo</h2>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              disabled={isUploading}
              // accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
              accept=".pdf,.txt,.jpg,.jpeg,.png"
              placeholder="Selecione um arquivo"
              aria-label="Selecione um arquivo"
              aria-describedby="file-upload-description"
              aria-required="true"
              aria-invalid={selectedFile ? 'false' : 'true'}
              aria-errormessage={uploadMessage ? 'upload-error' : undefined}
              className="block w-full text-sm text-slate-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-sky-accent file:text-white
                         hover:file:bg-sky-deep cursor-pointer"
            />
            <Button onClick={handleFileUpload} variant="primary" className="w-full sm:w-auto" disabled={!selectedFile || isUploading}>
              {isUploading ? 'Enviando...' : 'Enviar Arquivo'}
            </Button>
          </div>
          {uploadMessage && <p className={`mt-4 text-sm ${uploadMessage.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>{uploadMessage}</p>}
        </section>

        {/* Section for listing uploaded files */}
        <section>
          <h2 className="text-xl font-semibold text-sky-dark mb-4">Seus Arquivos Enviados</h2>
          {files.length > 0 ? (
            <ul className="space-y-3">
              {files.map((file) => (
                <FileItem key={file.id} file={file} />
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-center py-4">Nenhum arquivo enviado ainda. Comece enviando seu primeiro arquivo!</p>
          )}
        </section>
      </div>
    </PageLayout>
  );
};
