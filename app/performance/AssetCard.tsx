"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/app/components/ui/Card";
import { Badge } from "@/app/components/ui/Badge";
import { Progress } from "@/app/components/ui/Progress";
import Image from "next/image";
import Icon from "@/app/components/Icon";

interface AssetCardProps {
  pair: {
    symbol: string;
    logo: string | null;
    trades: number;
    wins: number;
    winRate: number;
    profit: number;
  };
  index: number;
}

export default function AssetCard({ pair, index }: AssetCardProps) {
  const [imgError, setImgError] = useState(false);

  const getWinRateColor = (rate: number) => {
    if (rate >= 80) return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
    if (rate >= 60) return "text-green-400 bg-green-400/10 border-green-400/30";
    if (rate >= 40) return "text-amber-400 bg-amber-400/10 border-amber-400/30";
    return "text-red-400 bg-red-400/10 border-red-400/30";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Card className="group bg-gradient-to-br from-card/60 to-card/40 dark:from-dark-800/50 dark:to-dark-900/30 backdrop-blur-sm border border-border/40 dark:border-dark-700/40 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {pair.logo && !imgError ? (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 border border-emerald-500/20 p-2">
                <Image 
                  src={pair.logo} 
                  alt={pair.symbol}
                  width={20}
                  height={20}
                  className="w-full h-full rounded-lg"
                  onError={() => setImgError(true)}
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Icon icon="fa-solid:coins" className="text-2xl text-emerald-400" />
              </div>
            )}
            <div>
              <div className="text-xl font-bold text-foreground dark:text-white">{pair.symbol}</div>
              <div className="text-xs text-muted-foreground dark:text-gray-400">{pair.trades} trades</div>
            </div>
          </div>
          {index < 3 && (
            <Badge className={`${
              index === 0 ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white' :
              index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white' :
              'bg-gradient-to-r from-amber-700 to-amber-800 text-white'
            } border-0`}>
              #{index + 1}
            </Badge>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground dark:text-gray-400">Win Rate</span>
            <Badge className={`${getWinRateColor(pair.winRate)} border px-3 py-1`}>
              {pair.winRate}%
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground dark:text-gray-400">Profit</span>
            <span className={`font-bold ${pair.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatCurrency(pair.profit)}
            </span>
          </div>
          
          <Progress 
            value={pair.winRate} 
            className={`h-2 ${
              pair.winRate >= 80 ? '[&>div]:bg-gradient-to-r [&>div]:from-emerald-400 [&>div]:to-emerald-500' :
              pair.winRate >= 60 ? '[&>div]:bg-gradient-to-r [&>div]:from-green-400 [&>div]:to-green-500' :
              pair.winRate >= 40 ? '[&>div]:bg-gradient-to-r [&>div]:from-amber-400 [&>div]:to-amber-500' :
              '[&>div]:bg-gradient-to-r [&>div]:from-red-400 [&>div]:to-red-500'
            }`}
          />
          
          <div className="flex items-center justify-between text-xs text-muted-foreground dark:text-gray-500">
            <span>{pair.wins} Wins</span>
            <span>{pair.trades - pair.wins} Losses</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}