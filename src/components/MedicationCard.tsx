import React, { memo} from'react';
import { motion} from'framer-motion';
import { Card, CardContent} from'@/components/ui/card';
import { Badge} from'@/components/ui/badge';
import { Pill, Clock, Calendar, AlertCircle} from'lucide-react';
import { cn} from'@/lib/utils';
import { Separator} from'@/components/ui/separator';

interface MedicationCardProps {
 med: {
 name: string;
 concentration: string;
 form: string;
 via: string;
 dosage: string;
 duration: string;
 quantity?: string;
 quantityText?: string;
 indication: string;
 type:'primary' |'alternative' |'optional' |'controlled';
 isControlled?: boolean;
 controlledType?: string | null;
};
 idx?: number;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ med}) => {
 const shadowByType = {
 primary:"0 8px 16px -4px rgba(236, 72, 153, 0.2)",
 alternative:"0 8px 16px -4px rgba(251, 191, 36, 0.2)",
 optional:"0 8px 16px -4px rgba(0, 0, 0, 0.1)",
 controlled:"0 8px 16px -4px rgba(147, 51, 234, 0.2)"
 };

 return (
 <motion.div
 whileHover={{
 scale: 1.01,
 y: -2,
 boxShadow: shadowByType[med.type]
 }}
 transition={{ type:"spring", stiffness: 300, damping: 20}}
 >
 <Card className={cn(
"shadow-sm transition-all duration-300 border-l-4",
 med.type ==='primary' &&"border-l-pink-500 bg-white",
 med.type ==='alternative' &&"border-l-amber-400 bg-white",
 med.type ==='optional' &&"border-l-gray-300 bg-gray-50/50",
 med.type ==='controlled' &&"border-l-purple-600 bg-purple-50/30"
 )}>
 <CardContent className="p-5">
 <div className="flex items-start justify-between mb-4">
 <div className="flex items-center gap-4">
 <motion.div
 className={cn(
"h-12 w-12 rounded-xl flex items-center justify-center shadow-sm ring-1 ring-inset",
 med.type ==='primary' &&"bg-pink-50 text-pink-600 ring-pink-100",
 med.type ==='alternative' &&"bg-amber-50 text-amber-600 ring-amber-100",
 med.type ==='optional' &&"bg-gray-100 text-gray-500 ring-gray-200",
 med.type ==='controlled' &&"bg-purple-100 text-purple-600 ring-purple-200"
 )}
 whileHover={{ rotate: [0, -5, 5, 0]}}
 transition={{ duration: 0.3}}
 >
 <Pill className="h-6 w-6" />
 </motion.div>
 <div>
 <div className="flex items-center gap-2">
 <h4 className="font-bold text-lg text-gray-900">{med.name}</h4>
 <span className="text-sm font-medium text-gray-500">{med.concentration}</span>
 </div>
 <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
 <span className="capitalize">{med.form}</span>
 <span className="text-gray-300">•</span>
 <span>{med.via}</span>
 </p>
 </div>
 </div>
 <div className="flex flex-col items-end gap-2">
 <Badge className={cn(
"text-xs font-semibold px-2.5 py-0.5 shadow-none border",
 med.type ==='primary' &&"bg-pink-50 text-pink-700 border-pink-200",
 med.type ==='alternative' &&"bg-amber-50 text-amber-700 border-amber-200",
 med.type ==='optional' &&"bg-gray-100 text-gray-700 border-gray-200",
 med.type ==='controlled' &&"bg-purple-50 text-purple-700 border-purple-200"
 )}>
 {med.type ==='primary' &&'Primeira Escolha'}
 {med.type ==='alternative' &&'Alternativa'}
 {med.type ==='optional' &&'Opcional'}
 {med.type ==='controlled' &&'Controlado'}
 </Badge>
 {med.isControlled && (
 <Badge variant="outline" className="text-[10px] border-purple-200 text-purple-600 bg-white">
 {med.controlledType}
 </Badge>
 )}
 </div>
 </div>

 <Separator className="mb-4 bg-gray-100" />

 <div className="grid sm:grid-cols-2 gap-4">
 <div className="space-y-3">
 <div className="flex items-start gap-3 p-2.5 rounded-lg bg-gray-50/80 transition-all hover:bg-gray-100 hover:scale-[1.02]">
 <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
 <div>
 <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-0.5">Posologia</span>
 <span className="text-sm font-medium text-gray-900">{med.dosage}</span>
 </div>
 </div>
 <div className="flex items-start gap-3 p-2.5 rounded-lg bg-gray-50/80 transition-all hover:bg-gray-100 hover:scale-[1.02]">
 <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
 <div>
 <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-0.5">Duração</span>
 <span className="text-sm font-medium text-gray-900">{med.duration}</span>
 </div>
 </div>
 </div>

 <div className="space-y-3">
 <div className="flex items-start gap-3 p-2.5 rounded-lg bg-gray-50/80 transition-all hover:bg-gray-100 hover:scale-[1.02]">
 <AlertCircle className="h-4 w-4 text-gray-400 mt-0.5" />
 <div>
 <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-0.5">Indicação</span>
 <span className="text-sm font-medium text-gray-900">{med.indication}</span>
 </div>
 </div>
 {med.quantity && (
 <div className="flex items-start gap-3 p-2.5 rounded-lg bg-gray-50/80 transition-all hover:bg-gray-100 hover:scale-[1.02]">
 <Pill className="h-4 w-4 text-gray-400 mt-0.5" />
 <div>
 <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-0.5">Quantidade</span>
 <span className="text-sm font-medium text-gray-900">{med.quantity}</span>
 </div>
 </div>
 )}
 </div>
 </div>
 </CardContent>
 </Card>
 </motion.div>
 );
};

export default memo(MedicationCard);