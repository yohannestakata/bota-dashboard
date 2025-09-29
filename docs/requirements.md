### Bota Review Admin Dashboard Requirements

This document defines the initial functional and non-functional requirements for the admin dashboard that manages the Bota Review platform.

The dashboard oversees data and workflows backed by Supabase Postgres with RLS, as used by the public site in `web/`. It should be implemented in the `dashboard/` Next.js app.

## Personas and Access Control

- **Admin**: Full access to all entities and settings.
- **Moderator**: Can moderate reviews/photos/edit-requests; cannot change system settings.
- **Content Editor**: Can manage places/branches/menus/categories; limited moderation powers.

Access must be restricted to authenticated users meeting one of:

- Supabase Auth user with metadata `role = admin|moderator|editor` (preferred), or
- Email allowlist configured in environment.

All write operations must respect Supabase RLS. Service role usage is only allowed server-side for controlled admin actions (e.g., featured refresh).

## Key Data Model (from `supabase/migrations/…_complete_schema.sql`)

- **Core**: `profiles`, `categories`, `places`, `branches`
- **Taxonomies**: `cuisine_types`, `amenity_types`, `photo_categories`
- **Relations**: `place_cuisines`, `branch_cuisines`, `place_amenities`, `branch_amenities`
- **Hours and Menus**: `place_hours`, `branch_hours`, `menu_sections`, `branch_menu_sections`, `menu_items`, `menu_item_photos`
- **Media**: `place_photos`, `branch_photos`, `review_photos`
- **Social**: `reviews`, `review_replies`, `review_reactions`, `favorite_places`, `favorite_branches`, `search_history`
- **Requests**: `place_add_requests`, `branch_add_requests`, `place_edit_requests`, `branch_edit_requests`
- **Views**: `branches_with_details`, `branch_stats`, `review_stats`, `recent_reviews_enriched`, `featured_places`
- **Functions**: `recent_reviews_nearby`, `recent_reviews_popular`, `recent_reviews_food`, `search_places_nearby`, and utility triggers such as `set_updated_at()`

## Information Architecture

Sidebar sections and pages:

- **Overview**
- **Places**
  - All Places
  - Categories
  - Cuisines
- **Branches**
  - All Branches
  - Hours
  - Amenities
  - Menus
- **Media**
  - Photos (place/branch/review)
- **Reviews**
  - Moderation Queue
  - Recent Reviews
- **Requests**
  - Add Requests (Place/Branch)
  - Edit Requests (Place/Branch)
- **Featured**
  - Featured Places
  - Refresh/Jobs
- **Users**
  - Profiles
- **Analytics**
  - Activity & Trends
- **Settings**

## Functional Requirements

### 1) Overview

- KPIs: total `places`, `branches`, `reviews`, `photos`, active users.
- Trends: reviews over time, average rating trend, photo uploads over time.
- Recent activity: latest reviews (`recent_reviews_enriched`), latest photos, latest edit/add requests.

### 2) Places Management

- List/search/sort/filter places by `name`, `category_id`, `is_active`, created/updated time.
- Create/Edit Place: `name`, `description`, `category_id`, `tags`, `is_active`.
- Show computed slug (read-only) from `places.slug`.
- Link to and manage associated branches of a place; surface `branch_stats` from the main branch.
- Deactivate/Activate place (soft toggle `is_active`).

### 3) Branches Management

- List branches with filters (by place, city/country, `is_main_branch`, `is_active`).
- Create/Edit Branch: `place_id`, `name`, contact, address, geolocation (`latitude`, `longitude`), `price_range`, `is_main_branch`, `is_active`.
- Business hours editor: CRUD on `branch_hours` with per-day open/close, closed/24h flags.
- Amenities editor: toggle boolean values for `branch_amenities` linked to `amenity_types`.
- Set main branch for a place (enforce single `is_main_branch = true`).

### 4) Menus

- Manage `menu_sections` and branch linkage via `branch_menu_sections`.
- Manage `menu_items` with `name`, `description`, `price`, `currency`, `is_available`, `position`.
- Manage `menu_item_photos` with upload, alt text, delete.

### 5) Categories and Taxonomies

- Manage `categories`: `name`, `slug`, `description`, `icon_name`.

  - List with pagination and search (by `name`, `slug`, `description`).
  - Create category: required `name`; optional `description`, `icon_name`.
  - Update category: edit `name`, `description`, `icon_name`.
  - Delete category: confirm irreversible delete; block if FK constraints prevent deletion (surface friendly error).
  - Slug should be generated in DB and unique. If duplicate name insertion fails, show a readable error or attempt a suffix retry server-side.
  - Show `created_at`, `updated_at` columns; sort by `created_at` desc by default.
  - Admin-only mutations via server API; reads via client are fine under RLS.
  - Validation: trim inputs; `name` length 2–80; `icon_name` length up to 64; `description` up to 500.

- Manage `cuisine_types`:
  - List with pagination and search (by `name`, `description`).
  - Create cuisine: required `name`; optional `description`.
  - Update cuisine: edit `name`, `description`.
  - Delete cuisine: confirm irreversible delete; block if FK constraints (e.g., `place_cuisines`, `branch_cuisines`) prevent deletion with a helpful error.
  - Show `created_at`; sort by `created_at` desc by default.
  - Admin-only mutations via server API; reads via client are fine under RLS.
  - Validation: trim inputs; `name` length 2–80; `description` up to 500.
- Manage `cuisine_types` and mappings (`place_cuisines`, `branch_cuisines`).
- Manage `amenity_types` (key/name/icon) used by `branch_amenities`.
- Manage `photo_categories` used by `review_photos` and other media lists.

### 6) Photos and Media Moderation

- Unified queue for `place_photos`, `branch_photos`, `review_photos`, `menu_item_photos` with filters and bulk actions.
- Actions: approve/hide/delete, edit `alt_text`, recategorize (`photo_category_id`), associate to entity.
- If using Cloudinary (see `web/src/app/api/uploads/cloudinary-sign/`), ensure deletions also remove cloud assets.

### 7) Reviews Moderation

- List/search/sort reviews; filter by rating range, date range, flagged status.
- Actions: hide/delete review, edit or add `owner_response` with `owner_response_by` & `owner_response_at` stamping.
- View reactions summary via `review_stats` and individual `review_reactions` if needed.
- Manage `review_replies` (delete abusive replies).

### 8) Requests (Add/Edit)

- Place/Branch Add Requests: triage queue, inspect proposed data, approve to create real `places`/`branches`, or reject with reason.
- Place/Branch Edit Requests: diff view against current values, approve to apply `proposed_changes`, or reject.
- Track status transitions and `reviewed_by`, `reviewed_at` per request table.

### 9) Featured Places

- Read-only table of `featured_places` (materialized view): show score/rank details.
- Control: trigger server-side refresh RPC (e.g., `refresh_featured_places`) and show last refresh time.
- Link to doc `web/docs/featured-places-setup.md` for cron/automation.

### 10) Users and Profiles

- List/search `profiles`; view details and recent activity.
- Assign roles via Supabase user metadata (write-only UI that calls admin API) or maintain a small `admin_users` table (if adopted later).

### 11) Analytics

- Time series: reviews/day, photos/day, new places/branches.
- Top categories/cuisines by review volume.
- Geographic distribution (if `location`/PostGIS present on `branches`).
- Recently popular content via `recent_reviews_popular` and `branch_stats`.

### 12) Settings

- Branding and site content snippets optionally editable.
- Integration keys (Cloudinary, map provider) stored server-side; never expose on client.
- Email allowlist and role mapping rules.

## API/DB Integration Notes

- Prefer server actions or API routes for mutations to keep service role keys off the client.
- Use existing views/functions where available:
  - `branches_with_details` for rich branch/place pages
  - `branch_stats`, `review_stats` for metrics
  - `recent_reviews_enriched`, `recent_reviews_popular`, `recent_reviews_food`, `recent_reviews_nearby`
  - `search_places_nearby` for geo queries
- Ensure triggers `set_updated_at()` fire by using standard `UPDATE` statements; avoid bypassing with raw SQL unless necessary.

## Non-Functional Requirements

- Security & RLS: all reads/writes respect policies; admin operations run server-side.
- Audit Trail: record who did what and when for destructive or sensitive changes (ownership changes, deletions, moderation actions, approvals). Store minimal structured audit rows.
- Performance: paginate lists; index-heavy filters; avoid N+1 by leveraging views and server joins.
- Reliability: optimistic UI with rollback on failure; retries for transient network errors.
- Accessibility: WCAG AA for admin UI components.
- Observability: minimal telemetry for admin actions (errors, latency). Avoid PII in logs.

## Dashboard UI Hooks (initial template alignment)

- Replace `src/app/page.tsx` placeholders:
  - `SectionCards`: bind to KPIs from counts (`places`, `branches`, `reviews`, photos).
  - `ChartAreaInteractive`: bind to review/photo time series.
  - `DataTable`: bind to recent reviews or requests with row actions.

## Out of Scope (for initial release)

- Bulk CSV import/export for places/branches (nice-to-have).
- Multi-language content management.
- Advanced RBAC beyond three roles.

## Acceptance Criteria

- Admin-only access enforced; non-admins redirected to login/denied page.
- CRUD works for Places/Branches/Menus with RLS-compliant writes.
- Moderation queues operate with pagination and bulk actions.
- Featured Places view renders and manual refresh works server-side.
- Analytics charts populate using existing views/RPCs.
