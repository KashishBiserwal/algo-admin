
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, MoreHorizontal, CheckCircle, XCircle, Eye, Play, Pause, Edit, Trash2, User, X } from 'lucide-react';
import Cookies from 'js-cookie';
import { StrategyDetailsDialog } from './StrategyDetailsDialog';
import { StrategyEditForm } from './StrategyEditForm';
import { useSearchParams } from 'react-router-dom';

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
}

interface StrategyStats {
  totalStrategies: number;
  activeStrategies: number;
  pausedStrategies: number;
  totalUsers: number;
  timeBasedStrategies: number;
  indicatorBasedStrategies: number;
  recentStrategies: Strategy[];
}

export const StrategyManagement: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [stats, setStats] = useState<StrategyStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const token = Cookies.get('auth_token');

  // Get user filter from URL params
  const userFilter = searchParams.get('user');

  // Fetch strategies from API
  useEffect(() => {
    fetchStrategies();
    fetchStats();
    fetchUsers();
  }, [activeTab, currentPage, searchTerm, userFilter]);

  // Set user filter from URL params
  useEffect(() => {
    if (userFilter) {
      setSelectedUserId(userFilter);
      const user = users.find(u => u._id === userFilter);
      if (user) {
        setSelectedUser(user);
      }
    } else {
      setSelectedUserId('all');
      setSelectedUser(null);
    }
  }, [userFilter, users]);

  const fetchStrategies = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:4000/api/admin/strategies';
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });
      
      if (activeTab !== 'all') {
        params.append('status', activeTab);
      }
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      // If user filter is applied, fetch user-specific strategies
      if (userFilter) {
        url = `http://localhost:4000/api/admin/users/${userFilter}/strategies`;
      }

      const response = await fetch(`${url}?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setStrategies(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching strategies:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

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
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusUpdate = async (strategyId: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/strategies/${strategyId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      const data = await response.json();
      if (data.success) {
        fetchStrategies(); // Refresh the list
        fetchStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Error updating strategy status:', error);
    }
  };

  const handleDeleteStrategy = async (strategyId: string) => {
    if (window.confirm('Are you sure you want to delete this strategy? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:4000/api/admin/strategies/${strategyId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        if (data.success) {
          fetchStrategies(); // Refresh the list
          fetchStats(); // Refresh stats
        }
      } catch (error) {
        console.error('Error deleting strategy:', error);
      }
    }
  };

  const handleViewDetails = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setDialogOpen(true);
  };

  const handleEditStrategy = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setEditFormOpen(true);
  };

  const handleUpdateStrategy = (strategyId: string, updates: any) => {
    // Update the local state
    setStrategies(prev => prev.map(s => 
      s._id === strategyId ? { ...s, ...updates } : s
    ));
    fetchStrategies(); // Refresh from server
  };

  const handleUserFilter = (userId: string) => {
    if (userId && userId !== 'all') {
      setSearchParams({ user: userId });
      setSelectedUserId(userId);
      const user = users.find(u => u._id === userId);
      setSelectedUser(user);
    } else {
      setSearchParams({});
      setSelectedUserId('all');
      setSelectedUser(null);
    }
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Strategy Management
          </h1>
          {selectedUser && (
            <div className="flex items-center space-x-2 mt-2">
              <User className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">
                Viewing strategies for: <span className="font-medium text-foreground">{selectedUser.username}</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleUserFilter('all')}
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
        {/* <Button className="bg-blue-600 hover:bg-blue-700">
          Add New Strategy
        </Button> */}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">
          Trading Strategies ({stats?.totalStrategies || 0})
        </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search strategies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-60 bg-input border-border text-foreground"
                />
              </div>
              <Select value={selectedUserId} onValueChange={handleUserFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="border-border text-muted-foreground">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-muted border-border">
              <TabsTrigger value="active" className="data-[state=active]:bg-accent">
                Active ({stats?.activeStrategies || 0})
              </TabsTrigger>
              <TabsTrigger value="paused" className="data-[state=active]:bg-accent">
                Paused ({stats?.pausedStrategies || 0})
              </TabsTrigger>
              <TabsTrigger value="stopped" className="data-[state=active]:bg-accent">
                Stopped ({stats?.totalStrategies - (stats?.activeStrategies || 0) - (stats?.pausedStrategies || 0) || 0})
              </TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-accent">
                All ({stats?.totalStrategies || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Strategy</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Instruments</TableHead>
                    <TableHead>Legs</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        Loading strategies...
                      </TableCell>
                    </TableRow>
                  ) : strategies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        No strategies found
                      </TableCell>
                    </TableRow>
                  ) : (
                    strategies.map((strategy) => (
                      <TableRow key={strategy._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-foreground">{strategy.name}</div>
                            <div className="text-xs text-muted-foreground">{strategy._id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-foreground">{strategy.created_by?.username}</div>
                            <div className="text-sm text-muted-foreground">{strategy.created_by?.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-blue-500 text-blue-500">
                            {strategy.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {strategy.instruments?.slice(0, 2).map((instrument, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {typeof instrument === 'string' ? instrument : instrument.symbol || instrument.name}
                              </Badge>
                            ))}
                            {strategy.instruments?.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{strategy.instruments.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-purple-500 text-purple-500">
                            {strategy.order_legs?.length || 0} legs
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(strategy.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
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
                        </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border">
                            <DropdownMenuItem 
                              onClick={() => handleViewDetails(strategy)}
                              className="text-popover-foreground hover:bg-accent"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleEditStrategy(strategy)}
                              className="text-blue-500 hover:bg-blue-500/20"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Strategy
                            </DropdownMenuItem>
                            {strategy.status === 'active' && (
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(strategy._id, 'paused')}
                                className="text-yellow-500 hover:bg-yellow-500/20"
                              >
                                <Pause className="mr-2 h-4 w-4" />
                                Pause Strategy
                              </DropdownMenuItem>
                            )}
                            {strategy.status === 'paused' && (
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(strategy._id, 'active')}
                                className="text-green-500 hover:bg-green-500/20"
                              >
                                <Play className="mr-2 h-4 w-4" />
                                Activate Strategy
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(strategy._id, 'stopped')}
                              className="text-red-500 hover:bg-red-500/20"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Stop Strategy
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteStrategy(strategy._id)}
                              className="text-red-600 hover:bg-red-600/20"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Strategy
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                  )}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <StrategyDetailsDialog
        strategy={selectedStrategy}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onStatusUpdate={handleStatusUpdate}
        onUpdate={handleUpdateStrategy}
      />

      <StrategyEditForm
        strategy={selectedStrategy}
        open={editFormOpen}
        onOpenChange={setEditFormOpen}
        onSave={handleUpdateStrategy}
      />
    </div>
  );
};
