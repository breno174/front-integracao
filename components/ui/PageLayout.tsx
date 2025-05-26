
import React from 'react';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-sky-dark mb-8 text-center">{title}</h1>
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-4xl mx-auto">
          {children}
        </div>
      </main>
      <footer className="bg-sky-dark text-center p-4 text-white text-sm">
        © {new Date().getFullYear()} FileZip App. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export const AuthPageLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
   return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-light to-sky-accent p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
             <h1 className="text-3xl font-bold text-sky-dark mb-8 text-center">{title}</h1>
            {children}
        </div>
        <p className="text-center text-white text-sm mt-8">
            © {new Date().getFullYear()} FileZip App.
        </p>
    </div>
   )
}
