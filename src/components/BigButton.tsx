import React from'react';
import { motion} from'framer-motion';
import { Loader2} from'lucide-react';

interface BigButtonProps {
 children: React.ReactNode;
 onClick?: () => void;
 variant?:'primary' |'accent' |'secondary';
 disabled?: boolean;
 loading?: boolean;
 className?: string;
}

const BigButton: React.FC<BigButtonProps> = ({
 children,
 onClick,
 variant ='primary',
 disabled = false,
 loading = false,
 className =''
}) => {
 const baseClasses ='w-full py-6 px-8 rounded-2xl text-xl font-semibold transition-all duration-200 flex items-center justify-center';
 
 const variantClasses = {
 primary: disabled || loading
 ?'bg-[#682bd7]/50 text-white cursor-not-allowed'
 :'bg-[#682bd7] text-white #4a1fa0] active:scale-95',
 accent: disabled || loading
 ?'bg-[#e6ddd6]/50 text-[#682bd7] cursor-not-allowed'
 :'bg-[#e6ddd6] text-[#682bd7] #d4cec8] active:scale-95',
 secondary: disabled || loading
 ?'bg-[#e6ddd6]/50 text-[#682bd7] cursor-not-allowed'
 :'bg-[#e6ddd6] text-[#682bd7] #ddd6d0] active:scale-95'
};

 return (
 <motion.button
 whileHover={
 disabled || loading
 ? {}
 : { scale: 1.02, y: -2, boxShadow:"0 10px 20px -5px rgba(0, 0, 0, 0.15)"}
 }
 whileTap={
 disabled || loading
 ? {}
 : { scale: 0.98, y: 0}
 }
 transition={{ type:"spring", stiffness: 400, damping: 17}}
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