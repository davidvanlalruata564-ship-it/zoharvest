import React, { useState } from 'react';
import { 
  Sprout, 
  Globe, 
  Bell, 
  Store, 
  Menu, 
  X,
  UserCheck,
  User,
  LogOut,
  LogIn,
  Settings,
  PlusCircle
} from 'lucide-react';

export default function Navbar({ 
  currentLang, 
  setCurrentLang, 
  t, 
  activeTab, 
  setActiveTab,
  notifications,
  setIsNotifOpen,
  unreadCount,
  currentUser,
  authenticatedUser,
  onOpenAuthModal,
  onOpenProfile,
  onOpenUserProfile,
  onOpenNewListing,
  onLogout
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab) => {
    if (tab === 'profile') {
      if (!authenticatedUser) {
        onOpenAuthModal();
      } else {
        if (onOpenUserProfile) {
          onOpenUserProfile(null);
        } else {
          setActiveTab('profile');
        }
      }
    } else {
      if (onOpenUserProfile && tab === 'marketplace') {
        onOpenUserProfile(null);
      }
      setActiveTab(tab);
    }
    setMobileMenuOpen(false);
  };

  const handlePostClick = () => {
    if (!authenticatedUser) {
      onOpenAuthModal();
    } else if (onOpenNewListing) {
      onOpenNewListing();
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top Banner: Regional Authenticity & Quick Language */}
      <div className="bg-emerald-950 text-emerald-100/90 text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center font-medium">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span>Mizoram Direct Farm Produce & Groceries</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-emerald-300/80 text-[11px]">Grassroots Growers & Pantry</span>
          <button 
            onClick={() => setCurrentLang(currentLang === 'en' ? 'mz' : 'en')}
            className="flex items-center gap-1.5 bg-emerald-900/90 hover:bg-emerald-800 text-amber-300 px-2.5 py-0.5 rounded-full text-xs font-semibold transition cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{currentLang === 'en' ? 'Mizo (MZ)' : 'English (EN)'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => handleNavClick('marketplace')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center text-white shadow-sm">
              <Sprout className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-emerald-950 font-sans">
                  ZO<span className="text-amber-600">HARVEST</span>
                </span>
                <span className="text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Groceries
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium hidden sm:block">
                Direct Farm Produce Exchange
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-2 bg-stone-100/80 p-1.5 rounded-2xl border border-stone-200/70">
            <button
              onClick={() => handleNavClick('marketplace')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'marketplace'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-emerald-900 hover:bg-white/70'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>{t.navMarketplace || 'Marketplace'}</span>
            </button>

            <button
              onClick={handlePostClick}
              className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 transition cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Produce</span>
            </button>

            <button
              onClick={() => handleNavClick('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-emerald-900 hover:bg-white/70'
              }`}
            >
              <User className="w-4 h-4" />
              <span>My Profile & Posts</span>
            </button>

            {authenticatedUser?.role === 'admin' && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-600 hover:text-emerald-900 hover:bg-white/70'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Admin Hub</span>
              </button>
            )}
          </nav>

          {/* Right Action: Profile & Notifications */}
          <div className="flex items-center gap-2 sm:gap-3">

            {authenticatedUser ? (
              <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-stone-200/80 shadow-2xs">
                <button
                  onClick={() => handleNavClick('profile')}
                  className="flex items-center gap-2 text-left hover:opacity-85 transition cursor-pointer"
                  title="View your Profile & Listings"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs shadow-xs overflow-hidden">
                    {authenticatedUser?.avatarUrl ? (
                      <img src={authenticatedUser.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span>{authenticatedUser?.name ? authenticatedUser.name[0].toUpperCase() : 'U'}</span>
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <div className="font-bold text-stone-900 text-xs truncate max-w-[120px]">
                      {authenticatedUser?.name || 'My Profile'}
                    </div>
                    <div className="text-[10px] text-emerald-800 font-semibold truncate max-w-[120px]">
                      {authenticatedUser?.district ? `${authenticatedUser.district}` : 'Active Account'}
                    </div>
                  </div>
                </button>

                <button
                  onClick={onOpenProfile}
                  title="Edit Profile Picture & Settings"
                  className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-sm cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-300" />
                <span>Sign In</span>
              </button>
            )}

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotifOpen(true)}
              className="relative p-2.5 rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-600 hover:text-emerald-900 transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <div className="text-[11px] font-bold uppercase text-stone-400 px-2 py-1 tracking-wider">Navigation</div>
          
          <button
            onClick={() => handleNavClick('marketplace')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
              activeTab === 'marketplace' ? 'bg-emerald-800 text-white' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Marketplace</span>
          </button>

          <button
            onClick={handlePostClick}
            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 bg-amber-400 text-slate-950 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Post Produce</span>
          </button>

          <button
            onClick={() => handleNavClick('profile')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
              activeTab === 'profile' ? 'bg-emerald-800 text-white' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Profile & Posts</span>
          </button>

          {authenticatedUser?.role === 'admin' && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                activeTab === 'admin' ? 'bg-emerald-800 text-white' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Admin Hub</span>
            </button>
          )}

          {/* Mobile Auth button */}
          <div className="pt-2 border-t border-stone-200">
            {authenticatedUser ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl">
                  <div>
                    <div className="text-xs font-bold text-stone-800">{authenticatedUser?.name || 'User'}</div>
                    <div className="text-[10px] text-emerald-800 font-bold">
                      {authenticatedUser?.district || 'Active Account'}
                    </div>
                  </div>
                  <button onClick={onLogout} className="text-xs font-bold text-red-600 hover:underline cursor-pointer">
                    Sign Out
                  </button>
                </div>
                
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenProfile(); }}
                  className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Edit Profile Picture & Contacts</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onOpenAuthModal(); setMobileMenuOpen(false); }}
                className="w-full bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-amber-300" />
                <span>Sign In or Create Account</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
