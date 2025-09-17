
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Subscription {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  features: string[];
  maxStrategies: number;
  maxUsers: number;
  isActive: boolean;
  description: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  startDate: string;
  endDate: string;
  amount: number;
  autoRenew: boolean;
}

const initialPlans: Subscription[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 999,
    period: 'monthly',
    features: ['Up to 3 strategies', 'Basic support', 'Standard execution'],
    maxStrategies: 3,
    maxUsers: 1,
    isActive: true,
    description: 'Perfect for individual traders getting started'
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 2999,
    period: 'monthly',
    features: ['Up to 15 strategies', 'Priority support', 'Advanced analytics', 'Custom indicators'],
    maxStrategies: 15,
    maxUsers: 3,
    isActive: true,
    description: 'For professional traders and small teams'
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 9999,
    period: 'monthly',
    features: ['Unlimited strategies', '24/7 support', 'Advanced analytics', 'API access', 'Custom development'],
    maxStrategies: -1,
    maxUsers: -1,
    isActive: true,
    description: 'For large teams and institutions'
  }
];

const initialUserSubscriptions: UserSubscription[] = [
  {
    id: 'sub001',
    userId: 'USR001',
    userName: 'John Doe',
    userEmail: 'john.doe@email.com',
    plan: 'Pro Plan',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    amount: 2999,
    autoRenew: true
  },
  {
    id: 'sub002',
    userId: 'USR002',
    userName: 'Jane Smith',
    userEmail: 'jane.smith@email.com',
    plan: 'Enterprise Plan',
    status: 'active',
    startDate: '2024-02-15',
    endDate: '2025-02-14',
    amount: 9999,
    autoRenew: true
  },
  {
    id: 'sub003',
    userId: 'USR003',
    userName: 'Mike Johnson',
    userEmail: 'mike.j@email.com',
    plan: 'Basic Plan',
    status: 'expired',
    startDate: '2023-12-01',
    endDate: '2024-05-31',
    amount: 999,
    autoRenew: false
  }
];

export const useSubscriptions = () => {
  const [plans, setPlans] = useState<Subscription[]>(initialPlans);
  const [userSubscriptions, setUserSubscriptions] = useState<UserSubscription[]>(initialUserSubscriptions);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createPlan = (plan: Omit<Subscription, 'id'>) => {
    setLoading(true);
    setTimeout(() => {
      const newPlan: Subscription = {
        ...plan,
        id: `plan_${Date.now()}`
      };
      setPlans(prev => [...prev, newPlan]);
      toast({
        title: "Success",
        description: "Subscription plan created successfully"
      });
      setLoading(false);
    }, 1000);
  };

  const updatePlan = (planId: string, updates: Partial<Subscription>) => {
    setLoading(true);
    setTimeout(() => {
      setPlans(prev => prev.map(plan => 
        plan.id === planId ? { ...plan, ...updates } : plan
      ));
      toast({
        title: "Success",
        description: "Plan updated successfully"
      });
      setLoading(false);
    }, 1000);
  };

  const updateUserSubscription = (subId: string, status: UserSubscription['status']) => {
    setLoading(true);
    setTimeout(() => {
      setUserSubscriptions(prev => prev.map(sub => 
        sub.id === subId ? { ...sub, status } : sub
      ));
      toast({
        title: "Success",
        description: `Subscription ${status} successfully`
      });
      setLoading(false);
    }, 1000);
  };

  return {
    plans,
    userSubscriptions,
    loading,
    createPlan,
    updatePlan,
    updateUserSubscription
  };
};
