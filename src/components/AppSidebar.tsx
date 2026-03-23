import { memo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    Settings,
    Activity,
    LogOut,
    FileText,
    BookOpen,
    Search,
    Stethoscope,
    Zap,
    Sparkles
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
import { motion, AnimatePresence } from 'framer-motion'
import { type AppContext } from '@/lib/contextConfig'
import { AccessStatusBadge } from '@/components/AccessStatusBadge'

const getMenuItems = (_appContext: AppContext) => [
    { title: 'Início', icon: Search, url: '/worklist' },
    { title: 'Atendimento', icon: Stethoscope, url: '/consultation' },
    { title: 'Copiloto', icon: Zap, url: '/copilot' },
    { title: 'Plantões', icon: Activity, url: '/plantoes' },
    { title: 'Protocolos', icon: BookOpen, url: '/protocols' },
    { title: 'Histórico', icon: FileText, url: '/history' },
    { title: 'Configurações', icon: Settings, url: '/settings' },
]

const bottomMenuItems: any[] = []

export const AppSidebar = memo(function AppSidebar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout, appContext } = useAppStore()
    const menuItems = getMenuItems(appContext)

    const handleLogout = () => { logout(); navigate('/') }

    const isActive = (url: string) => {
        if (location.pathname === url) return true
        if (url !== '/worklist' && location.pathname.startsWith(url + '/')) return true
        if (url === '/worklist' && location.pathname === '/') return true
        return false
    }

    return (
        <Sidebar
            collapsible="icon"
            variant="sidebar"
            className="border-r-0 shadow-[1px_0_10px_rgba(0,0,0,0.02)] transition-all duration-300"
            style={{ background: '#ffffff' }}
        >
            {/* ── Header ── */}
            <SidebarHeader className="h-20 border-b-0 px-4 group-data-[collapsible=icon]:px-2 flex items-center justify-center">
                <div className="flex items-center gap-3 w-full animate-in fade-in slide-in-from-left-2 duration-500">
                    <div className="h-10 w-10 rounded-xl bg-[#512B81] flex items-center justify-center shadow-lg shadow-purple-900/10 border border-[#512B81] group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9">
                        <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
                    </div>

                    {/* Brand text */}
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">
                            Medical
                        </span>
                        <span className="text-sm font-bold text-[#1b1b1b] leading-none tracking-tight">
                            COPILOT <span className="text-[#512B81] inline-block w-1 h-1 rounded-full bg-[#512B81] ml-0.5" />
                        </span>
                    </div>
                </div>
            </SidebarHeader>

            {/* ── Content ── */}
            <SidebarContent className="px-3 py-4 group-data-[collapsible=icon]:px-2">

                {/* Shift Status Indicator */}
                <div className="px-2 mb-4 group-data-[collapsible=icon]:px-0">
                    <div 
                        className={cn(
                            "flex items-center gap-3 p-3 rounded-2xl border transition-colors",
                            useAppStore.getState().shiftStatus === 'active'
                                ? "bg-emerald-50 border-emerald-100"
                                : "bg-slate-50 border-slate-100"
                        )}
                    >
                        <div className="relative">
                            <div 
                                className={cn(
                                    "w-2.5 h-2.5 rounded-full",
                                    useAppStore.getState().shiftStatus === 'active' ? "bg-emerald-500" : "bg-slate-300"
                                )}
                            />
                        </div>
                        <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none">Status</span>
                            <span className={cn(
                                "text-xs font-semibold mt-1 leading-none",
                                useAppStore.getState().shiftStatus === 'active' ? "text-emerald-700" : "text-slate-500"
                            )}>
                                {useAppStore.getState().shiftStatus === 'active' ? 'Em Plantão' : 'Indisponível'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Search button */}
                <div className="px-2 mb-5 group-data-[collapsible=icon]:px-0">
                    <Button
                        variant="outline"
                        className="w-full h-10 justify-start gap-3 bg-white border-slate-200 text-slate-400 font-bold hover:bg-slate-50 hover:text-[#512B81] hover:border-[#512B81]/30 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 shadow-sm transition-all rounded-xl"
                        onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
                    >
                        <Search className="h-4 w-4 shrink-0" />
                        <span className="text-xs group-data-[collapsible=icon]:hidden">Busca rápida...</span>
                        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 font-mono text-[10px] font-bold text-slate-400 opacity-100 group-data-[collapsible=icon]:hidden">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </Button>
                </div>

                {/* Menu Principal */}
                <SidebarGroup className="group-data-[collapsible=icon]:px-0">
                    <SidebarGroupLabel className="px-2 text-[9px] font-black text-[#918983]/70 uppercase tracking-widest mb-2 group-data-[collapsible=icon]:hidden">
                        Menu Principal
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1">
                            {menuItems.map((item) => {
                                const active = isActive(item.url)
                                return (
                                    <SidebarMenuItem key={item.title}>
                                            <Link
                                                to={item.url}
                                                title={item.title}
                                                className={cn(
                                                    'relative flex items-center gap-3 px-3 py-2 rounded-xl group/item transition-all duration-200',
                                                    'group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:p-0',
                                                    active
                                                        ? 'bg-[#512B81] text-white shadow-[0_4px_12px_rgba(81,43,129,0.2)] ring-1 ring-white/10'
                                                        : 'text-slate-500 hover:text-[#1b1b1b] hover:bg-slate-50'
                                                )}
                                            >
                                            {/* Active indicator */}
                                            <AnimatePresence>
                                                {active && (
                                                    <motion.div
                                                        layoutId="sidebar-active"
                                                        className="absolute left-0 w-[4px] h-6 rounded-r-full bg-[#512B81]"
                                                        initial={{ opacity: 0, scaleY: 0 }}
                                                        animate={{ opacity: 1, scaleY: 1 }}
                                                        exit={{ opacity: 0, scaleY: 0 }}
                                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                    />
                                                )}
                                            </AnimatePresence>

                                            <item.icon
                                                className={cn(
                                                    'h-4 w-4 flex-shrink-0 transition-all duration-200',
                                                    active
                                                        ? 'text-white'
                                                        : 'text-slate-400 group-hover/item:text-[#512B81] group-hover/item:scale-110'
                                                )}
                                                aria-hidden="true"
                                            />
                                                <span
                                                    className={cn(
                                                        'font-bold text-sm group-data-[collapsible=icon]:hidden tracking-tight',
                                                        active ? 'text-white' : 'text-inherit'
                                                    )}
                                                >
                                                    {item.title}
                                                </span>

                                            {/* Active dot (collapsed mode) */}
                                            {active && (
                                                <div
                                                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full hidden group-data-[collapsible=icon]:block bg-white"
                                                />
                                            )}
                                        </Link>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Divider */}
                <div className="my-4 h-px bg-gradient-to-r from-transparent via-[#ddd6d0] to-transparent mx-2 group-data-[collapsible=icon]:mx-0" />

                {/* Ferramentas */}
                {bottomMenuItems.length > 0 && (
                    <SidebarGroup className="group-data-[collapsible=icon]:px-0">
                        <SidebarGroupLabel className="px-2 text-[9px] font-black text-[#918983]/70 uppercase tracking-widest mb-2 group-data-[collapsible=icon]:hidden">
                            Ferramentas
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="gap-1">
                                {bottomMenuItems.map((item) => {
                                    const active = isActive(item.url)
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <Link
                                                to={item.url}
                                                title={item.title}
                                                className={cn(
                                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl group/item transition-all',
                                                    'group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0',
                                                    active
                                                        ? 'text-[#682bd7]'
                                                        : 'text-[#918983] hover:text-[#682bd7] hover:bg-white'
                                                )}
                                            >
                                                <item.icon className="h-4 w-4 transition-colors" />
                                                <span className="text-sm font-bold group-data-[collapsible=icon]:hidden">{item.title}</span>
                                            </Link>
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarContent>

            {/* ── Footer ── */}
            <SidebarFooter className="border-t border-[#e6ddd6]/60 p-3 group-data-[collapsible=icon]:p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/80 transition-all group/footer group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2">
                            {/* Avatar with glow ring */}
                            <div className="relative flex-shrink-0">
                                <Avatar
                                    className="h-9 w-9 shadow-sm"
                                    title={user?.name || 'Usuário'}
                                    style={{ boxShadow: '0 0 0 2px #512B81, 0 0 12px rgba(81,43,129,0.25)' }}
                                >
                                    <AvatarFallback
                                        className="font-black text-sm text-white bg-[#512B81]"
                                    >
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                {/* Online dot */}
                                <div
                                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white bg-emerald-500"
                                />
                            </div>

                            <div className="flex flex-1 flex-col overflow-hidden group-data-[collapsible=icon]:hidden min-w-0">
                                <span className="text-sm font-semibold text-slate-900 truncate leading-none">
                                    {user?.name || 'Doutor'}
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 truncate mt-1">
                                    {user?.email || 'medico@exemplo.com'}
                                </span>
                                <div className="mt-1.5">
                                    <AccessStatusBadge />
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleLogout}
                                className="h-8 w-8 text-[#918983] hover:text-red-500 hover:bg-red-50 group-data-[collapsible=icon]:hidden flex-shrink-0"
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
})
