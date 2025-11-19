import React from 'react';
import { motion } from 'framer-motion';

interface SuggestionCardProps {
  text: string;
  onClick: () => void;
  isSelected?: boolean;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  text,
  onClick,
  isSelected = false
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-[#D4D4D4] rounded-2xl p-4 cursor-pointer transition-all ${
        isSelected
          ? 'ring-2 ring-[#283618] bg-[#283618]/10'
          : 'hover:bg-[#c4c4c4]'
      }`}
    >
      <p className="text-lg">{text}</p>
    </motion.div>
  );
};

export default SuggestionCard;