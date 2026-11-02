import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  UserCheck, 
  UserPlus, 
  ShieldCheck, 
  MapPin, 
  Package, 
  ExternalLink,
  Users
} from 'lucide-react';

export default function FollowersModal({
  isOpen,
  onClose,
  userId,
  username,
  initialTab = 'followers',
  currentUser,
  onSelectUser,
  onFollowToggle
}) {
  const [activeTab, setActiveTab] = useState(initialTab || 'followers');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [followingMap, setFollowingMap] = useState({});

  useEffect(() => {
    setActiveTab(initialTab || 'followers');
  }, [initialTab, isOpen]);

  useEffect(() => {
    if (!isOpen || !userId) return;

    let mounted = true;
    setLoading(true);

    async function fetchNetwork() {
      try {
        const res = await fetch(`/api/users/${encodeURIComponent(userId)}/network`);
        if (res.ok) {
          const data = await res.json();
          if (mounted) {
            setFollowers(data.followers || []);
            setFollowing(data.following || []);
          }
        }
      } catch (err) {
        console.error('Failed to load network:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchNetwork();
    return () => { mounted = false; };
  }, [isOpen, userId]);

  // Synchronize currentUser following status
  useEffect(() => {
    if (currentUser?.following && Array.isArray(currentUser.following)) {
      const map = {};
      currentUser.following.forEach(id => {
        map[id] = true;
      });
      setFollowingMap(map);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const activeList = activeTab === 'followers' ? followers : following;
  const filteredList = activeList.filter(user => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(q) ||
      user.username?.toLowerCase().includes(q) ||
      user.district?.toLowerCase().includes(q) ||
      user.organization?.toLowerCase().includes(q)
    );
  });

  const handleToggleFollow = async (targetUser) => {
    if (!currentUser) return;
    const isCurrentlyFollowing = Boolean(followingMap[targetUser.id]);
    const nextState = !isCurrentlyFollowing;

    // Optimistic update
    setFollowingMap(prev => ({ ...prev, [targetUser.id]: nextState }));

    try {
      const token = localStorage.getItem('zh_token');
      const res = await fetch(`/api/users/${encodeURIComponent(targetUser.id)}/follow`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFollowingMap(prev => ({ ...prev, [targetUser.id]: data.isFollowing }));
        if (onFollowToggle) onFollowToggle(targetUser.id, data.isFollowing);
      }
    } catch (err) {
      // Revert on error
      setFollowingMap(prev => ({ ...prev, [targetUser.id]: isCurrentlyFollowing }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Community Connections
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
              @{username || 'member'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100/80 mx-4 mt-3 rounded-2xl border border-slate-200/60">
          <button
            onClick={() => { setActiveTab('followers'); setSearchTerm(''); }}
            className={`py-2 text-xs font-extrabold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'followers'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Followers</span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-md font-mono">
              {followers.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('following'); setSearchTerm(''); }}
            className={`py-2 text-xs font-extrabold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'following'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Following</span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-md font-mono">
              {following.length}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 pt-3 pb-1">
          <div className="relative flex items-center bg-slate-50 rounded-xl border border-slate-200 px-3 py-1.5 focus-within:border-emerald-600 focus-within:bg-white transition">
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full text-xs font-medium text-slate-800 placeholder-slate-400 bg-transparent focus:outline-hidden"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="text-[10px] text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* List Body */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 divide-y divide-slate-100">
          {loading ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-500 font-medium">Loading {activeTab}...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-xs font-bold text-slate-700">
                {searchTerm ? 'No results found' : (activeTab === 'followers' ? 'No followers yet' : 'Not following anyone yet')}
              </div>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                {searchTerm 
                  ? `No accounts matched "${searchTerm}".`
                  : (activeTab === 'followers' 
                      ? 'When other members follow this profile, they will show up here.'
                      : 'Profiles followed by this member will be listed here.')}
              </p>
            </div>
          ) : (
            filteredList.map((user) => {
              const isSelf = currentUser && String(currentUser.id) === String(user.id);
              const isFollowing = Boolean(followingMap[user.id]);

              return (
                <div 
                  key={user.id}
                  className="pt-2 flex items-center justify-between gap-3 group"
                >
                  {/* Clickable Identity (navigates to their profile) */}
                  <div 
                    onClick={() => {
                      onClose();
                      if (onSelectUser) onSelectUser(user.id);
                    }}
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center text-sm font-bold text-emerald-800">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>👨‍🌾</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-extrabold text-xs text-slate-900 truncate group-hover:text-emerald-700 transition">
                          {user.name}
                        </span>
                        {user.isVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      
                      <div className="text-[11px] text-slate-500 font-mono truncate">
                        @{user.username || 'member'}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span>{user.district || 'Mizoram'}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Package className="w-3 h-3 text-amber-500" />
                          <span>{user.postsCount || 0} listings</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: View Profile & Quick Follow */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        onClose();
                        if (onSelectUser) onSelectUser(user.id);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                      title="View Profile"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    {!isSelf && currentUser && (
                      <button
                        onClick={() => handleToggleFollow(user)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition cursor-pointer shadow-2xs ${
                          isFollowing
                            ? 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200'
                            : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                        }`}
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center text-[11px] text-slate-400 font-medium">
          Click any member to visit their public produce showcase
        </div>

      </div>
    </div>
  );
}
