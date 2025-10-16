import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Save, 
  X, 
  Clock, 
  Target, 
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import Cookies from 'js-cookie';

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
  square_off_time?: string;
  trading_days?: any;
  longEntryConditions?: any[];
  shortEntryConditions?: any[];
  exitConditions?: any[];
  useCombinedChart?: boolean;
  chartType?: string;
  interval?: string;
  transactionType?: string;
}

interface StrategyEditFormProps {
  strategy: Strategy | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (strategyId: string, updates: any) => void;
}

interface OrderLeg {
  orderType: "BUY" | "SELL";
  optionType: "CE" | "PE";
  expiryType: "Weekly" | "Monthly";
  quantity: number;
  strikeType: "ATM" | "ATMPER" | "ITM" | "OTM" | "CP" | "CP >=" | "CP <=";
  strikeValue: string;
  stopLoss: {
    type: "points" | "percent";
    value: number;
    trigger: "price" | "premium";
  };
  target: {
    type: "points" | "percent";
    value: number;
    trigger: "price" | "premium";
  };
}

interface Condition {
  indicator: string;
  comparator: string;
  value: string;
}

const availableInstruments = ["NIFTY50", "BANKNIFTY", "SENSEX", "RELIANCE", "TCS", "HDFCBANK", "INFY"];
const tradingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const indicators = ["SMA", "EMA", "RSI", "MACD", "Bollinger Bands", "Stochastic", "ADX", "Williams %R"];
const comparators = [">", "<", ">=", "<=", "=", "Cross Above", "Cross Below"];

export const StrategyEditForm: React.FC<StrategyEditFormProps> = ({
  strategy,
  open,
  onOpenChange,
  onSave
}) => {
  const [formData, setFormData] = useState<Strategy | null>(null);
  const [orderLegs, setOrderLegs] = useState<OrderLeg[]>([]);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [longEntryConditions, setLongEntryConditions] = useState<Condition[]>([]);
  const [shortEntryConditions, setShortEntryConditions] = useState<Condition[]>([]);
  const [exitConditions, setExitConditions] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get('auth_token');

  useEffect(() => {
    if (strategy) {
      // Ensure all form data has proper default values
      setFormData({ 
        ...strategy,
        type: strategy.type || 'time_based',
        status: strategy.status || 'active',
        chartType: strategy.chartType || 'Candlestick',
        interval: strategy.interval || '5m',
        square_off_time: strategy.square_off_time || '15:15'
      });
      
      // Ensure order legs have proper default values
      const defaultLegs = (strategy.order_legs || []).map(leg => ({
        ...leg,
        orderType: leg.orderType || 'SELL',
        optionType: leg.optionType || 'PE',
        expiryType: leg.expiryType || 'Weekly',
        strikeType: leg.strikeType || 'OTM',
        strikeValue: leg.strikeValue || '150',
        quantity: leg.quantity || 50,
        stopLoss: {
          type: leg.stopLoss?.type || 'points',
          value: leg.stopLoss?.value || 1500,
          trigger: leg.stopLoss?.trigger || 'price'
        },
        target: {
          type: leg.target?.type || 'points',
          value: leg.target?.value || 800,
          trigger: leg.target?.trigger || 'price'
        }
      }));
      
      setOrderLegs(defaultLegs);
      setSelectedInstruments(strategy.instruments || []);
      setSelectedDays(strategy.trading_days || []);
      
      // Filter out conditions with empty values and ensure defaults
      const filterConditions = (conditions: any[]) => {
        return (conditions || []).map(condition => ({
          indicator: condition.indicator || 'SMA',
          comparator: condition.comparator || '>',
          value: condition.value || '0'
        })).filter(condition => 
          condition.indicator && condition.indicator.trim() !== '' &&
          condition.comparator && condition.comparator.trim() !== '' &&
          condition.value && condition.value.trim() !== ''
        );
      };
      
      setLongEntryConditions(filterConditions(strategy.longEntryConditions));
      setShortEntryConditions(filterConditions(strategy.shortEntryConditions));
      setExitConditions(filterConditions(strategy.exitConditions));
    }
  }, [strategy]);

  const addOrderLeg = () => {
    const newLeg: OrderLeg = {
      orderType: "SELL",
      optionType: "PE",
      expiryType: "Weekly",
      quantity: 50,
      strikeType: "OTM",
      strikeValue: "150",
      stopLoss: {
        type: "points",
        value: 1500,
        trigger: "price"
      },
      target: {
        type: "points",
        value: 800,
        trigger: "price"
      }
    };
    setOrderLegs([...orderLegs, newLeg]);
  };

  const removeOrderLeg = (index: number) => {
    setOrderLegs(orderLegs.filter((_, i) => i !== index));
  };

  const updateOrderLeg = (index: number, field: keyof OrderLeg, value: any) => {
    const updatedLegs = [...orderLegs];
    updatedLegs[index] = { ...updatedLegs[index], [field]: value };
    setOrderLegs(updatedLegs);
  };

  const updateNestedLeg = (index: number, parentField: "stopLoss" | "target", childField: string, value: any) => {
    const updatedLegs = [...orderLegs];
    updatedLegs[index][parentField] = { ...updatedLegs[index][parentField], [childField]: value };
    setOrderLegs(updatedLegs);
  };

  const toggleInstrument = (instrument: string) => {
    setSelectedInstruments(prev => 
      prev.includes(instrument) 
        ? prev.filter(i => i !== instrument)
        : [...prev, instrument]
    );
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const addCondition = (type: 'longEntryConditions' | 'shortEntryConditions' | 'exitConditions') => {
    const newCondition: Condition = { indicator: "SMA", comparator: ">", value: "0" };
    if (type === 'longEntryConditions') {
      setLongEntryConditions([...longEntryConditions, newCondition]);
    } else if (type === 'shortEntryConditions') {
      setShortEntryConditions([...shortEntryConditions, newCondition]);
    } else {
      setExitConditions([...exitConditions, newCondition]);
    }
  };

  const removeCondition = (type: 'longEntryConditions' | 'shortEntryConditions' | 'exitConditions', index: number) => {
    if (type === 'longEntryConditions') {
      setLongEntryConditions(longEntryConditions.filter((_, i) => i !== index));
    } else if (type === 'shortEntryConditions') {
      setShortEntryConditions(shortEntryConditions.filter((_, i) => i !== index));
    } else {
      setExitConditions(exitConditions.filter((_, i) => i !== index));
    }
  };

  const updateCondition = (type: 'longEntryConditions' | 'shortEntryConditions' | 'exitConditions', index: number, field: string, value: string) => {
    // Don't allow empty values for indicator and comparator
    if ((field === 'indicator' || field === 'comparator') && value.trim() === '') {
      return;
    }
    
    if (type === 'longEntryConditions') {
      const updated = [...longEntryConditions];
      updated[index] = { ...updated[index], [field]: value };
      setLongEntryConditions(updated);
    } else if (type === 'shortEntryConditions') {
      const updated = [...shortEntryConditions];
      updated[index] = { ...updated[index], [field]: value };
      setShortEntryConditions(updated);
    } else {
      const updated = [...exitConditions];
      updated[index] = { ...updated[index], [field]: value };
      setExitConditions(updated);
    }
  };

  const handleSave = async () => {
    if (!formData) return;

    setLoading(true);
    try {
      const updatedStrategy = {
        ...formData,
        order_legs: orderLegs,
        instruments: selectedInstruments,
        trading_days: selectedDays,
        entry_conditions: {
          long: longEntryConditions,
          short: shortEntryConditions,
          exit: exitConditions
        }
      };

      const response = await fetch(`http://localhost:4000/api/admin/strategies/${formData._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedStrategy)
      });
      
      const data = await response.json();
      if (data.success) {
        onSave(formData._id, updatedStrategy);
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error saving strategy:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              Edit Strategy: {formData.name}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="instruments">Instruments</TabsTrigger>
            <TabsTrigger value="legs">Order Legs</TabsTrigger>
            <TabsTrigger value="conditions">Conditions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Strategy Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="strategyName">Strategy Name</Label>
                    <Input
                      id="strategyName"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label>Strategy Type</Label>
                    <Select
                      value={formData.type || 'time_based'}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="time_based">Time Based</SelectItem>
                        <SelectItem value="indicator_based">Indicator Based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Status</Label>
                    <Select
                      value={formData.status || 'active'}
                      onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="stopped">Stopped</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Created By</Label>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="font-medium">{formData.userId?.username}</p>
                      <p className="text-sm text-muted-foreground">{formData.userId?.email}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Created Date</Label>
                    <div className="p-3 bg-muted rounded-md">
                      <p>{new Date(formData.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="instruments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Instruments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {availableInstruments.map((instrument) => (
                    <div key={instrument} className="flex items-center space-x-2">
                      <Checkbox
                        id={instrument}
                        checked={selectedInstruments.includes(instrument)}
                        onCheckedChange={() => toggleInstrument(instrument)}
                      />
                      <Label htmlFor={instrument}>{instrument}</Label>
                    </div>
                  ))}
                </div>
                
                {selectedInstruments.length > 0 && (
                  <div className="mt-4">
                    <Label>Selected Instruments:</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedInstruments.map((instrument) => (
                        <Badge key={instrument} variant="secondary">
                          {instrument}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {formData.type === 'time_based' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Trading Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Square Off Time</Label>
                    <Input
                      type="time"
                      value={formData.square_off_time || '15:15'}
                      onChange={(e) => setFormData({ ...formData, square_off_time: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label>Trading Days</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {tradingDays.map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            id={day}
                            checked={selectedDays.includes(day)}
                            onCheckedChange={() => toggleDay(day)}
                          />
                          <Label htmlFor={day}>{day}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="legs" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Order Legs ({orderLegs.length})</CardTitle>
                  <Button onClick={addOrderLeg} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Leg
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderLegs.map((leg, index) => (
                  <Card key={index} className="border-2">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Leg {index + 1}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOrderLeg(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <Label>Order Type</Label>
                          <Select
                            value={leg.orderType || 'SELL'}
                            onValueChange={(value) => updateOrderLeg(index, 'orderType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BUY">BUY</SelectItem>
                              <SelectItem value="SELL">SELL</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Option Type</Label>
                          <Select
                            value={leg.optionType || 'PE'}
                            onValueChange={(value) => updateOrderLeg(index, 'optionType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CE">Call (CE)</SelectItem>
                              <SelectItem value="PE">Put (PE)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Expiry Type</Label>
                          <Select
                            value={leg.expiryType || 'Weekly'}
                            onValueChange={(value) => updateOrderLeg(index, 'expiryType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Weekly">Weekly</SelectItem>
                              <SelectItem value="Monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            value={leg.quantity}
                            onChange={(e) => updateOrderLeg(index, 'quantity', parseInt(e.target.value))}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label>Strike Type</Label>
                          <Select
                            value={leg.strikeType || 'OTM'}
                            onValueChange={(value) => updateOrderLeg(index, 'strikeType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ATM">ATM</SelectItem>
                              <SelectItem value="ATMPER">ATM%</SelectItem>
                              <SelectItem value="ITM">ITM</SelectItem>
                              <SelectItem value="OTM">OTM</SelectItem>
                              <SelectItem value="CP">CP</SelectItem>
                              <SelectItem value="CP >=">CP {'>'}=</SelectItem>
                              <SelectItem value="CP <=">CP {'<'}=</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Strike Value</Label>
                          <Input
                            value={leg.strikeValue}
                            onChange={(e) => updateOrderLeg(index, 'strikeValue', e.target.value)}
                            placeholder="e.g., 150 or ITM 2000"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>Stop Loss</Label>
                            <div className="space-y-2">
                              <Input
                                type="number"
                                value={leg.stopLoss.value}
                                onChange={(e) => updateNestedLeg(index, 'stopLoss', 'value', parseInt(e.target.value))}
                                placeholder="Value"
                              />
                              <Select
                                value={leg.stopLoss.type || 'points'}
                                onValueChange={(value) => updateNestedLeg(index, 'stopLoss', 'type', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="points">Points</SelectItem>
                                  <SelectItem value="percent">Percent</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label>Target</Label>
                            <div className="space-y-2">
                              <Input
                                type="number"
                                value={leg.target.value}
                                onChange={(e) => updateNestedLeg(index, 'target', 'value', parseInt(e.target.value))}
                                placeholder="Value"
                              />
                              <Select
                                value={leg.target.type || 'points'}
                                onValueChange={(value) => updateNestedLeg(index, 'target', 'type', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="points">Points</SelectItem>
                                  <SelectItem value="percent">Percent</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {orderLegs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No order legs configured</p>
                    <p className="text-sm">Click "Add Leg" to create your first order leg</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conditions" className="space-y-4">
            {formData.strategyType === 'Indicator Based' && (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                        Long Entry Conditions ({longEntryConditions.length})
                      </CardTitle>
                      <Button onClick={() => addCondition('longEntryConditions')} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Condition
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {longEntryConditions.map((condition, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 border rounded-md">
                        <Select
                          value={condition.indicator || 'SMA'}
                          onValueChange={(value) => updateCondition('longEntryConditions', index, 'indicator', value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Indicator" />
                          </SelectTrigger>
                          <SelectContent>
                            {indicators.filter(indicator => indicator.trim() !== '').map((indicator) => (
                              <SelectItem key={indicator} value={indicator}>{indicator}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select
                          value={condition.comparator || '>'}
                          onValueChange={(value) => updateCondition('longEntryConditions', index, 'comparator', value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Compare" />
                          </SelectTrigger>
                          <SelectContent>
                            {comparators.filter(comp => comp.trim() !== '').map((comp) => (
                              <SelectItem key={comp} value={comp}>{comp}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Input
                          value={condition.value || '0'}
                          onChange={(e) => updateCondition('longEntryConditions', index, 'value', e.target.value)}
                          placeholder="Value"
                          className="w-24"
                        />
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCondition('longEntryConditions', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <TrendingDown className="w-5 h-5 mr-2 text-red-500" />
                        Short Entry Conditions ({shortEntryConditions.length})
                      </CardTitle>
                      <Button onClick={() => addCondition('shortEntryConditions')} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Condition
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {shortEntryConditions.map((condition, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 border rounded-md">
                        <Select
                          value={condition.indicator || 'SMA'}
                          onValueChange={(value) => updateCondition('shortEntryConditions', index, 'indicator', value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Indicator" />
                          </SelectTrigger>
                          <SelectContent>
                            {indicators.filter(indicator => indicator.trim() !== '').map((indicator) => (
                              <SelectItem key={indicator} value={indicator}>{indicator}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select
                          value={condition.comparator || '>'}
                          onValueChange={(value) => updateCondition('shortEntryConditions', index, 'comparator', value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Compare" />
                          </SelectTrigger>
                          <SelectContent>
                            {comparators.filter(comp => comp.trim() !== '').map((comp) => (
                              <SelectItem key={comp} value={comp}>{comp}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Input
                          value={condition.value || '0'}
                          onChange={(e) => updateCondition('shortEntryConditions', index, 'value', e.target.value)}
                          placeholder="Value"
                          className="w-24"
                        />
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCondition('shortEntryConditions', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                        Exit Conditions ({exitConditions.length})
                      </CardTitle>
                      <Button onClick={() => addCondition('exitConditions')} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Condition
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {exitConditions.map((condition, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 border rounded-md">
                        <Select
                          value={condition.indicator || 'SMA'}
                          onValueChange={(value) => updateCondition('exitConditions', index, 'indicator', value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Indicator" />
                          </SelectTrigger>
                          <SelectContent>
                            {indicators.filter(indicator => indicator.trim() !== '').map((indicator) => (
                              <SelectItem key={indicator} value={indicator}>{indicator}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select
                          value={condition.comparator || '>'}
                          onValueChange={(value) => updateCondition('exitConditions', index, 'comparator', value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Compare" />
                          </SelectTrigger>
                          <SelectContent>
                            {comparators.filter(comp => comp.trim() !== '').map((comp) => (
                              <SelectItem key={comp} value={comp}>{comp}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Input
                          value={condition.value || '0'}
                          onChange={(e) => updateCondition('exitConditions', index, 'value', e.target.value)}
                          placeholder="Value"
                          className="w-24"
                        />
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCondition('exitConditions', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}

            {formData.type === 'time_based' && (
              <Card>
                <CardContent className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Time-based strategies don't use indicator conditions</p>
                  <p className="text-sm">They execute based on time schedules and order legs</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chart & Display Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Chart Type</Label>
                    <Select
                      value={formData.chartType || 'Candlestick'}
                      onValueChange={(value) => setFormData({ ...formData, chartType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Candlestick">Candlestick</SelectItem>
                        <SelectItem value="Line">Line</SelectItem>
                        <SelectItem value="Bar">Bar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Interval</Label>
                    <Select
                      value={formData.interval || '5m'}
                      onValueChange={(value) => setFormData({ ...formData, interval: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1m">1 Minute</SelectItem>
                        <SelectItem value="5m">5 Minutes</SelectItem>
                        <SelectItem value="15m">15 Minutes</SelectItem>
                        <SelectItem value="1h">1 Hour</SelectItem>
                        <SelectItem value="1d">1 Day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="useCombinedChart"
                    checked={formData.useCombinedChart || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, useCombinedChart: checked as boolean })}
                  />
                  <Label htmlFor="useCombinedChart">Use Combined Chart View</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};