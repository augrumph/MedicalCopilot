import { ReactNode} from'react'
import { SidebarProvider, SidebarInset} from'@/components/ui/sidebar'
import { AppSidebar} from'@/components/AppSidebar'
import { AppNavbar} from'@/components/AppNavbar'

interface AppLayoutProps {
 children: ReactNode
 title?: string
 description?: string
}

export function AppLayout({ children, title, description}: AppLayoutProps) {
 // Function to handle skip to main content
 const skipToMainContent = () => {
 const mainContent = document.getElementById('main-content');
 if (mainContent) {
 mainContent.focus();
 mainContent.scrollIntoView({ behavior:'smooth'});
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
 <SidebarInset className="h-screen overflow-hidden flex flex-col bg-gray-50/50">
 <AppNavbar title={title} description={description} />
 <main
 id="main-content"
 className="flex-1 overflow-y-auto flex flex-col relative px-6 sm:px-8 lg:px-10 py-6"
 tabIndex={-1}
 >
 {children}
 </main>
 </SidebarInset>
 </SidebarProvider>
 )
}