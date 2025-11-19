import React from 'react';
import { motion } from 'framer-motion';

const LoadingDots: React.FC = () => {
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-3 w-3 rounded-full bg-[#283618]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

export default LoadingDots;