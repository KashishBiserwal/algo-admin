
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User } from '@/hooks/useUsers';
import { Eye, Shield, CheckCircle, Ban } from 'lucide-react';

interface UserDetailsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (userId: string, status: User['status']) => void;
  onUpdateKYC: (userId: string, kycStatus: User['kycStatus']) => void;
  onUpdateRole: (userId: string, role: string) => void;
}

export const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({
  user,
  open,
  onOpenChange,
  onUpdateStatus,
  onUpdateKYC,
  onUpdateRole
}) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">User Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-blue-400 mb-2">Personal Information</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-slate-400">Name:</span> {user.name}</div>
                <div><span className="text-slate-400">Email:</span> {user.email}</div>
                <div><span className="text-slate-400">Phone:</span> {user.phone}</div>
                <div><span className="text-slate-400">Country:</span> {user.country}</div>
                <div><span className="text-slate-400">Join Date:</span> {user.joinDate}</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-blue-400 mb-2">Account Status</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">Role:</span>
                  <Badge variant="outline" className="border-blue-400 text-blue-400">
                    {user.role}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">Status:</span>
                  <Badge 
                    variant="outline"
                    className={`${
                      user.status === 'Active' ? 'border-green-400 text-green-400' :
                      user.status === 'Flagged' ? 'border-yellow-400 text-yellow-400' :
                      'border-red-400 text-red-400'
                    }`}
                  >
                    {user.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">KYC:</span>
                  <Badge 
                    variant="outline"
                    className={`${
                      user.kycStatus === 'Verified' ? 'border-green-400 text-green-400' :
                      'border-yellow-400 text-yellow-400'
                    }`}
                  >
                    {user.kycStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-blue-400 mb-2">Trading Information</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div><span className="text-slate-400">Total Trades:</span> {user.totalTrades.toLocaleString()}</div>
              <div><span className="text-slate-400">Wallet Balance:</span> {user.wallet}</div>
              <div><span className="text-slate-400">Last Login:</span> {user.lastLogin}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800">
            <Button
              onClick={() => onUpdateRole(user.id, user.role === 'Trader' ? 'Premium Trader' : 'Trader')}
              variant="outline"
              size="sm"
              className="border-slate-700 text-slate-300"
            >
              <Shield className="w-4 h-4 mr-2" />
              Toggle Role
            </Button>
            
            {user.kycStatus !== 'Verified' && (
              <Button
                onClick={() => onUpdateKYC(user.id, 'Verified')}
                variant="outline"
                size="sm"
                className="border-green-600 text-green-400"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve KYC
              </Button>
            )}
            
            <Button
              onClick={() => onUpdateStatus(user.id, user.status === 'Active' ? 'Suspended' : 'Active')}
              variant="outline"
              size="sm"
              className={user.status === 'Active' ? 'border-red-600 text-red-400' : 'border-green-600 text-green-400'}
            >
              <Ban className="w-4 h-4 mr-2" />
              {user.status === 'Active' ? 'Suspend' : 'Activate'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
