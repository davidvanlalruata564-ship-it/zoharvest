import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, UserX, Check, ArrowLeft } from 'lucide-react';

export default function BlockedUsersModal({ isOpen, onClose, onUnblockUser }) {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(true);
  const [blockedList, setBlockedList] = useState([]);
  const [unblockingId, setUnblockingId] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchBlocked() {
      setLoading(true);
      const token = localStorage.getItem('zh_token');
      if (!token) return;
      try {
        const res = await fetch('/api/users/me/blocked', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (mounted) setBlockedList(data.blocked || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchBlocked();
    return () => { mounted = false; };
  }, [isOpen]);

  const handleUnblock = async (user) => {
    setUnblockingId(user.id);
    const token = localStorage.getItem('zh_token');
    try {
      const res = await fetch(`/api/users/${user.id}/block`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setBlockedList(prev => prev.filter(u => u.id !== user.id));
        if (onUnblockUser) onUnblockUser(user.id);
      }
    } catch (err) {
      alert('Failed to unblock user.');
    } finally {
      setUnblockingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-600 transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Blocked Accounts</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-500 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 bg-slate-50 border-b border-slate-100 text-[11px] text-slate-600">
          Blocked accounts cannot interact with your posts or profile, and their listings are hidden from your feed.
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading blocked accounts...</div>
          ) : blockedList.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-2">
              <UserX className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-700">No Blocked Accounts</div>
              <p className="text-[11px]">You have not blocked any members on ZOHARVEST.</p>
            </div>
          ) : (
            blockedList.map(user => (
              <div
                key={user.id}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-slate-200 bg-white shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-extrabold flex items-center justify-center shrink-0 border border-slate-200">
                    👨‍🌾
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-900 truncate">{user.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono truncate">
                      @{user.username || 'member'} • {user.district || 'Mizoram'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleUnblock(user)}
                  disabled={unblockingId === user.id}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {unblockingId === user.id ? 'Unblocking...' : 'Unblock'}
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
