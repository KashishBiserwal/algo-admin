
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const pendingAlgos = [
  {
    id: 'ALG001',
    name: 'Momentum Scalper Pro',
    submittedBy: 'John Doe',
    submittedAt: '2 hours ago',
    status: 'pending',
    riskScore: 'Medium'
  },
  {
    id: 'ALG002',
    name: 'Mean Reversion Strategy',
    submittedBy: 'Jane Smith',
    submittedAt: '4 hours ago',
    status: 'pending',
    riskScore: 'Low'
  },
  {
    id: 'ALG003',
    name: 'Volatility Breakout',
    submittedBy: 'Mike Johnson',
    submittedAt: '1 day ago',
    status: 'pending',
    riskScore: 'High'
  }
];

export const AlgoApprovalQueue: React.FC = () => {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-foreground">
          <Clock className="w-5 h-5" />
          <span>Algo Approval Queue</span>
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">
            {pendingAlgos.length} Pending
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingAlgos.map((algo) => (
            <div key={algo.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-foreground">{algo.name}</h4>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      algo.riskScore === 'High' ? 'border-red-500 text-red-500' :
                      algo.riskScore === 'Medium' ? 'border-yellow-500 text-yellow-500' :
                      'border-green-500 text-green-500'
                    }`}
                  >
                    {algo.riskScore} Risk
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  ID: {algo.id} • By {algo.submittedBy} • {algo.submittedAt}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
