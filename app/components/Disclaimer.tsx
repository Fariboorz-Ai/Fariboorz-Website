"use client"
import React from 'react'
import { Card, CardContent } from './ui/Card'
import { Badge } from './ui/Badge'
import Icon from './Icon'
const Disclaimer = () => {
    return (
       <Card className="bg-gradient-to-br from-card/80 to-card/60 dark:from-dark-800/60 dark:to-dark-900/40 backdrop-blur-xl border border-border/50 dark:border-dark-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-50"></div>
            <CardContent className="p-8 relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500/20 to-red-500/10 rounded-xl flex items-center justify-center">
                  <Icon icon="fa-solid:shield-alt" className="text-2xl text-red-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground dark:text-white">Important Risk Disclaimer</h3>
                  <p className="text-muted-foreground dark:text-gray-300">Please read before trading</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon icon="fa-solid:info-circle" className="text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground dark:text-white mb-1">High Risk Activity</h4>
                      <p className="text-sm text-muted-foreground dark:text-gray-300 leading-relaxed">
                        Trading involves substantial risk. Past performance is not indicative of future results.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon icon="fa-regular:lightbulb" className="text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground dark:text-white mb-1">Educational Purpose</h4>
                      <p className="text-sm text-muted-foreground dark:text-gray-300 leading-relaxed">
                        Signals are for informational purposes only. Conduct your own research.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon icon="fa-solid:user-check" className="text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground dark:text-white mb-1">Personal Responsibility</h4>
                      <p className="text-sm text-muted-foreground dark:text-gray-300 leading-relaxed">
                        You are solely responsible for your trading decisions.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon icon="fa-solid:balance-scale" className="text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground dark:text-white mb-1">Regulatory Notice</h4>
                      <p className="text-sm text-muted-foreground dark:text-gray-300 leading-relaxed">
                        Ensure compliance with local regulations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-border/50 dark:border-dark-700/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                      <Icon icon="fa-solid:trophy" className="text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground dark:text-white">Trade Responsibly</div>
                      <div className="text-xs text-muted-foreground dark:text-gray-400">Success comes with careful risk management</div>
                    </div>
                  </div>
                  <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30 px-4 py-2">⚠️ High Risk</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
    )
}

export default Disclaimer
