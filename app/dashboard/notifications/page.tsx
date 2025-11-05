
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { connectDB } from "@/app/db";
import notificationModel from "@/app/models/notificationModel";
import Sidebar from '../../components/Sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import Icon from '../../components/Icon';
import { redirect } from "next/navigation";
import Link from 'next/link';

import MarkAsReadButton from "./MarkAsReadButton";


async function getNotificationsData(userId: string, page = 1, perPage = 10) {
  await connectDB();

  const skip = (page - 1) * perPage;


  const notifications = await notificationModel
    .find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(perPage);

  const [totalNotifications, unreadNotifications, tradeCount, signalCount, systemCount, alertCount, customCount] = await Promise.all([
    notificationModel.countDocuments({ userId }),
    notificationModel.countDocuments({ userId, isRead: false }),
    notificationModel.countDocuments({ userId, type: 'trade' }),
    notificationModel.countDocuments({ userId, type: 'signal' }),
    notificationModel.countDocuments({ userId, type: 'system' }),
    notificationModel.countDocuments({ userId, type: 'alert' }),
    notificationModel.countDocuments({ userId, type: 'custom' }),
  ]);

  const readNotifications = totalNotifications - unreadNotifications;

  const typeCounts = {
    trade: tradeCount,
    signal: signalCount,
    system: systemCount,
    alert: alertCount,
    custom: customCount,
  };

  const totalPages = Math.max(1, Math.ceil(totalNotifications / perPage));

  return {
    notifications,
    stats: {
      total: totalNotifications,
      unread: unreadNotifications,
      read: readNotifications,
      typeCounts,
    },
    pagination: {
      page,
      perPage,
      totalPages,
      total: totalNotifications,
    },
  };
}

export default async function NotificationsPage(props: any) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }
  
  const params = props?.searchParams;
  const page = parseInt((Array.isArray(params?.page) ? params?.page[0] : params?.page) ?? '1', 10) || 1;
  const perPage = 10;
  const data = await getNotificationsData(session.user.id, page, perPage);
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trade':
        return 'mdi:chart-line';
      case 'signal':
        return 'mdi:trending-up';
      case 'system':
        return 'mdi:cog';
      case 'alert':
        return 'mdi:alert-circle';
      case 'custom':
        return 'mdi:bell';
      default:
        return 'mdi:bell';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'trade':
        return 'text-green-500 bg-green-500/10';
      case 'signal':
        return 'text-blue-500 bg-blue-500/10';
      case 'system':
        return 'text-purple-500 bg-purple-500/10';
      case 'alert':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'custom':
        return 'text-gray-500 bg-gray-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'trade':
        return 'Trade';
      case 'signal':
        return 'Signal';
      case 'system':
        return 'System';
      case 'alert':
        return 'Alert';
      case 'custom':
        return 'Custom';
      default:
        return type;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date(date));
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(date);
  };


  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />

      <main className="flex-1 p-8 space-y-8 max-w-7xl ml-64">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2">
                Notifications
              </h1>
              <p className="text-gray-400">Stay updated with your trading activities and system alerts</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg border border-primary/20">
                <Icon icon="mdi:bell" className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">{data.stats.unread} unread</span>
              </div>
            </div>
          </div>

      
          <div className="flex items-center gap-4 flex-wrap">
            <button className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-primary text-white">
              All ({data.stats.total})
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-800/50 text-base-400 hover:bg-gray-700/50">
              Trade ({data.stats.typeCounts.trade})
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-800/50 text-base-400 hover:bg-gray-700/50">
              Signal ({data.stats.typeCounts.signal})
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-800/50 text-base-400 hover:bg-gray-700/50">
              System ({data.stats.typeCounts.system})
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-800/50 text-base-400 hover:bg-gray-700/50">
              Alert ({data.stats.typeCounts.alert})
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-800/50 text-base-400 hover:bg-gray-700/50">
              Custom ({data.stats.typeCounts.custom})
            </button>
          </div>
        </div>

        <div>
          <Card className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl">
            <CardHeader className="border-b border-border/30">
              <CardTitle className="text-xl font-bold flex items-center gap-3 text-foreground">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                  <Icon icon="mdi:bell" className="w-5 h-5 text-white" />
                </div>
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700/50 hover:bg-gray-700/20">
                      <TableHead className="text-muted-foreground font-medium">Type</TableHead>
                      <TableHead className="text-muted-foreground font-medium">Title</TableHead>
                      <TableHead className="text-muted-foreground font-medium">Message</TableHead>
                      <TableHead className="text-muted-foreground font-medium">Time</TableHead>
                      <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                      <TableHead className="text-muted-foreground font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.notifications.length > 0 ? (
                      data.notifications.map((notification: any) => (
                        <TableRow 
                          key={notification._id.toString()} 
                          className={`border-gray-700/30 hover:bg-background/20 transition-all ${!notification.isRead ? 'bg-primary/5' : ''}`}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Icon 
                                icon={getTypeIcon(notification.type)} 
                                className={`w-5 h-5 ${getTypeColor(notification.type).split(' ')[0]}`} 
                              />
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                                {getTypeDisplayName(notification.type)}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="max-w-xs">
                            <div className="flex items-start gap-3">
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                              )}
                              <p className={`text-sm font-medium ${notification.isRead ? 'text-muted-foreground' : 'text-foreground'}`}>
                                {notification.title}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell className="max-w-md">
                            <p className={`text-sm ${notification.isRead ? 'text-gray-400' : 'text-primary'}`}>
                              {notification.message}
                            </p>
                          </TableCell>

                          <TableCell className="text-gray-400 text-sm">
                            <div className="flex flex-col">
                              <span className="text-foreground">{getRelativeTime(notification.createdAt)}</span>
                              <span className="text-xs text-muted-foreground">{formatDate(notification.createdAt)}</span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2">
                              {notification.isRead ? (
                                <span className="text-green-500 text-sm flex items-center gap-1">
                                  <Icon icon="mdi:check" className="w-3 h-3" />
                                  Read
                                </span>
                              ) : (
                                <span className="text-primary text-sm flex items-center gap-1">
                                  <Icon icon="mdi:circle" className="w-3 h-3" />
                                  Unread
                                </span>
                              )}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2">
                              {notification.isRead ? (
                                <button className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-sm rounded-lg transition-all text-white">
                                 Read
                                </button>
                              ) : (
                                 <MarkAsReadButton id={notification._id.toString()} />
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2">
                            <Icon icon="mdi:bell-off" className="w-12 h-12 text-muted-foreground" />
                            <p className="text-muted-foreground">No notifications found</p>
                            <p className="text-sm text-muted-foreground">You&apos;re all caught up!</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

              <div className="flex items-center justify-between px-2">
                <div className="text-sm text-muted-foreground">Showing page {data.pagination.page} of {data.pagination.totalPages} — {data.pagination.total} total</div>
                <div className="flex items-center gap-2">
                  <Link href={`?page=${Math.max(1, data.pagination.page - 1)}`} className={`px-3 py-1 rounded-lg text-sm ${data.pagination.page === 1 ? 'bg-gray-700/30 text-gray-500 pointer-events-none' : 'bg-gray-800/50 text-foreground hover:bg-background/60'}`}>
                    Prev
                  </Link>
           
                  {(() => {
                    const pages = [] as number[];
                    const total = data.pagination.totalPages;
                    const current = data.pagination.page;
                    const start = Math.max(1, current - 2);
                    const end = Math.min(total, current + 2);
                    for (let p = start; p <= end; p++) pages.push(p);
                    return pages.map((p) => (
                      <Link key={p} href={`?page=${p}`} className={`px-3 py-1 rounded-lg text-sm ${p === current ? 'bg-primary text-white' : 'bg-gray-800/50 text-muted-foreground hover:bg-background/60'}`}>
                        {p}
                      </Link>
                    ));
                  })()}
                  <Link href={`?page=${Math.min(data.pagination.totalPages, data.pagination.page + 1)}`} className={`px-3 py-1 rounded-lg text-sm ${data.pagination.page === data.pagination.totalPages ? 'bg-gray-700/30 text-gray-500 pointer-events-none' : 'bg-gray-800/50 text-foreground hover:bg-background/60'}`}>
                    Next
                  </Link>
                </div>
              </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card/80 backdrop-blur border border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Notifications</p>
                  <p className="text-2xl font-bold text-foreground">{data.stats.total}</p>
                </div>
                <Icon icon="mdi:bell" className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unread</p>
                  <p className="text-2xl font-bold text-foreground">{data.stats.unread}</p>
                </div>
                <Icon icon="mdi:bell-ring" className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Read</p>
                  <p className="text-2xl font-bold text-foreground">{data.stats.read}</p>
                </div>
                <Icon icon="mdi:check-circle" className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Trade Alerts</p>
                  <p className="text-2xl font-bold text-foreground">{data.stats.typeCounts.trade}</p>
                </div>
                <Icon icon="mdi:chart-line" className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}



