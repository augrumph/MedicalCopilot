import { memo } from 'react';
import { Bell, Search, EyeOff, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';

interface AppNavbarProps {
  title?: string;
  description?: string;
}

export const AppNavbar = memo(function AppNavbar({ title, description }: AppNavbarProps) {
  const { privacyMode, togglePrivacyMode, user } = useAppStore();

  return (
    <header
      className="sticky top-0 z-40 flex h-16 w-full items-center gap-4 px-4 sm:px-6 border-b border-slate-100 transition-all"
      style={{
        background: '#FFFFFF',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
      }}
    >
      <div className="flex items-center gap-3">
        <SidebarTrigger
          className="-ml-1 h-9 w-9 text-slate-400 hover:text-[#512B81] hover:bg-slate-50 transition-all rounded-lg"
          aria-label="Alternar menu lateral"
        />
        <Separator orientation="vertical" className="h-4 bg-slate-200" />
      </div>

      <div className="flex flex-1 items-center gap-4">
        {title ? (
          <div className="flex flex-col">
            <h1 className="text-sm sm:text-base font-bold text-[#1b1b1b] tracking-tight leading-none uppercase">
              {title}
            </h1>
            {description && (
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 sm:block hidden">
                {description}
              </p>
            )}
          </div>
        ) : (
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#512B81] transition-colors" />
            <Input
              type="search"
              placeholder="Pesquisar..."
              className="pl-9 h-10 bg-white border-slate-200 text-[#1b1b1b] placeholder:text-slate-400 focus-visible:border-[#512B81]/40 focus-visible:ring-[#512B81]/10 transition-all rounded-xl shadow-none font-medium"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Pro Badge */}
        {/* Pro Badge - Simple & Sophisticated */}
        {/* Pro Badge - Sharp and Technical */}
        <div className="hidden md:block">
          <Badge className="bg-[#1b1b1b] text-white border-0 py-2 px-4 rounded-full flex items-center gap-2 shadow-sm group">
            <div className="h-2 w-2 rounded-full bg-[#512B81] group-hover:scale-125 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white">Medical <span className="text-[#512B81]">Pro</span></span>
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Privacy Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 sm:h-10 sm:w-10 rounded-xl transition-all",
              privacyMode ? "bg-[#512B81]/10 text-[#512B81]" : "text-slate-400 hover:bg-slate-50"
            )}
            onClick={togglePrivacyMode}
          >
            {privacyMode ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-xl text-slate-400 hover:text-[#512B81] hover:bg-slate-50 transition-all"
            onClick={() => {
              const event = new CustomEvent('openNotifications');
              window.dispatchEvent(event);
            }}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#F61115] border-2 border-white" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8 bg-slate-100 mx-1 sm:block hidden" />

        {/* User Mini Profile */}
        <div className="flex items-center gap-3 pl-1 sm:block hidden">
          <div className="text-right">
            <p className="text-[11px] font-semibold text-slate-900 leading-none">
              {user?.name?.split(' ')[0] || 'Doutor'}
            </p>
            <p className="text-[9px] font-medium text-slate-500 uppercase tracking-wide mt-1">
              CRM-SP 12345
            </p>
          </div>
        </div>
      </div>
    </header>
  );
});