import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Settings,
  Activity,
  LogOut,
  FileText,
  Calendar,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/appStore'
import { cn } from '@/lib/utils'
import { getContextConfig } from '@/lib/contextConfig'

const getMenuItems = (appContext: 'medical' | 'psychology') => {
  const config = getContextConfig(appContext);
  return [
    {
      title: 'Worklist',
      icon: LayoutDashboard,
      url: '/worklist',
    },
    {
      title: config.patientLabelPlural,
      icon: Users,
      url: '/patients',
    },
    {
      title: config.consultationLabel,
      icon: Stethoscope,
      url: '/consultation',
    },
    {
      title: 'Histórico',
      icon: FileText,
      url: '/history',
    },
  ];
}

const bottomMenuItems = [
  {
    title: 'Agenda',
    icon: Calendar,
    url: '/appointments',
  },
  {
    title: 'Configurações',
    icon: Settings,
    url: '/settings',
  },
]

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, appContext } = useAppStore()
  const config = getContextConfig(appContext)
  const menuItems = getMenuItems(appContext)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Enhanced isActive to handle nested routes
  const isActive = (url: string) => {
    // Exact match
    if (location.pathname === url) return true

    // Handle nested routes (e.g., /consultation/123 activates /consultation)
    if (url !== '/worklist' && location.pathname.startsWith(url + '/')) return true

    // Handle route aliases
    if (url === '/appointments' && (location.pathname === '/scheduling' || location.pathname.startsWith('/scheduling/'))) return true
    if (url === '/patients' && location.pathname.startsWith('/patients/')) return true

    return false
  }

  return (
    <Sidebar collapsible="icon" variant="inset" className="border-r border-gray-200">
      {/* Header */}
      <SidebarHeader className="h-16 border-b border-gray-200 px-4 group-data-[collapsible=icon]:px-2">
        <div className="flex h-full items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8C00FF] shadow-lg flex-shrink-0">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-base font-bold text-gray-900">{config.appName}</span>
            <span className="text-xs text-gray-500">AI Assistant</span>
          </div>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="px-3 py-4 group-data-[collapsible=icon]:px-2">
        {/* Menu Principal */}
        <SidebarGroup className="group-data-[collapsible=icon]:px-0">
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 group-data-[collapsible=icon]:hidden">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {menuItems.map((item) => {
                const active = isActive(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <Link
                      to={item.url}
                      title={item.title}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group/item",
                        "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0",
                        active
                          ? "bg-[#8C00FF]/10 text-[#8C00FF]"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 transition-transform group-hover/item:scale-110 flex-shrink-0",
                        active ? "text-[#8C00FF]" : "text-gray-500 group-hover/item:text-gray-700"
                      )}
                        aria-hidden="true" />
                      <span className={cn(
                        "font-medium text-sm group-data-[collapsible=icon]:hidden",
                        active ? "text-[#8C00FF] font-semibold" : "text-gray-700"
                      )}>
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Separador */}
        <div className="my-4 h-px bg-gray-300 mx-2 group-data-[collapsible=icon]:mx-0" />

        {/* Ferramentas */}
        <SidebarGroup className="group-data-[collapsible=icon]:px-0">
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 group-data-[collapsible=icon]:hidden">
            Ferramentas
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {bottomMenuItems.map((item) => {
                const active = isActive(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <Link
                      to={item.url}
                      title={item.title}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group/item",
                        "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0",
                        active
                          ? "bg-[#8C00FF] text-white shadow-md shadow-[#8C00FF]/20"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 transition-transform group-hover/item:scale-110 flex-shrink-0",
                        active ? "text-white" : "text-gray-600"
                      )}
                        aria-hidden="true" />
                      <span className={cn(
                        "font-medium text-sm group-data-[collapsible=icon]:hidden",
                        active ? "text-white" : "text-gray-700"
                      )}>
                        {item.title}
                      </span>
                      {active && (
                        <div
                          className="ml-auto h-2 w-2 rounded-full bg-white group-data-[collapsible=icon]:hidden"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-gray-300 p-3 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-100 transition-all duration-200 group/footer cursor-pointer group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2">
              <Avatar
                className="h-9 w-9 border-2 border-[#8C00FF]/30 shadow-sm flex-shrink-0"
                title={user?.name || 'Usuário'}
              >
                <AvatarFallback className="bg-[#8C00FF] text-white font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col overflow-hidden group-data-[collapsible=icon]:hidden min-w-0">
                <span className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || 'Usuário'}
                </span>
                <span className="text-xs text-gray-500 truncate">
                  {user?.email || 'email@example.com'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-8 w-8 group-data-[collapsible=icon]:hidden hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0"
                title="Sair"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}