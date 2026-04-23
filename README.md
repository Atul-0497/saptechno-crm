# Saptechno CRM

Saptechno CRM is a `Next.js 16` App Router project for CRM and master-data operations. It includes a premium dashboard UI, configurable layout system, reusable form/table building blocks, API-backed master modules, and browser-storage-backed commercial modules such as Quotes and Purchase Orders.

This README is intended to help a developer understand the current project structure quickly before adding new modules or modifying existing ones.

## Stack

- `Next.js 16.2.3` with App Router
- `React 19`
- `TypeScript`
- `Tailwind CSS v4`
- `React Query` for server-backed master data
- `React Hook Form` + `Zod` for forms and validation
- `next-themes` for theme switching
- `lucide-react` for icons
- `react-hot-toast` for notifications

## Run Locally

Install dependencies and start the dev server:

```bash
npm install
cmd /c npm run dev
```

Open `http://localhost:3000`.

Available scripts:

```bash
cmd /c npm run dev
cmd /c npm run build
cmd /c npm run start
cmd /c npm run lint
```

Note:
- PowerShell script execution may block `npm.ps1` on some Windows setups, so `cmd /c npm ...` is often safer.
- After changing `next.config.ts`, restart the dev server.

## Project Purpose

The app currently serves two broad categories of functionality:

1. Master data management
2. CRM or operational feature pages

Master data modules are the most complete and consistent part of the codebase. They follow a common pattern for:

- listing records
- adding records
- editing records
- deleting records
- validating forms
- talking to the backend through `/api`

On top of that, the project now includes:

- `QuotesMaster`
- `PurchaseorderMaster`

These two modules currently persist data in `localStorage` instead of the backend API.

## High-Level Architecture

### 1. App Router layout

The root layout lives in [app/layout.tsx](/d:/NextJS%20Projects/saptechno-crm/app/layout.tsx:1).

It wraps the entire app with:

- `ThemeProvider`
- `CustomizationProvider`
- `ReactQueryProvider`
- `MobileMenuProvider`
- `MainLayout`

The visible shell is rendered by [MainLayout.tsx](/d:/NextJS%20Projects/saptechno-crm/app/components/layout/MainLayout.tsx:1), which combines:

- `Sidebar`
- `Topbar`
- a scrolling main content area
- a global toast container

### 2. Route groups

The project uses App Router route groups:

- `app/(auth)` for auth-related pages
- `app/(Masters)` for master modules

Because route groups are organizational only, `(Masters)` does not appear in the browser URL. Example:

- file path: `app/(Masters)/QuotesMaster/page.tsx`
- route: `/QuotesMaster`

### 3. Navigation

Navigation is centralized in [app/constants/navigation.ts](/d:/NextJS%20Projects/saptechno-crm/app/constants/navigation.ts:1).

Important exports:

- `TOP_NAV_ITEMS`
- `NAV_SECTIONS`

Both `Sidebar.tsx` and `Topbar.tsx` read from this shared config. If you want to add, move, or rename a menu item, start there instead of hardcoding links in layout components.

## Folder Guide

### `app/(Masters)`

Contains the main CRUD modules:

- `CompanyMaster`
- `DepartmentMaster`
- `DesignationMaster`
- `EmployeesMaster`
- `VendorMaster`
- `DealerMaster`
- `LeadSourcemaster`
- `IndustryMaster`
- `Productmaster`
- `Location`
- `QuotesMaster`
- `PurchaseorderMaster`

Most of these have:

- `page.tsx` for listing
- `add/page.tsx`
- `edit/[id]/page.tsx`
- `components/` for module-specific form/table/modal UI

### `app/components`

Shared UI and layout building blocks:

- `layout/` for sidebar, topbar, main shell, and customization drawer
- `forms/` for reusable form engine and form blocks
- `tables/` for reusable table helpers
- `providers/` for theme wrapper
- `search/` for global search-related UI

### `app/hooks`

Main data-access and client-state hooks:

- [useMasters.ts](/d:/NextJS%20Projects/saptechno-crm/app/hooks/useMasters.ts:1)
- [useQuotes.ts](/d:/NextJS%20Projects/saptechno-crm/app/hooks/useQuotes.ts:1)
- [usePurchaseOrders.ts](/d:/NextJS%20Projects/saptechno-crm/app/hooks/usePurchaseOrders.ts:1)

### `app/lib`

Contains:

- API client logic
- validation schemas
- other utility logic

Most important files:

- [app/lib/api/masters/masters.ts](/d:/NextJS%20Projects/saptechno-crm/app/lib/api/masters/masters.ts:1)
- [app/lib/validations/masterSchemas.ts](/d:/NextJS%20Projects/saptechno-crm/app/lib/validations/masterSchemas.ts:1)

### `app/types`

Type definitions for:

- master records
- quote records
- purchase order records
- layout types

### `app/api`

The API route lives at [app/api/route.ts](/d:/NextJS%20Projects/saptechno-crm/app/api/route.ts:1).

It proxies requests to:

`http://saptechno-001-site17.anytempurl.com/api/CRMAPI/MagicSearch`

This means the frontend talks to `/api`, and the Next server forwards the request to the external CRM backend.

## Data Flow Patterns

There are currently two different data patterns in this repo.

### Pattern A: Backend-backed master modules

Used by modules like:

- Company
- Department
- Designation
- Employee
- Vendor
- Dealer
- Product
- Lead Source
- Industry
- Country
- State
- City
- Pincode

Flow:

1. UI page uses a hook from `useMasters.ts`
2. Hook uses `React Query`
3. Hook calls `mastersAPI`
4. `mastersAPI` posts to `/api`
5. `/api` forwards to the external backend

This is the main “real” data pipeline in the app today.

### Pattern B: Browser-storage-backed feature modules

Used by:

- `QuotesMaster`
- `PurchaseorderMaster`

Flow:

1. Page uses `useQuotes()` or `usePurchaseOrders()`
2. Hook reads and writes from `window.localStorage`
3. Data is not sent to the backend yet

This makes these modules fast to prototype, but also means:

- data is browser-local
- data will not sync across devices
- data can be cleared by browser storage reset

## Reusable UI Systems

### Universal Form System

The reusable form engine is [app/components/forms/UniversalForm.tsx](/d:/NextJS%20Projects/saptechno-crm/app/components/forms/UniversalForm.tsx:1).

It accepts:

- `sections`
- a `zod` schema
- submit/cancel handlers
- optional external `react-hook-form` instance

This gives the project a consistent add/edit page design.

### Universal Form Blocks

[app/components/forms/UniversalFormBlocks.tsx](/d:/NextJS%20Projects/saptechno-crm/app/components/forms/UniversalFormBlocks.tsx:1) contains reusable complex sections:

- `UniversalAddressSection`
- `UniversalQuotedItemsSection`

These are currently used by:

- `QuotesMaster`
- `PurchaseorderMaster`

### Navigation and layout state

Layout customization is managed in [app/contexts/CustomizationContext.tsx](/d:/NextJS%20Projects/saptechno-crm/app/contexts/CustomizationContext.tsx:1).

It stores the following in `localStorage`:

- accent color
- density
- layout mode (`sidebar` or `topnav`)

## Current Modules

### Dashboard

[app/dashboard/page.tsx](/d:/NextJS%20Projects/saptechno-crm/app/dashboard/page.tsx:1) is a UI-focused overview page with stat cards and charts.

### Auth

The project contains:

- `app/(auth)/login`
- `app/(auth)/register`

These folders exist, but authentication enforcement is not deeply wired into the rest of the app yet from the code reviewed here.

### Master Modules

The following follow the standard CRUD pattern and use the backend API:

- Company
- Department
- Designation
- Employee
- Vendor
- Dealer
- Product
- Lead Source
- Industry
- Location hierarchy:
  - Country
  - State
  - City
  - Pincode

### Quotes

Route:

- `/QuotesMaster`

Key files:

- [app/(Masters)/QuotesMaster/page.tsx](/d:/NextJS%20Projects/saptechno-crm/app/(Masters)/QuotesMaster/page.tsx:1)
- [app/(Masters)/QuotesMaster/add/page.tsx](/d:/NextJS%20Projects/saptechno-crm/app/(Masters)/QuotesMaster/add/page.tsx:1)
- [app/(Masters)/QuotesMaster/edit/[id]/page.tsx](/d:/NextJS%20Projects/saptechno-crm/app/(Masters)/QuotesMaster/edit/[id]/page.tsx:1)
- [app/hooks/useQuotes.ts](/d:/NextJS%20Projects/saptechno-crm/app/hooks/useQuotes.ts:1)
- [app/types/quote.ts](/d:/NextJS%20Projects/saptechno-crm/app/types/quote.ts:1)

Summary:

- quote list page
- create/edit flow
- vendor selection
- billing and shipping sections
- line-item table
- totals calculation
- localStorage persistence

### Purchase Orders

Route:

- `/PurchaseorderMaster`

Key files:

- [app/(Masters)/PurchaseorderMaster/page.tsx](/d:/NextJS%20Projects/saptechno-crm/app/(Masters)/PurchaseorderMaster/page.tsx:1)
- [app/(Masters)/PurchaseorderMaster/add/page.tsx](/d:/NextJS%20Projects/saptechno-crm/app/(Masters)/PurchaseorderMaster/add/page.tsx:1)
- [app/(Masters)/PurchaseorderMaster/edit/[id]/page.tsx](/d:/NextJS%20Projects/saptechno-crm/app/(Masters)/PurchaseorderMaster/edit/[id]/page.tsx:1)
- [app/(Masters)/PurchaseorderMaster/components/PurchaseOrderForm.tsx](/d:/NextJS%20Projects/saptechno-crm/app/(Masters)/PurchaseorderMaster/components/PurchaseOrderForm.tsx:1)
- [app/hooks/usePurchaseOrders.ts](/d:/NextJS%20Projects/saptechno-crm/app/hooks/usePurchaseOrders.ts:1)
- [app/types/purchaseOrder.ts](/d:/NextJS%20Projects/saptechno-crm/app/types/purchaseOrder.ts:1)

Summary:

- purchase order list page
- create/edit flow
- vendor selection
- purchase metadata like purchase number, reference number, payment terms, and expected delivery date
- address sections
- ordered-item grid
- totals calculation
- localStorage persistence

## Validation

Validation is centralized in [app/lib/validations/masterSchemas.ts](/d:/NextJS%20Projects/saptechno-crm/app/lib/validations/masterSchemas.ts:1).

This file contains:

- master module schemas
- `QuoteSchema`
- `PurchaseOrderSchema`

When adding a new module, the current project pattern is:

1. define the `zod` schema
2. export the inferred form type
3. build the form with `react-hook-form`
4. connect to either:
   - `useMasters.ts` + backend API, or
   - a dedicated localStorage hook

## Database Notes

The file [schema.sql](/d:/NextJS%20Projects/saptechno-crm/schema.sql:1) documents the intended SQL Server schema for the core master tables.

It currently covers the backend-oriented master entities such as:

- Company
- Department
- Designation
- Employee
- Vendor
- Product
- Dealer
- Lead Source
- Industry
- Country
- State
- City

Quotes and Purchase Orders are not yet represented in this SQL file.

## Important Routing Notes

The project includes redirects in [next.config.ts](/d:/NextJS%20Projects/saptechno-crm/next.config.ts:1) for legacy paths:

- `/quotes` -> `/QuotesMaster`
- `/quotes/add` -> `/QuotesMaster/add`
- `/quotes/edit/:id` -> `/QuotesMaster/edit/:id`
- `/purchase-orders` -> `/PurchaseorderMaster`
- `/purchase-orders/add` -> `/PurchaseorderMaster/add`
- `/purchase-orders/edit/:id` -> `/PurchaseorderMaster/edit/:id`

If you change route names again, update both:

- `app/constants/navigation.ts`
- `next.config.ts`

## How To Add A New CRUD Module

Recommended approach for a new master-style module:

1. Create a route folder under `app/(Masters)/NewModule`
2. Add `page.tsx`, `add/page.tsx`, and `edit/[id]/page.tsx`
3. Add module-specific `components/`
4. Add types in `app/types`
5. Add a schema in `app/lib/validations/masterSchemas.ts`
6. Add hook logic in `app/hooks`
7. If backend-backed, extend `app/lib/api/masters/masters.ts`
8. Add the navigation entry in `app/constants/navigation.ts`
9. If renaming routes, add redirects in `next.config.ts`

## Known Architecture Gaps

These are useful to know before expanding the project:

- Quotes and Purchase Orders are not backend-backed yet
- Some non-master routes in the nav still look like placeholders
- There are mixed naming styles such as `Productmaster`, `LeadSourcemaster`, and `PurchaseorderMaster`
- The `/api` route is a single proxy endpoint, so backend operation names are encoded in request payloads
- Auth exists as route structure but is not fully integrated across the app shell

## Recommended Next Improvements

- Move Quotes and Purchase Orders from `localStorage` to the backend API
- Normalize route naming conventions
- Add module-level documentation files in complex features
- Add tests for forms, hooks, and route flows
- Split the single `masters.ts` API file into smaller feature-based API files as the project grows

## Quick Reference

If you are changing:

- navigation: edit `app/constants/navigation.ts`
- backend master requests: edit `app/lib/api/masters/masters.ts`
- master data hooks: edit `app/hooks/useMasters.ts`
- shared form engine: edit `app/components/forms/UniversalForm.tsx`
- shared address/item blocks: edit `app/components/forms/UniversalFormBlocks.tsx`
- route redirects: edit `next.config.ts`
- master table schema reference: edit `schema.sql`

## Summary

This project is best understood as a CRM admin application with:

- a shared premium UI shell
- reusable CRUD patterns
- backend-backed master modules
- local prototype modules for Quotes and Purchase Orders

If you keep new work aligned with the existing route, hook, validation, and shared-form patterns, the codebase stays much easier to maintain.
