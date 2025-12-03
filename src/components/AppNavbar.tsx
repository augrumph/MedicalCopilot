import { Bell, Search, EyeOff, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/stores/appStore';

interface AppNavbarProps {
  title?: string;
  description?: string;
}

export function AppNavbar({ title, description }: AppNavbarProps) {
  const { privacyMode, togglePrivacyMode } = useAppStore();

  return (
    <div
      className="sticky top-0 z-50 flex h-16 items-center gap-4 px-4 sm:px-6 border-b border-gray-200"
      style={{
        backgroundColor: 'rgba(249, 250, 251, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      role="banner"
      aria-label="Barra de navegação principal"
    >
      <div className="flex items-center gap-3">
        <SidebarTrigger
          className="-ml-1 h-8 w-8 text-gray-700 hover:bg-gray-100"
          aria-label="Alternar menu lateral"
        />
        <Separator orientation="vertical" className="h-6 bg-gray-200" />
      </div>

      <div className="flex flex-1 items-center gap-4">
        {title ? (
          <div className="flex flex-col">
            <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight">{title}</h1>
            {description && (
              <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        ) : (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar pacientes, consultas..."
              className="pl-9 h-9 sm:h-10 bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-500 focus-visible:bg-white focus-visible:border-gray-400 transition-colors"
              aria-label="Campo de busca"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Privacy Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className={`relative h-9 w-9 sm:h-10 sm:w-10 hover:bg-gray-100 transition-colors ${privacyMode ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : ''
            }`}
          onClick={togglePrivacyMode}
          aria-label={privacyMode ? 'Desativar Modo Privacidade' : 'Ativar Modo Privacidade'}
          title={privacyMode ? 'Modo Privacidade Ativo' : 'Ativar Modo Privacidade'}
        >
          {privacyMode ? (
            <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 sm:h-10 sm:w-10 hover:bg-gray-100 transition-colors"
          onClick={() => {
            // Disparar evento para abrir notificações
            const event = new CustomEvent('openNotifications', { detail: {} });
            window.dispatchEvent(event);
          }}
          aria-label="Abrir notificações"
          aria-pressed={false}
        >
          <span className="sr-only">Notificações</span>
          <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
          <Badge
            className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center shadow-md bg-[#FF3F7F] text-white border-0 font-semibold"
            aria-label="3 notificações não lidas"
          >
            3
          </Badge>
        </Button>
      </div>
    </div>
  );
}