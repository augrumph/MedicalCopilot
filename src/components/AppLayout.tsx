import { ReactNode } from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { AppNavbar } from '@/components/AppNavbar'

interface AppLayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

export function AppLayout({ children, title, description }: AppLayoutProps) {
  // Function to handle skip to main content
  const skipToMainContent = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <SidebarProvider>
      {/* Skip Navigation Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#8C00FF] focus:text-white focus:rounded-md focus:ring-2 focus:ring-[#8C00FF]"
        onClick={skipToMainContent}
      >
        Pular para conteúdo principal
      </a>

      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <AppNavbar title={title} description={description} />
        <div
          id="main-content"
          className="flex flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6 lg:gap-8 lg:p-8 overflow-auto"
          tabIndex={-1}
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}