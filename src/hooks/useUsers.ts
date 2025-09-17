
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Flagged' | 'Suspended' | 'Banned';
  kycStatus: 'Verified' | 'Pending' | 'Rejected';
  lastLogin: string;
  totalTrades: number;
  wallet: string;
  joinDate: string;
  phone: string;
  country: string;
}

// Dummy data
const initialUsers: User[] = [
  {
    id: 'USR001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    role: 'Trader',
    status: 'Active',
    kycStatus: 'Verified',
    lastLogin: '2 hours ago',
    totalTrades: 1247,
    wallet: '₹45,000',
    joinDate: '2024-01-15',
    phone: '+91 9876543210',
    country: 'India'
  },
  {
    id: 'USR002',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    role: 'Premium Trader',
    status: 'Active',
    kycStatus: 'Verified',
    lastLogin: '5 minutes ago',
    totalTrades: 2891,
    wallet: '₹1,20,000',
    joinDate: '2023-11-22',
    phone: '+91 9876543211',
    country: 'India'
  },
  {
    id: 'USR003',
    name: 'Mike Johnson',
    email: 'mike.j@email.com',
    role: 'Trader',
    status: 'Flagged',
    kycStatus: 'Pending',
    lastLogin: '1 day ago',
    totalTrades: 45,
    wallet: '₹5,000',
    joinDate: '2024-05-10',
    phone: '+91 9876543212',
    country: 'India'
  },
  {
    id: 'USR004',
    name: 'Sarah Wilson',
    email: 'sarah.w@email.com',
    role: 'Broker',
    status: 'Suspended',
    kycStatus: 'Verified',
    lastLogin: '3 days ago',
    totalTrades: 0,
    wallet: '₹0',
    joinDate: '2024-02-28',
    phone: '+91 9876543213',
    country: 'India'
  },
  {
    id: 'USR005',
    name: 'Alex Kumar',
    email: 'alex.kumar@email.com',
    role: 'Trader',
    status: 'Active',
    kycStatus: 'Verified',
    lastLogin: '30 minutes ago',
    totalTrades: 892,
    wallet: '₹78,500',
    joinDate: '2024-03-12',
    phone: '+91 9876543214',
    country: 'India'
  }
];

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const updateUserStatus = (userId: string, status: User['status']) => {
    setLoading(true);
    setTimeout(() => {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status } : user
      ));
      toast({
        title: "Success",
        description: `User status updated to ${status}`,
      });
      setLoading(false);
    }, 1000);
  };

  const updateUserKYC = (userId: string, kycStatus: User['kycStatus']) => {
    setLoading(true);
    setTimeout(() => {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, kycStatus } : user
      ));
      toast({
        title: "Success",
        description: `KYC status updated to ${kycStatus}`,
      });
      setLoading(false);
    }, 1000);
  };

  const updateUserRole = (userId: string, role: string) => {
    setLoading(true);
    setTimeout(() => {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role } : user
      ));
      toast({
        title: "Success",
        description: `User role updated to ${role}`,
      });
      setLoading(false);
    }, 1000);
  };

  const deleteUser = (userId: string) => {
    setLoading(true);
    setTimeout(() => {
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      setLoading(false);
    }, 1000);
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    setLoading(true);
    setTimeout(() => {
      const newUser: User = {
        ...userData,
        id: `USR${String(users.length + 1).padStart(3, '0')}`,
      };
      setUsers(prev => [...prev, newUser]);
      toast({
        title: "Success",
        description: "User added successfully",
      });
      setLoading(false);
    }, 1000);
  };

  return {
    users,
    loading,
    updateUserStatus,
    updateUserKYC,
    updateUserRole,
    deleteUser,
    addUser
  };
};
