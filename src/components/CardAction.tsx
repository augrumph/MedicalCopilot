import React from 'react';
import { motion } from 'framer-motion';

interface CardActionProps {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const CardAction: React.FC<CardActionProps> = ({
  children,
  title,
  icon,
  onClick,
  className = ''
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-[#D4D4D4] rounded-3xl p-8 cursor-pointer transition-all ${className}`}
      onClick={onClick}
    >
      {title && (
        <div className="flex items-center mb-4">
          {icon && <span className="mr-3 text-2xl">{icon}</span>}
          <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
      )}
      <div>{children}</div>
    </motion.div>
  );
};

export default CardAction;