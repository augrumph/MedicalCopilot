import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ProtocolsLayoutProps {
  children: ReactNode;
}

export function ProtocolsLayout({ children }: ProtocolsLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4 py-8 space-y-8">
        {children}
      </div>
    </motion.div>
  );
}
