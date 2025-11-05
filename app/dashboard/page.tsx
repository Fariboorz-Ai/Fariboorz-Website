import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { connectDB } from "@/app/db";
import userModel from "@/app/models/userModel";
import tradeModel from "@/app/models/tradeModel";
import notificationModel from "@/app/models/notificationModel";
import Sidebar from "../components/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { AreaChartComponent as AreaChart } from "../components/charts/AreaChart";
import Icon from "../components/Icon";
import { redirect } from "next/navigation";

async function getDashboardData(userId: string) {
  await connectDB();
  
  const user = await userModel.findById(userId).populate('trades_history');
  

  const recentTrades = await tradeModel
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(5);
  
  const notifications = await notificationModel
    .find({ userId, isRead: false })
    .sort({ createdAt: -1 })
    .limit(5);
  

  const allTrades = await tradeModel.find({ userId });
  const openTrades = allTrades.filter(trade => trade.status === 'open');
  const closedTrades = allTrades.filter(trade => trade.status === 'closed');
  
  const totalProfitLoss = closedTrades.reduce((sum, trade) => sum + (trade.profitLoss || 0), 0);
  const winRate = closedTrades.length > 0 
    ? (closedTrades.filter(trade => (trade.profitLoss || 0) > 0).length / closedTrades.length) * 100 
    : 0;
  
 
  const portfolioData = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayTrades = closedTrades.filter(trade => 
      trade.updatedAt && 
      trade.updatedAt.toDateString() === date.toDateString()
    );
    const dayProfit = dayTrades.reduce((sum, trade) => sum + (trade.profitLoss || 0), 0);
    portfolioData.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.max(0, 10000 + dayProfit)
    });
  }
  
  return {
    user,
    recentTrades,
    notifications,
    stats: {
      totalTrades: allTrades.length,
      openTrades: openTrades.length,
      closedTrades: closedTrades.length,
      totalProfitLoss,
      winRate,
      averageProfit: closedTrades.length > 0 ? totalProfitLoss / closedTrades.length : 0
    },
    portfolioData
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }
  
  const data = await getDashboardData(session.user.id);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
  <div className="flex ml-64 min-h-screen bg-background text-foreground">
      <Sidebar />
      
  <main className="flex-1 p-8 pt-24 bg-transparent min-h-screen">
   
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {data.user?.name}</h1>
            <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your trading today</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-card/80 rounded-lg border border-border/50">
              <div className={`w-2 h-2 rounded-full ${data.user?.subscription?.plan === 'vip' ? 'bg-warning' : data.user?.subscription?.plan === 'pro' ? 'bg-primary' : 'bg-muted'}`} />
              <span className="text-sm text-muted-foreground capitalize">{data.user?.subscription?.plan || 'free'} Plan</span>
            </div>
            <button className="p-2 bg-card/80 rounded-lg border border-border/50 hover:bg-background/50 transition-colors">
              <Icon icon="mdi:bell" className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
        
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/80 border border-border/50 hover:border-success/50 hover:shadow-lg hover:shadow-success/10 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-success text-sm font-medium flex items-center gap-2">
                <Icon icon="mdi:chart-line" className="w-4 h-4" />
                Total Profit/Loss
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${data.stats.totalProfitLoss >= 0 ? 'text-success' : 'text-primary'}`}> 
                {formatCurrency(data.stats.totalProfitLoss)}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Icon 
                  icon={data.stats.totalProfitLoss >= 0 ? "mdi:trending-up" : "mdi:trending-down"} 
                  className={`w-4 h-4 ${data.stats.totalProfitLoss >= 0 ? 'text-success' : 'text-primary'}`} 
                />
                <span className={`text-sm ${data.stats.totalProfitLoss >= 0 ? 'text-success' : 'text-primary'}`}> 
                  {data.stats.totalProfitLoss >= 0 ? '+' : ''}{formatPercentage(data.stats.winRate)} win rate
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 border border-border/50 hover:border-success/50 hover:shadow-lg hover:shadow-success/10 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-success text-sm font-medium flex items-center gap-2">
                <Icon icon="mdi:check-circle" className="w-4 h-4" />
                Closed Trades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{data.stats.closedTrades}</p>
              <div className="flex items-center gap-2 mt-2">
                <Icon icon="mdi:chart-bar" className="w-4 h-4 text-success" />
                <span className="text-sm text-success">
                  {data.stats.closedTrades > 0 ? formatCurrency(data.stats.averageProfit) : '$0.00'} avg profit
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 border border-border/50 hover:border-warning/50 hover:shadow-lg hover:shadow-warning/10 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-warning text-sm font-medium flex items-center gap-2">
                <Icon icon="mdi:clock-outline" className="w-4 h-4" />
                Open Trades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{data.stats.openTrades}</p>
              <div className="flex items-center gap-2 mt-2">
                <Icon icon="mdi:alert-circle" className="w-4 h-4 text-warning" />
                <span className="text-sm text-warning">
                  {data.stats.openTrades > 0 ? 'Active positions' : 'No open trades'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 border border-border/50 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-accent text-sm font-medium flex items-center gap-2">
                <Icon icon="mdi:robot" className="w-4 h-4" />
                Trading Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-foreground">
                  {data.user?.trade_settings?.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className="mt-2">
                <div className="flex items-center gap-2 text-sm">
                  <Icon icon="mdi:exchange" className="w-4 h-4 text-accent" />
                  <span className="text-accent">
                    {data.user?.exchange?.name ? data.user.exchange.name.toUpperCase() : 'No Exchange'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

   
  <Card className="p-6 mb-8 bg-card/80 backdrop-blur border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Portfolio Performance (Last 7 Days)</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span>Portfolio Value</span>
              </div>
            </div>
          </div>
          <AreaChart
            data={data.portfolioData}
            height={300}
          />
        </Card>

     
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card/80 backdrop-blur border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Icon icon="mdi:history" className="w-5 h-5" />
                Recent Trades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentTrades.length > 0 ? (
                  data.recentTrades.map((trade) => (
                    <div key={trade._id} className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${trade.side === 'BUY' ? 'bg-success' : 'bg-primary'}`} />
                        <div>
                          <p className="font-medium text-foreground">{trade.symbol}</p>
                          <p className="text-sm text-muted-foreground">{trade.side} • {trade.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">${trade.entryPrice?.toFixed(2)}</p>
                        <p className={`text-sm ${trade.profitLoss && trade.profitLoss > 0 ? 'text-success' : trade.profitLoss && trade.profitLoss < 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                          {trade.profitLoss ? formatCurrency(trade.profitLoss) : 'Pending'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon icon="mdi:chart-line" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No trades yet</p>
                    <p className="text-sm">Start trading to see your activity here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Icon icon="mdi:bell" className="w-5 h-5" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.notifications.length > 0 ? (
                  data.notifications.map((notification) => (
                    <div key={notification._id} className="flex items-start gap-3 p-3 bg-background/30 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === 'trade' ? 'bg-success' : 
                        notification.type === 'signal' ? 'bg-primary' : 
                        notification.type === 'alert' ? 'bg-warning' : 'bg-muted'
                      }`} />
                      <div className="flex-1">
                        <p className="text-foreground font-medium">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon icon="mdi:bell-off" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No notifications</p>
                    <p className="text-sm">You&apos;re all caught up!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

    
        <div className="mt-8">
          <Card className="bg-card/80 backdrop-blur border border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Icon icon="mdi:account-cog" className="w-5 h-5" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Exchange Connection:</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${data.user?.exchange?.isActive ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'}`}>
                      {data.user?.exchange?.isActive ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Telegram Bot:</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${data.user?.telegram?.isActive ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'}`}>
                      {data.user?.telegram?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Trading Strategy:</span>
                    <span className="text-foreground text-sm">
                      {data.user?.trade_settings?.strategyId ? 'Active' : 'None Selected'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Leverage:</span>
                    <span className="text-foreground text-sm">
                      {data.user?.trade_settings?.leverage}x
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last Login:</span>
                    <span className="text-foreground text-sm">
                      {data.user?.lastLogin ? new Date(data.user.lastLogin).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Member Since:</span>
                    <span className="text-foreground text-sm">
                      {data.user?.createdAt ? new Date(data.user.createdAt).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

