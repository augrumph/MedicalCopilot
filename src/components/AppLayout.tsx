import { ReactNode } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { CommandPalette } from '@/components/consultation/CommandPalette';
import { BgGrid } from '@/components/ui/bg-grid';
import { AppNavbar } from '@/components/AppNavbar';
import { useProtocolsStore } from '@/stores/protocolsStore';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
  /** fullscreen: removes padding + disables outer scroll (for fixed-layout pages like consultation) */
  variant?: 'default' | 'fullscreen';
  title?: string;
  description?: string;
}

export function AppLayout({ children, variant = 'default', title, description }: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const startProtocol = useProtocolsStore(state => state.startProtocol);
  const user = useAppStore(state => state.user);

  const showProfileBanner =
    !!user && !user.isCrmVerified && location.pathname !== '/onboarding';

  const handleSelectProtocol = (id: string) => {
    startProtocol(id);
    if (!location.pathname.includes('/consultation')) {
      navigate('/consultation');
    }
  };

  return (
    <SidebarProvider>
      <CommandPalette onSelectProtocol={handleSelectProtocol} />
      <AppSidebar />
      <SidebarInset className="relative min-h-screen flex flex-col" style={{ background: '#faf9f7' }}>
        {/* Fixed Navbar complement to Sidebar */}
        <AppNavbar />

        {/* Incomplete profile banner */}
        {showProfileBanner && (
          <Link
            to="/onboarding"
            className="relative z-20 flex items-center justify-center gap-2 bg-amber-50 border-b border-amber-200 px-4 py-2 text-amber-800 hover:bg-amber-100 transition-colors"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
            <span className="text-[11px] font-bold">
              Seu cadastro está incompleto. Complete para liberar todos os recursos.
            </span>
            <span className="flex items-center gap-0.5 text-[11px] font-black text-amber-600 ml-1">
              Completar agora <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        )}

        {/* Subtle warm dot grid */}
        <BgGrid dotColor="#918983" opacity={0.07} gap={24} />
        {/* Soft purple glow top-right */}
        <div
          className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(104,43,215,0.06) 0%, transparent 65%)',
            filter: 'blur(40px)',
          }}
        />
        <main
          id="main-content"
          className={
            variant === 'fullscreen'
              ? 'relative z-10 flex-1 overflow-hidden flex flex-col min-h-0'
              : 'relative z-10 flex-1 overflow-y-auto px-6 py-4'
          }
          tabIndex={-1}
        >
          {title && (
            <div className="mb-6">
              <h1 className="text-2xl font-black text-primary tracking-tight">{title}</h1>
              {description && <p className="text-sm text-primary/40 font-medium">{description}</p>}
            </div>
          )}
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}