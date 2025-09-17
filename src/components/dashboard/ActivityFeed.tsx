import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, User, Target, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import Cookies from 'js-cookie';

interface RecentStrategy {
  _id: string;
  strategyName: string;
  strategyType: string;
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  status: 'active' | 'paused' | 'stopped';
  createdAt: string;
}

export const ActivityFeed: React.FC = () => {
  const [recentStrategies, setRecentStrategies] = useState<RecentStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get('auth_token');

  useEffect(() => {
    fetchRecentStrategies();
  }, []);

  const fetchRecentStrategies = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/strategies/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success && data.data.recentStrategies) {
        setRecentStrategies(data.data.recentStrategies);
      }
    } catch (error) {
      console.error('Error fetching recent strategies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (strategy: RecentStrategy) => {
    if (strategy.status === 'active') return TrendingUp;
    if (strategy.status === 'paused') return Clock;
    return Target;
  };

  const getActivityTitle = (strategy: RecentStrategy) => {
    if (strategy.status === 'active') return 'Strategy activated';
    if (strategy.status === 'paused') return 'Strategy paused';
    return 'Strategy created';
  };

  const getActivityDescription = (strategy: RecentStrategy) => {
    return `${strategy.strategyName} (${strategy.strategyType}) by ${strategy.userId?.username}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'stopped': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-3 w-16 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentStrategies.length > 0 ? (
            recentStrategies.map((strategy) => {
              const Icon = getActivityIcon(strategy);
              return (
                <div key={strategy._id} className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(strategy.status)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {getActivityTitle(strategy)}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {getActivityDescription(strategy)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        strategy.status === 'active' ? 'border-green-500 text-green-500' :
                        strategy.status === 'paused' ? 'border-yellow-500 text-yellow-500' :
                        'border-red-500 text-red-500'
                      }`}
                    >
                      {strategy.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(strategy.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm">Strategies will appear here when created</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};