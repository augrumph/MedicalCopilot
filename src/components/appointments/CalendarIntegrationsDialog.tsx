import { useState, useEffect} from'react';
import { useGoogleLogin} from'@react-oauth/google';
import { PublicClientApplication} from'@azure/msal-browser';
import { motion, AnimatePresence} from'framer-motion';
import {
 X,
 Calendar,
 Trash2,
 CheckCircle,
 Mail,
 Apple,
 ChevronRight,
} from'lucide-react';
import { Button} from'@/components/ui/button';
import { Input} from'@/components/ui/input';
import { Card, CardContent} from'@/components/ui/card';
import { useCalendarIntegrationsStore} from'@/stores/calendarIntegrationsStore';
import { toast} from'sonner';

interface CalendarIntegrationsDialogProps {
 isOpen: boolean;
 onClose: () => void;
}

type CalendarProvider ='google' |'microsoft' |'apple' |'other' | null;

// Microsoft OAuth configuration
const msalConfig = {
 auth: {
 clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID ||'placeholder-client-id',
 authority:'https://login.microsoftonline.com/common',
 redirectUri: window.location.origin,
},
};

const msalInstance = new PublicClientApplication(msalConfig);

export function CalendarIntegrationsDialog({
 isOpen,
 onClose,
}: CalendarIntegrationsDialogProps) {
 const {
 googleCalendar,
 connectGoogle,
 disconnectGoogle,
 microsoftCalendar,
 connectMicrosoft,
 disconnectMicrosoft,
 icalFeeds,
 addIcalFeed,
 removeIcalFeed,
} = useCalendarIntegrationsStore();

 const [selectedProvider, setSelectedProvider] = useState<CalendarProvider>(null);
 const [icalUrl, setIcalUrl] = useState('');
 const [icalName, setIcalName] = useState('');

 // Check if providers are configured
 const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ||'';
 const isGoogleConfigured = googleClientId && googleClientId !=='' && googleClientId !=='placeholder-client-id';

 const microsoftClientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID ||'';
 const isMicrosoftConfigured = microsoftClientId && microsoftClientId !=='' && microsoftClientId !=='placeholder-client-id';

 // Initialize MSAL
 useEffect(() => {
 if (isMicrosoftConfigured) {
 msalInstance.initialize();
}
}, [isMicrosoftConfigured]);

 const handleConnectGoogle = useGoogleLogin({
 onSuccess: async (tokenResponse) => {
 try {
 const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
 headers: { Authorization: `Bearer ${tokenResponse.access_token}`},
});
 const userInfo = await userInfoResponse.json();

 connectGoogle(userInfo.email, tokenResponse.access_token, tokenResponse.expires_in);
 toast.success('Google Calendar conectado!');
 setSelectedProvider(null);
} catch (error) {
 console.error('Error fetching user info:', error);
 toast.error('Erro ao conectar com Google Calendar');
}
},
 onError: () => {
 toast.error('Erro ao conectar com Google Calendar');
},
 scope:'https://www.googleapis.com/auth/calendar.events.readonly',
});

 const handleConnectMicrosoft = async () => {
 try {
 const loginResponse = await msalInstance.loginPopup({
 scopes: ['Calendars.Read','User.Read'],
});

 const account = loginResponse.account;
 connectMicrosoft(
 account.username,
 loginResponse.accessToken,
 3600 // 1 hour in seconds
 );
 toast.success('Microsoft Calendar conectado!');
 setSelectedProvider(null);
} catch (error) {
 console.error('Microsoft login error:', error);
 toast.error('Erro ao conectar com Microsoft Calendar');
}
};

 const handleDisconnectGoogle = () => {
 disconnectGoogle();
 toast.info('Google Calendar desconectado');
};

 const handleDisconnectMicrosoft = () => {
 disconnectMicrosoft();
 toast.info('Microsoft Calendar desconectado');
};

 const handleAddIcalFeed = (provider:'apple' |'other') => {
 if (!icalUrl.trim()) {
 toast.error('Por favor, insira o link do calendário');
 return;
}

 try {
 new URL(icalUrl.replace('webcal://','https://'));
} catch {
 toast.error('Link inválido. Verifique e tente novamente.');
 return;
}

 const lowerUrl = icalUrl.toLowerCase();
 if (!lowerUrl.includes('ical') && !lowerUrl.includes('calendar') && !lowerUrl.endsWith('.ics') && !lowerUrl.startsWith('webcal://')) {
 toast.error('O link não parece ser um calendário válido (.ics)');
 return;
}

 const defaultName = provider ==='apple' ?'Apple Calendar' :'Meu Calendário';
 const name = icalName.trim() || `${defaultName} ${icalFeeds.length + 1}`;

 addIcalFeed(name, icalUrl);
 toast.success(`${name} conectado!`);

 // Reset
 setIcalUrl('');
 setIcalName('');
 setSelectedProvider(null);
};

 const handleRemoveIcalFeed = (id: string, name: string) => {
 removeIcalFeed(id);
 toast.info(`${name} desconectado`);
};

 // Reset when closing
 const handleClose = () => {
 setSelectedProvider(null);
 setIcalUrl('');
 setIcalName('');
 onClose();
};

 return (
 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity: 0}}
 animate={{ opacity: 1}}
 exit={{ opacity: 0}}
 className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
 onClick={handleClose}
 >
 <motion.div
 initial={{ scale: 0.95, opacity: 0}}
 animate={{ scale: 1, opacity: 1}}
 exit={{ scale: 0.95, opacity: 0}}
 transition={{ type:'spring', damping: 25, stiffness: 300}}
 className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
 onClick={(e) => e.stopPropagation()}
 >
 {/* Header */}
 <div className="flex items-center justify-between p-6 border-b border-gray-200">
 <div>
 <h2 className="text-2xl font-bold text-gray-900">
 {selectedProvider ?'Conectar Calendário' :'Conecte sua Agenda'}
 </h2>
 <p className="text-sm text-gray-600 mt-1">
 {selectedProvider
 ?'Siga as instruções abaixo'
 :'Escolha de onde você quer importar seus compromissos'
}
 </p>
 </div>
 <Button
 variant="ghost"
 size="icon"
 onClick={handleClose}
 className="h-10 w-10 text-gray-500 rounded-xl"
 >
 <X className="h-5 w-5" />
 </Button>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-6">
 {!selectedProvider ? (
 /* Main Selection Screen */
 <div className="space-y-6">
 {/* Grid 2x2 */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {/* Google Calendar Card */}
 {!googleCalendar.connected ? (
 <Card
 className="border-2 border-gray-200 transition-all cursor-pointer group"
 onClick={() => {
 if (isGoogleConfigured) {
 setSelectedProvider('google');
} else {
 toast.error('Google Calendar não configurado. Verifique o arquivo .env');
}
}}
 >
 <CardContent className="p-5">
 <div className="flex flex-col items-center text-center gap-3">
 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md border border-gray-100">
 <svg viewBox="0 0 24 24" className="h-9 w-9">
 <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
 <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
 <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
 <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
 </svg>
 </div>
 <div>
 <h3 className="text-base font-bold text-gray-900 group-transition-colors mb-1">
 Google Calendar
 </h3>
 <p className="text-xs text-gray-600">
 Doctoralia, iClinic, Android
 </p>
 </div>
 <ChevronRight className="h-5 w-5 text-gray-400 group-group-transition-all" />
 </div>
 </CardContent>
 </Card>
 ) : (
 <Card className="border-2 border-green-200 bg-green-50">
 <CardContent className="p-5">
 <div className="flex flex-col items-center text-center gap-3">
 <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
 <CheckCircle className="h-9 w-9 text-green-600" />
 </div>
 <div className="flex-1">
 <h3 className="text-base font-bold text-gray-900 mb-1">Google Calendar</h3>
 <p className="text-xs text-gray-600 truncate">{googleCalendar.email}</p>
 </div>
 <Button
 onClick={handleDisconnectGoogle}
 variant="outline"
 size="sm"
 className="border-red-200 text-red-600 text-xs h-8"
 >
 Desconectar
 </Button>
 </div>
 </CardContent>
 </Card>
 )}

 {/* Microsoft Calendar Card */}
 {!microsoftCalendar.connected ? (
 <Card
 className="border-2 border-gray-200 transition-all cursor-pointer group"
 onClick={() => {
 if (isMicrosoftConfigured) {
 setSelectedProvider('microsoft');
} else {
 toast.error('Microsoft Calendar não configurado. Verifique o arquivo .env');
}
}}
 >
 <CardContent className="p-5">
 <div className="flex flex-col items-center text-center gap-3">
 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md border border-gray-100">
 <svg viewBox="0 0 24 24" className="h-9 w-9">
 <path fill="#f25022" d="M1 1h10v10H1z"/>
 <path fill="#00a4ef" d="M13 1h10v10H13z"/>
 <path fill="#7fba00" d="M1 13h10v10H1z"/>
 <path fill="#ffb900" d="M13 13h10v10H13z"/>
 </svg>
 </div>
 <div>
 <h3 className="text-base font-bold text-gray-900 group-transition-colors mb-1">
 Outlook / Office 365
 </h3>
 <p className="text-xs text-gray-600">
 Hotmail, Live, Microsoft
 </p>
 </div>
 <ChevronRight className="h-5 w-5 text-gray-400 group-group-transition-all" />
 </div>
 </CardContent>
 </Card>
 ) : (
 <Card className="border-2 border-green-200 bg-green-50">
 <CardContent className="p-5">
 <div className="flex flex-col items-center text-center gap-3">
 <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
 <CheckCircle className="h-9 w-9 text-green-600" />
 </div>
 <div className="flex-1">
 <h3 className="text-base font-bold text-gray-900 mb-1">Outlook / Office 365</h3>
 <p className="text-xs text-gray-600 truncate">{microsoftCalendar.email}</p>
 </div>
 <Button
 onClick={handleDisconnectMicrosoft}
 variant="outline"
 size="sm"
 className="border-red-200 text-red-600 text-xs h-8"
 >
 Desconectar
 </Button>
 </div>
 </CardContent>
 </Card>
 )}

 {/* Apple Calendar Card */}
 <Card
 className="border-2 border-gray-200 transition-all cursor-pointer group"
 onClick={() => setSelectedProvider('apple')}
 >
 <CardContent className="p-5">
 <div className="flex flex-col items-center text-center gap-3">
 <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-600 rounded-2xl flex items-center justify-center shadow-md">
 <Apple className="h-9 w-9 text-white" />
 </div>
 <div>
 <h3 className="text-base font-bold text-gray-900 group-transition-colors mb-1">
 Apple Calendar
 </h3>
 <p className="text-xs text-gray-600">
 Mac, iPhone, iPad
 </p>
 </div>
 <ChevronRight className="h-5 w-5 text-gray-400 group-group-transition-all" />
 </div>
 </CardContent>
 </Card>

 {/* Other Systems Card */}
 <Card
 className="border-2 border-gray-200 transition-all cursor-pointer group"
 onClick={() => setSelectedProvider('other')}
 >
 <CardContent className="p-5">
 <div className="flex flex-col items-center text-center gap-3">
 <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md">
 <Calendar className="h-9 w-9 text-white" />
 </div>
 <div>
 <h3 className="text-base font-bold text-gray-900 group-transition-colors mb-1">
 Outros Sistemas
 </h3>
 <p className="text-xs text-gray-600">
 Feegow, ProDoctor, etc.
 </p>
 </div>
 <ChevronRight className="h-5 w-5 text-gray-400 group-group-transition-all" />
 </div>
 </CardContent>
 </Card>
 </div>

 {/* Connected Calendars List */}
 {icalFeeds.length > 0 && (
 <div className="mt-8">
 <h3 className="text-sm font-semibold text-gray-700 mb-3">Calendários conectados via iCal:</h3>
 <div className="space-y-2">
 {icalFeeds.map((feed) => (
 <Card key={feed.id} className="border border-gray-200">
 <CardContent className="p-4 flex items-center justify-between">
 <div className="flex items-center gap-3 flex-1 min-w-0">
 <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
 <CheckCircle className="h-5 w-5 text-green-600" />
 </div>
 <div className="min-w-0 flex-1">
 <p className="font-semibold text-gray-900">{feed.name}</p>
 <p className="text-xs text-gray-500 truncate">{feed.url}</p>
 </div>
 </div>
 <Button
 size="sm"
 variant="ghost"
 onClick={() => handleRemoveIcalFeed(feed.id, feed.name)}
 className="text-red-500 flex-shrink-0"
 >
 <Trash2 className="h-4 w-4" />
 </Button>
 </CardContent>
 </Card>
 ))}
 </div>
 </div>
 )}
 </div>
 ) : selectedProvider ==='google' ? (
 /* Google Setup Screen */
 <div className="space-y-6">
 <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
 <div className="flex items-start gap-4">
 <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
 <Mail className="h-6 w-6 text-blue-600" />
 </div>
 <div className="flex-1">
 <h3 className="text-lg font-bold text-gray-900 mb-2">Como conectar:</h3>
 <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
 <li>Clique no botão abaixo</li>
 <li>Faça login com sua conta Google</li>
 <li>Clique em"Avançado" se aparecer aviso de segurança</li>
 <li>Autorize o acesso ao calendário</li>
 <li>Pronto! Seus eventos serão sincronizados automaticamente</li>
 </ol>
 </div>
 </div>
 </div>

 <div className="flex gap-3">
 <Button
 onClick={() => setSelectedProvider(null)}
 variant="outline"
 className="flex-1"
 >
 Voltar
 </Button>
 <Button
 onClick={() => handleConnectGoogle()}
 className="flex-1 bg-blue-600 text-white font-semibold"
 >
 <Mail className="mr-2 h-4 w-4" />
 Conectar com Google
 </Button>
 </div>
 </div>
 ) : selectedProvider ==='microsoft' ? (
 /* Microsoft Setup Screen */
 <div className="space-y-6">
 <div className="bg-sky-50 border-2 border-sky-200 rounded-xl p-6">
 <div className="flex items-start gap-4">
 <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
 <svg viewBox="0 0 24 24" className="h-6 w-6">
 <path fill="#f25022" d="M1 1h10v10H1z"/>
 <path fill="#00a4ef" d="M13 1h10v10H13z"/>
 <path fill="#7fba00" d="M1 13h10v10H1z"/>
 <path fill="#ffb900" d="M13 13h10v10H13z"/>
 </svg>
 </div>
 <div className="flex-1">
 <h3 className="text-lg font-bold text-gray-900 mb-2">Como conectar:</h3>
 <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
 <li>Clique no botão abaixo</li>
 <li>Faça login com sua conta Microsoft</li>
 <li>Autorize o acesso ao calendário</li>
 <li>Pronto! Seus eventos serão sincronizados automaticamente</li>
 </ol>
 </div>
 </div>
 </div>

 <div className="flex gap-3">
 <Button
 onClick={() => setSelectedProvider(null)}
 variant="outline"
 className="flex-1"
 >
 Voltar
 </Button>
 <Button
 onClick={handleConnectMicrosoft}
 className="flex-1 bg-sky-600 text-white font-semibold"
 >
 <Mail className="mr-2 h-4 w-4" />
 Conectar com Microsoft
 </Button>
 </div>
 </div>
 ) : selectedProvider ==='apple' ? (
 /* Apple Setup Screen */
 <div className="space-y-6">
 <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
 <div className="flex items-start gap-4 mb-4">
 <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-600 rounded-xl flex items-center justify-center flex-shrink-0">
 <Apple className="h-6 w-6 text-white" />
 </div>
 <div className="flex-1">
 <h3 className="text-lg font-bold text-gray-900 mb-2">Como pegar o link:</h3>
 <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
 <li><strong>No Mac:</strong> Abra o app Calendário</li>
 <li>Clique com botão direito no calendário que quer compartilhar</li>
 <li>Escolha"Sharing Settings" (Configurações de compartilhamento)</li>
 <li>Marque"Public Calendar" (Calendário público)</li>
 <li>Copie o link que aparecer</li>
 </ol>
 </div>
 </div>
 </div>

 <div className="space-y-4">
 <div>
 <label className="text-sm font-medium text-gray-700 mb-2 block">
 Cole o link do seu calendário Apple:
 </label>
 <Input
 placeholder="webcal://p01-caldav.icloud.com/..."
 value={icalUrl}
 onChange={(e) => setIcalUrl(e.target.value)}
 className="text-sm"
 />
 </div>
 <div>
 <label className="text-sm font-medium text-gray-700 mb-2 block">
 Nome (opcional):
 </label>
 <Input
 placeholder="Ex: Agenda do iPhone"
 value={icalName}
 onChange={(e) => setIcalName(e.target.value)}
 className="text-sm"
 />
 </div>
 </div>

 <div className="flex gap-3">
 <Button
 onClick={() => setSelectedProvider(null)}
 variant="outline"
 className="flex-1"
 >
 Voltar
 </Button>
 <Button
 onClick={() => handleAddIcalFeed('apple')}
 disabled={!icalUrl.trim()}
 className="flex-1 bg-gray-800 text-white font-semibold"
 >
 <Apple className="mr-2 h-4 w-4" />
 Conectar
 </Button>
 </div>
 </div>
 ) : (
 /* Other Systems Setup Screen */
 <div className="space-y-6">
 <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
 <div className="flex items-start gap-4 mb-4">
 <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
 <Calendar className="h-6 w-6 text-white" />
 </div>
 <div className="flex-1">
 <h3 className="text-lg font-bold text-gray-900 mb-3">Sistemas compatíveis:</h3>
 <div className="space-y-3 text-sm text-gray-700">
 <div>
 <p className="font-semibold">Feegow:</p>
 <p className="text-xs">Configurações → Exportar Agenda → Copiar Link</p>
 </div>
 <div>
 <p className="font-semibold">ProDoctor:</p>
 <p className="text-xs">Menu → Configurações → Sincronização de Calendário</p>
 </div>
 <div>
 <p className="font-semibold">HiDoctor:</p>
 <p className="text-xs">Configurações → Agenda → Feed iCal</p>
 </div>
 </div>
 </div>
 </div>
 </div>

 <div className="space-y-4">
 <div>
 <label className="text-sm font-medium text-gray-700 mb-2 block">
 Cole o link do seu calendário (.ics):
 </label>
 <Input
 placeholder="https://..."
 value={icalUrl}
 onChange={(e) => setIcalUrl(e.target.value)}
 className="text-sm"
 />
 </div>
 <div>
 <label className="text-sm font-medium text-gray-700 mb-2 block">
 Nome do sistema (opcional):
 </label>
 <Input
 placeholder="Ex: Agenda Feegow"
 value={icalName}
 onChange={(e) => setIcalName(e.target.value)}
 className="text-sm"
 />
 </div>
 </div>

 <div className="flex gap-3">
 <Button
 onClick={() => setSelectedProvider(null)}
 variant="outline"
 className="flex-1"
 >
 Voltar
 </Button>
 <Button
 onClick={() => handleAddIcalFeed('other')}
 disabled={!icalUrl.trim()}
 className="flex-1 bg-purple-600 text-white font-semibold"
 >
 <Calendar className="mr-2 h-4 w-4" />
 Conectar
 </Button>
 </div>
 </div>
 )}
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 );
}
