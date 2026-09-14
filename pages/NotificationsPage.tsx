import { useEffect, useState } from 'react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { notificationApi } from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await notificationApi.list();
      if (res.success && res.data) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }

  async function markRead(id: string) {
    try {
      await notificationApi.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      toast.error('Failed to mark as read');
    }
  }

  async function markAll() {
    try {
      await notificationApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All marked as read');
    } catch {
      toast.error('Failed');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-careva-teal border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="mt-1 text-sm text-slate-500">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" onClick={markAll}>
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="flex flex-col items-center py-16">
          <Bell className="h-12 w-12 text-slate-300" />
          <p className="mt-4 text-slate-500">No notifications yet.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={cn(
                'flex items-start gap-3 p-4 transition-colors',
                !n.isRead && 'border-careva-teal/30 bg-careva-teal/5'
              )}
            >
              <div
                className={cn(
                  'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  n.isRead ? 'bg-slate-100 dark:bg-slate-800' : 'bg-careva-teal/20'
                )}
              >
                <Bell className={cn('h-4 w-4', n.isRead ? 'text-slate-400' : 'text-careva-teal')} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-semibold', !n.isRead && 'text-slate-900 dark:text-white')}>
                  {n.title}
                </p>
                <p className="mt-0.5 text-sm text-slate-500">{n.message}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
                {n.link && (
                  <Link
                    to={n.link}
                    className="mt-1 inline-block text-xs font-medium text-careva-blue hover:underline dark:text-careva-teal"
                    onClick={() => !n.isRead && markRead(n.id)}
                  >
                    View →
                  </Link>
                )}
              </div>
              {!n.isRead && (
                <button
                  onClick={() => markRead(n.id)}
                  className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-careva-teal dark:hover:bg-slate-800"
                  title="Mark as read"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
