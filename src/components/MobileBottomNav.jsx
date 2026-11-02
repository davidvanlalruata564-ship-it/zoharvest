import React from 'react';
import { Store, Search, PlusCircle, Users, User, Compass } from 'lucide-react';

export default function MobileBottomNav({
  activeTab,
  onNavigate,
  onOpenNewListing,
  currentUser,
  onOpenAuth
}) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-3 flex justify-around items-center shadow-lg safe-area-bottom">
      
      {/* 1. Feed / Marketplace */}
      <button
        onClick={() => onNavigate('marketplace')}
        className={`flex flex-col items-center gap-1 cursor-pointer transition ${
          activeTab === 'marketplace'
            ? 'text-emerald-800 font-extrabold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Store className={`w-5 h-5 ${activeTab === 'marketplace' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px]">Market</span>
      </button>

      {/* 2. Explore / Highlights */}
      <button
        onClick={() => onNavigate('explore')}
        className={`flex flex-col items-center gap-1 cursor-pointer transition ${
          activeTab === 'explore'
            ? 'text-emerald-800 font-extrabold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Compass className={`w-5 h-5 ${activeTab === 'explore' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px]">Explore</span>
      </button>

      {/* 3. Primary Add Post Button */}
      <button
        onClick={() => {
          if (!currentUser) {
            onOpenAuth();
          } else {
            onOpenNewListing();
          }
        }}
        className="flex flex-col items-center gap-1 cursor-pointer -mt-4 group"
        title="Post Produce Listing"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-105 transition border-2 border-white">
          <PlusCircle className="w-6 h-6 stroke-[2.5]" />
        </div>
        <span className="text-[10px] font-extrabold text-slate-900">Post</span>
      </button>

      {/* 4. About / Mission */}
      <button
        onClick={() => onNavigate('about')}
        className={`flex flex-col items-center gap-1 cursor-pointer transition ${
          activeTab === 'about'
            ? 'text-emerald-800 font-extrabold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Users className={`w-5 h-5 ${activeTab === 'about' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px]">About</span>
      </button>

      {/* 5. Profile Page */}
      <button
        onClick={() => {
          if (!currentUser) {
            onOpenAuth();
          } else {
            onNavigate('profile');
          }
        }}
        className={`flex flex-col items-center gap-1 cursor-pointer transition ${
          activeTab === 'profile'
            ? 'text-emerald-800 font-extrabold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className={`w-5 h-5 rounded-full overflow-hidden flex items-center justify-center text-[10px] ${
          currentUser?.avatarUrl 
            ? 'border border-emerald-700' 
            : activeTab === 'profile' ? 'text-emerald-800' : 'text-slate-500'
        }`}>
          {currentUser?.avatarUrl ? (
            <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : ''}`} />
          )}
        </div>
        <span className="text-[10px]">Profile</span>
      </button>

    </nav>
  );
}
