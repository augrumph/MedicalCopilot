import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface BigButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'accent' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const BigButton: React.FC<BigButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  loading = false,
  className = ''
}) => {
  const baseClasses = 'w-full py-6 px-8 rounded-2xl text-xl font-semibold transition-all duration-200 flex items-center justify-center';
  
  const variantClasses = {
    primary: disabled || loading
      ? 'bg-[#283618]/50 text-white cursor-not-allowed'
      : 'bg-[#283618] text-white hover:bg-[#1e2914] active:scale-95',
    accent: disabled || loading
      ? 'bg-[#B7B7A4]/50 text-[#283618] cursor-not-allowed'
      : 'bg-[#B7B7A4] text-[#283618] hover:bg-[#a8a894] active:scale-95',
    secondary: disabled || loading
      ? 'bg-[#D4D4D4]/50 text-[#283618] cursor-not-allowed'
      : 'bg-[#D4D4D4] text-[#283618] hover:bg-[#c4c4c4] active:scale-95'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Carregando...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default BigButton;