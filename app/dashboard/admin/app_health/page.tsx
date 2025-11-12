"use client";
import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  BsBarChartFill, BsPieChartFill, BsArrowUpRight, BsCalendar, BsFilter,
  BsServer, BsPlug, BsMemory, BsCpu, BsActivity, BsExclamationTriangle,
  BsCheckCircle, BsXCircle, BsClock, BsDatabase, BsWifi, BsWifiOff
} from 'react-icons/bs';
import api from '../../../../utils/api'
import {
  Card, CardContent, CardHeader, CardTitle
} from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { Progress } from '../../../components/ui/Progress';
import { Skeleton } from '../../../components/ui/Skeleton';
import Sidebar from '../../../components/Sidebar';
import dotenv from 'dotenv';

dotenv.config();
interface HealthStatus {
  status: string;
  timestamp: string;
  strategies: { count: number; names: string[] };
  signals: { pending: number; total: number };
  engine: any;
  websocket: any;
  tradeManager: any;
  uptime: number;
  memory: any;
  version: string;
}

interface DetailedHealth {
  timestamp: string;
  overall: string;
  checks: any;
  responseTime: number;
}

interface Performance {
  engine: any;
  websocket: any;
  memory: any;
  cpu: any;
  uptime: string;
}

export default function AppHealthPage() {
  const [timeRange, setTimeRange] = useState('live');
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [detailedHealth, setDetailedHealth] = useState<DetailedHealth | null>(null);
  const [performance, setPerformance] = useState<Performance | null>(null);
  const [loading, setLoading] = useState({ health: false, detailed: false, performance: false });
  const [errors, setErrors] = useState<{ health: string | null; detailed: string | null; performance: string | null }>({ health: null, detailed: null, performance: null });

  const fetchAll = async () => {
    setLoading({ health: true, detailed: true, performance: true });
    setErrors({ health: null, detailed: null, performance: null });

    try {
      const [hRes, dRes, pRes] = await Promise.all([
        api.get('/health').catch(() => null),
        api.get('/health/detailed').catch(() => null),
        api.get('/performance').catch(() => null)
      ]);
     
      if (hRes?.data) setHealthStatus(hRes.data);
      else setErrors(prev => ({ ...prev, health: 'Failed to load /health' }));

      if (dRes?.data) setDetailedHealth(dRes.data);
      else setErrors(prev => ({ ...prev, detailed: 'Failed to load /health/detailed' }));

      if (pRes?.data) setPerformance(pRes.data);
      else setErrors(prev => ({ ...prev, performance: 'Failed to load /performance' }));

    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading({ health: false, detailed: false, performance: false });
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

  const formatBytes = (bytes: number) => {
    if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
    if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${bytes} B`;
  };

  const getStatusColor = (status: string) => {
    return status === 'healthy' || status === 'ok' ? 'text-success' :
           status === 'warning' ? 'text-warning' : 'text-error';
  };

  const getConnectionStatus = (conn: any) => {
    return conn.status.isConnected ? 
      <Badge className="bg-success/20 text-success"><BsWifi className="w-3 h-3 mr-1" />Connected</Badge> :
      <Badge className="bg-error/20 text-error"><BsWifiOff className="w-3 h-3 mr-1" />Disconnected</Badge>;
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-full ml-64 overflow-x-hidden">
       
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            System Health & Performance
          </h1>
          <p className="text-muted-foreground mt-1">Real-time monitoring of engine, websockets, and system resources</p>
        </motion.div>

      
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <BsActivity className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Auto-refresh: 10s</span>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchAll} size="sm" className="ml-auto">
            <BsCalendar className="w-4 h-4 mr-2" /> Refresh Now
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Overall", value: detailedHealth?.overall || healthStatus?.status || 'unknown', icon: BsCheckCircle },
            { label: "Uptime", value: performance?.uptime || formatUptime(healthStatus?.uptime || 0), icon: BsClock },
            { label: "Memory", value: performance?.memory?.heapUsed || 'N/A', icon: BsMemory },
            { label: "CPU", value: performance?.cpu?.user || 'N/A', icon: BsCpu },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="bg-card/80 backdrop-blur border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className={`text-xl font-bold ${getStatusColor(item.value)}`}>
                        {item.value}
                      </p>
                    </div>
                    <item.icon className="w-8 h-8 text-primary/70" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

      
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex bg-card border border-border">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground">Overview</TabsTrigger>
            <TabsTrigger value="websockets" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground">WebSockets</TabsTrigger>
            <TabsTrigger value="engine" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground">Engine</TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground">Resources</TabsTrigger>
          </TabsList>

        
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <BsServer className="w-5 h-5 text-primary" /> Strategies & Signals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-foreground">
                    <span>Active Strategies</span>
                    <Badge className="bg-primary/20 text-primary">{healthStatus?.strategies.count || 0}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {healthStatus?.strategies.names.join(', ') || 'None'}
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Pending Signals</span>
                    <Badge variant={healthStatus?.signals.pending ? 'destructive' : 'default'}>
                      {healthStatus?.signals.pending || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Total Signals</span>
                    <Badge className="bg-primary/20 text-primary">{healthStatus?.signals.total || 0}</Badge>
                  </div>
                </CardContent>
              </Card>

              
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <BsCheckCircle className="w-5 h-5 text-primary" /> Health Checks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {detailedHealth ? (
                    <div className="space-y-3">
                      {Object.entries(detailedHealth.checks).map(([key, check]: [string, any]) => (
                        <div key={key} className="flex items-center justify-between text-foreground">
                          <span className="capitalize text-sm">{key}</span>
                          <Badge className={check.status === 'healthy' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}>
                            {check.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Skeleton className="h-32 w-full" />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        
          <TabsContent value="websockets">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">WebSocket Connections</CardTitle>
              </CardHeader>
              <CardContent>
                {performance?.websocket?.connections ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-card">
                        <TableHead className="text-foreground">Exchange</TableHead>
                        <TableHead className="text-foreground">Pairs</TableHead>
                        <TableHead className="text-foreground">Status</TableHead>
                        <TableHead className="text-foreground">Uptime</TableHead>
                        <TableHead className="text-foreground">Data Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {performance.websocket.connections.map((conn: any, i: number) => (
                        <TableRow key={i} className="border-border hover:bg-muted text-foreground">
                          <TableCell className="font-medium text-foreground">{conn.exchange}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {conn.pairs.slice(0, 3).join(', ')}{conn.pairs.length > 3 && ` +${conn.pairs.length - 3}`}
                          </TableCell>
                          <TableCell>{getConnectionStatus(conn)}</TableCell>
                          <TableCell className="text-foreground">{formatUptime(conn.uptime)}</TableCell>
                          <TableCell className="text-foreground">{conn.dataCount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">No connection data</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        
          <TabsContent value="engine">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Strategy Engine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['analyses', 'buy', 'sell', 'hold'].map((key) => {
                    const value = performance?.engine?.counters?.signals?.[key] ?? 
                                 detailedHealth?.checks?.strategyEngine?.details?.counters?.signals?.[key] ?? 0;
                    return (
                      <div key={key} className="text-center p-3 bg-muted/50 rounded-lg border border-border hover:border-primary transition-colors">
                        <p className="text-2xl font-bold text-primary">{value}</p>
                        <p className="text-xs text-muted-foreground capitalize">{key}</p>
                      </div>
                    );
                  })}
                </div>
                <div>
                  <p className="text-sm font-medium mb-2 text-foreground">Skip Reasons</p>
                  <Progress value={65} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Rate Limit: 655</span>
                    <span>Cooldown: 34</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

     
          <TabsContent value="resources">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Memory Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(performance?.memory || {}).map(([k, v]) => (
                      <div key={k}>
                        <div className="flex justify-between text-sm text-foreground">
                          <span className="capitalize">{k}</span>
                          <span className="font-medium text-primary">{String(v)}</span>
                        </div>
                        <Progress value={k === 'heapUsed' ? 67 : k === 'heapTotal' ? 100 : 0} className="h-2 mt-1" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">System Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-foreground">
                    <div className="flex justify-between">
                      <span>Version</span>
                      <Badge className="bg-primary/20 text-primary">{healthStatus?.version || 'N/A'}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Node.js</span>
                      <Badge variant="outline" className="border-border text-foreground">v25.1.0</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform</span>
                      <Badge variant="outline" className="border-border text-foreground">macOS</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

      
        <div className="text-center text-xs text-muted-foreground">
          Last updated: {healthStatus?.timestamp ? format(new Date(healthStatus.timestamp), 'PPpp') : 'Never'}
        </div>
      </main>
    </div>
  );
}