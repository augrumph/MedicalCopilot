import { useState, useMemo} from'react';
import { ChevronLeft, ChevronRight} from'lucide-react';
import { Button} from'@/components/ui/button';
import { Card, CardContent} from'@/components/ui/card';
import { Badge} from'@/components/ui/badge';
import type { Appointment} from'@/lib/types/appointment';

interface AppointmentCalendarProps {
 appointments: Appointment[];
 onAppointmentClick?: (appointment: Appointment) => void;
 onDateChange?: (date: Date) => void;
}

const HOURS = Array.from({ length: 11}, (_, i) => i + 8); // 8h às 18h
const DAYS_OF_WEEK = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

export function AppointmentCalendar({
 appointments,
 onAppointmentClick,
 onDateChange
}: AppointmentCalendarProps) {
 const [currentDate, setCurrentDate] = useState(new Date());
 const [viewMode, setViewMode] = useState<'day' |'week'>('week');

 // Format date to YYYY-MM-DD
 const formatDate = (date: Date): string => {
 const year = date.getFullYear();
 const month = String(date.getMonth() + 1).padStart(2,'0');
 const day = String(date.getDate()).padStart(2,'0');
 return `${year}-${month}-${day}`;
};

 // Navigate to next/previous period
 const navigateDate = (direction:'prev' |'next') => {
 const newDate = new Date(currentDate);
 if (viewMode ==='day') {
 newDate.setDate(newDate.getDate() + (direction ==='next' ? 1 : -1));
} else {
 newDate.setDate(newDate.getDate() + (direction ==='next' ? 7 : -7));
}
 setCurrentDate(newDate);
 onDateChange?.(newDate);
};

 // Get today's date
 const goToToday = () => {
 const today = new Date();
 setCurrentDate(today);
 onDateChange?.(today);
};

 // Get week days
 const getWeekDays = (): Date[] => {
 const start = new Date(currentDate);
 start.setDate(start.getDate() - start.getDay());
 return Array.from({ length: 7}, (_, i) => {
 const day = new Date(start);
 day.setDate(start.getDate() + i);
 return day;
});
};

 // Get appointments for a specific date and hour
 const getAppointmentsForSlot = (date: Date, hour: number): Appointment[] => {
 const dateStr = formatDate(date);
 return appointments.filter((apt) => {
 if (apt.date !== dateStr) return false;
 const [startHour] = apt.startTime.split(':').map(Number);
 return startHour === hour;
});
};

 // Format the title based on view mode
 const getTitle = (): string => {
 if (viewMode ==='day') {
 return currentDate.toLocaleDateString('pt-BR', {
 weekday:'long',
 day:'numeric',
 month:'long',
 year:'numeric',
});
} else {
 const weekDays = getWeekDays();
 return `${weekDays[0].getDate()} - ${weekDays[6].getDate()} de ${currentDate.toLocaleDateString('pt-BR', { month:'long', year:'numeric'})}`;
}
};

 // Check if date is today
 const isToday = (date: Date): boolean => {
 const today = new Date();
 return date.toDateString() === today.toDateString();
};

 // Get appointments for the current day in day view
 useMemo(() => {
 if (viewMode ==='day') {
 const dateStr = formatDate(currentDate);
 return appointments.filter(apt => apt.date === dateStr);
}
 return [];
}, [currentDate, appointments, viewMode]);

 return (
 <Card className="w-full overflow-hidden border-0 shadow-sm bg-white">
 <div className="flex items-center justify-between p-6 pb-4">
 <div>
 <h2 className="text-xl font-bold text-gray-900">Agenda</h2>
 <p className="text-gray-600">{getTitle()}</p>
 </div>
 <div className="flex items-center gap-2">
 <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
 <ChevronLeft className="h-4 w-4" />
 </Button>
 <Button variant="outline" size="sm" onClick={goToToday}>
 Hoje
 </Button>
 <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
 <ChevronRight className="h-4 w-4" />
 </Button>
 </div>
 </div>

 <div className="px-6 mb-4 flex items-center justify-between">
 <div className="flex gap-2">
 <Button
 variant={viewMode ==='day' ?'default' :'outline'}
 size="sm"
 onClick={() => setViewMode('day')}
 className={viewMode ==='day' ?'bg-[#8C00FF] #7a00e6]' :''}
 >
 Dia
 </Button>
 <Button
 variant={viewMode ==='week' ?'default' :'outline'}
 size="sm"
 onClick={() => setViewMode('week')}
 className={viewMode ==='week' ?'bg-[#8C00FF] #7a00e6]' :''}
 >
 Semana
 </Button>
 </div>
 </div>

 <CardContent className="p-0">
 {viewMode ==='day' ? (
 // Day View
 <div className="space-y-1 max-h-[500px] overflow-y-auto">
 {HOURS.map((hour) => {
 const slotAppointments = getAppointmentsForSlot(currentDate, hour);
 return (
 <div key={hour} className="flex border-b border-gray-100">
 <div className="w-20 p-3 text-center text-sm font-medium text-gray-500 bg-gray-50 flex items-center justify-center">
 {String(hour).padStart(2,'0')}:00
 </div>
 <div className="flex-1 p-3 min-h-16">
 {slotAppointments.length > 0 ? (
 <div className="space-y-2">
 {slotAppointments.map((apt) => (
 <div
 key={apt.id}
 className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-l-4 border-[#8C00FF] cursor-pointer transition-all"
 onClick={() => onAppointmentClick?.(apt)}
 >
 <div className="flex justify-between items-center">
 <span className="font-semibold text-gray-900">{apt.patientName}</span>
 <Badge className="bg-[#8C00FF] text-white text-xs">
 {apt.startTime} - {apt.endTime}
 </Badge>
 </div>
 <p className="text-sm text-gray-600 mt-1 truncate">{apt.reason}</p>
 <div className="mt-2">
 <Badge variant="outline" className="text-xs">
 {apt.type ==='consultation' &&'Consulta'}
 {apt.type ==='follow-up' &&'Retorno'}
 {apt.type ==='emergency' &&'Emergência'}
 {apt.type ==='checkup' &&'Check-up'}
 {apt.type ==='procedure' &&'Procedimento'}
 </Badge>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="text-sm text-gray-400 italic">Livre</div>
 )}
 </div>
 </div>
 );
})}
 </div>
 ) : (
 // Week View
 <div className="overflow-x-auto">
 <div className="grid grid-cols-8 gap-px bg-gray-200 min-w-max">
 {/* Time column header */}
 <div className="p-3 text-center text-sm font-medium text-gray-700 bg-gray-100"></div>

 {/* Day headers */}
 {getWeekDays().map((day, idx) => (
 <div
 key={idx}
 className={`p-3 text-center text-sm font-medium ${
 isToday(day) ?'bg-[#8C00FF]/10 text-[#8C00FF]' :'bg-gray-100 text-gray-700'
}`}
 >
 <div>{DAYS_OF_WEEK[day.getDay()]}</div>
 <div className={`text-xl font-bold ${isToday(day) ?'text-[#8C00FF]' :'text-gray-900'}`}>
 {day.getDate()}
 </div>
 </div>
 ))}

 {/* Time slots */}
 {HOURS.map((hour) => (
 <>
 {/* Time label */}
 <div className="p-3 text-center text-sm font-medium text-gray-700 bg-gray-100">
 {String(hour).padStart(2,'0')}:00
 </div>

 {/* Day slots */}
 {getWeekDays().map((day, idx) => {
 const slotAppointments = getAppointmentsForSlot(day, hour);
 return (
 <div
 key={`${hour}-${idx}`}
 className="p-2 min-h-20 bg-white"
 >
 {slotAppointments.map((apt) => (
 <div
 key={apt.id}
 className="p-2 mb-1 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-l-4 border-[#8C00FF] cursor-pointer transition-all text-xs"
 onClick={() => onAppointmentClick?.(apt)}
 >
 <div className="font-medium text-gray-900 truncate">{apt.patientName}</div>
 <div className="text-gray-600">{apt.startTime}</div>
 <div className="mt-1">
 <Badge variant="outline" className="text-xs">
 {apt.type ==='consultation' &&'C'}
 {apt.type ==='follow-up' &&'R'}
 {apt.type ==='emergency' &&'E'}
 {apt.type ==='checkup' &&'CH'}
 {apt.type ==='procedure' &&'P'}
 </Badge>
 </div>
 </div>
 ))}
 </div>
 );
})}
 </>
 ))}
 </div>
 </div>
 )}
 </CardContent>
 </Card>
 );
}