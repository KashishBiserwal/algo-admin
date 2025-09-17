import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings as SettingsIcon,
  Activity,
  Bell,
  Shield,
  Zap
} from 'lucide-react';

interface Setting {
  id: string;
  name: string;
  description: string;
  value: string;
  type: 'string' | 'boolean';
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const generalSettings: Setting[] = [
  {
    id: 'siteName',
    name: 'Site Name',
    description: 'The name of your platform',
    value: 'Alogo Rooms',
    type: 'string',
    icon: SettingsIcon
  },
  {
    id: 'enableAnalytics',
    name: 'Enable Analytics',
    description: 'Enable or disable site analytics',
    value: 'true',
    type: 'boolean',
    icon: Activity
  },
  {
    id: 'defaultLanguage',
    name: 'Default Language',
    description: 'Set the default language for the platform',
    value: 'English',
    type: 'string',
    icon: SettingsIcon
  }
];

const tradingSettings: Setting[] = [
  {
    id: 'autoTradingEnabled',
    name: 'Auto Trading',
    description: 'Enable or disable automated trading',
    value: 'false',
    type: 'boolean',
    icon: Activity
  },
  {
    id: 'maxTradeSize',
    name: 'Max Trade Size',
    description: 'Maximum size of automated trades',
    value: '1000',
    type: 'string',
    icon: Activity
  }
];

const notificationSettings: Setting[] = [
  {
    id: 'emailNotifications',
    name: 'Email Notifications',
    description: 'Enable or disable email notifications',
    value: 'true',
    type: 'boolean',
    icon: Bell
  },
  {
    id: 'smsNotifications',
    name: 'SMS Notifications',
    description: 'Enable or disable SMS notifications',
    value: 'false',
    type: 'boolean',
    icon: Bell
  }
];

const securitySettings: Setting[] = [
  {
    id: 'twoFactorAuth',
    name: 'Two-Factor Authentication',
    description: 'Enable or disable two-factor authentication',
    value: 'true',
    type: 'boolean',
    icon: Shield
  },
  {
    id: 'sessionTimeout',
    name: 'Session Timeout',
    description: 'Set the session timeout duration (minutes)',
    value: '30',
    type: 'string',
    icon: Shield
  }
];

const apiSettings: Setting[] = [
  {
    id: 'apiEnabled',
    name: 'API Access',
    description: 'Enable or disable API access',
    value: 'false',
    type: 'boolean',
    icon: Zap
  },
  {
    id: 'maxApiRequests',
    name: 'Max API Requests',
    description: 'Maximum number of API requests per hour',
    value: '1000',
    type: 'string',
    icon: Zap
  }
];

export const PlatformSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: generalSettings,
    trading: tradingSettings,
    notifications: notificationSettings,
    security: securitySettings,
    api: apiSettings
  });

  const handleSettingChange = (id: string, value: string) => {
    setSettings(prevSettings => {
      const tab = Object.keys(prevSettings).find(key =>
        prevSettings[key as keyof typeof prevSettings].find(setting => setting.id === id)
      ) as keyof typeof prevSettings;

      const updatedSettings = { ...prevSettings };
      updatedSettings[tab] = prevSettings[tab].map(setting =>
        setting.id === id ? { ...setting, value } : setting
      );
      return updatedSettings;
    });
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Platform Settings
        </h1>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveSettings}>
          Save Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted border-border">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="api">API & Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.general.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <setting.icon className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium text-foreground">{setting.name}</div>
                      <div className="text-sm text-muted-foreground">{setting.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {setting.type === 'boolean' ? (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={setting.value === 'true'}
                          onChange={() => handleSettingChange(setting.id, setting.value === 'true' ? 'false' : 'true')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    ) : (
                      <Input
                        value={setting.value}
                        onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                        className="w-48 bg-input border-border text-foreground"
                      />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trading" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Trading Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.trading.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <setting.icon className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium text-foreground">{setting.name}</div>
                      <div className="text-sm text-muted-foreground">{setting.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {setting.type === 'boolean' ? (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={setting.value === 'true'}
                          onChange={() => handleSettingChange(setting.id, setting.value === 'true' ? 'false' : 'true')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    ) : (
                      <Input
                        value={setting.value}
                        onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                        className="w-48 bg-input border-border text-foreground"
                      />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.notifications.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <setting.icon className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="font-medium text-foreground">{setting.name}</div>
                      <div className="text-sm text-muted-foreground">{setting.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {setting.type === 'boolean' ? (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={setting.value === 'true'}
                          onChange={() => handleSettingChange(setting.id, setting.value === 'true' ? 'false' : 'true')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    ) : (
                      <Input
                        value={setting.value}
                        onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                        className="w-48 bg-input border-border text-foreground"
                      />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Security Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.security.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <setting.icon className="w-5 h-5 text-red-500" />
                    <div>
                      <div className="font-medium text-foreground">{setting.name}</div>
                      <div className="text-sm text-muted-foreground">{setting.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {setting.type === 'boolean' ? (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={setting.value === 'true'}
                          onChange={() => handleSettingChange(setting.id, setting.value === 'true' ? 'false' : 'true')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    ) : (
                      <Input
                        value={setting.value}
                        onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                        className="w-48 bg-input border-border text-foreground"
                      />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">API & Integration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.api.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <setting.icon className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="font-medium text-foreground">{setting.name}</div>
                      <div className="text-sm text-muted-foreground">{setting.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {setting.type === 'boolean' ? (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={setting.value === 'true'}
                          onChange={() => handleSettingChange(setting.id, setting.value === 'true' ? 'false' : 'true')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    ) : (
                      <Input
                        value={setting.value}
                        onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                        className="w-48 bg-input border-border text-foreground"
                      />
                    )}
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
