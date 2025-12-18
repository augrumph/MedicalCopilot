import React from'react';
import { motion} from'framer-motion';

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
 whileHover={{ scale: 1.03, boxShadow:"0 4px 12px -2px rgba(0, 0, 0, 0.1)"}}
 whileTap={{ scale: 0.97}}
 transition={{ type:"spring", stiffness: 400, damping: 25}}
 onClick={onClick}
 className={`bg-[#D4D4D4] rounded-2xl p-4 cursor-pointer transition-all ${
 isSelected
 ?'ring-2 ring-[#283618] bg-[#283618]/10'
 :'hover:bg-[#c8c8c8] hover:shadow-md'
}`}
 >
 <p className="text-lg">{text}</p>
 </motion.div>
 );
};

export default SuggestionCard;