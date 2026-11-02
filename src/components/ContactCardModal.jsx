import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  CreditCard, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Building,
  Globe,
  Instagram
} from 'lucide-react';

export default function ContactCardModal({ isOpen, onClose, profile }) {
  if (!isOpen || !profile) return null;

  const [copiedKey, setCopiedKey] = useState(null);

  const copyToClipboard = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Generate and download standard vCard (.vcf)
  const downloadVCard = () => {
    const vCardLines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${profile.name || profile.organization || 'ZOHARVEST Member'}`,
      `ORG:${profile.organization || 'Local Agricultural Collective'}`,
      `TITLE:ZOHARVEST Producer / Wholesale Member`,
      profile.phone ? `TEL;TYPE=CELL,VOICE:${profile.phone}` : '',
      profile.whatsapp ? `TEL;TYPE=WORK,MSG:${profile.whatsapp}` : '',
      profile.email ? `EMAIL;TYPE=PREF,INTERNET:${profile.email}` : '',
      `ADR;TYPE=WORK:;;${profile.district || 'Champhai'};Mizoram;;;India`,
      profile.socialLinks?.website ? `URL:${profile.socialLinks.website}` : '',
      `NOTE:Direct Agricultural Producer on ZOHARVEST B2B Exchange. UPI: ${profile.upiId || 'N/A'}`,
      'END:VCARD'
    ].filter(Boolean).join('\r\n');

    const blob = new Blob([vCardLines], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${(profile.name || 'contact').replace(/[^a-zA-Z0-9]/g, '_')}_ZOHARVEST.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const cleanPhone = (profile.whatsapp || profile.phone || '').replace(/[^0-9]/g, '');
  const shareText = `🌾 *ZOHARVEST Direct Producer Contact Card*\n*Name:* ${profile.name}\n*Organization:* ${profile.organization || 'Agricultural Collective'}\n*District:* ${profile.district || 'Champhai'}, Mizoram\n*Phone:* ${profile.phone || 'N/A'}\n*WhatsApp:* https://wa.me/${cleanPhone}\n*UPI ID:* ${profile.upiId || 'N/A'}\n*Exchange Profile:* ${window.location.origin}/#profile-${profile.id}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-400 text-slate-950 text-xs font-black">
              📇
            </span>
            <div>
              <h3 className="font-extrabold text-sm text-white">Direct Producer Contact Card</h3>
              <p className="text-[11px] text-emerald-200">Verified Direct Farm-Gate Member</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          
          {/* Card Showcase */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border-2 border-emerald-200 rounded-2xl p-5 space-y-4 shadow-sm relative">
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-amber-300 font-black text-2xl flex items-center justify-center shadow-md overflow-hidden shrink-0 border-2 border-white">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <span>👨‍🌾</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-base text-slate-900 truncate">
                    {profile.organization || profile.name}
                  </h4>
                  {profile.isVerified && (
                    <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0" />
                  )}
                </div>
                <div className="text-xs text-slate-600 font-medium">{profile.name}</div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-semibold mt-0.5">
                  <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                  <span>{profile.district} District, Mizoram</span>
                </div>
              </div>
            </div>

            {/* Direct Contact Fields */}
            <div className="space-y-2 text-xs pt-1 border-t border-emerald-200/60">
              {profile.phone && (
                <div className="flex items-center justify-between bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Mobile Number</span>
                      <a href={`tel:${profile.phone}`} className="font-bold text-slate-900 font-mono hover:underline">
                        {profile.phone}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(profile.phone, 'phone')}
                    className="p-1 rounded-md text-slate-400 hover:text-emerald-700 transition"
                  >
                    {copiedKey === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              {profile.whatsapp && (
                <div className="flex items-center justify-between bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">WhatsApp Chat</span>
                      <a 
                        href={`https://wa.me/${cleanPhone}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="font-bold text-emerald-800 hover:underline"
                      >
                        Chat Directly ➜
                      </a>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/${cleanPhone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-lg shadow-2xs"
                  >
                    Open
                  </a>
                </div>
              )}

              {profile.email && (
                <div className="flex items-center justify-between bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <div className="truncate">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Email</span>
                      <span className="font-semibold text-slate-800 truncate">{profile.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(profile.email, 'email')}
                    className="p-1 rounded-md text-slate-400 hover:text-emerald-700 transition shrink-0"
                  >
                    {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              {profile.upiId && (
                <div className="flex items-center justify-between bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Google Pay / UPI ID</span>
                      <span className="font-bold font-mono text-slate-900">{profile.upiId}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(profile.upiId, 'upi')}
                    className="p-1 rounded-md text-slate-400 hover:text-emerald-700 transition"
                  >
                    {copiedKey === 'upi' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              {/* Social Links if present */}
              {(profile.socialLinks?.instagram || profile.socialLinks?.website) && (
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  {profile.socialLinks.instagram && (
                    <a
                      href={`https://instagram.com/${profile.socialLinks.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pink-50 text-pink-900 border border-pink-200 text-[11px] font-bold"
                    >
                      <Instagram className="w-3 h-3 text-pink-600" />
                      <span>@{profile.socialLinks.instagram.replace('@', '')}</span>
                    </a>
                  )}
                  {profile.socialLinks.website && (
                    <a
                      href={profile.socialLinks.website.startsWith('http') ? profile.socialLinks.website : `https://${profile.socialLinks.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-[11px] font-bold"
                    >
                      <Globe className="w-3 h-3 text-slate-600" />
                      <span>Website</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={downloadVCard}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Save Contact to Phone (.vcf)</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold py-2 px-3 rounded-xl text-xs transition border border-emerald-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Share via WhatsApp</span>
              </a>

              <button
                onClick={() => copyToClipboard(shareText, 'shareAll')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-3 rounded-xl text-xs transition border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedKey === 'shareAll' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'shareAll' ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
