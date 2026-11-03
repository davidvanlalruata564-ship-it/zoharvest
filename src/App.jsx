import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import MarketplaceCatalog from './components/MarketplaceCatalog';
import ProductDetailModal from './components/ProductDetailModal';
import ProfilePage from './components/ProfilePage';
import MobileBottomNav from './components/MobileBottomNav';
import AdminVerificationHub from './components/AdminVerificationHub';
import NewListingModal from './components/NewListingModal';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';

import { translations } from './i18n/translations';
import { 
  initialCategories, 
  initialDistricts, 
  initialProducts, 
  initialUsers, 
} from '../server/data/seedData';

export default function App() {
  const [currentLang, setCurrentLang] = useState('en');
  const [currentRole, setCurrentRole] = useState('farmer'); // 'farmer' | 'buyer' | 'admin'
  const [activeTab, setActiveTab] = useState('marketplace');

  // Core Data States with fallback to seed data
  const [categories, setCategories] = useState(initialCategories);
  const [districts, setDistricts] = useState(initialDistricts);
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState(initialUsers);
  const [stats, setStats] = useState(null);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals & Drawers
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [isNewListingOpen, setIsNewListingOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingSellerId, setViewingSellerId] = useState(null);
  const [viewingProfileInitialTab, setViewingProfileInitialTab] = useState('posts');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileInitialTab, setProfileInitialTab] = useState('general');

  const handleOpenProfile = (tab = 'general') => {
    setProfileInitialTab(tab);
    setIsProfileOpen(true);
  };

  const handleOpenUserProfile = (sellerId, preferredTab = 'posts') => {
    setViewingSellerId(sellerId || null);
    setViewingProfileInitialTab(preferredTab);
    setActiveTab('profile');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('zh_token') || null);
  const [authenticatedUser, setAuthenticatedUser] = useState(() => {
    try {
      const stored = localStorage.getItem('zh_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  // Active translation dictionary
  const t = translations[currentLang] || translations.en;

  // Active user: authenticated user session or guest
  const currentUser = authenticatedUser || null;

  // Handle Authentication Success
  const handleAuthSuccess = (user, token) => {
    if (!user) return;
    const safeUser = {
      role: 'buyer',
      organization: 'Wholesale Buyer',
      district: 'Aizawl',
      ...user
    };
    setAuthenticatedUser(safeUser);
    setAuthToken(token);
    if (safeUser.role) {
      setCurrentRole(safeUser.role);
    }
  };

  // Handle Sign Out with backend cryptographic token revocation
  const handleLogout = async () => {
    if (authToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });
      } catch (e) {
        // Continue local cleanup even if offline
      }
    }
    localStorage.removeItem('zh_token');
    localStorage.removeItem('zh_user');
    setAuthenticatedUser(null);
    setAuthToken(null);
    setActiveTab('marketplace');
  };

  // Initial fetch from backend (or fallback if offline)
  const fetchAllData = async () => {
    try {
      const prodRes = await fetch('/api/products');
      if (prodRes.ok) {
        const data = await prodRes.json();
        if (data.products) setProducts(data.products);
      }

      const orderRes = await fetch('/api/orders');
      if (orderRes.ok) {
        const data = await orderRes.json();
        if (data.orders) setOrders(data.orders);
      }

      const userRes = await fetch('/api/users');
      if (userRes.ok) {
        const data = await userRes.json();
        if (data.users) setUsers(data.users);
      }

      const statsRes = await fetch('/api/stats');
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
    } catch (err) {
      console.log('Using seeded in-memory state');
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Filter products client-side for ultra-fast responsiveness
  const filteredProducts = products.filter(p => {
    // Hide quarantined products from public marketplace view
    if (p.moderationStatus === 'quarantined') return false;
    // Hide posts from blocked users
    if (currentUser?.blockedUsers && p.sellerId && currentUser.blockedUsers.includes(p.sellerId)) return false;
    if (selectedCategory === 'following') {
      if (!currentUser?.following || !currentUser.following.includes(p.sellerId)) return false;
    } else if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }
    if (selectedDistrict !== 'all' && p.district.toLowerCase() !== selectedDistrict.toLowerCase()) return false;
    if (selectedGrade !== 'all' && !p.grade.toLowerCase().includes(selectedGrade.toLowerCase())) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        (p.nameMizo && p.nameMizo.toLowerCase().includes(q)) ||
        p.district.toLowerCase().includes(q) ||
        p.fpoName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Helper: Get authenticated headers
  const getAuthHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
  };

  // Handler: New Commodity Listing by Farmer
  const handlePublishNewProduct = async (productData) => {
    if (!authenticatedUser) {
      setIsAuthOpen(true);
      return { success: false, error: 'Authentication required. Please sign in.' };
    }
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        const created = await res.json();
        setProducts(prev => [created, ...prev]);
        setActiveTab('marketplace');
        return { success: true, product: created };
      } else {
        const err = await res.json();
        return { success: false, error: err.error || 'Failed to list commodity' };
      }
    } catch (e) {
      console.error(e);
      return { success: false, error: 'Network error or server unavailable' };
    }
  };

  // Handler: Admin KYC Approval
  const handleVerifyKYC = async (userId) => {
    if (!authenticatedUser) {
      setIsAuthOpen(true);
      return;
    }
    try {
      const res = await fetch(`/api/users/${userId}/verify-kyc`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerified: true } : u));
      } else {
        const err = await res.json();
        alert(err.error || 'KYC Approval failed');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Update product listing
  const handleUpdateProduct = async (productId, updatedFields) => {
    if (!authenticatedUser) {
      setIsAuthOpen(true);
      return { success: false, error: 'Authentication required. Please sign in.' };
    }
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(prev => prev.map(p => p.id === productId ? data.product : p));
        return { success: true, product: data.product };
      } else {
        const err = await res.json();
        return { success: false, error: err.error || 'Failed to update product' };
      }
    } catch (e) {
      console.error(e);
      return { success: false, error: 'Network error or server unavailable' };
    }
  };

  // Handler: Delete/Delist product listing
  const handleDeleteProduct = async (productId) => {
    if (!authenticatedUser) {
      setIsAuthOpen(true);
      return;
    }
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId));
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete listing');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Admin Toggle user status
  const handleToggleUserStatus = async (userId, newStatus) => {
    if (!authenticatedUser || authenticatedUser.role !== 'admin') {
      alert('Admin authorization required.');
      return;
    }
    try {
      const res = await fetch(`/api/users/${userId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(prev => prev.map(u => u.id === userId ? data.user : u));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Admin Update User (role, status, forcePasswordChange, isVerified)
  const handleAdminUpdateUser = async (userId, updates) => {
    if (!authenticatedUser || authenticatedUser.role !== 'admin') {
      alert('Admin authorization required.');
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(prev => prev.map(u => u.id === userId ? data.user : u));
        if (authenticatedUser.id === userId) {
          setAuthenticatedUser(data.user);
        }
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update user profile');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Admin Quarantine or Release Product Listing
  const handleQuarantineProduct = async (productId, moderationStatus, quarantineReason) => {
    if (!authenticatedUser || authenticatedUser.role !== 'admin') {
      alert('Admin authorization required.');
      return;
    }
    try {
      const res = await fetch(`/api/products/${productId}/moderation`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ moderationStatus, quarantineReason })
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(prev => prev.map(p => p.id === productId ? data.product : p));
      } else {
        const err = await res.json();
        alert(err.error || 'Moderation action rejected');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Admin Reset Database to Seed State
  const handleResetDatabase = async () => {
    if (!authenticatedUser || authenticatedUser.role !== 'admin') {
      alert('Admin authorization required.');
      return;
    }
    try {
      const res = await fetch('/api/admin/database/reset', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'X-Admin-Confirm-Reset': 'CONFIRM_RESET'
        }
      });
      if (res.ok) {
        await fetchAllData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to reset database');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Profile update callback
  const handleProfileUpdated = (updatedUser) => {
    setAuthenticatedUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] font-sans selection:bg-emerald-700 selection:text-white overflow-x-hidden w-full max-w-full">
      
      {/* Top Main Navigation */}
      <Navbar
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        t={t}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        authenticatedUser={authenticatedUser}
        onOpenAuthModal={() => setIsAuthOpen(true)}
        onOpenProfile={handleOpenProfile}
        onOpenUserProfile={handleOpenUserProfile}
        onOpenNewListing={() => {
          setEditingProduct(null);
          setIsNewListingOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        
        {/* Marketplace Catalog Tab */}
        {activeTab === 'marketplace' && (
          <>
            <HeroBanner
              t={t}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onNewListingClick={() => setIsNewListingOpen(true)}
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthOpen(true)}
            />

            <MarketplaceCatalog
              products={filteredProducts}
              categories={categories}
              districts={districts}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              selectedGrade={selectedGrade}
              setSelectedGrade={setSelectedGrade}
              onOpenProductDetail={(p) => setSelectedProductDetail(p)}
              onOpenUserProfile={handleOpenUserProfile}
              onEditProduct={(p) => {
                setEditingProduct(p);
                setIsNewListingOpen(true);
              }}
              onOpenNewListing={() => {
                setEditingProduct(null);
                setIsNewListingOpen(true);
              }}
              onOpenAuth={() => setIsAuthOpen(true)}
              currentUser={currentUser}
              t={t}
              currentLang={currentLang}
            />
          </>
        )}

        {/* Unified Profile & Inventory Showcase Tab */}
        {(activeTab === 'profile' || activeTab === 'dashboard') && (
          !viewingSellerId && !authenticatedUser ? (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl mx-auto flex items-center justify-center text-2xl mb-4">
                👤
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Sign In Required</h3>
              <p className="text-sm text-slate-500 mb-6">
                Please sign in to view your profile, manage harvest posts, check followers, and share your contact card with buyers.
              </p>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-md cursor-pointer"
              >
                Sign In / Register
              </button>
            </div>
          ) : (
            <ProfilePage
              profileUserId={viewingSellerId || (authenticatedUser ? authenticatedUser.id : null)}
              currentUser={currentUser}
              products={products}
              onSelectProduct={(p) => setSelectedProductDetail(p)}
              onOpenEditProfile={(tab = 'general') => handleOpenProfile(tab)}
              onOpenNewListing={() => {
                setEditingProduct(null);
                setIsNewListingOpen(true);
              }}
              onEditProduct={(prod) => {
                setEditingProduct(prod);
                setIsNewListingOpen(true);
              }}
              onDeleteProduct={handleDeleteProduct}
              onNavigateUser={handleOpenUserProfile}
              onBack={() => {
                setViewingSellerId(null);
                setActiveTab('marketplace');
              }}
              onLogout={handleLogout}
            />
          )
        )}

        {/* Admin Verification & Moderation Tab */}
        {activeTab === 'admin' && (
          authenticatedUser?.role === 'admin' ? (
            <AdminVerificationHub
              users={users}
              stats={stats}
              orders={orders}
              products={products}
              onVerifyUser={handleVerifyKYC}
              onAdminUpdateUser={handleAdminUpdateUser}
              onQuarantineProduct={handleQuarantineProduct}
              onDelistProduct={handleDeleteProduct}
              onResetDatabase={handleResetDatabase}
              t={t}
              currentLang={currentLang}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-red-200 text-center shadow-sm">
              <div className="w-14 h-14 bg-red-100 text-red-700 rounded-2xl mx-auto flex items-center justify-center text-2xl mb-4">
                🛡️
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Admin Authorization Required</h3>
              <p className="text-sm text-slate-500 mb-6">
                Only authenticated platform administrators may access KYC compliance verification and user audits.
              </p>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-md cursor-pointer"
              >
                Sign In as Admin
              </button>
            </div>
          )
        )}

      </main>

      {/* MODALS */}
      {selectedProductDetail && (
        <ProductDetailModal
          product={selectedProductDetail}
          onClose={() => setSelectedProductDetail(null)}
          onOpenUserProfile={handleOpenUserProfile}
          currentUser={currentUser}
          onEditProduct={(p) => {
            setSelectedProductDetail(null);
            setEditingProduct(p);
            setIsNewListingOpen(true);
          }}
          t={t}
          currentLang={currentLang}
        />
      )}

      {isNewListingOpen && (
        <NewListingModal
          isOpen={isNewListingOpen}
          onClose={() => {
            setIsNewListingOpen(false);
            setEditingProduct(null);
          }}
          onSubmitNewProduct={handlePublishNewProduct}
          onUpdateProduct={handleUpdateProduct}
          editingProduct={editingProduct}
          products={products}
          districts={districts}
          categories={categories}
          currentUser={currentUser}
          t={t}
          currentLang={currentLang}
        />
      )}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        districts={districts}
        t={t}
        currentLang={currentLang}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        districts={districts}
        onProfileUpdated={handleProfileUpdated}
        initialTab={profileInitialTab}
        onViewPublicProfile={(sellerId) => {
          setIsProfileOpen(false);
          handleOpenUserProfile(sellerId);
        }}
        t={t}
      />

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 border-t border-stone-800/80 py-8 px-4 sm:px-6 lg:px-8 mt-auto text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-400 flex items-center justify-center font-bold text-sm shadow-xs">
              🌿
            </div>
            <div>
              <div className="font-extrabold text-base text-white tracking-tight">
                ZO<span className="text-amber-400">HARVEST</span>
              </div>
              <p className="text-[11px] text-stone-500">Mizoram Direct Farm Produce & Groceries</p>
            </div>
          </div>

          <div className="flex items-center gap-5 text-xs font-semibold text-stone-400">
            <button 
              onClick={() => { setViewingSellerId(null); setActiveTab('marketplace'); }} 
              className="hover:text-white transition cursor-pointer"
            >
              Marketplace
            </button>
            <button 
              onClick={() => { setViewingSellerId(null); setActiveTab('profile'); }} 
              className="hover:text-white transition cursor-pointer"
            >
              My Profile
            </button>
            {authenticatedUser?.role === 'admin' && (
              <button 
                onClick={() => setActiveTab('admin')} 
                className="text-amber-400 hover:text-amber-300 transition cursor-pointer font-bold"
              >
                Admin Hub
              </button>
            )}
          </div>

          <div className="text-[11px] text-stone-500">
            Babutlang, Aizawl, Mizoram — 796001 • © 2026 ZOHARVEST
          </div>
        </div>
      </footer>

      {/* Mobile App-Style Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        onNavigate={(tab) => {
          if (tab === 'profile') {
            setViewingSellerId(null);
            setActiveTab('profile');
          } else {
            setViewingSellerId(null);
            setActiveTab(tab);
          }
          if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenNewListing={() => {
          setEditingProduct(null);
          setIsNewListingOpen(true);
        }}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

    </div>
  );
}
