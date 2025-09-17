
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import { AppLayout } from "./components/layout/AppLayout";
import { Dashboard } from "./components/dashboard/Dashboard";
import { UserManagement } from "./components/users/UserManagement";
import { StrategyManagement } from "./components/strategies/StrategyManagement";
import { SubscriptionManagement } from "./components/subscriptions/SubscriptionManagement";
import { NotificationManagement } from "./components/notifications/NotificationManagement";
import { SecurityManagement } from "./components/security/SecurityManagement";
import { PlatformSettings } from "./components/settings/PlatformSettings";
import NotFound from "./pages/NotFound";
import LoginPage from "./components/auth/LoginPage";
import BrokerManagement from "./components/broker/Broker";


const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
     
        <Route path="/login" element={<LoginPage />} />
     
        <Route path="/register" element={<LoginPage />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/strategies" element={<StrategyManagement />} />
        <Route path="/brokers" element={<BrokerManagement/>} />
        <Route path="/trades" element={<div className="text-foreground">Orders & Trades - Coming Soon</div>} />
        <Route path="/compliance" element={<div className="text-foreground">Compliance Center - Coming Soon</div>} />
        <Route path="/financial" element={<div className="text-foreground">Financial Dashboard - Coming Soon</div>} />
        <Route path="/subscriptions" element={<SubscriptionManagement />} />
        <Route path="/notifications" element={<NotificationManagement />} />
        <Route path="/pages" element={<div className="text-foreground">Pages Manager - Coming Soon</div>} />
        <Route path="/settings" element={<PlatformSettings />} />
        <Route path="/security" element={<SecurityManagement />} />
        <Route path="/audit" element={<div className="text-foreground">Audit & Logs - Coming Soon</div>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
