"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Label } from '@/app/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/app/components/ui/Select';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/app/components/ui/Card';
import { Switch } from '@/app/components/ui/Switch';
import Icon from '@/app/components/Icon';
import Sidebar from '@/app/components/Sidebar';
import { loadUserSettings, saveUserSettings } from './actions';

interface UserSettings {

  exchangeName: string;
  apiKey: string;
  apiSecret: string;


  strategyId: string;
  leverage: number;
  marginType: 'cross' | 'isolated';
  margin: number;
  tradeLimit: number;
  tradingActive: boolean;

  telegramToken: string;
  telegramChatId: string;
  telegramActive: boolean;

  timezone: string;
  language: 'fa' | 'en';
  notificationsActive: boolean;


  strategies: Array<{
    id: string;
    name: string;
    strategy_id: string;
  }>;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [showBotToken, setShowBotToken] = useState(false);
  const [state, setState] = useState({ message: '', success: false });
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const result = await loadUserSettings();

        if (result.success && result.data) {
          setSettings({
            ...result.data,
            strategies: result.data.strategies || [], 
          });
        } else {
          console.error('Failed to load settings:', result.error);
       
          setSettings({
            exchangeName: '',
            apiKey: '',
            apiSecret: '',
            strategyId: '',
            leverage: 10,
            marginType: 'isolated',
            margin: 0,
            tradeLimit: 5,
            tradingActive: true,
            telegramToken: '',
            telegramChatId: '',
            telegramActive: false,
            timezone: 'Asia/Tehran',
            language: 'fa',
            notificationsActive: true,
            strategies: [], 
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
     
        setSettings({
          exchangeName: '',
          apiKey: '',
          apiSecret: '',
          strategyId: '',
          leverage: 10,
          marginType: 'isolated',
          margin: 0,
          tradeLimit: 5,
          tradingActive: true,
          telegramToken: '',
          telegramChatId: '',
          telegramActive: false,
          timezone: 'Asia/Tehran',
          language: 'fa',
          notificationsActive: true,
          strategies: [], 
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);



  const exchanges = [
    { id: 'bitunix', name: 'Bitunix', status: 'Available' },
    { id: 'bingx', name: 'BingX', status: 'Available' },
  ];

  const timezones = [
    { value: 'Asia/Tehran', label: 'Tehran (UTC+3:30)' },
    { value: 'UTC', label: 'UTC (UTC+0)' },
    { value: 'America/New_York', label: 'New York (UTC-5)' },
    { value: 'Europe/London', label: 'London (UTC+0)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (UTC+9)' },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10 flex items-center justify-center">
          <div className="text-center">
            <Icon icon="mdi:alert-circle" className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Failed to load settings</p>
          </div>
        </main>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setState({ message: '', success: false });
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const result = await saveUserSettings(formData);
      setState(result);
      
     
      setTimeout(() => {
        setState({ message: '', success: false });
      }, 3000);
    } catch (error) {
      setState({ message: 'An error occurred while saving settings', success: false });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-8   ml-64 min-h-screen bg-background text-foreground font-sans">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10 space-y-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-1">
            Account Settings
          </h1>
          <p className="text-muted-foreground text-base">Manage your account and trading configuration</p>
        </motion.div>

 
        {state.message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border ${
              state.success 
                ? 'bg-success/10 border-success/20 text-success' 
                : 'bg-primary/10 border-primary/20 text-primary'
            }`}
          >
            {state.message}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-8 mb-8"
          >
            <Card className="bg-card/80 border border-border/50 rounded-2xl shadow-xl">
              <CardHeader className="border-b border-border/30">
                <CardTitle className="text-lg md:text-xl font-bold flex items-center gap-3 text-foreground">
                  <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                    <Icon icon="mdi:exchange" className="w-5 h-5 text-white" />
                  </div>
                  Exchange Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Select Exchange
                  </Label>
                  <Select name="exchangeName" defaultValue={settings.exchangeName}>
                    <SelectTrigger className="bg-background/60 border-border focus:border-primary focus:ring-primary/20 text-foreground">
                      <SelectValue placeholder="Choose your exchange" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {exchanges.map(ex => (
                        <SelectItem 
                          key={ex.id} 
                          value={ex.id}
                          className="flex items-center justify-between text-foreground hover:bg-primary/10"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{ex.name}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              ex.status === 'Connected' 
                                ? 'bg-success/20 text-success' 
                                : 'bg-primary/20 text-primary'
                            }`}>
                              {ex.status}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      API Key
                    </Label>
                    <div className="relative">
                      <Input
                        name="apiKey"
                        type={showApiKey ? "text" : "password"}
                        defaultValue={settings.apiKey}
                        className="pr-10 bg-background/60 border-border focus:border-primary focus:ring-primary/20 text-foreground"
                        placeholder="Enter your API key"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showApiKey ? <Icon icon="mdi:eye-off" className="w-4 h-4" /> : <Icon icon="mdi:eye" className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      API Secret
                    </Label>
                    <div className="relative">
                      <Input
                        name="apiSecret"
                        type={showApiSecret ? "text" : "password"}
                        defaultValue={settings.apiSecret}
                        className="pr-10 bg-background/60 border-border focus:border-primary focus:ring-primary/20 text-foreground"
                        placeholder="Enter your API secret"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiSecret(!showApiSecret)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showApiSecret ? <Icon icon="mdi:eye-off" className="w-4 h-4" /> : <Icon icon="mdi:eye" className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-8 mb-8"
          >
            <Card className="bg-card/80 border border-border/50 rounded-2xl shadow-xl">
              <CardHeader className="border-b border-border/30">
                <CardTitle className="text-lg md:text-xl font-bold flex items-center gap-3 text-foreground">
                  <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                    <Icon icon="mdi:cog" className="w-5 h-5 text-white" />
                  </div>
                  Trading Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Leverage
                  </Label>
                  <Select name="leverage" defaultValue={settings.leverage.toString()}>
                    <SelectTrigger className="bg-background/60 border-border focus:border-primary focus:ring-primary/20 text-foreground">
                      <SelectValue placeholder="Select leverage" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {[1, 5, 10, 20, 50, 100].map(val => (
                        <SelectItem 
                          key={val} 
                          value={val.toString()}
                          className="flex items-center justify-between text-foreground hover:bg-primary/10"
                        >
                          <span className="font-medium">{val}x</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            val > 10 ? 'bg-primary/20 text-primary' : 'bg-warning/20 text-warning'
                          }`}>
                            {val > 10 ? 'High Risk' : 'Moderate Risk'}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                    Trading Strategy
                  </Label>
                  <Select
                    name="strategyId"
                    defaultValue={
                      settings.strategies && settings.strategies.length > 0
                        ? settings.strategyId
                        : undefined
                    }
                    disabled={!(settings.strategies && settings.strategies.length > 0)}
                  >
                      <SelectTrigger className="bg-background/60 border-border focus:border-primary focus:ring-primary/20 text-foreground">
                      <SelectValue
                        placeholder={
                          settings.strategies && settings.strategies.length === 0
                            ? "now we dont have active strategy"
                            : "Select strategy"
                        }
                      />
                    </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                      {settings.strategies && settings.strategies.length > 0 ? (
                        settings.strategies.map(strat => (
                          <SelectItem 
                            key={strat.id} 
                            value={strat.id}
                              className="flex items-center justify-between text-foreground hover:bg-primary/10"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{strat.name}</span>
                                <span className="text-xs text-muted-foreground">ID: {strat.strategy_id}</span>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                          <div className="px-3 py-2 text-muted-foreground text-sm select-none">
                          now we dont have active strategy
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                    Margin Type
                  </Label>
                  <Select name="marginType" defaultValue={settings.marginType}>
                      <SelectTrigger className="bg-background/60 border-border focus:border-primary focus:ring-primary/20 text-foreground">
                      <SelectValue placeholder="Select margin type" />
                    </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="cross" className="text-foreground hover:bg-primary/10">
                        <span className="font-medium">Cross Margin</span>
                      </SelectItem>
                        <SelectItem value="isolated" className="text-foreground hover:bg-primary/10">
                        <span className="font-medium">Isolated Margin</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                    Margin Amount (USDT)
                  </Label>
                  <Input
                    name="margin"
                    type="number"
                    min="0"
                    defaultValue={settings.margin}
                      className="bg-background/60 border-border focus:border-primary focus:ring-primary/20 text-foreground"
                    placeholder="e.g. 100"
                  />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                    Daily Trade Limit
                  </Label>
                  <Input
                    name="tradeLimit"
                    type="number"
                    min="0"
                    defaultValue={settings.tradeLimit}
                      className="bg-background/60 border-border focus:border-primary focus:ring-primary/20 text-foreground"
                    placeholder="e.g. 10 (0 = unlimited)"
                  />
                    <span className="text-xs text-muted-foreground">If set to 0, there is no limit.</span>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                    Enable Auto Trading
                  </Label>
                    <div className="flex items-center justify-between p-3 bg-background/40 rounded-lg border border-border">
                      <span className="text-sm text-muted-foreground">Enable automated trading by bot</span>
                    <Switch
                      name="tradingActive"
                      defaultChecked={settings.tradingActive}
                        className="data-[state=checked]:bg-primary"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 mb-8"
          >
            <Card className="bg-card/80 border border-border/50 rounded-2xl shadow-xl">
              <CardHeader className="border-b border-border/30">
                <CardTitle className="text-lg md:text-xl font-bold flex items-center gap-3 text-foreground">
                  <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                    <Icon icon="mdi:bell" className="w-5 h-5 text-white" />
                  </div>
                  Notifications & Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-background/40 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <Icon icon="mdi:bell" className="w-5 h-5 text-primary" />
                        <div>
                          <span className="font-medium text-foreground">Push Notifications</span>
                          <p className="text-xs text-muted-foreground">Receive real-time alerts</p>
                        </div>
                      </div>
                      <Switch
                        name="notificationsActive"
                        defaultChecked={settings.notificationsActive}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Language
                      </Label>
                      <Select name="language" defaultValue={settings.language}>
                        <SelectTrigger className="bg-background/60 border-border focus:border-primary focus:ring-primary/20 text-foreground">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="en" className="text-foreground hover:bg-primary/10">
                            English
                          </SelectItem>
                          <SelectItem value="fa" className="text-foreground hover:bg-primary/10">
                            فارسی
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Timezone
                      </Label>
                      <Select name="timezone" defaultValue={settings.timezone}>
                        <SelectTrigger className="bg-background/60 border-border focus:border-primary focus:ring-primary/20 text-foreground">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {timezones.map(tz => (
                            <SelectItem 
                              key={tz.value} 
                              value={tz.value}
                              className="text-foreground hover:bg-primary/10"
                            >
                              {tz.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg border border-primary/20">
                      <h4 className="font-semibold text-foreground mb-2">Security Tips</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Never share your API keys</li>
                        <li>• Use IP whitelisting when possible</li>
                        <li>• Enable 2FA on your exchange account</li>
                        <li>• Regularly rotate your API keys</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8"
          >
            <Card className="bg-card/80 border border-border/50 rounded-2xl shadow-xl">
              <CardHeader className="border-b border-border/30">
                <CardTitle className="text-lg md:text-xl font-bold flex items-center gap-3 text-foreground">
                  <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                    <Icon icon="mdi:telegram" className="w-5 h-5 text-white" />
                  </div>
                  Telegram Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Bot Token
                  </Label>
                  <div className="relative">
                    <Input
                      name="telegramToken"
                      type={showBotToken ? "text" : "password"}
                      defaultValue={settings.telegramToken}
                      className="pr-10 bg-background/60 border-border focus:border-primary focus:ring-primary/20 text-foreground"
                      placeholder="Enter bot token"
                    />
                    <button
                      type="button"
                      onClick={() => setShowBotToken(!showBotToken)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showBotToken ? <Icon icon="mdi:eye-off" className="w-4 h-4" /> : <Icon icon="mdi:eye" className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Chat ID
                  </Label>
                  <Input
                    name="telegramChatId"
                    defaultValue={settings.telegramChatId}
                    className="bg-background/60 border-border focus:border-primary focus:ring-primary/20 text-foreground"
                    placeholder="Enter chat ID"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                    Enable Telegram Notifications
                  </Label>
                    <div className="flex items-center justify-between p-3 bg-background/40 rounded-lg border border-border">
                      <span className="text-sm text-muted-foreground">Receive notifications via Telegram</span>
                    <Switch
                      name="telegramActive"
                      defaultChecked={settings.telegramActive}
                        className="data-[state=checked]:bg-primary"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex justify-end gap-4 mt-8"
          >
            <Button 
              type="button"
              variant="outline"
              className="border-2 border-border hover:border-primary bg-transparent text-foreground hover:bg-primary/10 px-6 py-3 rounded-xl transition-all"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/80 text-white px-8 py-3 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                <>
                  <Icon icon="mdi:content-save" className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </main>
    </div>
  );
}