
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-sky-dark mb-1">{label}</label>}
      <input
        id={id}
        className={`w-full px-3 py-2 border border-sky-light rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-accent focus:border-sky-accent sm:text-sm text-slate-700 ${className}`}
        {...props}
      />
    </div>
  );
};
