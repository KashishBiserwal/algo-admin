
import React from 'react';
import { StatsGrid } from './StatsGrid';
import { ActivityFeed } from './ActivityFeed';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <div className="text-sm text-slate-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <ActivityFeed />
        </div>
        {/* <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-md bg-muted hover:bg-accent transition-colors">
                <div className="font-medium text-foreground">View All Users</div>
                <div className="text-sm text-muted-foreground">Manage user accounts and permissions</div>
              </button>
              <button className="w-full text-left p-3 rounded-md bg-muted hover:bg-accent transition-colors">
                <div className="font-medium text-foreground">Strategy Management</div>
                <div className="text-sm text-muted-foreground">Monitor and edit trading strategies</div>
              </button>
              <button className="w-full text-left p-3 rounded-md bg-muted hover:bg-accent transition-colors">
                <div className="font-medium text-foreground">System Health</div>
                <div className="text-sm text-muted-foreground">Check API status and broker connections</div>
              </button>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">API Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-500">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Database</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-500">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Angel One API</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-500">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};
