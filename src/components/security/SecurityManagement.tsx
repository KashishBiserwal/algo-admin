import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
import { Search, Filter, MoreHorizontal, Edit, Trash, Power, Shield, Lock, KeyRound, ServerCrash, UserCog, CheckCircle2, XCircle } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface LogEntry {
  id: string;
  user: string;
  action: string;
  ipAddress: string;
  location: string;
  timestamp: string;
  status: 'Success' | 'Failed';
}

interface SecuritySetting {
  id: string;
  name: string;
  description: string;
  value: string;
  type: 'boolean' | 'string';
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const roles: Role[] = [
  {
    id: 'role-1',
    name: 'Administrator',
    description: 'Full access to all features and data',
    permissions: ['read', 'write', 'delete', 'manage users', 'configure settings'],
    userCount: 5,
    icon: Shield
  },
  {
    id: 'role-2',
    name: 'Manager',
    description: 'Access to manage strategies and view analytics',
    permissions: ['read', 'write', 'view analytics', 'manage strategies'],
    userCount: 12,
    icon: UserCog
  },
  {
    id: 'role-3',
    name: 'Auditor',
    description: 'Read-only access to logs and compliance data',
    permissions: ['read logs', 'view compliance data'],
    userCount: 3,
    icon: Lock
  }
];

const accessLogs: LogEntry[] = [
  {
    id: 'log-1',
    user: 'john.doe@example.com',
    action: 'Login',
    ipAddress: '192.168.1.1',
    location: 'New York, USA',
    timestamp: '2024-07-15 10:30 AM',
    status: 'Success'
  },
  {
    id: 'log-2',
    user: 'jane.smith@example.com',
    action: 'Update Strategy Settings',
    ipAddress: '10.0.0.5',
    location: 'London, UK',
    timestamp: '2024-07-15 11:45 AM',
    status: 'Success'
  },
  {
    id: 'log-3',
    user: 'mike.johnson@example.com',
    action: 'Failed Login Attempt',
    ipAddress: '203.0.113.45',
    location: 'Unknown',
    timestamp: '2024-07-15 12:00 PM',
    status: 'Failed'
  }
];

const securitySettings: SecuritySetting[] = [
  {
    id: 'setting-1',
    name: 'Two-Factor Authentication',
    description: 'Enable 2FA for all users',
    value: 'Enabled',
    type: 'boolean',
    icon: KeyRound
  },
  {
    id: 'setting-2',
    name: 'Session Timeout',
    description: 'Set the duration of user session before auto logout',
    value: '30 minutes',
    type: 'string',
    icon: ServerCrash
  },
  {
    id: 'setting-3',
    name: 'Password Policy',
    description: 'Configure password complexity requirements',
    value: 'Strong',
    type: 'string',
    icon: Lock
  }
];

export const SecurityManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const [searchTerm, setSearchTerm] = useState('');
  const [rolesData, setRolesData] = useState(roles);
  const [logsData, setLogsData] = useState(accessLogs);
  const [settingsData, setSettingsData] = useState(securitySettings);

  const filteredLogs = logsData.filter(log =>
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRole = () => {
    console.log('Create Role clicked');
  };

  const handleEditRole = (roleId: string) => {
    console.log('Edit Role clicked for role ID:', roleId);
  };

  const handleDeleteRole = (roleId: string) => {
    console.log('Delete Role clicked for role ID:', roleId);
    setRolesData(prevRoles => prevRoles.filter(role => role.id !== roleId));
  };

  const handleUpdateSetting = (settingId: string) => {
    console.log('Update Setting clicked for setting ID:', settingId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Security & Access Management
        </h1>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateRole}>
          Create Role
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted border-border">
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="logs">Access Logs</TabsTrigger>
          <TabsTrigger value="settings">Security Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">User Roles ({rolesData.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rolesData.map((role) => (
                  <div key={role.id} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <role.icon className="w-5 h-5 text-blue-500" />
                        <h3 className="font-semibold text-foreground">{role.name}</h3>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-popover border-border">
                          <DropdownMenuItem onClick={() => handleEditRole(role.id)} className="text-popover-foreground hover:bg-accent">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Role
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteRole(role.id)} className="text-red-500 hover:bg-red-500/20">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Role
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                    <div className="text-xs text-muted-foreground mb-3">
                      {role.userCount} users assigned
                    </div>
                    <div className="space-y-1">
                      {role.permissions.slice(0, 3).map((permission, index) => (
                        <div key={index} className="text-xs text-muted-foreground">
                          • {permission}
                        </div>
                      ))}
                      {role.permissions.length > 3 && (
                        <div className="text-xs text-blue-500">
                          +{role.permissions.length - 3} more permissions
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Access Logs</CardTitle>
                <div className="flex items-center space-x-2">
                  <Input 
                    placeholder="Search logs..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 bg-input border-border text-foreground"
                  />
                  <Button variant="outline" size="sm" className="border-border">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                      <TableCell>{log.location}</TableCell>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>
                        <Badge className={log.status === 'Success' ? 
                          'bg-green-500/20 text-green-600 dark:text-green-400' : 
                          'bg-red-500/20 text-red-600 dark:text-red-400'
                        }>
                          {log.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {settingsData.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <setting.icon className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium text-foreground">{setting.name}</div>
                      <div className="text-sm text-muted-foreground">{setting.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-muted-foreground">{setting.value}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleUpdateSetting(setting.id)}
                      className="border-border"
                    >
                      Configure
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
