
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, Wifi, WifiOff } from 'lucide-react';

const brokers = [
  {
    name: 'Zerodha Kite',
    status: 'online',
    uptime: '99.9%',
    latency: '12ms',
    orders: '2,847'
  },
  {
    name: 'Angel One',
    status: 'online',
    uptime: '99.7%',
    latency: '18ms',
    orders: '1,923'
  },
  {
    name: 'ICICI Direct',
    status: 'degraded',
    uptime: '98.2%',
    latency: '45ms',
    orders: '1,156'
  },
  {
    name: 'Kotak Securities',
    status: 'offline',
    uptime: '97.8%',
    latency: '—',
    orders: '0'
  }
];

export const BrokerHealthStatus: React.FC = () => {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-foreground">
          <Server className="w-5 h-5" />
          <span>Broker Health Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {brokers.map((broker, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                {broker.status === 'online' ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : broker.status === 'degraded' ? (
                  <Wifi className="w-4 h-4 text-yellow-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
                <div>
                  <div className="font-medium text-foreground text-sm">{broker.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {broker.uptime} uptime • {broker.latency} avg latency
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge 
                  variant="outline"
                  className={`text-xs mb-1 ${
                    broker.status === 'online' ? 'border-green-500 text-green-500' :
                    broker.status === 'degraded' ? 'border-yellow-500 text-yellow-500' :
                    'border-red-500 text-red-500'
                  }`}
                >
                  {broker.status}
                </Badge>
                <div className="text-xs text-muted-foreground">{broker.orders} orders</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
