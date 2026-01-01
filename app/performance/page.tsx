import React from "react";
import Header from "@/app/header";
import Footer from "@/app/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Badge } from "@/app/components/ui/Badge";
import { Progress } from "@/app/components/ui/Progress";
import singalsModel from "@/app/models/signalsModel";
import StrategyModel from "@/app/models/strategiesModel";
import AssetCard from "./AssetCard";
import Disclaimer from "@/app/components/Disclaimer";
import { getCryptoLogo } from "@/utils/utils";
import { connectDB } from "@/app/db";
import Icon from "@/app/components/Icon";


async function getPerformanceData() {
  await connectDB();

  
  const closedSignals = await singalsModel.find({ status: 'closed' }).lean();

  const totalSignals = closedSignals.length;
  const profitableSignals = closedSignals.filter(s => (s.tpHitCount || 0) > 0).length;
  const overallWinRate = totalSignals > 0 ? Math.round((profitableSignals / totalSignals) * 100) : 0;


  const totalTpHits = closedSignals.reduce((sum, s) => sum + (s.tpHitCount || 0), 0);

 
  const strategyStats = new Map();
  const pairStats = new Map();

  const strategyIds = [...new Set(closedSignals.map(s => s.strategyId))].filter(Boolean);
  const strategies = strategyIds.length ? await StrategyModel.find({ strategy_id: { $in: strategyIds } }).select('strategy_id name').lean() : [];
  const strategyMap = new Map(strategies.map(s => [s.strategy_id, s.name || s.strategy_id]));

  for (const sig of closedSignals) {
    const strategyId = sig.strategyId || 'unknown';
    const symbol = sig.symbol;
    const won = (sig.tpHitCount || 0) > 0 ? 1 : 0;
    const tpHits = sig.tpHitCount || 0;

    if (!strategyStats.has(strategyId)) {
      strategyStats.set(strategyId, { name: strategyMap.get(strategyId) || strategyId, trades: 0, wins: 0, profit: 0 });
    }

    if (!pairStats.has(symbol)) {
      pairStats.set(symbol, { trades: 0, wins: 0, profit: 0 });
    }

    const strat = strategyStats.get(strategyId);
    const pair = pairStats.get(symbol);

    strat.trades++;
    pair.trades++;
    strat.wins += won;
    pair.wins += won;
    strat.profit += tpHits; 
    pair.profit += tpHits;
  }

  const strategiesList = Array.from(strategyStats.values()).map(stat => ({
    ...stat,
    winRate: stat.trades > 0 ? Math.round((stat.wins / stat.trades) * 100) : 0
  })).sort((a, b) => b.winRate - a.winRate);

  const allPairs = await Promise.all(
    Array.from(pairStats.entries()).map(async ([symbol, stats]) => ({
      symbol,
      ...stats,
      winRate: stats.trades > 0 ? Math.round((stats.wins / stats.trades) * 100) : 0,
      logo: await getCryptoLogo(symbol)
    }))
  );

  const topPairs = allPairs.filter(p => p.trades >= 3).sort((a, b) => b.winRate - a.winRate).slice(0, 8);

  const bestSignal = closedSignals.length > 0 ? closedSignals.filter(s => (s.tpHitCount || 0) > 0).sort((a, b) => (b.tpHitCount || 0) - (a.tpHitCount || 0) || (b.confidence || 0) - (a.confidence || 0))[0] : null;

  return {
    overallWinRate ,
    totalTrades: totalSignals,
    profitableTrades: profitableSignals,
    totalProfit: totalTpHits,
    avgProfitPerTrade: totalSignals > 0 ? totalTpHits / totalSignals : 0,
    strategiesList,
    topPairs,
    bestTrade: bestSignal,
  };
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const getWinRateColor = (rate: number) => {
  if (rate >= 80) return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
  if (rate >= 60) return "text-green-400 bg-green-400/10 border-green-400/30";
  if (rate >= 40) return "text-amber-400 bg-amber-400/10 border-amber-400/30";
  return "text-red-400 bg-red-400/10 border-red-400/30";
};

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  badge, 
  progress, 
  subtitle,
  color = "primary",
  children 
}: {
  title: string;
  value: React.ReactNode;
  icon: React.ComponentType<any>;
  badge?: React.ReactNode;
  progress?: number;
  subtitle?: React.ReactNode;
  color?: 'primary' | 'emerald' | 'purple';
  children?: React.ReactNode;
}) => {
  const colors: Record<'primary' | 'emerald' | 'purple', string> = {
    primary: "from-primary/20 to-primary/10 text-primary border-primary/50",
    emerald: "from-emerald-500/20 to-emerald-500/10 text-emerald-400 border-emerald-500/50",
    purple: "from-purple-500/20 to-purple-500/10 text-purple-400 border-purple-500/50"
  };

  return (
    <Card className={`group bg-gradient-to-br from-card/80 to-card/60 dark:from-dark-800/60 dark:to-dark-900/40 backdrop-blur-sm border border-border/50 dark:border-dark-700/50 hover:border-${color}/50 hover:shadow-2xl hover:shadow-${color}/10 transition-all duration-300`}>
      <CardContent className="p-6 relative">
        <div className={`absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-${color}/20 to-${color}/5 rounded-full blur-xl`}></div>
        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 bg-gradient-to-br ${colors[color]} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <Icon className="text-2xl" />
          </div>
          {badge}
        </div>
        <div className={`text-4xl font-bold mb-2 ${color === 'primary' ? 'bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent' : `text-${color}-400`}`}>
          {value}
        </div>
        <div className="text-sm text-muted-foreground dark:text-gray-400 mb-3">{title}</div>
        {progress && <Progress value={progress} className={`h-2 [&>div]:bg-gradient-to-r [&>div]:from-${color} [&>div]:to-${color === 'primary' ? 'orange-400' : color + '-500'}`} />}
        {subtitle && <div className="mt-3 text-xs text-muted-foreground dark:text-gray-500">{subtitle}</div>}
        {children}
      </CardContent>
    </Card>
  );
};

export default async function PerformancePage() {
  const data = await getPerformanceData();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-base-200 to-background dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 text-foreground">
      <Header />
      
      <main className="flex-1 py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 relative">
            <div className="relative">
              <Badge className="mb-6 px-6 py-3 bg-gradient-to-r from-primary to-orange-500 text-white border-0 animate-pulse font-semibold text-base">
                <Icon icon="fa-solid:fire" className="mr-2 animate-pulse" /> LIVE PERFORMANCE
              </Badge>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-orange-400 to-amber-400 bg-clip-text text-transparent font-poppins">
                AI Trading <span className="block mt-2">Performance</span>
              </h1>

              <p className="text-xl text-muted-foreground dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                Transparent, real-time results from our advanced AI trading algorithms.
              </p>

              <div className="grid grid-cols-1 mr-6  md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12">
                <StatCard
                  title="Overall Win Rate"
                  value={`${data.overallWinRate}%`}
                  icon={(props: any) => <Icon icon="fa-solid:percentage" {...props} />}
                  badge={
                    <Badge className={`${getWinRateColor(data.overallWinRate)} border`}>
                      {data.overallWinRate >= 70 ? '🔥 Excellent' : data.overallWinRate >= 50 ? '👍 Good' : '📊 Improving'}
                    </Badge>
                  }
                  progress={data.overallWinRate}
                  subtitle={`${data.profitableTrades}W / ${data.totalTrades - data.profitableTrades}L`}
                  color="primary"
                />

                <StatCard
                  title="Total Closed Signals"
                  value={data.totalTrades}
                  icon={(props: any) => <Icon icon="fa-solid:chart-line" {...props} />}
                  badge={<Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Closed</Badge>}
                  color="emerald"
                >
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="text-xs text-muted-foreground dark:text-gray-400">{data.profitableTrades} Wins</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-xs text-muted-foreground dark:text-gray-400">{data.totalTrades - data.profitableTrades} Losses</span>
                    </div>
                  </div>
                </StatCard>

                <StatCard
                  title="Top Signal"
                  value={data.bestTrade ? `${data.bestTrade.tpHitCount || 0} TP` : "No signals"}
                  icon={(props: any) => <Icon icon="fa-solid:trophy" {...props} />}
                  badge={<Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30"><Icon icon="fa-solid:medal" className="mr-1" /> Top</Badge>}
                  subtitle={data.bestTrade ? data.bestTrade.symbol : "Start trading to see results"}
                  color="purple"
                />
              </div>
            </div>
          </div>

          <section className="mb-16">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                    <Icon icon="tabler:chart-infographic" className="text-xl text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground dark:text-white">Strategy Performance</h2>
                </div>
                <p className="text-muted-foreground dark:text-gray-300">Detailed breakdown of win rates</p>
              </div>
              <Badge variant="outline" className="border-primary/30 text-primary">
                {data.strategiesList.length} Strategies
              </Badge>
            </div>
               <div className="divider" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.strategiesList.length === 0 ? (
                <Card className="col-span-full bg-gradient-to-br from-card/50 to-card/30 dark:from-dark-800/40 dark:to-dark-900/20 backdrop-blur-sm border border-border/30 dark:border-dark-700/30">
                  <CardContent className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon icon="tabler:chart-infographic" className="text-3xl text-primary/40" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">No strategy data yet</h3>
                    <p className="text-muted-foreground dark:text-gray-400">Strategy performance data will appear after trades</p>
                  </CardContent>
                </Card>
              ) : (
                data.strategiesList.map((strat, index) => (
                  <Card key={strat.name} className="group bg-gradient-to-br from-card/60 to-card/40 dark:from-dark-800/50 dark:to-dark-900/30 backdrop-blur-sm border border-border/40 dark:border-dark-700/40 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold text-foreground dark:text-white flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            index === 0 ? 'bg-gradient-to-br from-amber-500/20 to-amber-500/10' :
                            index === 1 ? 'bg-gradient-to-br from-gray-400/20 to-gray-400/10' :
                            index === 2 ? 'bg-gradient-to-br from-amber-700/20 to-amber-700/10' :
                            'bg-gradient-to-br from-primary/20 to-primary/10'
                          }`}>
                            {index === 0 ? <Icon icon="fa-solid:crown" className="text-amber-400" /> :
                             index === 1 ? <Icon icon="fa-solid:medal" className="text-gray-400" /> :
                             index === 2 ? <Icon icon="fa-solid:medal" className="text-amber-600" /> :
                             <Icon icon="tabler:chart-infographic" className="text-primary" />
                            }
                          </div>
                          <span className="truncate">{strat.name}</span>
                        </CardTitle>
                        <Badge className={`${getWinRateColor(strat.winRate)} border px-3 py-1`}>{strat.winRate}%</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground dark:text-gray-400">Signals</div>
                          <div className="font-bold text-foreground dark:text-white">{strat.trades}</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground dark:text-gray-400">TP Hits</div>
                          <div className={`font-bold ${strat.profit > 0 ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                            {strat.profit}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground dark:text-gray-400">Win Rate</span>
                            <span className="font-semibold">{strat.winRate}%</span>
                          </div>
                          <Progress value={strat.winRate} className={`h-2 ${
                            strat.winRate >= 80 ? '[&>div]:bg-gradient-to-r [&>div]:from-emerald-400 [&>div]:to-emerald-500' :
                            strat.winRate >= 60 ? '[&>div]:bg-gradient-to-r [&>div]:from-green-400 [&>div]:to-green-500' :
                            strat.winRate >= 40 ? '[&>div]:bg-gradient-to-r [&>div]:from-amber-400 [&>div]:to-amber-500' :
                            '[&>div]:bg-gradient-to-r [&>div]:from-red-400 [&>div]:to-red-500'
                          }`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>

          <section className="mb-16">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 rounded-xl flex items-center justify-center">
                    <Icon icon="mdi:trending-up" className="text-xl text-emerald-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground dark:text-white">Top Performing Assets</h2>
                </div>
                <p className="text-muted-foreground dark:text-gray-300">Highest win rate trading pairs</p>
              </div>
               
            </div>
             <div className="divider" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data.topPairs.length === 0 ? (
                <Card className="col-span-full bg-gradient-to-br from-card/50 to-card/30 dark:from-dark-800/40 dark:to-dark-900/20 backdrop-blur-sm border border-border/30 dark:border-dark-700/30">
                  <CardContent className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon icon="fa-solid:coins" className="text-3xl text-emerald-500/40" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">No pair data available</h3>
                    <p className="text-muted-foreground dark:text-gray-400">Pair performance data will appear after sufficient trades</p>
                  </CardContent>
                </Card>
              ) : (
                data.topPairs.map((pair, index) => <AssetCard key={pair.symbol} pair={pair} index={index} />)
              )}
            </div>
          </section>
  <div className="divider" />
           <Disclaimer />   
        </div>
      </main>

      <Footer />
    </div>
  );
}

export const metadata = {
    title: 'Live Trading Performance & Win Rate Statistics',
    description: 'Transparent real-time trading results from our AI bot: overall win rate, total closed trades, performance by strategy, and top performing pairs.',
};
