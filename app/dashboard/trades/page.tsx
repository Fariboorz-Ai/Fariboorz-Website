import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { connectDB } from "@/app/db";
import tradeModel from "@/app/models/tradeModel";
import userModel from "@/app/models/userModel";
import Sidebar from '../../components/Sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/Accordion';
import Icon from '../../components/Icon';
import { redirect } from "next/navigation";

async function getTradesData(userId: string) {
  await connectDB();
  
 
  const trades = await tradeModel
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(50); 
  
 
  const user = await userModel.findById(userId);
  
  return {
    trades,
    user
  };
}

export default async function TradesHistoryPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }
  
  const data = await getTradesData(session.user.id);
  
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
        return 'text-green-500 bg-green-500/10';
      case 'open':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'cancelled':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'BUY' ? 'text-green-500' : 'text-red-500';
  };

  const getPnlColor = (pnl: number) => {
    return pnl >= 0 ? 'text-green-500' : 'text-red-500';
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
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <Sidebar />

      <main className="flex-1 p-8 space-y-8 max-w-7xl ml-64">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-2">
            Trades History
          </h1>
          <p className="text-gray-400">View and analyze your trading history and performance</p>
        </div>

        <div>
          <Card className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl">
            <CardHeader className="border-b border-gray-700/30">
              <CardTitle className="text-xl font-bold flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
                  <Icon icon="mdi:history" className="w-5 h-5 text-white" />
                </div>
                Recent Trades ({data.trades.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {data.trades.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700/50 hover:bg-gray-700/20">
                        <TableHead className="text-gray-300 font-medium">Trade</TableHead>
                        <TableHead className="text-gray-300 font-medium">Type</TableHead>
                        <TableHead className="text-gray-300 font-medium">Entry Price</TableHead>
                        <TableHead className="text-gray-300 font-medium">Exit Price</TableHead>
                        <TableHead className="text-gray-300 font-medium">Status</TableHead>
                        <TableHead className="text-gray-300 font-medium">Date</TableHead>
                        <TableHead className="text-gray-300 font-medium">P&L</TableHead>
                        <TableHead className="text-gray-300 font-medium">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.trades.map((trade) => {
                        const { pnl, pnlPercent } = calculatePnl(trade);
                        return (
                          <TableRow key={trade._id.toString()} className="border-gray-700/30 hover:bg-gray-700/20">
                            <TableCell className="font-medium text-white">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${trade.side === 'BUY' ? 'bg-green-500' : 'bg-red-500'}`} />
                                {trade.symbol}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(trade.side)} bg-opacity-10 ${trade.side === 'BUY' ? 'bg-green-500' : 'bg-red-500'}`}>
                                {trade.side}
                              </span>
                            </TableCell>
                            <TableCell className="text-white">
                              {trade.entryPrice ? formatCurrency(trade.entryPrice) : 'N/A'}
                            </TableCell>
                            <TableCell className="text-white">
                              {trade.exitPrice ? formatCurrency(trade.exitPrice) : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trade.status)}`}>
                                {trade.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-gray-400 text-sm">
                              {formatDate(trade.createdAt)}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className={`font-medium ${getPnlColor(pnl)}`}>
                                  {pnl !== 0 ? formatCurrency(pnl) : 'Pending'}
                                </span>
                                {pnl !== 0 && (
                                  <span className={`text-xs ${getPnlColor(pnlPercent)}`}>
                                    {formatPercentage(pnlPercent)}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <details className="group">
                                <summary className="cursor-pointer p-1 hover:bg-gray-700/50 rounded transition-colors list-none">
                                  <Icon 
                                    icon="mdi:chevron-down" 
                                    className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" 
                                  />
                                </summary>
                              </details>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Icon icon="mdi:chart-line" className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">No trades yet</h3>
                  <p className="text-gray-400 mb-4">Start trading to see your history here</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Icon icon="mdi:information" className="w-4 h-4" />
                    <span>Your trades will appear here once you start trading</span>
                  </div>
                </div>
              )}

              {data.trades.length > 0 && (
                <Accordion type="single" collapsible className="border-t border-gray-700/30">
                  {data.trades.map((trade) => {
                    const { pnl, pnlPercent } = calculatePnl(trade);
                    const duration = trade.updatedAt && trade.createdAt 
                      ? Math.round((new Date(trade.updatedAt).getTime() - new Date(trade.createdAt).getTime()) / (1000 * 60))
                      : 0;
                    
                    return (
                      <AccordionItem key={trade._id.toString()} value={trade._id.toString()} className="border-gray-700/30">
                        <AccordionTrigger className="hidden" />
                        <AccordionContent>
                          <div className="p-6 bg-gray-900/30 rounded-lg border border-gray-700/30">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                              <div className="space-y-3">
                                <h4 className="font-semibold text-white flex items-center gap-2">
                                  <Icon icon="mdi:chart-line" className="w-4 h-4 text-red-500" />
                                  Trade Details
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Entry Price:</span>
                                    <span className="text-white">
                                      {trade.entryPrice ? formatCurrency(trade.entryPrice) : 'N/A'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Exit Price:</span>
                                    <span className="text-white">
                                      {trade.exitPrice ? formatCurrency(trade.exitPrice) : 'N/A'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Duration:</span>
                                    <span className="text-white">
                                      {duration > 0 ? `${duration} minutes` : 'N/A'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Trade ID:</span>
                                    <span className="text-white text-xs font-mono">
                                      {trade.tradeId}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <h4 className="font-semibold text-white flex items-center gap-2">
                                  <Icon icon="mdi:shield" className="w-4 h-4 text-red-500" />
                                  Risk Management
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Stop Loss:</span>
                                    <span className="text-red-400">
                                      {trade.stopLoss ? formatCurrency(trade.stopLoss) : 'Not set'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Take Profit:</span>
                                    <span className="text-green-400">
                                      {trade.takeProfit && trade.takeProfit.length > 0 
                                        ? trade.takeProfit.map((tp: number, i: number) => 
                                            `${formatCurrency(tp)}${i < trade.takeProfit.length - 1 ? ', ' : ''}`
                                          ).join('')
                                        : 'Not set'
                                      }
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">TP Hit Count:</span>
                                    <span className="text-white">{trade.tpHitCount || 0}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Closed Portion:</span>
                                    <span className="text-white">
                                      {trade.closedPortion ? `${(trade.closedPortion * 100).toFixed(1)}%` : '0%'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <h4 className="font-semibold text-white flex items-center gap-2">
                                  <Icon icon="mdi:information" className="w-4 h-4 text-red-500" />
                                  Market Info
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Symbol:</span>
                                    <span className="text-white">{trade.symbol}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Exchange:</span>
                                    <span className="text-white">{trade.exchange}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Signal ID:</span>
                                    <span className="text-white text-xs font-mono">{trade.signalId}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Description:</span>
                                    <span className="text-white text-xs">
                                      {trade.description || 'No description'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <h4 className="font-semibold text-white flex items-center gap-2">
                                  <Icon icon="mdi:robot" className="w-4 h-4 text-red-500" />
                                  Performance
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Status:</span>
                                    <span className={`font-medium ${getStatusColor(trade.status).split(' ')[0]}`}>
                                      {trade.status}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">P&L:</span>
                                    <span className={`font-medium ${getPnlColor(pnl)}`}>
                                      {pnl !== 0 ? formatCurrency(pnl) : 'Pending'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">ROI:</span>
                                    <span className={`font-medium ${getPnlColor(pnlPercent)}`}>
                                      {pnl !== 0 ? formatPercentage(pnlPercent) : 'Pending'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Events:</span>
                                    <span className="text-white">
                                      {trade.events ? trade.events.length : 0}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                         
                            {trade.events && trade.events.length > 0 && (
                              <div className="mt-6 pt-6 border-t border-gray-700/30">
                                <h4 className="font-semibold text-white flex items-center gap-2 mb-4">
                                  <Icon icon="mdi:timeline" className="w-4 h-4 text-red-500" />
                                  Trade Events
                                </h4>
                                <div className="space-y-2">
                                  {trade.events.map((event: any, index: number) => (
                                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-800/30 rounded-lg">
                                      <div className={`w-2 h-2 rounded-full ${
                                        event.type === 'opened' ? 'bg-green-500' :
                                        event.type === 'tp_hit' ? 'bg-blue-500' :
                                        event.type === 'sl_hit' ? 'bg-red-500' :
                                        'bg-gray-500'
                                      }`} />
                                      <span className="text-sm text-gray-300 capitalize">{event.type}</span>
                                      <span className="text-sm text-gray-400">
                                        {event.price ? formatCurrency(event.price) : ''}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {event.at ? formatDate(event.at) : ''}
                                      </span>
                                      {event.note && (
                                        <span className="text-xs text-gray-400 ml-auto">{event.note}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}



