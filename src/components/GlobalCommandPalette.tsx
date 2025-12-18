import { useEffect, useState} from'react';
import { useNavigate} from'react-router-dom';
import {
 CommandDialog,
 CommandEmpty,
 CommandGroup,
 CommandInput,
 CommandItem,
 CommandList,
 CommandSeparator,
} from'@/components/ui/command';
import {
 Calendar,
 FileText,
 History,
 Home,
 Settings,
 User,
 Users,
 Stethoscope,
} from'lucide-react';
import { useAppStore} from'@/stores/appStore';

export function GlobalCommandPalette() {
 const [open, setOpen] = useState(false);
 const navigate = useNavigate();
 const { patients, consultations, startConsultation} = useAppStore();

 // Get recent patients (últimos 5)
 const recentPatients = patients.slice(0, 5);

 // Get recent consultations (últimas 5)
 const recentConsultations = consultations
 .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
 .slice(0, 5);

 useEffect(() => {
 const down = (e: KeyboardEvent) => {
 if (e.key ==='k' && (e.metaKey || e.ctrlKey)) {
 e.preventDefault();
 setOpen((open) => !open);
}
};

 document.addEventListener('keydown', down);
 return () => document.removeEventListener('keydown', down);
}, []);

 const runCommand = (command: () => void) => {
 setOpen(false);
 command();
};

 return (
 <CommandDialog open={open} onOpenChange={setOpen}>
 <CommandInput placeholder="Buscar pacientes, consultas, páginas..." />
 <CommandList>
 <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

 <CommandGroup heading="Navegação Rápida">
 <CommandItem
 onSelect={() => runCommand(() => navigate('/worklist'))}
 className="gap-2"
 >
 <Home className="h-4 w-4" />
 <span>Worklist</span>
 </CommandItem>
 <CommandItem
 onSelect={() => runCommand(() => navigate('/appointments'))}
 className="gap-2"
 >
 <Calendar className="h-4 w-4" />
 <span>Agenda</span>
 </CommandItem>
 <CommandItem
 onSelect={() => runCommand(() => navigate('/patients'))}
 className="gap-2"
 >
 <Users className="h-4 w-4" />
 <span>Pacientes</span>
 </CommandItem>
 <CommandItem
 onSelect={() => runCommand(() => navigate('/history'))}
 className="gap-2"
 >
 <History className="h-4 w-4" />
 <span>Histórico</span>
 </CommandItem>
 <CommandItem
 onSelect={() => runCommand(() => navigate('/settings'))}
 className="gap-2"
 >
 <Settings className="h-4 w-4" />
 <span>Configurações</span>
 </CommandItem>
 </CommandGroup>

 <CommandSeparator />

 <CommandGroup heading="Ações Rápidas">
 <CommandItem
 onSelect={() => runCommand(() => navigate('/consultation'))}
 className="gap-2"
 >
 <Stethoscope className="h-4 w-4 text-purple-600" />
 <span>Nova Consulta</span>
 <span className="ml-auto text-xs text-gray-500">↵</span>
 </CommandItem>
 <CommandItem
 onSelect={() => runCommand(() => navigate('/patients/new'))}
 className="gap-2"
 >
 <User className="h-4 w-4 text-blue-600" />
 <span>Novo Paciente</span>
 </CommandItem>
 </CommandGroup>

 <CommandSeparator />

 <CommandGroup heading="Pacientes Recentes">
 {recentPatients.map((patient) => (
 <CommandItem
 key={patient.id}
 onSelect={() => runCommand(() => {
 startConsultation(patient);
 navigate('/consultation');
})}
 className="gap-2"
 >
 <User className="h-4 w-4 text-gray-400" />
 <div className="flex flex-col">
 <span>{patient.name}</span>
 <span className="text-xs text-gray-500">
 {patient.age} anos • Click para iniciar consulta
 </span>
 </div>
 </CommandItem>
 ))}
 </CommandGroup>

 <CommandSeparator />

 <CommandGroup heading="Consultas Recentes">
 {recentConsultations.map((consultation) => {
 const patient = patients.find(p => p.id === consultation.patientId);
 return (
 <CommandItem
 key={consultation.id}
 onSelect={() => runCommand(() => navigate(`/consultation/${consultation.id}`))}
 className="gap-2"
 >
 <FileText className="h-4 w-4 text-gray-400" />
 <div className="flex flex-col">
 <span>{patient?.name ||'Paciente'}</span>
 <span className="text-xs text-gray-500">
 {new Date(consultation.startedAt).toLocaleDateString('pt-BR')}
 </span>
 </div>
 </CommandItem>
 );
})}
 </CommandGroup>
 </CommandList>

 {/* Keyboard hint */}
 <div className="border-t px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
 <span>Pressione ESC para fechar</span>
 <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium opacity-100">
 <span className="text-xs">⌘</span>K
 </kbd>
 </div>
 </CommandDialog>
 );
}
