"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { BsBarChart, BsPieChart, BsArrowUpRight , BsCalendar, BsFilter } from 'react-icons/bs';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select';
import Sidebar from '../../components/Sidebar';
import { AreaChartComponent } from '../../components/charts/AreaChart';
import { BarChartComponent } from '../../components/charts/BarChart';
import { DonutChartComponent } from '../../components/charts/DonutChart';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('pnl');

  const performanceData = [
    { date: 'Mon', value: 1200 },
    { date: 'Tue', value: 1800 },
    { date: 'Wed', value: 1400 },
    { date: 'Thu', value: 2200 },
    { date: 'Fri', value: 1900 },
    { date: 'Sat', value: 1600 },
    { date: 'Sun', value: 2400 },
  ];

  const volumeData = [
    { day: 'Mon', buy: 1500, sell: 1200 },
    { day: 'Tue', buy: 1800, sell: 1400 },
    { day: 'Wed', buy: 1200, sell: 1600 },
    { day: 'Thu', buy: 2200, sell: 1800 },
    { day: 'Fri', buy: 2000, sell: 1600 },
    { day: 'Sat', buy: 1400, sell: 1200 },
    { day: 'Sun', buy: 1800, sell: 1400 },
  ];

  const portfolioData = [
    { name: 'BTC', value: 45 },
    { name: 'ETH', value: 25 },
    { name: 'BNB', value: 15 },
    { name: 'ADA', value: 10 },
    { name: 'Others', value: 5 },
  ];

  const topPerformers = [
    { pair: 'BTC/USDT', pnl: '+$1,247.50', change: '+12.5%', volume: '$45.2K' },
    { pair: 'ETH/USDT', pnl: '+$892.30', change: '+8.7%', volume: '$32.1K' },
    { pair: 'BNB/USDT', pnl: '+$456.80', change: '+5.2%', volume: '$18.9K' },
    { pair: 'ADA/USDT', pnl: '+$234.10', change: '+3.1%', volume: '$12.4K' },
  ];

  const riskMetrics = [
    { metric: 'Sharpe Ratio', value: '2.45', status: 'good' },
    { metric: 'Max Drawdown', value: '-8.2%', status: 'warning' },
    { metric: 'Win Rate', value: '78.5%', status: 'good' },
    { metric: 'Profit Factor', value: '1.85', status: 'good' },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-foreground">
      <Sidebar />

      <main className="flex-1 p-8 space-y-8 max-w-7xl ml-64">
       
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-2">
            Analytics
          </h1>
          <p className="text-muted-foreground">Detailed insights into your trading performance</p>
        </motion.div>

    
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="flex flex-wrap gap-4 items-center"
        >
          <div className="flex items-center gap-2">
            <BsFilter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Time Range:</span>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-background/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card/90 border-border/50">
                <SelectItem value="1d">1 Day</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Metric:</span>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-32 bg-background/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card/90 border-border/50">
                <SelectItem value="pnl">P&L</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
                <SelectItem value="trades">Trades</SelectItem>
                <SelectItem value="winrate">Win Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

  
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total P&L</p>
                  <p className="text-2xl font-bold text-green-500">+$8,247.50</p>
                  <p className="text-xs text-green-500 flex items-center gap-1">
                    <BsArrowUpRight  className="w-3 h-3" />
                    +12.5% this week
                  </p>
                </div>
                <BsBarChart className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Volume</p>
                  <p className="text-2xl font-bold text-foreground">$156.8K</p>
                  <p className="text-xs text-blue-500 flex items-center gap-1">
                    <BsArrowUpRight  className="w-3 h-3" />
                    +8.3% this week
                  </p>
                </div>
                <BsBarChart className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Trades</p>
                  <p className="text-2xl font-bold text-foreground">1,247</p>
                  <p className="text-xs text-yellow-500 flex items-center gap-1">
                    <BsArrowUpRight  className="w-3 h-3" />
                    +15.2% this week
                  </p>
                </div>
                <BsBarChart className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold text-blue-500">78.5%</p>
                  <p className="text-xs text-blue-500 flex items-center gap-1">
                    <BsArrowUpRight  className="w-3 h-3" />
                    +2.1% this week
                  </p>
                </div>
                <BsPieChart className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
                    <BsArrowUpRight  className="w-5 h-5 text-white" />
                  </div>
                  Performance Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <AreaChartComponent data={performanceData} height={320} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

        
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Portfolio Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <DonutChartComponent data={portfolioData} height={320} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Card className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Volume Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <BarChartComponent data={volumeData} height={256} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

   
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Card className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskMetrics.map((metric, index) => (
                    <motion.div
                      key={metric.metric}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                      className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-border/30"
                    >
                      <span className="font-medium text-foreground">{metric.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${
                          metric.status === 'good' ? 'text-green-500' : 
                          metric.status === 'warning' ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {metric.value}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${
                          metric.status === 'good' ? 'bg-green-500' : 
                          metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

    
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Card className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Top Performing Pairs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {topPerformers.map((performer, index) => (
                  <motion.div
                    key={performer.pair}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                    className="p-4 bg-background/30 rounded-lg border border-border/30 hover:border-red-600/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{performer.pair}</span>
                      <span className="text-sm text-green-500">{performer.change}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-green-500">{performer.pnl}</p>
                      <p className="text-xs text-muted-foreground">Volume: {performer.volume}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex justify-end"
        >
          <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-600/90 hover:to-red-700/90 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-red-500/25 transition-all">
            <BsCalendar className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </motion.div>
      </main>
    </div>
  );
} 