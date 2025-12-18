"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  BsActivity, BsClock,
  BsServer, BsDatabase, BsCpu, BsMemory, BsCheckCircle, BsXCircle,
  BsCalendar, BsArrowRight, BsFilter , BsClockHistory, BsTriangle, BsArrowUp, BsArrowDown, BsMap
} from 'react-icons/bs';
import api from '../../../../utils/api'
import {
  Card, CardContent, CardHeader, CardTitle
} from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { Skeleton } from '../../../components/ui/Skeleton';
import Sidebar from '../../../components/Sidebar';
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';

interface SignalStats {
  total: number;
  pending: number;
  closed: number;
  today: number;
  byType: { buy: number; sell: number };
}

interface TradeManagerStatus {
  status: string;
  data: {
    queueLength: number;
    processedJobs: number;
    skippedJobs: number;
    successfulTrades: number;
    failedTrades: number;
    lastJobAt: number;
    recentJobs: Array<{
      jobId: string;
      signalId: string;
      strategyId: string;
      exchange: string;
      symbol: string;
      timeframe: string;
      eligibleUsers: number;
      executedTrades: number;
      enqueuedAt: number;
    }>;
  };
  timestamp: string;
}

export default function SignalsPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<SignalStats | null>(null);
  const [tradeManager, setTradeManager] = useState<TradeManagerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  if (!session || !session.user || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }
  const fetchData = async () => {
    setLoading(true);
    try {

      const [statsRes, tmRes] = await Promise.all([
        api.get('/signals/stats'),
        api.get('/trade-manager/status')
      ]);

      setStats(statsRes.data);
      setTradeManager(tmRes.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp: number) => {
    return format(new Date(timestamp), 'HH:mm:ss');
  };

  const getSignalTypeBadge = (type: 'buy' | 'sell') => {
    return type === 'buy' ? (
      <Badge className="bg-success/15 text-success border border-success/30 text-xs flex items-center gap-1">
        <BsArrowUp className="w-3 h-3" /> Buy
      </Badge>
    ) : (
      <Badge className="bg-error/15 text-error border border-error/30 text-xs flex items-center gap-1">
        <BsArrowDown className="w-3 h-3" /> Sell
      </Badge>
    );
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-full ml-64 overflow-x-hidden">
    
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Signals Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Live signal statistics, trade execution, and performance</p>
        </motion.div>

      
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <BsActivity className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Auto-refresh: 10s</span>
          </div>
          <Button onClick={fetchData} size="sm" className="ml-auto">
            <BsCalendar className="w-4 h-4 mr-2" /> Refresh Now
          </Button>
        </div>

       
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Signals", value: stats?.total || 0, icon: BsDatabase, color: "text-primary" },
            { label: "Today", value: stats?.today || 0, icon: BsClockHistory, color: "text-info" },
            { label: "Pending", value: stats?.pending || 0, icon: BsTriangle, color: "text-warning" },
            { label: "Queue Length", value: tradeManager?.data.queueLength || 0, icon: BsMap, color: "text-accent" },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="bg-card/90 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                    </div>
                    <item.icon className={`w-8 h-8 ${item.color} opacity-80`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-card/90 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BsArrowUp className="w-5 h-5 text-emerald-400" /> Buy Signals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-400">{stats?.byType.buy || 0}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {stats?.total ? ((stats.byType.buy / stats.total) * 100).toFixed(1) : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/90 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BsArrowDown className="w-5 h-5 text-rose-400" /> Sell Signals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-rose-400">{stats?.byType.sell || 0}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {stats?.total ? ((stats.byType.sell / stats.total) * 100).toFixed(1) : 0}% of total
              </p>
            </CardContent>
          </Card>
        </div>

     
        <Tabs defaultValue="trade-manager" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-flex bg-card border border-border">
            <TabsTrigger value="trade-manager" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground">Trade Manager</TabsTrigger>
            <TabsTrigger value="recent-jobs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground">Recent Jobs</TabsTrigger>
          </TabsList>

         
          <TabsContent value="trade-manager">
            <Card className="bg-card/90 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-foreground">
                  <span className="flex items-center gap-2">
                    <BsServer className="w-5 h-5 text-primary" /> Trade Execution Engine
                  </span>
                  <Badge variant={tradeManager?.status === 'ok' ? 'default' : 'destructive'} className="text-xs">
                    {tradeManager?.status || 'unknown'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {[
                    { label: "Processed", value: tradeManager?.data.processedJobs || 0, icon: BsCheckCircle, color: "text-success" },
                    { label: "Skipped", value: tradeManager?.data.skippedJobs || 0, icon: BsXCircle, color: "text-warning" },
                    { label: "Success", value: tradeManager?.data.successfulTrades || 0, icon: BsCheckCircle, color: "text-success" },
                    { label: "Failed", value: tradeManager?.data.failedTrades || 0, icon: BsXCircle, color: "text-error" },
                  ].map((item, i) => (
                    <div key={i} className="text-center p-3 bg-muted/40 rounded-lg border border-border/30">
                      <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                        <item.icon className="w-3 h-3" /> {item.label}
                      </p>
                    </div>
                  ))}
                </div>

                {tradeManager?.data.lastJobAt && (
                  <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
                    <BsClock className="w-3 h-3" />
                    Last job: {formatTime(tradeManager.data.lastJobAt)}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          
          <TabsContent value="recent-jobs">
            <Card className="bg-card/90 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Trade Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-14 w-full" />
                    ))}
                  </div>
                ) : tradeManager?.data.recentJobs.length ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead className="text-foreground text-xs">Time</TableHead>
                          <TableHead className="text-foreground text-xs">Symbol</TableHead>
                          <TableHead className="text-foreground text-xs">Exchange</TableHead>
                          <TableHead className="text-foreground text-xs">Timeframe</TableHead>
                          <TableHead className="text-foreground text-xs">Users</TableHead>
                          <TableHead className="text-foreground text-xs">Executed</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tradeManager.data.recentJobs.map((job) => (
                          <TableRow key={job.jobId} className="hover:bg-muted/30 border-border">
                            <TableCell className="text-xs text-muted-foreground">
                              {formatTime(job.enqueuedAt)}
                            </TableCell>
                            <TableCell className="font-medium text-foreground text-sm">
                              {job.symbol}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs border-border/50 text-foreground">
                                {job.exchange}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {job.timeframe}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className={job.eligibleUsers > 0 ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"} >
                                {job.eligibleUsers}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className={job.executedTrades > 0 ? "bg-success/15 text-success" : "bg-error/15 text-error"}>
                                {job.executedTrades}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No recent jobs</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center text-xs text-muted-foreground">
          Last updated: {lastUpdated ? format(lastUpdated, 'PPpp') : 'Never'}
        </div>
      </main>
    </div>
  );
}