# finalruchibazzar

# Ruchi Bazaar - Complete Hyperlocal Food & Grocery Delivery Platform

A full-stack monorepo featuring customer storefront, partner portals, super administration dashboard, and a robust Express/Sequelize API.

## Monorepo Architecture

- **`ruchi`**: Customer-facing Next.js 16 (React 19, Tailwind CSS) web application with full SEO optimization, JSON-LD schemas, sitemap, robots, and 14 comprehensive policy pages.
- **`admin`**: Restaurant & Merchant Partner Next.js 16 Dashboard for live order management, menu customization, earnings tracking, and compliance.
- **`delivery`**: Delivery Fleet & Rider Partner Next.js 16 Dashboard for active order tracking, earnings, milestone incentives, and rider policies.
- **`mainadmin`**: SuperAdmin Next.js 16 Enterprise Management Console for vendor approvals, customer care, finance/GST, service zones, and platform oversight.
- **`ruchi-backend`**: Node.js & Express 5 API powered by Sequelize ORM, MySQL, JWT authentication, and Socket.io real-time order tracking.

## Getting Started

### 1. Backend Setup
```bash
cd ruchi-backend
npm install
npm run dev # or npm start
```

### 2. Customer Application
```bash
cd ruchi
npm install
npm run dev # Runs on http://localhost:3000
```

### 3. Restaurant Partner Portal
```bash
cd admin
npm install
npm run dev # Runs on http://localhost:3001
```

### 4. Delivery Partner Portal
```bash
cd delivery
npm install
npm run dev # Runs on http://localhost:3002
```

### 5. SuperAdmin Console
```bash
cd mainadmin
npm install
npm run dev # Runs on http://localhost:3005
```

## Features & Compliance
- **SEO Ready**: Dynamic OpenGraph, Twitter cards, sitemap.xml, robots.txt, and Google Sitelinks SearchBox.
- **Consumer Protection**: Multi-tier grievance redressal mechanism compliant with Consumer Protection (E-Commerce) Rules 2020.
- **Food Safety**: FSSAI verification and tamper-evident packaging policies.
