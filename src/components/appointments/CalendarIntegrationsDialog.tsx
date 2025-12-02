import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Calendar,
    Plus,
    Trash2,
    Link as LinkIcon,
    HelpCircle,
    CheckCircle,
    Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { useCalendarIntegrationsStore } from '@/stores/calendarIntegrationsStore';
import { toast } from 'sonner';

interface CalendarIntegrationsDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CalendarIntegrationsDialog({
    isOpen,
    onClose,
}: CalendarIntegrationsDialogProps) {
    const {
        googleCalendar,
        connectGoogle,
        disconnectGoogle,
        icalFeeds,
        addIcalFeed,
        removeIcalFeed,
    } = useCalendarIntegrationsStore();

    const [icalUrl, setIcalUrl] = useState('');
    const [icalName, setIcalName] = useState('');

    const handleConnectGoogle = () => {
        // Mock OAuth flow - in production this would redirect to Google OAuth
        const mockEmail = 'dr.luzzi@gmail.com';
        connectGoogle(mockEmail);
        toast.success('Google Calendar conectado com sucesso!');
    };

    const handleDisconnectGoogle = () => {
        disconnectGoogle();
        toast.info('Google Calendar desconectado');
    };

    const handleAddIcalFeed = () => {
        // Validate URL
        if (!icalUrl.trim()) {
            toast.error('Por favor, insira um link válido');
            return;
        }

        // Basic URL validation
        try {
            new URL(icalUrl);
        } catch {
            toast.error('URL inválida. Verifique o link e tente novamente.');
            return;
        }

        // Check if URL ends with .ics or contains ical/calendar keywords
        const lowerUrl = icalUrl.toLowerCase();
        if (!lowerUrl.includes('ical') && !lowerUrl.includes('calendar') && !lowerUrl.endsWith('.ics')) {
            toast.error('O link não parece ser uma agenda iCal válida (.ics)');
            return;
        }

        const name = icalName.trim() || `Agenda ${icalFeeds.length + 1}`;
        addIcalFeed(name, icalUrl);
        toast.success(`Agenda "${name}" adicionada com sucesso!`);

        // Reset form
        setIcalUrl('');
        setIcalName('');
    };

    const handleRemoveIcalFeed = (id: string, name: string) => {
        removeIcalFeed(id);
        toast.info(`Agenda "${name}" removida`);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Sincronização de Agendas</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Centralize seus atendimentos do Google, Apple ou softwares médicos.
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="h-10 w-10 hover:bg-gray-100 text-gray-500 rounded-xl"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Section 1: Google Calendar */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Mail className="h-5 w-5 text-blue-600" />
                                    Google Calendar
                                </h3>

                                <Card className="border-2 border-blue-100 bg-blue-50/50">
                                    <CardContent className="p-5">
                                        {!googleCalendar.connected ? (
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                        <svg viewBox="0 0 24 24" className="h-7 w-7">
                                                            <path
                                                                fill="#4285F4"
                                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                            />
                                                            <path
                                                                fill="#34A853"
                                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                            />
                                                            <path
                                                                fill="#FBBC05"
                                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                            />
                                                            <path
                                                                fill="#EA4335"
                                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-900 mb-1">Google Calendar (Recomendado)</p>
                                                        <p className="text-sm text-gray-600">
                                                            Sincroniza com Doctoralia, iClinic, GestãoDS e Android.
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={handleConnectGoogle}
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
                                                >
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    Conectar Conta Google
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                                        <CheckCircle className="h-7 w-7 text-green-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-900 mb-1">Conectado</p>
                                                        <p className="text-sm text-gray-600">{googleCalendar.email}</p>
                                                        <Badge className="mt-2 bg-green-600 text-white hover:bg-green-700">
                                                            🟢 Sincronizando
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={handleDisconnectGoogle}
                                                    variant="outline"
                                                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                                                >
                                                    Desconectar
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Section 2: iCal Links */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <LinkIcon className="h-5 w-5 text-purple-600" />
                                    Outros Sistemas (Via Link Público)
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Cole o link .ics exportado do seu sistema (Feegow, ProDoctor, Apple Calendar, Outlook).
                                </p>

                                {/* Add iCal Form */}
                                <Card className="border-2 border-gray-200 mb-4">
                                    <CardContent className="p-5 space-y-4">
                                        <div>
                                            <Label htmlFor="ical-url" className="text-sm font-medium text-gray-700">
                                                Link da Agenda (.ics)
                                            </Label>
                                            <Input
                                                id="ical-url"
                                                placeholder="https://clinica.com/calendar/feed/..."
                                                value={icalUrl}
                                                onChange={(e) => setIcalUrl(e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="ical-name" className="text-sm font-medium text-gray-700">
                                                Nome da Etiqueta (Opcional)
                                            </Label>
                                            <Input
                                                id="ical-name"
                                                placeholder="Ex: Agenda Feegow, Consultório Centro"
                                                value={icalName}
                                                onChange={(e) => setIcalName(e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>
                                        <Button
                                            onClick={handleAddIcalFeed}
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Adicionar Agenda
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* iCal Feeds List */}
                                {icalFeeds.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Agendas Ativas:</p>
                                        {icalFeeds.map((feed) => (
                                            <motion.div
                                                key={feed.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                            >
                                                <Card className="border border-gray-200 hover:border-purple-300 transition-colors">
                                                    <CardContent className="p-4 flex items-center gap-3">
                                                        <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                            <Calendar className="h-5 w-5 text-purple-600" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-gray-900">{feed.name}</p>
                                                            <p className="text-xs text-gray-500 truncate">{feed.url}</p>
                                                        </div>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => handleRemoveIcalFeed(feed.id, feed.name)}
                                                            className="flex-shrink-0 h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Section 3: Help Accordion */}
                            <Accordion type="single" collapsible className="border border-gray-200 rounded-lg">
                                <AccordionItem value="help" className="border-none">
                                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <HelpCircle className="h-4 w-4 text-gray-500" />
                                            Como pegar meu link no Feegow/ProDoctor?
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 pb-4 pt-2 text-sm text-gray-600">
                                        <div className="space-y-3">
                                            <p>
                                                <strong>Sistemas Médicos (Feegow, ProDoctor, HiDoctor):</strong>
                                                <br />
                                                Geralmente fica em <strong>Configurações → Exportar Agenda → Copiar Link Público</strong>.
                                                Alguns sistemas chamam de "Sincronização de Calendário" ou "Feed iCal".
                                            </p>
                                            <p>
                                                <strong>Apple Calendar:</strong>
                                                <br />
                                                Clique no ícone <strong>(i)</strong> ao lado do calendário e marque "Calendário Público".
                                                Copie o link que aparece.
                                            </p>
                                            <p>
                                                <strong>Outlook/Office 365:</strong>
                                                <br />
                                                Vá em <strong>Configurações → Calendário → Calendários Compartilhados</strong>.
                                                Publique o calendário e copie o link ICS.
                                            </p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-200 bg-gray-50">
                            <Button
                                onClick={onClose}
                                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold"
                            >
                                Concluído
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
