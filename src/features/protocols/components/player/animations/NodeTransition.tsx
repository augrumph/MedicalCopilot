import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { nodeTransition } from '@/lib/animations/protocol-animations';

interface NodeTransitionProps {
  children: ReactNode;
  nodeId: string;
}

export function NodeTransition({ children, nodeId }: NodeTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={nodeId}
        variants={nodeTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
