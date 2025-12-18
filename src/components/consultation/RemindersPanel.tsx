import { Bell} from'lucide-react';
import { Card, CardContent, CardHeader, CardTitle} from'@/components/ui/card';
import { Badge} from'@/components/ui/badge';
import { motion} from'framer-motion';

interface RemindersPanelProps {
 reminders: string[];
}

export function RemindersPanel({ reminders}: RemindersPanelProps) {
 if (!reminders || reminders.length === 0) {
 return null;
}

 return (
 <Card className="border-amber-500/20 bg-amber-500/5">
 <CardHeader>
 <CardTitle className="flex items-center gap-2 text-lg">
 <Bell className="h-5 w-5 text-amber-500" />
 Coisas que Você Não Pode Esquecer
 </CardTitle>
 </CardHeader>
 <CardContent>
 <div className="flex flex-wrap gap-2">
 {reminders.map((reminder, idx) => (
 <motion.div
 key={idx}
 initial={{ opacity: 0, scale: 0.9}}
 animate={{ opacity: 1, scale: 1}}
 transition={{ delay: idx * 0.05}}
 >
 <Badge
 variant="secondary"
 className="bg-amber-500/10 text-amber-900 dark:text-amber-100 border-amber-500/20 text-sm py-2 px-3"
 >
 {reminder}
 </Badge>
 </motion.div>
 ))}
 </div>
 </CardContent>
 </Card>
 );
}
