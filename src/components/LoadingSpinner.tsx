import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '', 
  label = 'Carregando...' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div
        className={cn(
          'animate-spin rounded-full border-4 border-current border-t-transparent',
          sizeClasses[size],
          className
        )}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Carregando...</span>
      </div>
      {label && (
        <p className="mt-2 text-sm text-gray-600">{label}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;