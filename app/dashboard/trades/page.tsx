import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { connectDB } from "@/app/db";
import tradeModel from "@/app/models/tradeModel";
import userModel from "@/app/models/userModel";
import Sidebar from '@/app/components/Sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/Card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/app/components/ui/Accordion';
import Icon from '@/app/components/Icon';
import { redirect } from "next/navigation";
import Image from 'next/image';
import { getCryptoLogo } from "@/utils/utils";

async function getTradesData(userId: string) {
  await connectDB();
  
  const trades = await tradeModel
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean(); 
  
  const user = await userModel.findById(userId).lean();
  
 
  const tradesWithLogos = await Promise.all(
    trades.map(async (trade: any) => {
      const logo = await getCryptoLogo(trade.symbol);
      return {
        ...trade,
        logo
      };
    })
  );
  
  return {
    trades: tradesWithLogos,
    user
  };
}

export default async function TradesHistoryPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }
  
  const data = await getTradesData(session.user.id);
  const trades = data.trades || [];
  const closedTrades = trades.filter((t: any) => t.status === 'closed');
  const openTrades = trades.filter((t: any) => t.status === 'open');
  const totalPnL = closedTrades.reduce((sum: number, t: any) => sum + (t.profitLoss || 0), 0);
  const winRate = closedTrades.length > 0
    ? (closedTrades.filter((t: any) => (t.profitLoss || 0) > 0).length / closedTrades.length) * 100
    : 0;
  const avgHoldMinutes = closedTrades.length > 0
    ? Math.round(
        closedTrades.reduce((sum: number, t: any) => {
          if (!t.updatedAt || !t.createdAt) return sum;
          return sum + Math.max(0, (new Date(t.updatedAt).getTime() - new Date(t.createdAt).getTime()) / (1000 * 60));
        }, 0) / closedTrades.length
      )
    : 0;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed':
        return 'text-success bg-success/20 border border-success/30';
      case 'open':
        return 'text-warning bg-warning/20 border border-warning/30';
      case 'cancelled':
        return 'text-error bg-error/20 border border-error/30';
      default:
        return 'text-gray-400 bg-gray-400/20 border border-gray-400/30';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'BUY' 
      ? 'text-success font-semibold bg-success/10 px-2 py-1 rounded-lg' 
      : 'text-error font-semibold bg-error/10 px-2 py-1 rounded-lg';
  };

  const getPnlColor = (pnl: number) => {
    return pnl >= 0 
      ? 'text-success bg-success/10 px-3 py-1 rounded-full font-semibold' 
      : 'text-error bg-error/10 px-3 py-1 rounded-full font-semibold';
  };
  
  const calculatePnl = (trade: any) => {
    if (trade.status === 'open' || !trade.profitLoss) {
      return { pnl: 0, pnlPercent: 0 };
    }
    
    const pnl = trade.profitLoss;
    const entryValue = trade.entryPrice * (trade.closedPortion || 1);
    const pnlPercent = entryValue > 0 ? (pnl / entryValue) * 100 : 0;
    
    return { pnl, pnlPercent };
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  
  const getCryptoName = (symbol: string) => {
    const parts = symbol.split('/');
    if (parts.length > 0) {
      const cryptoName = parts[0];
      const cleanName = cryptoName.replace(/USDT|USD$/i, '');
      return parts;
    }
    return symbol;
  };


  const getCryptoPair = (symbol: string) => {
    const parts = symbol.split('/');
    if (parts.length > 1) {
      return parts[1];
    }
    return 'USD';
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 text-base-content font-inter">
      <Sidebar />

      <main className="flex-1 p-6 space-y-6 max-w-7xl ml-64">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2 font-poppins">
                Trading History
              </h1>
              <p className="text-base-content/70 text-lg">Analyze your trading performance and statistics</p>
            </div>
          </div>
        </div>
            <div className="divider" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-base-100 to-base-200 border border-base-300/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/60 text-sm font-medium">Total P&L</p>
                  <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-success' : 'text-error'}`}>
                    {formatCurrency(totalPnL)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                  <Icon icon="mdi:finance" className="w-6 h-6 text-success" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${totalPnL >= 0 ? 'bg-success' : 'bg-error'}`}></div>
                <span className="text-sm text-base-content/70">
                  {totalPnL >= 0 ? 'Profit' : 'Loss'} overall
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-base-100 to-base-200 border border-base-300/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/60 text-sm font-medium">Win Rate</p>
                  <p className="text-2xl font-bold text-info">{winRate.toFixed(1)}%</p>
                </div>
                <div className="w-12 h-12 bg-info/20 rounded-xl flex items-center justify-center">
                  <Icon icon="mdi:target" className="w-6 h-6 text-info" />
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-base-300/30 rounded-full h-2">
                  <div 
                    className="bg-info h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(winRate, 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-base-100 to-base-200 border border-base-300/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/60 text-sm font-medium">Total Trades</p>
                  <p className="text-2xl font-bold text-primary">{trades.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Icon icon="mdi:chart-box" className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="mt-3 flex gap-4 text-sm">
                <span className="text-success">● {openTrades.length} Open</span>
                <span className="text-base-content/60">● {closedTrades.length} Closed</span>
              </div>
            </CardContent>
          </Card>
        </div>

      
        <Card className="bg-gradient-to-br from-base-100 to-base-200 border border-base-300/50 rounded-2xl shadow-xl backdrop-blur-sm">
          <CardHeader className="border-b border-base-300/30 p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center gap-3 text-base-content">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <Icon icon="mdi:history" className="w-5 h-5 text-white" />
                </div>
                Recent Trading Activity
                <span className="text-base-content/60 font-normal">({trades.length} trades)</span>
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {trades.length > 0 ? (
              <div className="overflow-hidden">
             
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-base-200/50 text-base-content/60 text-sm font-medium border-b border-base-300/30">
                  <div className="col-span-2">Symbol</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-2">Price Levels</div>
                  <div className="col-span-2">Status / Date</div>
                  <div className="col-span-2">P&L</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

             
                <Accordion type="single" collapsible className="divide-y divide-base-300/30">
                  {trades.map((trade: any) => {
                    const cryptoName = getCryptoName(trade.symbol);
                    const cryptoPair = getCryptoPair(trade.symbol);
                    
                    return (
                    <AccordionItem key={String(trade._id)} value={String(trade._id)} className="border-0">
                      <AccordionTrigger className="px-6 py-4 hover:bg-base-200/30 transition-colors">
                        <div className="grid grid-cols-12 gap-4 items-center w-full">
                    
                          <div className="col-span-2 flex items-center gap-3">
                            <div className="flex items-center gap-3">
                          
                              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 border border-base-300/30">
                                {trade.logo ? (
                                  <Image
                                    src={trade.logo}
                                    alt={trade.symbol}
                                    fill
                                    className="object-cover"
                                    sizes="40px"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-base-200">
                                    <Icon icon="mdi:currency-usd" className="w-5 h-5 text-base-content/40" />
                                  </div>
                                )}
                              </div>
                              
                            
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1">
                             
                                  <span className="text-xs text-success bg-success/10 px-1.5 py-0.5 rounded">
                                    {trade.symbol}
                                  </span>
                                </div>
                                
                              </div>
                            </div>
                          </div>


                           <div className="col-span-2 flex items-center gap-3">
                              <div className={getTypeColor(trade.side)}>{trade.side}</div>
                          </div>

                          <div className="col-span-2">
                            <div className="text-sm">
                              <span className="text-base-content/60">Entry: </span>
                             <span className="text-base-content font-semibold">
                              {formatCurrency(trade.entryPrice)}
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="text-base-content/60">Exit: </span>
                              <span className="text-primary font-semibold">
                                {trade.exitPrice ? formatCurrency(trade.exitPrice) : '—'}
                              </span>
                            </div>
                          </div>

              
                          <div className="col-span-2">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(trade.status)}`}>
                                {trade.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-sm text-base-content/60">
                              {formatTimeAgo(trade.createdAt)}
                            </div>
                          </div>

                   
                          <div className="col-span-2">
                            {trade.status === 'closed' ? (
                              <div className={getPnlColor(trade.profitLoss || 0)}>
                                {formatCurrency(trade.profitLoss || 0)}
                              </div>
                            ) : (
                              <div className="text-base-content/40">—</div>
                            )}
                          </div>

                        </div>
                      </AccordionTrigger>
                      
                      <AccordionContent className="px-6 pb-4">
                        <div className="bg-base-200/30 rounded-xl border border-base-300/40 p-6 space-y-6">
                        
                          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-base-300/30">
                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-base-300/40">
                              {trade.logo ? (
                                <Image
                                  src={trade.logo}
                                  alt={trade.symbol}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-base-200">
                                  <Icon icon="mdi:currency-usd-circle" className="w-8 h-8 text-base-content/40" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-2xl font-bold text-base-content">{cryptoName}</h3>
                                <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                  <span className="text-primary font-semibold text-sm">{trade.symbol}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-base-content/60">
                                <span className="flex items-center gap-1">
                                  <Icon icon="mdi:exchange" className="w-4 h-4" />
                                  {trade.exchange}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Icon icon="mdi:currency-usd" className="w-4 h-4" />
                                  vs {cryptoPair}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Icon icon="mdi:calendar-clock" className="w-4 h-4" />
                                  {formatDate(trade.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                     
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                              <h4 className="text-sm uppercase tracking-wide text-base-content/60 font-semibold">Trade Info</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-base-content/60">Exchange:</span>
                                  <span className="font-semibold text-base-content">{trade.exchange}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-base-content/60">Duration:</span>
                                  <span className="text-base-content">
                                    {trade.updatedAt && trade.createdAt 
                                      ? `${Math.round((new Date(trade.updatedAt).getTime() - new Date(trade.createdAt).getTime()) / (1000 * 60))}m`
                                      : '—'
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-sm uppercase tracking-wide text-base-content/60 font-semibold">Risk Management</h4>
                              <div className="space-y-2">
                                <div className="p-2 bg-error/10 border border-error/20 rounded-lg">
                                  <div className="text-xs text-error font-semibold">Stop Loss</div>
                                  <div className="text-base-content font-medium">
                                    {trade.stopLoss ? formatCurrency(trade.stopLoss) : 'Not set'}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-sm uppercase tracking-wide text-base-content/60 font-semibold">Take Profits</h4>
                              <div className="space-y-2">
                                {trade.takeProfit?.length > 0 ? (
                                  trade.takeProfit.map((tp: number, i: number) => (
                                    <div key={i} className="p-2 bg-success/10 border border-success/20 rounded-lg">
                                      <div className="text-xs text-success font-semibold">TP {i+1}</div>
                                      <div className="text-base-content font-medium">{formatCurrency(tp)}</div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-base-content/60 text-sm">No take profits set</div>
                                )}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-sm uppercase tracking-wide text-base-content/60 font-semibold">Performance</h4>
                              {trade.status === 'closed' && trade.profitLoss !== undefined && (
                                <div className={getPnlColor(trade.profitLoss)}>
                                  <div className="text-lg font-bold text-center">
                                    {formatCurrency(trade.profitLoss)}
                                  </div>
                                  <div className="text-xs text-center opacity-80">
                                    {((trade.profitLoss / (trade.entryPrice * (trade.closedPortion || 1))) * 100).toFixed(2)}%
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {trade.description && (
                            <div>
                              <h4 className="text-sm uppercase tracking-wide text-base-content/60 font-semibold mb-2">Notes</h4>
                              <p className="text-base-content/80 bg-base-200/50 rounded-lg p-3 border border-base-300/30">
                                {trade.description}
                              </p>
                            </div>
                          )}

                 
                          <div>
                            <h4 className="text-sm uppercase tracking-wide text-base-content/60 font-semibold mb-3">Trade Events</h4>
                            <div className="relative">
                              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-base-300/50"></div>
                              <div className="space-y-4">
                                {trade.events && trade.events.length > 0 ? (
                                  trade.events.map((ev: any, idx: number) => (
                                    <div key={idx} className="flex items-start gap-4 relative">
                                      <div className={`w-3 h-3 rounded-full mt-1.5 z-10 ${
                                        ev.type === 'opened' ? 'bg-primary' :
                                        ev.type === 'tp_hit' ? 'bg-success' :
                                        ev.type === 'sl_hit' ? 'bg-error' :
                                        'bg-warning'
                                      }`}></div>
                                      <div className="flex-1 bg-base-200/50 rounded-lg p-3 border border-base-300/30">
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="font-semibold text-base-content capitalize">
                                            {ev.type.replace('_', ' ')}
                                          </span>
                                          <span className="text-xs text-base-content/60">
                                            {formatDate(ev.at)}
                                          </span>
                                        </div>
                                        <div className="text-sm text-base-content/80">
                                          {ev.price && `Price: ${formatCurrency(ev.price)}`}
                                          {ev.note && ` • ${ev.note}`}
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-base-content/60 text-sm p-4 text-center bg-base-200/30 rounded-lg border border-base-300/30">
                                    No events recorded for this trade
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            ) : (
            

             <div className="p-8 text-center">
                   <div className="w-16 h-16 bg-base-300/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon icon="mdi:chart-line" className="w-4 h-4 text-base-content/40" />
                </div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">No trades yet</h3>
                  <p className="text-gray-400 mb-4">Start trading to see your history here</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Icon icon="mdi:information" className="w-4 h-4" />
                    <span>Your trades will appear here once you start trading</span>
                  </div>
                </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
