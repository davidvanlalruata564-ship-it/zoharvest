import React from 'react';
import { 
  X, 
  Bell, 
  MessageSquare, 
  Smartphone, 
  CheckCheck, 
  Clock, 
  ShieldCheck, 
  Truck,
  Sparkles
} from 'lucide-react';

export default function NotificationsDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  t
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                {t.notifications}
              </h3>
              <p className="text-[11px] text-slate-400">Automated SMS & WhatsApp Webhooks</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 px-2 py-1"
            >
              Mark Read
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No recent alerts
            </div>
          ) : (
            notifications.map((n) => {
              const isWhatsApp = n.type === 'whatsapp';
              return (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-2xl border transition ${
                    n.read
                      ? 'bg-white border-slate-200'
                      : 'bg-emerald-50/50 border-emerald-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded flex items-center gap-1 ${
                      isWhatsApp ? 'bg-green-100 text-green-900' : 'bg-blue-100 text-blue-900'
                    }`}>
                      {isWhatsApp ? <MessageSquare className="w-3 h-3 text-green-700" /> : <Smartphone className="w-3 h-3 text-blue-700" />}
                      <span>{isWhatsApp ? 'WhatsApp Alert' : 'SMS Webhook'}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{n.timestamp}</span>
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 leading-snug">{n.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 text-center">
          Integrated with Twilio SMS & Meta WhatsApp Business Cloud API.
        </div>

      </div>
    </div>
  );
}
