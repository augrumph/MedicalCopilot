import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface RedFlagPillProps {
  text: string;
}

const RedFlagPill: React.FC<RedFlagPillProps> = ({ text }) => {
  return (
    <div className="flex items-center bg-red-500/20 border border-red-500/50 rounded-full px-4 py-2">
      <AlertTriangle className="h-4 w-4 mr-2 text-red-400" />
      <span className="text-red-300 text-base">{text}</span>
    </div>
  );
};

export default RedFlagPill;