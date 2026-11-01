# ZOHARVEST | Mizoram B2B Agri & Craft Wholesale Digital Marketplace

> **"Bridging Mizoram's Grassroots Farmers, Artisans & FPOs Directly with Bulk National Wholesale Buyers."**  
> Eliminating commission agents (middlemen) • 0% Intermediary Markup • Razorpay-Protected Escrow • Bilingual Localization (English & Mizo)

---

## 🌾 Project Overview

**ZOHARVEST** is a business-to-business (B2B) digital marketplace engineered specifically to connect local farmers, artisans, and Farmer Producer Organizations (FPOs) across all 11 districts of Mizoram directly with bulk wholesale buyers across regional and national markets. Functioning similarly to platforms like IndiaMART, it digitizes regional wholesale supply chains, eliminating commission agents (middlemen) to maximize net profit margins for grassroots producers while serving as both an academic benchmark prototype and a commercial-ready startup.

### Dual-Purpose Scope
- **Academic Benchmark Prototype:** Demonstrates end-to-end full-stack software engineering with React, Tailwind CSS, Node.js Express REST API, a state-driven RFQ Negotiation Engine, simulated Razorpay Escrow Ledger, and bilingual i18n support.
- **Commercial Startup Grant Readiness:** Engineered to qualify for seed grants ranging from **₹2 Lakhs to ₹10 Lakhs** under the **Mizoram EDIC (Entrepreneurship Development & Innovation Scheme)** and **Startup India Seed Fund Scheme (SISFS)**.

---

## 💎 Core Value Propositions

### For Farmers & Artisans (FPOs)
1. **Direct Market Access:** Direct connectivity to verified wholesale buyers across diverse national commercial hubs without intermediary exploitation.
2. **Fair Pricing via RFQ Engine:** Facilitates transparent, real-time bulk price negotiations through a built-in Request for Quotation (RFQ) module.
3. **Advance Harvest Pre-Orders:** Allows producers to publish future harvest schedules and lock in bulk buyers before crop maturity.
4. **Guaranteed Escrow Payouts:** Protects producers against default and non-payment risks by holding buyer funds in neutral escrow prior to dispatch.

### For Wholesale Buyers
1. **Verified Regional Sourcing:** Direct procurement pipeline for authentic regional specialties, such as GI-Tagged Mizo Chilli, Organic Ginger, High-Curcumin Turmeric, and handcrafted bamboo goods.
2. **Catalog Transparency:** Real-time visibility into inventory volumes, harvest timelines, and quality grading (Grade A/B).
3. **Custom Volume Bidding:** Capability to tender targeted volume orders and specific unit-price bids via the RFQ interface.
4. **Secure Buyer Protection:** Escrow architecture ensures that committed funds are released only after physical delivery verification and quality inspection.

---

## 🏗️ System Architecture & Technical Stack

```
+-----------------------------------------------------------------------+
|                           FRONTEND LAYER                              |
|   React.js 18  •  Tailwind CSS  •  Mobile-First Responsive UI         |
|         Bilingual Support (English & Mizo)  •  PWA / Web App          |
+-----------------------------------------------------------------------+
                                   │
                                   ▼ REST APIs
+-----------------------------------------------------------------------+
|                           BACKEND & DATA                              |
|        Node.js (Express) Runtime  •  PostgreSQL / In-Memory Store     |
|       RFQ Negotiation Engine  •  Session & Access Control Layer       |
+-----------------------------------------------------------------------+
                                   │
                                   ▼ External Services
+-----------------------------------------------------------------------+
|                         INTEGRATIONS LAYER                            |
|    Razorpay / UPI Gateway  •  Escrow API  •  SMS & WhatsApp Alerts    |
+-----------------------------------------------------------------------+
```

- **Frontend:** Built with React 18 and Tailwind CSS, featuring an Emerald Green (`#047857`) and Amber Gold (`#f59e0b`) visual palette, responsive layout, dynamic currency formatters, and printable PO generation.
- **Localization:** Complete English and Mizo dictionary (`src/i18n/translations.js`) togglable with one click.
- **Backend:** Node.js Express REST API (`server/index.js`) managing products, negotiation queues, escrow ledgers, and notifications.
- **Escrow Ledger & Payments:** Automated escrow contract simulation hooked with Razorpay/UPI webhooks.
- **Alerts:** Automated SMS & WhatsApp push notification tray.

---

## 🔄 User Journey & Workflow Lifecycle

```
[ Step 1: Onboarding ] ──▶ [ Step 2: Catalog & RFQ ] ──▶ [ Step 3: Escrow Checkout ] ──▶ [ Step 4: Dispatch & Settlement ]
  • Phone OTP                • Producers post MOQs       • PO Generated               • Goods shipped with tracking
  • Admin doc verification   • Advance harvest dates     • Funds held in escrow       • Verification triggers
                             • Buyers submit bids          (Razorpay Vault)             payout to seller bank
```

1. **Onboarding & Verification:** Users register via phone OTP; platform compliance officers approve FPO certificates and trade licenses.
2. **Catalog & RFQ Negotiation:** Producers list commodities with MOQs and harvest schedules. Buyers submit custom RFQ tenders specifying target quantity, unit price, delivery date, and shipping destination.
3. **Escrow Checkout:** Once a quotation is agreed, a formal Purchase Order (PO) is generated. The buyer deposits funds into the secure Razorpay escrow vault.
4. **Dispatch, Verification & Settlement:** The producer ships the consignment and inputs logistics tracking. Upon arrival, the buyer inspects quality (1-5 stars) and confirms release; escrow engine transfers net funds directly to the farmer's registered bank account (minus 2.5% platform commission).

---

## 🗺️ Authentic Mizoram Commodities & 11 Districts

| District | Featured Commodity | Quality Grade | Farm-Gate Rate |
|---|---|---|---|
| **Champhai** | GI-Tagged Mizo Chilli (*Bird's Eye / Hmarchate*) | Grade A Sun-Dried | ₹780 / kg |
| **Kolasib** | Organic Fresh Ginger (*High Oleoresin*) | Grade A Cured | ₹6,400 / quintal |
| **Serchhip** | High-Curcumin Turmeric (*Aieng - 7.2% Curcumin*) | Grade A Polished | ₹14,200 / quintal |
| **Champhai** | Indigenous Red Sticky Rice (*Buhsen / Buhban*) | Grade A Semi-Polished | ₹8,200 / quintal |
| **Mamit** | Wild Hatkora Citrus (*Citrus Macroptera*) | Grade A Hand-Picked | ₹1,450 / crate |
| **Khawzawl** | Handcrafted Bamboo Baskets (*Paikawv & Thlangra*) | Grade A Smoked | ₹340 / piece |
| **Lunglei** | High-Tensile Hill Broom Grass (*Hmunphiah*) | Grade A 110cm+ | ₹8,900 / quintal |
| **Aizawl** | Export Polyhouse Anthurium Cut Stems | Grade A (45cm+) | ₹2,200 / box |

---

## 💼 Business & Revenue Model

| Revenue Channel | Mechanism | Target Segment |
|---|---|---|
| **Transaction Commissions** | **2% to 5%** take rate per completed bulk consignment | All fulfilled marketplace trades |
| **B2B Subscriptions** | ₹1,999 to ₹4,999/mo tiered membership for priority RFQs & analytics | High-volume Buyers & FPO federations |
| **Promoted Listings** | ₹499 to ₹1,499/lot for top catalog placement & featured banners | Sellers seeking rapid volume liquidation |

---

## 🚀 Quick Start Guide

### 1. Start the Production Server (Full-Stack Unified)
Runs both the REST API and the responsive web client on port `5000`:
```bash
npm start
```
Open your browser at: **`http://localhost:5000`**

### 2. Development Mode
To run with live hot reloading:
```bash
# Terminal 1: Backend API
npm run dev:server

# Terminal 2: Vite Frontend with API Proxy
npm run dev:client
```
Client runs at `http://localhost:3000`, proxying `/api` requests to `http://localhost:5000`.

---

## 👥 Role Switcher Demo
Use the top-right header dropdown to toggle between interactive user profiles:
- **👨‍🌾 Farmer / FPO Producer:** *Champhai High-Altitude Organic FPO* (Gross earnings, active escrow, dispatch action, publish new commodities).
- **🏢 Wholesale Buyer:** *Spices India Wholesale Corp* (Submit RFQs, deposit to escrow, inspect delivery, release payments).
- **🛡️ Platform Admin:** *ZOHARVEST Compliance & Operations* (Audit escrow ledger, approve KYC documents, analyze district volumes).
#   z o h a r v e s t  
 #   z o h a r v e s t  
 