import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, Activity, Shield, Wallet, Target, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Cookies from 'js-cookie';

interface DashboardStats {
  totalUsers: number;
  activeStrategies: number;
  totalStrategies: number;
  totalOrders: number;
  timeBasedStrategies: number;
  indicatorBasedStrategies: number;
  pausedStrategies: number;
  recentStrategies: any[];
}

export const StatsGrid: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get('auth_token');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/strategies/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: 'Total Users',
      value: stats?.totalUsers?.toString() || '0',
      change: '+0%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'registered users'
    },
    {
      title: 'Active Strategies',
      value: stats?.activeStrategies?.toString() || '0',
      change: '+0%',
      changeType: 'positive' as const,
      icon: Activity,
      description: 'currently running'
    },
    {
      title: 'Total Strategies',
      value: stats?.totalStrategies?.toString() || '0',
      change: '+0%',
      changeType: 'positive' as const,
      icon: Target,
      description: 'created strategies'
    },
    {
      title: 'Paused Strategies',
      value: stats?.pausedStrategies?.toString() || '0',
      change: '+0%',
      changeType: 'negative' as const,
      icon: Clock,
      description: 'need attention'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <Card key={index} className="bg-card border-border hover:border-accent transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-1">
              {stat.value}
            </div>
            <div className="flex items-center space-x-2">
              <div className={cn(
                "flex items-center text-xs font-medium",
                stat.changeType === 'positive' ? "text-green-500" : "text-red-500"
              )}>
                {stat.changeType === 'positive' ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {stat.change}
              </div>
              <span className="text-xs text-muted-foreground">{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};