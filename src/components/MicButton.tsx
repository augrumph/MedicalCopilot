import React from'react';
import { Mic, MicOff} from'lucide-react';
import { motion} from'framer-motion';

interface MicButtonProps {
 isListening: boolean;
 onClick: () => void;
 className?: string;
}

const MicButton: React.FC<MicButtonProps> = ({
 isListening,
 onClick,
 className =''
}) => {
 return (
 <motion.button
 whileHover={{ scale: 1.05}}
 whileTap={{ scale: 0.95}}
 onClick={onClick}
 aria-label={isListening ? 'Parar gravação' : 'Iniciar gravação'}
 aria-pressed={isListening}
 title={isListening ? 'Parar gravação' : 'Iniciar gravação'}
 className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
 isListening
 ?'bg-[#8b0000] text-white animate-pulse' // Sophisticated dark red for listening
 :'bg-[#D4D4D4] text-[#283618]' // Forest palette for idle
} ${className}`}
 >
 {isListening ? <MicOff className="h-8 w-8" aria-hidden="true" /> : <Mic className="h-8 w-8" aria-hidden="true" />}
 </motion.button>
 );
};

export default MicButton;