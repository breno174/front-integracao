
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "font-semibold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-colors duration-150 ease-in-out";
  
  let variantStyle = '';
  switch (variant) {
    case 'primary': // Green action button
      variantStyle = 'bg-green-action text-white hover:bg-green-action-hover focus:ring-green-action';
      break;
    case 'secondary': // Dark blue button
      variantStyle = 'bg-sky-dark text-white hover:bg-sky-deep focus:ring-sky-dark';
      break;
    case 'danger':
      variantStyle = 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500';
      break;
    case 'ghost': // For less prominent actions or links styled as buttons
      variantStyle = 'bg-transparent text-sky-dark hover:bg-sky-100 focus:ring-sky-dark';
      break;
  }

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
