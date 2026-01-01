"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Icon from '@/app/components/Icon';
import api from '@/utils/api'
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Badge } from '@/app/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/Tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/Table';
import { Skeleton } from '@/app/components/ui/Skeleton';
import Sidebar from '@/app/components/Sidebar';
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';

interface Signal {
  _id: string;
  signalId: string;
  strategyId: string;
  exchange: string;
  symbol: string;
  signal: 'buy' | 'sell';
  status: 'pending' | 'closed';
  createdAt: string;
}

interface StatusData {
  timeframes: string[];
  recentSignals: Signal[];
  engineStatus: any;
  websocketStatus: any;
  systemInfo: any;
}

interface WsStatus {
  isInitialized: boolean;
  totalConnections: number;
  totalDataReceived: number;
  connections: any[];
  timestamp: string;
}

interface PrivateWsStatus {
  status: string;
  data: {
    totalConnections: number;
    activeConnections: number;
    byExchange: { bitunix: number; bingx: number };
    connections: any[];
  };
  timestamp: string;
}

export default function StatusPage() {
  const { data: session } = useSession();
  const [status, setStatus] = useState<StatusData | null>(null);
  const [wsStatus, setWsStatus] = useState<WsStatus | null>(null);
  const [privateWsStatus, setPrivateWsStatus] = useState<PrivateWsStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);


  if (!session || !session.user || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }
  const fetchAll = async () => {
    setLoading(true);
    try {
 
      const [statusRes, wsRes, privateWsRes] = await Promise.all([
        api.get('/status'),
        api.get('/websocket/status'),
        api.get('/private-ws/status')
      ]);

      setStatus(statusRes.data);
      setWsStatus(wsRes.data);
      setPrivateWsStatus(privateWsRes.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch status', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
  };

  const getSignalBadge = (signal: string, status: string) => {
    if (status === 'pending') {
      return <Badge className="bg-warning/20 text-warning text-xs">Pending</Badge>;
    }
    if (signal === 'buy') {
      return <Badge className="bg-success/20 text-success text-xs flex items-center gap-1">
        <Icon icon="fa-solid:arrow-up-right" className="w-3 h-3" /> Buy
      </Badge>;
    }
    return <Badge className="bg-error/20 text-error text-xs flex items-center gap-1">
      <Icon icon="fa-solid:arrow-down-right" className="w-3 h-3" /> Sell
    </Badge>;
  };

  const getConnectionStatus = (conn: any) => {
    return conn.status.isConnected ? 
      <Badge className="bg-success/20 text-success text-xs"><Icon icon="fa-solid:wifi" className="w-3 h-3 mr-1" />Connected</Badge> :
      <Badge className="bg-error/20 text-error text-xs"><Icon icon="fa-solid:wifi-slash" className="w-3 h-3 mr-1" />Disconnected</Badge>;
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-full ml-64 overflow-x-hidden">
    
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Live Trading Status
          </h1>
          <p className="text-muted-foreground mt-1">Real-time signals, connections, and system performance</p>
        </motion.div>

     
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Icon icon="fa-solid:chart-line" className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Auto-refresh: 10s</span>
          </div>
          <Button onClick={fetchAll} size="sm" className="ml-auto">
            <Icon icon="fa-solid:calendar" className="w-4 h-4 mr-2" /> Refresh Now
          </Button>
        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Recent Signals", value: status?.recentSignals.length || 0, icon: 'fa-solid:chart-line', color: "text-info" },
            { label: "Active Connections", value: wsStatus?.totalConnections || 0, icon: 'fa-solid:wifi', color: "text-success" },
            { label: "Private WS", value: privateWsStatus?.data.activeConnections || 0, icon: 'fa-solid:plug', color: "text-accent" },
            { label: "Uptime", value: status?.systemInfo.uptime ? formatUptime(status.systemInfo.uptime) : 'N/A', icon: 'fa-solid:clock', color: "text-primary" },
          ].map((item: { label: string; value: string | number; icon: string; color: string }, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="bg-card/80 backdrop-blur border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                    </div>
                    <Icon icon={item.icon} className={`w-8 h-8 ${item.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

       
        <Tabs defaultValue="signals" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex bg-card border border-border">
            <TabsTrigger value="signals" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground">Signals</TabsTrigger>
            <TabsTrigger value="websockets" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground">WebSockets</TabsTrigger>
            <TabsTrigger value="engine" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground">Engine</TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground">System</TabsTrigger>
          </TabsList>

      
          <TabsContent value="signals">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-foreground">
                    <span className="flex items-center gap-2">
                    <Icon icon="fa-solid:chart-line" className="w-5 h-5 text-primary" /> Recent Signals
                  </span>
                  <Badge variant="outline" className="text-xs border-border text-foreground">
                    {status?.timeframes.join(', ')} timeframes
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : status?.recentSignals.length ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border hover:bg-card">
                          <TableHead className="text-foreground">Time</TableHead>
                          <TableHead className="text-foreground">Symbol</TableHead>
                          <TableHead className="text-foreground">Exchange</TableHead>
                          <TableHead className="text-foreground">Signal</TableHead>
                          <TableHead className="text-foreground">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {status.recentSignals.map((sig) => (
                          <TableRow key={sig._id} className="hover:bg-muted/50 border-border">
                            <TableCell className="text-xs text-muted-foreground">
                              {format(new Date(sig.createdAt), 'HH:mm:ss')}
                            </TableCell>
                            <TableCell className="font-medium text-foreground">{sig.symbol}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs border-border text-foreground">
                                {sig.exchange}
                              </Badge>
                            </TableCell>
                            <TableCell>{getSignalBadge(sig.signal, sig.status)}</TableCell>
                            <TableCell>
                              <Badge className={sig.status === 'pending' ? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground' } >
                                {sig.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No recent signals</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          
          <TabsContent value="websockets">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             
              <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                    <Icon icon="fa-solid:wifi" className="w-5 h-5 text-success" /> Public WebSockets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-foreground">
                      <span className="text-sm">Total Connections</span>
                      <Badge className="bg-success/20 text-success">{wsStatus?.totalConnections || 0}</Badge>
                    </div>
                    <div className="flex justify-between text-foreground">
                      <span className="text-sm">Data Received</span>
                      <span className="font-medium">{wsStatus?.totalDataReceived?.toLocaleString() || 0}</span>
                    </div>
                    {wsStatus?.connections.slice(0, 3).map((conn, i) => (
                      <div key={i} className="text-xs p-2 bg-muted/30 rounded border border-border/50">
                        <div className="flex justify-between text-foreground">
                          <span className="font-medium">{conn.exchange}</span>
                          {getConnectionStatus(conn)}
                        </div>
                        <div className="text-muted-foreground mt-1">
                          {conn.pairs.slice(0, 3).join(', ')}{conn.pairs.length > 3 && ` +${conn.pairs.length - 3}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

          
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Icon icon="fa-solid:plug" className="w-5 h-5 text-accent" /> Private WebSockets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-foreground">
                      <span className="text-sm">Active</span>
                      <Badge className={privateWsStatus?.data.activeConnections ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}>
                        {privateWsStatus?.data.activeConnections || 0}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-foreground">
                      <div className="p-2 bg-muted/30 rounded text-center border border-border/50">
                        <p className="font-medium">Bitunix</p>
                        <p>{privateWsStatus?.data.byExchange.bitunix || 0}</p>
                      </div>
                      <div className="p-2 bg-muted/30 rounded text-center border border-border/50">
                        <p className="font-medium">BingX</p>
                        <p>{privateWsStatus?.data.byExchange.bingx || 0}</p>
                      </div>
                    </div>
                    {privateWsStatus?.data.connections.length ? (
                      <p className="text-xs text-muted-foreground">Active private connections found</p>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No active private connections</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

       
          <TabsContent value="engine">
            <Card className="bg-card border-border">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                  <Icon icon="fa-solid:server" className="w-5 h-5 text-primary" /> Strategy Engine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Analyses", value: status?.engineStatus.counters.analyses || 0 },
                    { label: "Buy Signals", value: status?.engineStatus.counters.signals.buy || 0 },
                    { label: "Sell Signals", value: status?.engineStatus.counters.signals.sell || 0 },
                    { label: "Hold", value: status?.engineStatus.counters.signals.hold || 0 },
                  ].map((item, i) => (
                    <div key={i} className="text-center p-4 bg-muted/50 rounded-lg border border-border">
                      <p className="text-2xl font-bold text-primary">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Rate Limit Skips</span>
                    <Badge variant="destructive">{status?.engineStatus.counters.skips.rateLimit || 0}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Cooldown Skips</span>
                    <Badge variant="secondary">{status?.engineStatus.counters.skips.cooldown || 0}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          
          <TabsContent value="system">
            <Card className="bg-card border-border">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Icon icon="fa-solid:microchip" className="w-5 h-5 text-primary" /> System Information
                  </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-foreground">
                  <div>
                    <p className="text-muted-foreground">Node.js</p>
                    <p className="font-medium">{status?.systemInfo.nodeVersion || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Platform</p>
                    <p className="font-medium">{status?.systemInfo.platform || 'N/A'} ({status?.systemInfo.arch})</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Process ID</p>
                    <p className="font-medium">#{status?.systemInfo.pid || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Memory (Heap)</p>
                    <p className="font-medium">
                      {(status?.systemInfo.memory.heapUsed / 1024 / 1024).toFixed(1)} MB / {(status?.systemInfo.memory.heapTotal / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>
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