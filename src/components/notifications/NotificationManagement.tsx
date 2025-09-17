import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Filter, MoreHorizontal, Edit, Send, Power, Trash } from 'lucide-react';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'Email' | 'SMS' | 'Push';
  description: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  lastUsed: string;
}

interface NotificationLog {
  id: string;
  type: string;
  recipient: string;
  timestamp: string;
  status: 'Delivered' | 'Failed';
}

const initialTemplates: NotificationTemplate[] = [
  {
    id: 'NT001',
    name: 'Welcome Message',
    type: 'Email',
    description: 'Welcome email for new users',
    status: 'Active',
    createdAt: '2024-01-15',
    lastUsed: '2024-06-01',
  },
  {
    id: 'NT002',
    name: 'Trade Alert',
    type: 'SMS',
    description: 'SMS alert for trade execution',
    status: 'Active',
    createdAt: '2024-02-20',
    lastUsed: '2024-06-05',
  },
  {
    id: 'NT003',
    name: 'Strategy Update',
    type: 'Push',
    description: 'Push notification for strategy updates',
    status: 'Inactive',
    createdAt: '2024-03-10',
    lastUsed: 'Never',
  },
];

const initialLogs: NotificationLog[] = [
  {
    id: 'NL001',
    type: 'Email',
    recipient: 'john.doe@example.com',
    timestamp: '2024-06-07 10:30',
    status: 'Delivered',
  },
  {
    id: 'NL002',
    type: 'SMS',
    recipient: '+15551234567',
    timestamp: '2024-06-07 11:15',
    status: 'Delivered',
  },
  {
    id: 'NL003',
    type: 'Push',
    recipient: 'user123',
    timestamp: '2024-06-07 12:00',
    status: 'Failed',
  },
  {
    id: 'NL004',
    type: 'Email',
    recipient: 'jane.smith@example.com',
    timestamp: '2024-06-07 13:45',
    status: 'Delivered',
  },
  {
    id: 'NL005',
    type: 'SMS',
    recipient: '+15559876543',
    timestamp: '2024-06-07 14:30',
    status: 'Delivered',
  },
];

export const NotificationManagement: React.FC = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>(initialTemplates);
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>(initialLogs);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = activeTab === 'all' || template.type.toLowerCase() === activeTab;

    return matchesSearch && matchesType;
  });

  const handleCreateTemplate = () => {
    console.log('Creating new template');
  };

  const handleEditTemplate = (templateId: string) => {
    console.log('Editing template:', templateId);
  };

  const handleTestTemplate = (templateId: string) => {
    console.log('Sending test template:', templateId);
  };

  const handleToggleTemplate = (templateId: string) => {
    setTemplates(templates.map(template =>
      template.id === templateId ? { ...template, status: template.status === 'Active' ? 'Inactive' : 'Active' } : template
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Notification Management
        </h1>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateTemplate}>
          Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Notification Templates</CardTitle>
                <Button size="sm" variant="outline" className="border-border">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-muted border-border">
                  <TabsTrigger value="all">All Templates</TabsTrigger>
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="sms">SMS</TabsTrigger>
                  <TabsTrigger value="push">Push</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-4">
                  <div className="space-y-4">
                    {filteredTemplates.map((template) => (
                      <div key={template.id} className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-foreground">{template.name}</h3>
                            <Badge variant="outline" className={`${
                              template.type === 'Email' ? 'border-blue-500 text-blue-500' :
                              template.type === 'SMS' ? 'border-green-500 text-green-500' :
                              'border-purple-500 text-purple-500'
                            }`}>
                              {template.type}
                            </Badge>
                            <Badge className={template.status === 'Active' ? 
                              'bg-green-500/20 text-green-600 dark:text-green-400' : 
                              'bg-red-500/20 text-red-600 dark:text-red-400'
                            }>
                              {template.status}
                            </Badge>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-popover border-border">
                              <DropdownMenuItem onClick={() => handleEditTemplate(template.id)} className="text-popover-foreground hover:bg-accent">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Template
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleTestTemplate(template.id)} className="text-popover-foreground hover:bg-accent">
                                <Send className="mr-2 h-4 w-4" />
                                Send Test
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleToggleTemplate(template.id)}
                                className={template.status === 'Active' ? 'text-red-500 hover:bg-red-500/20' : 'text-green-500 hover:bg-green-500/20'}
                              >
                                <Power className="mr-2 h-4 w-4" />
                                {template.status === 'Active' ? 'Deactivate' : 'Activate'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                        <div className="text-xs text-muted-foreground">
                          Created: {template.createdAt} • Last used: {template.lastUsed}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Send</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Select Users</label>
                <Input placeholder="Search users..." className="mt-1 bg-input border-border text-foreground" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Template</label>
                <select className="w-full mt-1 p-2 bg-input border border-border rounded-md text-foreground">
                  <option>Welcome Message</option>
                  <option>Trade Alert</option>
                  <option>Strategy Update</option>
                </select>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4 mr-2" />
                Send Notification
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notificationLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium text-foreground">{log.type}</div>
                    <div className="text-xs text-muted-foreground">
                      To: {log.recipient} • {log.timestamp}
                    </div>
                    <Badge className={log.status === 'Delivered' ? 
                      'bg-green-500/20 text-green-600 dark:text-green-400' : 
                      'bg-red-500/20 text-red-600 dark:text-red-400'
                    }>
                      {log.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
