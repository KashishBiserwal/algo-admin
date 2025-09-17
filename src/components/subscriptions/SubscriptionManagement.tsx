import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  status: 'Active' | 'Inactive';
}

interface UserSubscription {
  id: string;
  userName: string;
  planName: string;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Pending';
}

const initialPlans: SubscriptionPlan[] = [
  {
    id: 'PLAN001',
    name: 'Basic',
    description: 'Access to standard features',
    price: '₹999/month',
    status: 'Active',
  },
  {
    id: 'PLAN002',
    name: 'Premium',
    description: 'Advanced features and priority support',
    price: '₹2999/month',
    status: 'Inactive',
  },
];

const initialSubscriptions: UserSubscription[] = [
  {
    id: 'SUB001',
    userName: 'john.doe@example.com',
    planName: 'Basic',
    expiryDate: '2024-07-15',
    status: 'Active',
  },
  {
    id: 'SUB002',
    userName: 'jane.smith@example.com',
    planName: 'Premium',
    expiryDate: '2024-08-01',
    status: 'Expired',
  },
];

export const SubscriptionManagement: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(initialPlans);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>(initialSubscriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreatePlan = () => {
    alert('Create New Plan');
  };

  const handleEditPlan = (planId: string) => {
    alert(`Edit Plan: ${planId}`);
  };

  const handleTogglePlan = (planId: string) => {
    setPlans(prevPlans =>
      prevPlans.map(plan =>
        plan.id === planId ? { ...plan, status: plan.status === 'Active' ? 'Inactive' : 'Active' } : plan
      )
    );
  };

  const handleRenewSubscription = (subscriptionId: string) => {
    setLoading(true);
    setTimeout(() => {
      setSubscriptions(prevSubscriptions =>
        prevSubscriptions.map(sub =>
          sub.id === subscriptionId ? { ...sub, status: 'Active', expiryDate: '2024-09-30' } : sub
        )
      );
      setLoading(false);
      alert(`Subscription ${subscriptionId} renewed successfully!`);
    }, 1500);
  };

  const handleCancelSubscription = (subscriptionId: string) => {
    setLoading(true);
    setTimeout(() => {
      setSubscriptions(prevSubscriptions =>
        prevSubscriptions.map(sub =>
          sub.id === subscriptionId ? { ...sub, status: 'Expired' } : sub
        )
      );
      setLoading(false);
      alert(`Subscription ${subscriptionId} cancelled successfully!`);
    }, 1500);
  };

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.planName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Subscription Management
        </h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Create New Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Subscription Plans ({plans.length})</CardTitle>
              <Button size="sm" onClick={handleCreatePlan} className="bg-blue-600 hover:bg-blue-700">
                Add Plan
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {plans.map((plan) => (
              <div key={plan.id} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{plan.name}</h3>
                  <Badge className={`${
                    plan.status === 'Active' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                    'bg-red-500/20 text-red-600 dark:text-red-400'
                  }`}>
                    {plan.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {plan.description}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-foreground">{plan.price}</span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditPlan(plan.id)}>
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleTogglePlan(plan.id)}
                      className={plan.status === 'Active' ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'}
                    >
                      {plan.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">User Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search subscribers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredSubscriptions.map((sub) => (
                <div key={sub.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-foreground">{sub.userName}</span>
                    <Badge className={`${
                      sub.status === 'Active' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                      sub.status === 'Expired' ? 'bg-red-500/20 text-red-600 dark:text-red-400' :
                      'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {sub.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Plan: {sub.planName} • Expires: {sub.expiryDate}
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleRenewSubscription(sub.id)}
                      disabled={loading}
                    >
                      Renew
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleCancelSubscription(sub.id)}
                      className="text-red-500 hover:text-red-600"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Subscription Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">2,847</div>
              <div className="text-sm text-muted-foreground">Total Subscribers</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-500">₹4.2M</div>
              <div className="text-sm text-muted-foreground">Monthly Revenue</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-500">156</div>
              <div className="text-sm text-muted-foreground">New This Month</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-500">23</div>
              <div className="text-sm text-muted-foreground">Churned Users</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
