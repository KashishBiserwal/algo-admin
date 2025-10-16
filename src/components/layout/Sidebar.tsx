
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Activity,
  Settings,
  Shield,
  Database,
  FileText,
  Wallet,
  Bell,
  Monitor,
  BookOpen,
  Lock,
  BarChart3,
  Zap,
  ChevronLeft,
  ChevronRight,
  Key
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: (collapsed: boolean) => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'User Management', href: '/users', icon: Users },
  { name: 'Strategy Management', href: '/strategies', icon: Activity },
  { name: 'Change Password', href: '/change-password', icon: Key },
  // Future features (commented out for now)
  // { name: 'Orders & Trades', href: '/trades', icon: BarChart3 },
  // { name: 'Risk Management', href: '/risk', icon: Shield },
  // { name: 'Financial Dashboard', href: '/financial', icon: Wallet },
  // { name: 'System Health', href: '/health', icon: Monitor },
  // { name: 'Platform Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-background border-r border-border transition-all duration-300 z-40",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Algo Trade
            </span>
          </div>
        )}
        <button
          onClick={() => onToggle(!collapsed)}
          className="p-1 rounded-md hover:bg-accent transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-accent",
                isActive ? "bg-accent text-blue-400 border-r-2 border-blue-400" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
