import { Button} from'@/components/ui/button';
import { Badge} from'@/components/ui/badge';
import { Appointment} from'@/lib/types/appointment';
import { Phone, Calendar, Clock, User, Stethoscope, CheckCircle, XCircle, AlertCircle, X} from'lucide-react';

interface AppointmentDetailsSidebarProps {
 appointment: Appointment | null;
 onClose: () => void;
 onStatusChange: (status:'confirmed' |'completed' |'cancelled' |'no-show') => void;
}

export function AppointmentDetailsSidebar({
 appointment,
 onClose,
 onStatusChange
}: AppointmentDetailsSidebarProps) {
 if (!appointment) {
 return (
 <div className="w-80 bg-gray-50 p-6 flex flex-col">
 <div className="flex justify-between items-center mb-6">
 <h2 className="text-lg font-semibold text-gray-900">Detalhes</h2>
 <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
 <X className="h-4 w-4" />
 </Button>
 </div>
 <div className="flex flex-col items-center justify-center h-full text-center py-12">
 <div className="bg-[#8C00FF]/10 p-4 rounded-full mb-4">
 <Calendar className="h-8 w-8 text-[#8C00FF]" />
 </div>
 <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum agendamento selecionado</h3>
 <p className="text-gray-600 text-sm max-w-[180px]">
 Selecione um agendamento na agenda para visualizar e gerenciar os detalhes.
 </p>
 </div>
 </div>
 );
}

 const statusConfig = {
 scheduled: { icon: Clock, color:'bg-purple-100 text-purple-800', label:'Agendado'},
 confirmed: { icon: CheckCircle, color:'bg-blue-100 text-blue-800', label:'Confirmado'},
'in-progress': { icon: Stethoscope, color:'bg-purple-100 text-purple-800', label:'Em Andamento'},
 completed: { icon: CheckCircle, color:'bg-green-100 text-green-800', label:'Concluído'},
 cancelled: { icon: XCircle, color:'bg-red-100 text-red-800', label:'Cancelado'},
'no-show': { icon: AlertCircle, color:'bg-gray-100 text-gray-800', label:'Não Compareceu'},
};

 const StatusIcon = statusConfig[appointment.status].icon;

 return (
 <div className="w-80 bg-white p-6 flex flex-col h-full">
 <div className="flex justify-between items-start mb-6">
 <div>
 <h2 className="text-xl font-bold text-gray-900">{appointment.patientName}</h2>
 <div className="flex items-center gap-2 mt-2">
 <Badge className={`${statusConfig[appointment.status].color} px-3 py-1`}>
 <StatusIcon className="h-3 w-3 mr-1" />
 {statusConfig[appointment.status].label}
 </Badge>
 </div>
 </div>
 <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
 <X className="h-4 w-4" />
 </Button>
 </div>

 <div className="space-y-6 flex-1 overflow-y-auto">
 <div className="space-y-4">
 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
 <Calendar className="h-5 w-5 text-[#8C00FF]" />
 <div>
 <p className="text-sm text-gray-500">Data</p>
 <p className="font-medium">{new Date(appointment.date).toLocaleDateString('pt-BR')}</p>
 </div>
 </div>

 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
 <Clock className="h-5 w-5 text-[#8C00FF]" />
 <div>
 <p className="text-sm text-gray-500">Horário</p>
 <p className="font-medium">{appointment.startTime} - {appointment.endTime}</p>
 </div>
 </div>

 {appointment.patientPhone && (
 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
 <Phone className="h-5 w-5 text-[#8C00FF]" />
 <div>
 <p className="text-sm text-gray-500">Telefone</p>
 <p className="font-medium">{appointment.patientPhone}</p>
 </div>
 </div>
 )}

 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
 <User className="h-5 w-5 text-[#8C00FF]" />
 <div>
 <p className="text-sm text-gray-500">Médico</p>
 <p className="font-medium">{appointment.doctorName ||'Dr. Silva'}</p>
 </div>
 </div>
 </div>

 <div className="space-y-4">
 <div>
 <h3 className="text-sm font-medium text-gray-700 mb-2">Tipo de Consulta</h3>
 <Badge variant="outline" className="text-sm">
 {appointment.type ==='consultation' &&'Consulta'}
 {appointment.type ==='follow-up' &&'Retorno'}
 {appointment.type ==='emergency' &&'Emergência'}
 {appointment.type ==='checkup' &&'Check-up'}
 {appointment.type ==='procedure' &&'Procedimento'}
 </Badge>
 </div>

 {appointment.reason && (
 <div>
 <h3 className="text-sm font-medium text-gray-700 mb-2">Motivo</h3>
 <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{appointment.reason}</p>
 </div>
 )}

 {appointment.notes && (
 <div>
 <h3 className="text-sm font-medium text-gray-700 mb-2">Observações</h3>
 <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{appointment.notes}</p>
 </div>
 )}
 </div>

 <div className="pt-4 border-t border-gray-200">
 <h3 className="text-sm font-medium text-gray-700 mb-3">Alterar Status</h3>
 <div className="grid grid-cols-2 gap-2">
 <Button
 size="sm"
 variant={appointment.status ==='confirmed' ?'default' :'outline'}
 className={appointment.status ==='confirmed' ?'bg-[#8C00FF] #7a00e6]' :''}
 onClick={() => onStatusChange('confirmed')}
 >
 Confirmar
 </Button>
 <Button
 size="sm"
 variant={appointment.status ==='completed' ?'default' :'outline'}
 className={appointment.status ==='completed' ?'bg-green-600' :''}
 onClick={() => onStatusChange('completed')}
 >
 Concluir
 </Button>
 <Button
 size="sm"
 variant={appointment.status ==='cancelled' ?'default' :'outline'}
 className={appointment.status ==='cancelled' ?'bg-red-600' :''}
 onClick={() => onStatusChange('cancelled')}
 >
 Cancelar
 </Button>
 <Button
 size="sm"
 variant={appointment.status ==='no-show' ?'default' :'outline'}
 className={appointment.status ==='no-show' ?'bg-gray-600' :''}
 onClick={() => onStatusChange('no-show')}
 >
 Não Compareceu
 </Button>
 </div>
 </div>
 </div>
 </div>
 );
}