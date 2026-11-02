import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  BarChart3, 
  DollarSign, 
  MapPin, 
  Building, 
  Scale,
  Package,
  Users,
  Search,
  Trash2,
  Sparkles,
  Lock,
  Unlock,
  Check,
  X,
  Database,
  Download,
  RotateCcw,
  Activity,
  AlertOctagon,
  RefreshCw,
  KeyRound,
  ShieldAlert
} from 'lucide-react';

export default function AdminVerificationHub({
  users = [],
  stats,
  orders = [],
  products = [],
  onVerifyUser,
  onAdminUpdateUser,
  onQuarantineProduct,
  onDelistProduct,
  onResetDatabase,
  t,
  currentLang
}) {
  const [activeTab, setActiveTab] = useState('kyc'); // 'kyc' | 'users' | 'products' | 'database' | 'ledger' | 'districts'
  const [userSearch, setUserSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // Quarantine Modal / Inline action state
  const [quarantiningProd, setQuarantiningProd] = useState(null);
  const [quarantineReason, setQuarantineReason] = useState('Suspected compliance / GI tag specification mismatch');

  // Admin User Edit Modal state
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState('farmer');
  const [newStatus, setNewStatus] = useState('active');
  const [newPassword, setNewPassword] = useState('');

  // Database metrics state
  const [dbMetrics, setDbMetrics] = useState(null);
  const [dbLoading, setDbLoading] = useState(false);

  const fetchDbMetrics = async () => {
    setDbLoading(true);
    try {
      const token = localStorage.getItem('zh_token');
      const res = await fetch('/api/admin/database/metrics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDbMetrics(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'database') {
      fetchDbMetrics();
    }
  }, [activeTab]);

  // Handle Export Database Backup JSON
  const handleExportDatabase = async () => {
    try {
      const token = localStorage.getItem('zh_token');
      const res = await fetch('/api/admin/database/export', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const backupData = await res.json();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `zoharvest-backup-${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      }
    } catch (e) {
      alert('Failed to export database backup.');
    }
  };

  // Submit Product Quarantine
  const handleConfirmQuarantine = async () => {
    if (!quarantiningProd) return;
    await onQuarantineProduct(quarantiningProd.id, 'quarantined', quarantineReason);
    setQuarantiningProd(null);
    setQuarantineReason('');
  };

  // Submit User Modification
  const handleSaveUserChanges = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    await onAdminUpdateUser(editingUser.id, {
      role: newRole,
      status: newStatus,
      newPassword: newPassword || undefined
    });
    setEditingUser(null);
    setNewPassword('');
  };

  // Filtered users for User Management tab
  const filteredUsers = users.filter(u => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q) ||
      u.organization?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q) ||
      u.district?.toLowerCase().includes(q)
    );
  });

  // Filtered products for Moderation tab
  const filteredProducts = products.filter(p => {
    if (!productSearch) return true;
    const q = productSearch.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.fpoName?.toLowerCase().includes(q) ||
      p.district?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-emerald-500 text-slate-950 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Platform Trust, Safety & Operations Command Center
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Admin Verification & Escrow Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Governing entity onboarding, managing registered accounts, quarantining non-compliant commodities, and auditing the live database and Escrow ledger.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-800 p-1.5 rounded-2xl flex-wrap">
          <button
            onClick={() => setActiveTab('kyc')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'kyc' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>KYC Queue</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'users' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Manage Accounts ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'products' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Catalog & Quarantine ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'database' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database Controls</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'ledger' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Escrow Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('districts')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'districts' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>11 Districts</span>
          </button>
        </div>
      </div>

      {/* Top Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Platform GMV</span>
          <div className="text-2xl font-extrabold text-slate-900 font-sans">
            ₹{(stats?.totalGMV || 510000).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Fulfilled & Active marketplace trades</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Commission Revenue (2.5%)</span>
          <div className="text-2xl font-extrabold text-amber-600 font-sans">
            ₹{(stats?.totalCommissionRevenue || 12750).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">Automated platform take rate</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Escrow Liabilities</span>
          <div className="text-2xl font-extrabold text-blue-700 font-sans">
            ₹{(stats?.activeEscrowAmount || 210000).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-blue-800 font-medium">Secured in neutral escrow vault</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Enterprises</span>
          <div className="text-2xl font-extrabold text-emerald-800 font-sans">
            {users.length} Entities
          </div>
          <span className="text-[11px] text-slate-500">{users.filter(u => u.isVerified).length} verified KYC compliance passes</span>
        </div>
      </div>

      {/* MODAL: QUARANTINE PRODUCT */}
      {quarantiningProd && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-red-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 text-red-600 font-extrabold">
              <AlertOctagon className="w-5 h-5" />
              <span>Quarantine Commodity Listing</span>
            </div>
            <p className="text-xs text-slate-600">
              Quarantining "<strong>{quarantiningProd.name}</strong>" will immediately hide it from the public marketplace and alert the producer to address compliance issues.
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Quarantine</label>
              <textarea
                rows={3}
                value={quarantineReason}
                onChange={(e) => setQuarantineReason(e.target.value)}
                placeholder="Specify the reason (e.g. Suspected fake GI Tag, organic claim audit, price anomaly)..."
                className="w-full p-2.5 text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setQuarantiningProd(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmQuarantine}
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition"
              >
                Confirm Quarantine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT USER & ACCOUNT CONTROLS */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveUserChanges} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
                <Users className="w-5 h-5 text-emerald-700" />
                <span>Manage User Account: {editingUser.name}</span>
              </div>
              <button type="button" onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assign User Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full p-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl"
              >
                <option value="farmer">Farmer / FPO Producer</option>
                <option value="buyer">Wholesale Buyer</option>
                <option value="admin">Platform Administrator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Account Security Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full p-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl"
              >
                <option value="active">Active (Good Standing)</option>
                <option value="suspended">Suspended (Access Blocked)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Force Password Reset (Leave blank to keep unchanged)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New temporary password (Min 8 chars)"
                className="w-full p-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-md transition"
              >
                Save Account Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 1: KYC VERIFICATION QUEUE */}
      {activeTab === 'kyc' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-700" />
              <span>Entity Onboarding & KYC Verification Queue</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Checking FPO Registrations, Trade Licenses & Aadhaar/GSTIN
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                  <th className="pb-3">Organization / Entity</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">District / Region</th>
                  <th className="pb-3">Verification Doc Reference</th>
                  <th className="pb-3">KYC Status</th>
                  <th className="pb-3 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5">
                      <div className="font-extrabold text-slate-900">{user.name}</div>
                      <div className="text-[11px] text-slate-500">{user.organization} ({user.phone})</div>
                    </td>

                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        user.role === 'farmer' ? 'bg-emerald-100 text-emerald-800' :
                        user.role === 'buyer' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="py-3.5 font-medium text-slate-700">
                      {user.district}
                    </td>

                    <td className="py-3.5 font-mono text-[11px] text-slate-600">
                      {user.verificationDoc || 'Pending Upload'}
                    </td>

                    <td className="py-3.5">
                      {user.isVerified ? (
                        <span className="flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approved & Verified</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600 font-bold text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Pending Document Review</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 text-right">
                      {!user.isVerified ? (
                        <button
                          onClick={() => onVerifyUser(user.id)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition shadow-xs"
                        >
                          Verify & Approve
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-semibold">Active In Good Standing</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE ACCOUNTS (EXPANDED CONTROLS) */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" />
                <span>Account Directory & Administrative Controls ({filteredUsers.length})</span>
              </h3>
              <p className="text-xs text-slate-500">Manage user roles, toggle account suspensions, reset credentials, and audit registration logs.</p>
            </div>

            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user, phone, role, district..."
                className="pl-9 pr-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                  <th className="pb-3">User & Organization</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Contact & Email</th>
                  <th className="pb-3">District</th>
                  <th className="pb-3">Account Status</th>
                  <th className="pb-3 text-right">Account Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5">
                      <div className="font-extrabold text-slate-900">{u.name}</div>
                      <div className="text-[11px] text-slate-500">{u.organization || 'Independent Operator'}</div>
                    </td>

                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        u.role === 'farmer' ? 'bg-emerald-100 text-emerald-800' :
                        u.role === 'buyer' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <div className="font-medium text-slate-800">{u.phone}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>

                    <td className="py-3.5 font-medium text-slate-700">
                      {u.district || 'Mizoram'}
                    </td>

                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        u.status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-800'
                      }`}>
                        {u.status === 'suspended' ? 'Suspended' : 'Active'}
                      </span>
                    </td>

                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingUser(u);
                            setNewRole(u.role);
                            setNewStatus(u.status || 'active');
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition"
                        >
                          Edit Account
                        </button>

                        {u.role !== 'admin' && (
                          <button
                            onClick={() => onAdminUpdateUser(u.id, { status: u.status === 'suspended' ? 'active' : 'suspended' })}
                            className={`p-1.5 rounded-lg text-xs font-bold transition ${
                              u.status === 'suspended' ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'
                            }`}
                            title={u.status === 'suspended' ? 'Reactivate Account' : 'Suspend Account'}
                          >
                            {u.status === 'suspended' ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CATALOG MODERATION & QUARANTINE ENGINE */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-700" />
                <span>Marketplace Catalog Moderation & Post Quarantine ({filteredProducts.length})</span>
              </h3>
              <p className="text-xs text-slate-500">
                Audit commodity quality specs, GI authentications, and immediately quarantine posts suspected of non-compliance.
              </p>
            </div>

            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search commodity, producer, district..."
                className="pl-9 pr-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                  <th className="pb-3">Commodity</th>
                  <th className="pb-3">Producer FPO</th>
                  <th className="pb-3">Farm-Gate Rate</th>
                  <th className="pb-3">Stock & MOQ</th>
                  <th className="pb-3">Moderation State</th>
                  <th className="pb-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const isQuarantined = p.moderationStatus === 'quarantined';
                  return (
                    <tr key={p.id} className={`transition ${isQuarantined ? 'bg-red-50/50' : 'hover:bg-slate-50'}`}>
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=150&q=80'} 
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-extrabold text-slate-900 line-clamp-1 max-w-[200px]" title={p.name}>
                              {p.name}
                            </div>
                            <div className="text-[11px] text-slate-400 capitalize">{p.category} • {p.district}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 font-bold text-slate-800">
                        {p.fpoName}
                      </td>

                      <td className="py-3.5 font-mono font-extrabold text-emerald-900">
                        ₹{p.pricePerUnit?.toLocaleString('en-IN')}/{p.unit}
                      </td>

                      <td className="py-3.5">
                        <div className="font-bold text-slate-800">{p.availableStock} {p.unit}</div>
                        <div className="text-[11px] text-slate-400">MOQ: {p.minOrderQty} {p.unit}</div>
                      </td>

                      <td className="py-3.5">
                        {isQuarantined ? (
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1 w-fit">
                              <ShieldAlert className="w-3 h-3 text-red-600" />
                              <span>QUARANTINED</span>
                            </span>
                            <span className="block text-[10px] text-red-600 max-w-[180px] truncate" title={p.quarantineReason}>
                              {p.quarantineReason || 'Compliance audit in progress'}
                            </span>
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Approved & Active</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isQuarantined ? (
                            <button
                              onClick={() => onQuarantineProduct(p.id, 'approved', null)}
                              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition shadow-2xs"
                              title="Release from quarantine back to marketplace"
                            >
                              Release Post
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setQuarantiningProd(p);
                                setQuarantineReason('Pesticide residue / GI certification audit');
                              }}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold transition shadow-2xs"
                              title="Quarantine this product from buyers"
                            >
                              Quarantine
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (window.confirm(`Permanently delist and delete commodity "${p.name}"?`)) {
                                onDelistProduct(p.id);
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DATABASE MANAGEMENT & GOVERNANCE CONTROLS */}
      {activeTab === 'database' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-700" />
                <span>Database Health, Backups & Governance Controls</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Monitor system document registers, active memory consumption, export database backups, or reset to baseline seed state.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchDbMetrics}
                disabled={dbLoading}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${dbLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Metrics</span>
              </button>

              <button
                onClick={handleExportDatabase}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span>Export Backup (JSON)</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm("CAUTION: Are you sure you want to reset the database to original seed data? This will clear newly registered test accounts and orders.")) {
                    onResetDatabase();
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Database to Seed</span>
              </button>
            </div>
          </div>

          {/* Database Live Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Product Records</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{products.length}</div>
              <span className="text-[10px] text-red-600 font-semibold">
                {products.filter(p => p.moderationStatus === 'quarantined').length} Quarantined
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Registered Users</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{users.length}</div>
              <span className="text-[10px] text-emerald-600 font-semibold">
                {users.filter(u => u.isVerified).length} Verified
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Active Orders & Escrows</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{orders.length}</div>
              <span className="text-[10px] text-blue-600 font-semibold">
                {orders.filter(o => o.status === 'Settled').length} Settled
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Memory Footprint</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {dbMetrics?.memoryUsageMB?.rss || 48} MB
              </div>
              <span className="text-[10px] text-green-600 font-semibold">State: Optimal</span>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
            <Database className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950">
              <span className="font-bold block">Production Database Safety Guidelines</span>
              All database records (products, users, orders, and RFQs) maintain transactional integrity. Exporting regular JSON backups guarantees zero data loss during cloud infrastructure migrations or Render zero-downtime updates.
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ESCROW LEDGER AUDIT */}
      {activeTab === 'ledger' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-700" />
              <span>Escrow Contract Ledger & Dispute Oversight</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Zero Intermediary Leakage • Guaranteed Farm-Gate Settlement
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                  <th className="pb-3">PO Reference</th>
                  <th className="pb-3">Buyer ➔ Producer</th>
                  <th className="pb-3">Contract Value</th>
                  <th className="pb-3">Platform Fee (2.5%)</th>
                  <th className="pb-3">Net Farm Payout</th>
                  <th className="pb-3">Current Escrow Phase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 font-mono font-bold text-slate-900">
                      {order.id}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {order.productName} ({order.quantity} {order.unit})
                      </span>
                    </td>

                    <td className="py-3.5">
                      <div className="font-bold text-slate-800">{order.buyerName}</div>
                      <div className="text-[11px] text-emerald-800 font-medium">➔ {order.sellerName}</div>
                    </td>

                    <td className="py-3.5 font-mono font-bold text-slate-900">
                      ₹{order.totalCommodityAmount?.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 font-mono font-bold text-amber-600">
                      ₹{order.platformFeeAmount?.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 font-mono font-extrabold text-emerald-900">
                      ₹{order.netPayableToSeller?.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        order.status === 'Settled' ? 'bg-green-100 text-green-800' :
                        order.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Escrow_Paid' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: 11 DISTRICTS REGIONAL ANALYTICS */}
      {activeTab === 'districts' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-700" />
              <span>Mizoram 11-District Regional Production & Capacity Overview</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Real-time monitoring of agricultural producer unions and handicraft collectives across the State of Mizoram.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Champhai', crop: "Bird's Eye Chilli, Grapes, Rice", fpos: 6, gmv: '₹18,40,000' },
              { name: 'Kolasib', crop: 'High-Oleoresin Ginger, Areca Nut, Turmeric', fpos: 5, gmv: '₹14,20,000' },
              { name: 'Serchhip', crop: 'Lakadong High-Curcumin Turmeric, Cabbage', fpos: 4, gmv: '₹9,80,000' },
              { name: 'Aizawl', crop: 'Handicrafts, Bamboo Artifacts, Anthurium Flowers', fpos: 7, gmv: '₹12,10,000' },
              { name: 'Lunglei', crop: 'Organic Black Pepper, Cinnamon, Coffee', fpos: 3, gmv: '₹7,50,000' },
              { name: 'Mamit', crop: 'Hatkora Wild Citrus, Bamboo Shoots, Rubber', fpos: 4, gmv: '₹6,90,000' },
              { name: 'Lawngtlai', crop: 'Cardamom, Forest Wild Honey, Silk Weaves', fpos: 2, gmv: '₹4,10,000' },
              { name: 'Siaha', crop: 'Sesame, Traditional Cotton Yarn Fabrics', fpos: 2, gmv: '₹3,60,000' },
              { name: 'Saitual', crop: 'Organic Tea, Ginger, Mustard Greens', fpos: 3, gmv: '₹4,80,000' },
              { name: 'Khawzawl', crop: 'Highland Garlic, Mizo Red Maize', fpos: 2, gmv: '₹3,20,000' },
              { name: 'Hnahthial', crop: 'Citrus (Mandarin Orange), Bamboo Mats', fpos: 2, gmv: '₹2,90,000' }
            ].map((d, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 hover:bg-emerald-50/50 transition">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{d.name}</span>
                  </span>
                  <span className="font-mono font-bold text-xs text-emerald-900">{d.gmv}</span>
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  {d.crop}
                </div>
                <div className="text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-200">
                  {d.fpos} Verified Producer Cooperatives
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
