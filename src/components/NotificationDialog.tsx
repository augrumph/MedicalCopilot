import { useState, useEffect} from'react';
import {
 Bell,
 X,
 AlertTriangle,
 CheckCircle,
 Info
} from'lucide-react';
import { Button} from'@/components/ui/button';
import { Badge} from'@/components/ui/badge';
import { ScrollArea} from'@/components/ui/scroll-area';
import { motion, AnimatePresence} from'framer-motion';

interface Notification {
 id: string;
 title: string;
 description: string;
 type:'info' |'warning' |'success' |'error';
 timestamp: string;
 read: boolean;
 category: string;
}

interface NotificationDialogProps {
 isOpen: boolean;
 onClose: () => void;
}

export function NotificationDialog({ isOpen, onClose}: NotificationDialogProps) {
 const [notifications, setNotifications] = useState<Notification[]>([
 {
 id:'1',
 title:'Consulta agendada',
 description:'Sua consulta com Maria Silva está marcada para amanhã às 14h',
 type:'info',
 timestamp:'10 min atrás',
 read: false,
 category:'Consultas'
},
 {
 id:'2',
 title:'Resultado de exame disponível',
 description:'Os resultados do hemograma completo de João Oliveira estão prontos',
 type:'success',
 timestamp:'2 horas atrás',
 read: true,
 category:'Exames'
},
 {
 id:'3',
 title:'Lembrete de medicamento',
 description:'Lembre-se de renovar a receita de metformina para o paciente Ana Costa',
 type:'warning',
 timestamp:'1 dia atrás',
 read: false,
 category:'Medicamentos'
},
 {
 id:'4',
 title:'Nova mensagem',
 description:'Carlos Santos enviou uma nova mensagem sobre sua consulta',
 type:'info',
 timestamp:'1 dia atrás',
 read: true,
 category:'Mensagens'
},
 {
 id:'5',
 title:'Atualização do sistema',
 description:'Nova versão do Medical Copilot disponível com melhorias de segurança',
 type:'info',
 timestamp:'2 dias atrás',
 read: true,
 category:'Sistema'
},
 {
 id:'6',
 title:'Exame com resultado anormal',
 description:'Nível elevado de glicose detectado no exame de rotina',
 type:'warning',
 timestamp:'2 dias atrás',
 read: true,
 category:'Exames'
},
 {
 id:'7',
 title:'Consulta cancelada',
 description:'O paciente Roberto Almeida cancelou a consulta de amanhã',
 type:'error',
 timestamp:'3 dias atrás',
 read: true,
 category:'Consultas'
}
 ]);

 const [activeCategory, setActiveCategory] = useState<string>('Todas');
 const [unreadCount, setUnreadCount] = useState(0);

 // Contar notificações não lidas
 useEffect(() => {
 const count = notifications.filter(n => !n.read).length;
 setUnreadCount(count);
}, [notifications]);

 const categories = ['Todas', ...Array.from(new Set(notifications.map(n => n.category)))];

 const getNotificationIcon = (type: string) => {
 switch (type) {
 case'success':
 return <CheckCircle className="h-5 w-5 text-green-500" />;
 case'warning':
 return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
 case'error':
 return <AlertTriangle className="h-5 w-5 text-red-500" />;
 default:
 return <Info className="h-5 w-5 text-blue-500" />;
}
};

 const getNotificationColor = (type: string) => {
 switch (type) {
 case'success':
 return'bg-green-50 border-green-200';
 case'warning':
 return'bg-yellow-50 border-yellow-200';
 case'error':
 return'bg-red-50 border-red-200';
 default:
 return'bg-blue-50 border-blue-200';
}
};

 const filteredNotifications = activeCategory ==='Todas' 
 ? notifications 
 : notifications.filter(n => n.category === activeCategory);

 const markAsRead = (id: string) => {
 setNotifications(prev => 
 prev.map(n => 
 n.id === id ? { ...n, read: true} : n
 )
 );
};

 const markAllAsRead = () => {
 setNotifications(prev => 
 prev.map(n => ({ ...n, read: true}))
 );
};

 const deleteNotification = (id: string) => {
 setNotifications(prev => prev.filter(n => n.id !== id));
};

 return (
 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity: 0}}
 animate={{ opacity: 1}}
 exit={{ opacity: 0}}
 className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-end p-4"
 onClick={onClose}
 >
 <motion.div
 initial={{ x:'100%'}}
 animate={{ x: 0}}
 exit={{ x:'100%'}}
 transition={{ type:'spring', damping: 20, stiffness: 300}}
 className="w-full max-w-md h-[calc(100vh-2rem)] bg-white rounded-xl shadow-2xl flex flex-col"
 onClick={(e) => e.stopPropagation()}
 >
 {/* Header */}
 <div className="flex items-center justify-between p-4 border-b border-gray-200">
 <div className="flex items-center gap-2">
 <Bell className="h-6 w-6 text-[#8C00FF]" />
 <h2 className="text-lg font-bold text-gray-900">Notificações</h2>
 {unreadCount > 0 && (
 <Badge className="bg-[#8C00FF] text-white text-xs">
 {unreadCount}
 </Badge>
 )}
 </div>
 <Button
 variant="ghost"
 size="icon"
 onClick={onClose}
 className="h-8 w-8 text-gray-500"
 >
 <X className="h-4 w-4" />
 </Button>
 </div>

 {/* Categories */}
 <div className="flex overflow-x-auto px-4 py-2 border-b border-gray-200 bg-gray-50">
 <div className="flex gap-2">
 {categories.map((category) => (
 <Button
 key={category}
 variant={activeCategory === category ?'default' :'ghost'}
 size="sm"
 className={`whitespace-nowrap ${
 activeCategory === category 
 ?'bg-[#8C00FF] text-white' 
 :'text-gray-600'
}`}
 onClick={() => setActiveCategory(category)}
 >
 {category}
 </Button>
 ))}
 </div>
 </div>

 {/* Actions */}
 <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
 <p className="text-sm text-gray-600">
 {filteredNotifications.length} {filteredNotifications.length === 1 ?'notificação' :'notificações'}
 </p>
 {notifications.some(n => !n.read) && (
 <Button
 variant="ghost"
 size="sm"
 onClick={markAllAsRead}
 className="text-[#8C00FF] #8C00FF] #8C00FF]/10"
 >
 Marcar todas como lidas
 </Button>
 )}
 </div>

 {/* Notifications List */}
 <ScrollArea className="flex-1 p-4">
 <div className="space-y-3">
 {filteredNotifications.length === 0 ? (
 <div className="text-center py-8">
 <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
 <p className="text-gray-500">Nenhuma notificação</p>
 <p className="text-sm text-gray-400 mt-1">As notificações aparecerão aqui</p>
 </div>
 ) : (
 filteredNotifications.map((notification) => (
 <motion.div
 key={notification.id}
 initial={{ opacity: 0, y: 10}}
 animate={{ opacity: 1, y: 0}}
 className={`p-4 rounded-lg border ${getNotificationColor(notification.type)} ${
 !notification.read ?'ring-2 ring-[#8C00FF]/30' :''
} relative group transition-shadow`}
 >
 <div className="flex items-start gap-3">
 {getNotificationIcon(notification.type)}
 <div className="flex-1 min-w-0">
 <div className="flex items-start justify-between gap-2">
 <h3 className={`font-semibold text-sm text-gray-900 ${
 !notification.read ?'text-[#8C00FF]' :''
}`}>
 {notification.title}
 </h3>
 {!notification.read && (
 <div className="h-2 w-2 rounded-full bg-[#8C00FF] flex-shrink-0 mt-1.5" />
 )}
 </div>
 <p className="text-sm text-gray-600 mt-1 mb-2">
 {notification.description}
 </p>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span className="text-xs text-gray-500">
 {notification.timestamp}
 </span>
 <Badge variant="secondary" className="text-xs">
 {notification.category}
 </Badge>
 </div>
 <div className="flex items-center gap-1 opacity-0 group-transition-opacity">
 <Button
 variant="ghost"
 size="sm"
 onClick={() => markAsRead(notification.id)}
 className="h-6 w-6 p-0 text-gray-400"
 title="Marcar como lida"
 >
 <CheckCircle className="h-3 w-3" />
 </Button>
 <Button
 variant="ghost"
 size="sm"
 onClick={() => deleteNotification(notification.id)}
 className="h-6 w-6 p-0 text-gray-400"
 title="Excluir"
 >
 <X className="h-3 w-3" />
 </Button>
 </div>
 </div>
 </div>
 </div>
 
 {/* Action buttons overlay */}
 <div className="absolute inset-0 bg-white bg-opacity-90 opacity-0 group-transition-opacity flex items-center justify-end p-4 gap-2">
 <Button
 variant="outline"
 size="sm"
 onClick={() => markAsRead(notification.id)}
 className="border-gray-300"
 >
 <CheckCircle className="h-4 w-4 mr-1" />
 Lida
 </Button>
 <Button
 variant="outline"
 size="sm"
 onClick={() => deleteNotification(notification.id)}
 className="border-red-300 text-red-600"
 >
 <X className="h-4 w-4 mr-1" />
 Excluir
 </Button>
 </div>
 </motion.div>
 ))
 )}
 </div>
 </ScrollArea>

 {/* Footer */}
 <div className="p-4 border-t border-gray-200 bg-gray-50">
 <Button
 variant="outline"
 className="w-full border-gray-300 text-gray-700"
 onClick={onClose}
 >
 Fechar
 </Button>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 );
}