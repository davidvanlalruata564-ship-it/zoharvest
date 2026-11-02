import React, { useState, useEffect } from 'react';
import { X, Search, ShieldCheck, UserPlus, UserCheck, ArrowLeft } from 'lucide-react';

export default function NetworkModal({
  isOpen,
  onClose,
  userId,
  initialTab = 'followers', // 'followers' | 'following'
  currentUser,
  onSelectUser,
  onFollowToggle
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [search, setSearch] = useState('');
  const [followingMap, setFollowingMap] = useState({});

  useEffect(() => {
    let mounted = true;
    async function fetchNetwork() {
      if (!userId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/users/${encodeURIComponent(userId)}/network`);
        if (res.ok) {
          const data = await res.json();
          if (mounted) {
            setFollowers(data.followers || []);
            setFollowing(data.following || []);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchNetwork();
    return () => { mounted = false; };
  }, [userId]);

  // Synchronize initialTab
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const list = activeTab === 'followers' ? followers : following;
  const filtered = list.filter(u => 
    (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
    (u.username && u.username.toLowerCase().includes(search.toLowerCase())) ||
    (u.district && u.district.toLowerCase().includes(search.toLowerCase()))
  );

  const handleFollowClick = async (targetUser, e) => {
    e.stopPropagation();
    if (!currentUser) return;
    const isCurrentlyFollowing = followingMap[targetUser.id] ?? false;
    // Optimistic toggle
    setFollowingMap(prev => ({ ...prev, [targetUser.id]: !isCurrentlyFollowing }));
    if (onFollowToggle) {
      await onFollowToggle(targetUser.id);
    } else {
      const token = localStorage.getItem('zh_token');
      try {
        await fetch(`/api/users/${targetUser.id}/follow`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (err) {
        // Revert
        setFollowingMap(prev => ({ ...prev, [targetUser.id]: isCurrentlyFollowing }));
      }
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
            <h3 className="font-extrabold text-sm text-slate-900">
              Community Network
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-500 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 text-xs font-bold bg-slate-50/50">
          <button
            onClick={() => setActiveTab('followers')}
            className={`flex-1 py-3 text-center border-b-2 transition cursor-pointer ${
              activeTab === 'followers'
                ? 'border-emerald-700 text-emerald-900 bg-white font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Followers ({followers.length})
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-3 text-center border-b-2 transition cursor-pointer ${
              activeTab === 'following'
                ? 'border-emerald-700 text-emerald-900 bg-white font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Following ({following.length})
          </button>
        </div>

        {/* Search filter */}
        <div className="p-3 border-b border-slate-100">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, handle or district..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* List Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-slate-100">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading network...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No accounts found in this list.
            </div>
          ) : (
            filtered.map((user) => {
              const isSelf = currentUser && currentUser.id === user.id;
              const isFollowingUser = followingMap[user.id] ?? (activeTab === 'following');

              return (
                <div
                  key={user.id}
                  onClick={() => {
                    onClose();
                    if (onSelectUser) onSelectUser(user.id);
                  }}
                  className="pt-2 first:pt-0 flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-slate-50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-900 font-extrabold flex items-center justify-center shrink-0 overflow-hidden border border-emerald-300">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>👨‍🌾</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-slate-900 truncate">{user.name}</span>
                        {user.isVerified && <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono truncate">
                        @{user.username || 'member'} • {user.district || 'Mizoram'}
                      </div>
                    </div>
                  </div>

                  {!isSelf && currentUser && (
                    <button
                      onClick={(e) => handleFollowClick(user, e)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                        isFollowingUser
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs'
                      }`}
                    >
                      {isFollowingUser ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
