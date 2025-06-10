
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { UploadedFile } from '../types';
import { useAuth } from './AuthContext'; // To namespace files per user
import axios from '../components/config/api';

interface FileContextType {
  files: UploadedFile[];
  addFile: (file: File) => void;
  generateZip: () => void; // Mock function
  clearFiles: () => void;
  setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [files, setFiles] = useState<UploadedFile[]>(() => {
    if (!currentUser) return [];
    const storedFiles = localStorage.getItem(`files_${currentUser.id}`);
    return storedFiles ? JSON.parse(storedFiles) : [];
  });

  React.useEffect(() => {
    if (currentUser) {
      const storedFiles = localStorage.getItem(`files_${currentUser.id}`);
      setFiles(storedFiles ? JSON.parse(storedFiles) : []);
    } else {
      setFiles([]);
    }
  }, [currentUser]);

  const updateStoredFiles = useCallback((updatedFiles: UploadedFile[]) => {
    if (currentUser) {
      localStorage.setItem(`files_${currentUser.id}`, JSON.stringify(updatedFiles));
    }
  }, [currentUser]);

  const addFile = useCallback((file: File) => {
    const newFile: UploadedFile = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date(),
    };
    setFiles(prevFiles => {
      const updated = [...prevFiles, newFile];
      updateStoredFiles(updated);
      return updated;
    });
  }, [updateStoredFiles]);

  const generateZip = useCallback(async () => {
    // Mock ZIP generation and download
    if (!currentUser || files.length === 0) {
      alert("Nenhum arquivo para zipar.");
      return;
    }
    await axios.post(`/api/zips/`, { userId: currentUser.id, zip_name: `${currentUser.username}_arquivos.zip` })
      .then(response => {
        if (response.status === 200) {
          console.log("ZIP gerado com sucesso!");
        } else {
          console.log("Erro ao gerar o ZIP.");
        }
      })
      .catch(error => {
        console.error("Erro ao gerar o ZIP:", error);
        // alert("Erro ao gerar o ZIP.");
      });
    await axios.get(`/api/zips/generate/${currentUser.id}`).then(response => {
      if (response.status !== 200) {
        alert("Erro ao gerar o ZIP.");        
      }
    })
    const zipContent = files.map(f => `Nome: ${f.name}, Tipo: ${f.type}, Tamanho: ${f.size} bytes`).join('\n');
    const blob = new Blob([zipContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentUser.username}_arquivos.zip.txt`; // Simulate zip with a txt
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert("Arquivo ZIP (simulado) baixado!");
  }, [files, currentUser]);
  
  const clearFiles = useCallback(() => {
    setFiles([]);
    if (currentUser) {
      localStorage.removeItem(`files_${currentUser.id}`);
    }
  }, [currentUser]);


  return (
    <FileContext.Provider value={{ files, setFiles, addFile, generateZip, clearFiles }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFiles = (): FileContextType => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
};
