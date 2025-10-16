import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Play, 
  Pause, 
  Square, 
  Edit, 
  Save, 
  X,
  Eye,
  Calendar,
  User,
  Target,
  AlertTriangle
} from 'lucide-react';
import Cookies from 'js-cookie';
import { StrategyEditForm } from './StrategyEditForm';

interface Strategy {
  _id: string;
  name: string;
  type: string;
  created_by: {
    _id: string;
    username: string;
    email: string;
  };
  status: 'active' | 'paused' | 'stopped' | 'draft' | 'completed' | 'backtested';
  instruments: any[];
  order_legs: any[];
  createdAt: string;
  updatedAt?: string;
  lastModifiedBy?: string;
  square_off_time?: string;
  trading_days?: any;
  entry_conditions?: any[];
  risk_management?: any;
}

interface StrategyDetailsDialogProps {
  strategy: Strategy | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate: (strategyId: string, status: string) => void;
  onUpdate: (strategyId: string, updates: any) => void;
}

export const StrategyDetailsDialog: React.FC<StrategyDetailsDialogProps> = ({
  strategy,
  open,
  onOpenChange,
  onStatusUpdate,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStrategy, setEditedStrategy] = useState<Strategy | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const token = Cookies.get('auth_token');

  useEffect(() => {
    if (strategy) {
      setEditedStrategy({ ...strategy });
      fetchStrategyOrders(strategy._id);
    }
  }, [strategy]);

  const fetchStrategyOrders = async (strategyId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/admin/strategies/${strategyId}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching strategy orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedStrategy) return;

    try {
      const response = await fetch(`http://localhost:4000/api/admin/strategies/${editedStrategy._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedStrategy)
      });
      
      const data = await response.json();
      if (data.success) {
        onUpdate(editedStrategy._id, editedStrategy);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating strategy:', error);
    }
  };

  const handleCancel = () => {
    setEditedStrategy(strategy ? { ...strategy } : null);
    setIsEditing(false);
  };

  if (!strategy) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              {isEditing ? 'Edit Strategy' : 'Strategy Details'}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              {!isEditing && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditFormOpen(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Strategy
                  </Button>
                  {strategy.status === 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStatusUpdate(strategy._id, 'paused')}
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  {/* {strategy.status === 'paused' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStatusUpdate(strategy._id, 'active')}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Activate
                    </Button>
                  )} */}
                  {/* <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStatusUpdate(strategy._id, 'stopped')}
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop
                  </Button> */}
                </>
              )}
              {isEditing && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="legs">Order Legs</TabsTrigger>
            <TabsTrigger value="conditions">Conditions</TabsTrigger>
            <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="strategyName">Strategy Name</Label>
                    {isEditing ? (
                      <Input
                        id="strategyName"
                        value={editedStrategy?.name || ''}
                        onChange={(e) => setEditedStrategy(prev => 
                          prev ? { ...prev, name: e.target.value } : null
                        )}
                      />
                    ) : (
                      <p className="text-sm font-medium">{strategy.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>Strategy Type</Label>
                    {isEditing ? (
                      <Select
                        value={editedStrategy?.type || ''}
                        onValueChange={(value) => setEditedStrategy(prev => 
                          prev ? { ...prev, type: value } : null
                        )}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Time Based">Time Based</SelectItem>
                          <SelectItem value="Indicator Based">Indicator Based</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline" className="border-blue-500 text-blue-500">
                        {strategy.type}
                      </Badge>
                    )}
                  </div>

                  <div>
                    <Label>Status</Label>
                    <Badge 
                      variant="outline"
                      className={`${
                        strategy.status === 'active' ? 'border-green-500 text-green-500' :
                        strategy.status === 'paused' ? 'border-yellow-500 text-yellow-500' :
                        'border-red-500 text-red-500'
                      }`}
                    >
                      {strategy.status}
                    </Badge>
                  </div>

                  <div>
                    <Label>Instruments</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {strategy.instruments?.map((instrument, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {typeof instrument === 'string' ? instrument : instrument.symbol || instrument.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <div>
                      <p className="font-medium">{strategy.created_by?.username}</p>
                      <p className="text-sm text-muted-foreground">{strategy.created_by?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <div>
                      <p className="text-sm">Created: {new Date(strategy.createdAt).toLocaleDateString()}</p>
                      {strategy.updatedAt && (
                        <p className="text-sm text-muted-foreground">
                          Modified: {new Date(strategy.updatedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="legs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Legs ({strategy.order_legs?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {strategy.order_legs && strategy.order_legs.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order Type</TableHead>
                        <TableHead>Option Type</TableHead>
                        <TableHead>Expiry</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Strike</TableHead>
                        <TableHead>Stop Loss</TableHead>
                        <TableHead>Target</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {strategy.order_legs.map((leg, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Badge variant={leg.orderType === 'BUY' ? 'default' : 'secondary'}>
                              {leg.orderType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={leg.optionType === 'CE' ? 'default' : 'destructive'}>
                              {leg.optionType}
                            </Badge>
                          </TableCell>
                          <TableCell>{leg.expiryType}</TableCell>
                          <TableCell>{leg.quantity}</TableCell>
                          <TableCell>{leg.strikeType} {leg.strikeValue}</TableCell>
                          <TableCell>
                            {leg.stopLoss?.value} {leg.stopLoss?.type}
                          </TableCell>
                          <TableCell>
                            {leg.target?.value} {leg.target?.type}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">No order legs configured</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conditions" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {strategy.longEntryConditions && strategy.longEntryConditions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Target className="w-5 h-5 mr-2 text-green-500" />
                      Long Entry Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {strategy.longEntryConditions.map((condition, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{condition.indicator}</Badge>
                        <span>{condition.comparator}</span>
                        <Badge variant="secondary">{condition.value}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {strategy.shortEntryConditions && strategy.shortEntryConditions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                      Short Entry Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {strategy.shortEntryConditions.map((condition, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{condition.indicator}</Badge>
                        <span>{condition.comparator}</span>
                        <Badge variant="secondary">{condition.value}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {strategy.exitConditions && strategy.exitConditions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Square className="w-5 h-5 mr-2 text-yellow-500" />
                      Exit Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {strategy.exitConditions.map((condition, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{condition.indicator}</Badge>
                        <span>{condition.comparator}</span>
                        <Badge variant="secondary">{condition.value}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {(!strategy.longEntryConditions?.length && 
                !strategy.shortEntryConditions?.length && 
                !strategy.exitConditions?.length) && (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No conditions configured</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Orders ({orders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading orders...</p>
                ) : orders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Side</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell className="font-mono text-xs">{order._id}</TableCell>
                          <TableCell>{order.tradingSymbol}</TableCell>
                          <TableCell>
                            <Badge variant={order.transactionType === 'BUY' ? 'default' : 'secondary'}>
                              {order.transactionType}
                            </Badge>
                          </TableCell>
                          <TableCell>{order.quantity}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={
                                order.orderStatus === 'COMPLETE' ? 'border-green-500 text-green-500' :
                                order.orderStatus === 'PENDING' ? 'border-yellow-500 text-yellow-500' :
                                'border-red-500 text-red-500'
                              }
                            >
                              {order.orderStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">No orders found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <StrategyEditForm
          strategy={strategy}
          open={editFormOpen}
          onOpenChange={setEditFormOpen}
          onSave={onUpdate}
        />
      </DialogContent>
    </Dialog>
  );
};
