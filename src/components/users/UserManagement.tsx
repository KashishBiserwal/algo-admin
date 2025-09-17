import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Cooies from 'js-cookie'; 
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Filter, MoreHorizontal, Shield, Ban, CheckCircle, Eye, Activity } from 'lucide-react';
import { useUsers, User } from '@/hooks/useUsers';
import { UserDetailsDialog } from './UserDetailsDialog';

interface ApiUser {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(false);
  const token = Cooies.get('auth_token');
  
  // Fetch users from API
  React.useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:4000/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (user: ApiUser) => {
    setSelectedUser({
      id: user._id,
      name: user.username,
      email: user.email,
      role: user.role,
      status: 'Active', // Default status since API doesn't provide this
      kycStatus: 'Pending', // Default KYC status
      lastLogin: new Date(user.createdAt).toLocaleString(),
      totalTrades: 0, // Default value
      wallet: 'N/A' // Default value
    });
    setDialogOpen(true);
  };

  const handleViewStrategies = (user: ApiUser) => {
    // Navigate to strategies page with user filter
    window.location.href = `/strategies?user=${user._id}`;
  };

  // Mock functions for user actions
  const updateUserStatus = async (userId: string, status: string) => {
    console.log(`Updating user ${userId} status to ${status}`);
    // Implement actual API call here
  };

  const updateUserKYC = async (userId: string, status: string) => {
    console.log(`Updating user ${userId} KYC to ${status}`);
    // Implement actual API call here
  };

  const updateUserRole = async (userId: string, role: string) => {
    console.log(`Updating user ${userId} role to ${role}`);
    // Implement actual API call here
  };

  const deleteUser = async (userId: string) => {
    console.log(`Deleting user ${userId}`);
    // Implement actual API call here
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          User Management
        </h1>
        {/* <Button className="bg-blue-600 hover:bg-blue-700">
          Add New User
        </Button> */}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Users ({filteredUsers.length})</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 bg-input border-border text-foreground"
                />
              </div>
              <Button variant="outline" size="sm" className="border-border text-muted-foreground">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading users...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>KYC</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">{user.username}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        <div className="text-xs text-muted-foreground">{user._id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          user.role === 'ADMIN' ? 'border-purple-500 text-purple-500' :
                          'border-blue-500 text-blue-500'
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-green-500 text-green-500">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                        Pending
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                          <DropdownMenuItem 
                            onClick={() => handleViewDetails(user)}
                            className="text-popover-foreground hover:bg-accent"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleViewStrategies(user)}
                            className="text-blue-500 hover:bg-blue-500/20"
                          >
                            <Activity className="mr-2 h-4 w-4" />
                            View Strategies
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => updateUserRole(user._id, user.role === 'USER' ? 'ADMIN' : 'USER')}
                            className="text-popover-foreground hover:bg-accent"
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            {user.role === 'USER' ? 'Make Admin' : 'Make Regular User'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => updateUserStatus(user._id, 'Suspended')}
                            className="text-red-500 hover:bg-red-500/20"
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Suspend User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <UserDetailsDialog
        user={selectedUser}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onUpdateStatus={updateUserStatus}
        onUpdateKYC={updateUserKYC}
        onUpdateRole={updateUserRole}
      />
    </div>
  );
};