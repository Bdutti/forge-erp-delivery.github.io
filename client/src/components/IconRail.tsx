import { BarChart3, Box, Gauge, Home, LogOut, Settings, TrendingUp } from 'lucide-react';
import { useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

export default function IconRail() {
  const [location, navigate] = useLocation();
  const { logout } = useAuth();

  const navItems: NavItem[] = [
    {
      id: 'pdv',
      label: 'PDV',
      icon: <Gauge className="w-5 h-5" />,
      path: '/pdv',
    },
    {
      id: 'pedidos',
      label: 'Pedidos',
      icon: <Home className="w-5 h-5" />,
      path: '/pedidos',
      badge: 3,
    },
    {
      id: 'produtos',
      label: 'Produtos',
      icon: <Box className="w-5 h-5" />,
      path: '/produtos',
    },
    {
      id: 'dashboards',
      label: 'Dashboards',
      icon: <BarChart3 className="w-5 h-5" />,
      path: '/dashboards',
    },
    {
      id: 'concorrencia',
      label: 'Concorrência',
      icon: <TrendingUp className="w-5 h-5" />,
      path: '/concorrencia',
    },
  ];

  const isActive = (path: string) => location === path;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-s1 border-r border-s3 flex flex-col items-center py-6 gap-2 z-50">
      {/* Logo/Brand */}
      <div className="w-12 h-12 rounded-lg bg-brasa flex items-center justify-center mb-4 animate-glow-pulse">
        <span className="text-white font-bold text-lg">F</span>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-3 flex-1">
        {navItems.map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate(item.path)}
                className={`relative w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-brasa text-white shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-s3'
                }`}
              >
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-brasa rounded-full text-xs font-bold text-white flex items-center justify-center animate-glow-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-s3 text-foreground border-s4">
              {item.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-3 border-t border-s3 pt-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-12 h-12 rounded-lg text-muted-foreground hover:text-foreground hover:bg-s3 flex items-center justify-center transition-all duration-200">
              <Settings className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-s3 text-foreground border-s4">
            Configurações
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleLogout}
              className="w-12 h-12 rounded-lg text-muted-foreground hover:text-destructive hover:bg-s3 flex items-center justify-center transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-s3 text-foreground border-s4">
            Sair
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
