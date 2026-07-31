# Psycholistica

**Document:** 08_Roadmap

**Version:** 1.1

**Status:** Active

**Last Updated:** 2026-07-30

---

# PURPOSE

This document defines the long-term development roadmap for Psycholistica.

The roadmap represents the planned direction of the project.

Implementation details may evolve over time, but the architectural principles must remain stable.

---

# PRODUCT VISION

Psycholistica is a scalable psychological content platform.

The platform is designed to grow continuously without requiring architectural redesign.

Every new feature should integrate into the existing ecosystem.

The application should remain simple during early development while being capable of supporting a large content library and thousands of users in the future.

---

# DEVELOPMENT STAGES

## Stage 1 — Foundation (Current)

Objectives:

- Configure Flutter project
- Feature First Architecture
- Clean Architecture
- Riverpod
- go_router
- Local repositories
- Local datasource
- Home screen
- Universal Content model
- Meditation catalog
- Audio player
- PWA deployment

Status:

**IN PROGRESS**

---

## Stage 2 — Cloud Backend

Objectives:

- Supabase Authentication
- PostgreSQL
- Cloudflare R2
- Replace local repositories
- User profiles
- Play history
- Favorites
- Sync user data

Status:

**PLANNED**

---

## Stage 3 — Subscription Platform

Objectives:

- Premium content
- Subscription validation
- Access management
- Restore purchases
- Subscription UI
- Protected media access

Status:

**PLANNED**

---

## Stage 4 — Content Expansion

Objectives:

- Books
- Articles
- Audiobooks
- Categories
- Search
- Favorites
- Recommendations

Status:

**PLANNED**

---

## Stage 5 — Learning Platform

Objectives:

- Courses
- Lesson progress
- Psychological tests
- Certificates (optional)

Status:

**PLANNED**

---

## Stage 6 — Personal Tools

Objectives:

- Personal diary
- Notes
- User history
- Personal recommendations

Status:

**PLANNED**

---

## Stage 7 — AI Assistant

Objectives:

- AI conversations
- Personalized recommendations
- Content search
- Intelligent guidance

Status:

**PLANNED**

---

## Stage 8 — Platform Growth

Objectives:

- Offline mode
- Push notifications
- Analytics
- Multiple languages
- Playlists
- Meditation series
- Community features
- Wearable support

Status:

**FUTURE**

---

## Stage 9 — Enterprise Infrastructure

Objectives:

- Dedicated Backend API
- Background Workers
- Scheduled Tasks
- Dedicated PostgreSQL
- Hetzner VPS (or equivalent)
- Monitoring
- Logging
- Automatic Backups

Status:

**LONG TERM**

---

# INFRASTRUCTURE ROADMAP

## Phase 1

Application works entirely with local data.

Components:

- Flutter
- Local Repository
- Local Datasource

Purpose:

Fast development with zero backend dependency.

---

## Phase 2

Cloud infrastructure.

Components:

- Supabase Auth
- Supabase PostgreSQL
- Cloudflare R2

Purpose:

Authentication, synchronization and scalable media storage.

---

## Phase 3

Hybrid architecture.

Components:

- Dedicated Backend API
- PostgreSQL
- Cloudflare R2

Purpose:

Move business logic to backend while keeping Flutter unchanged.

---

## Phase 4

Full enterprise infrastructure.

Components:

- Dedicated Backend
- Dedicated Database
- Object Storage
- Background Services

Purpose:

Support large-scale growth without changing application architecture.

---

# ARCHITECTURAL GOALS

Throughout every stage:

- No architectural rewrites.
- No feature coupling.
- Repository interfaces remain stable.
- Datasources remain replaceable.
- UI remains independent.
- Domain remains infrastructure independent.
- Content model remains universal.

---

# SUCCESS METRICS

Architecture is considered successful if:

- New features integrate without modifying existing ones.
- Infrastructure providers can be replaced without changing business logic.
- Every supported platform shares one codebase.
- Binary assets scale independently from the database.
- The application remains easy to maintain.

---

# FUTURE IDEAS

Potential future modules:

- AI-generated meditations
- Voice search
- Sleep tracking
- Mood tracking
- Smart reminders
- Meditation streaks
- Cloud synchronization
- Family accounts
- Therapist mode
- Apple Health / Google Fit integration

These ideas should integrate without requiring architectural redesign.

---

# RELATED DOCUMENTS

- 00_ProjectOverview.md
- 01_Architecture.md
- 04_ContentModel.md
- 05_DataFlow.md
- 06_TechStack.md
- 07_GitWorkflow.md