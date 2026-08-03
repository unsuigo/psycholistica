# Psycholistica

**Document:** 06_TechStack

**Version:** 1.2

**Status:** Active

**Last Updated:** 2026-08-03

---

# PURPOSE

This document defines the approved technology stack for the Psycholistica project.

The project prioritizes:

- maintainability
- scalability
- cross-platform compatibility
- infrastructure independence
- replaceable external providers
- secure premium content access

New technologies should only be introduced when they provide a clear architectural, functional, or long-term maintenance benefit.

External services must remain isolated behind application abstractions.

---

# FRONTEND

## Framework

Flutter

## Language

Dart

## Design System

Material 3

---

# TARGET PLATFORMS

A single Flutter codebase should support:

- Progressive Web App (PWA)
- Android
- iOS
- Windows
- macOS
- Linux

The application architecture must remain conceptually identical across all platforms.

Platform-specific implementations are allowed only inside infrastructure or platform integration layers when required.

Presentation and Domain must remain platform-independent.

---

# APPLICATION ARCHITECTURE

Approved architecture:

- Feature First
- Clean Architecture
- Repository Pattern
- Explicit Dependency Injection

Primary dependency direction:

Presentation

↓

Provider

↓

Use Case

↓

Repository Interface

↓

Repository Implementation

↓

Datasource / Service

↓

External Infrastructure

Presentation and Domain must never depend directly on Supabase, Cloudflare R2, Stripe, or any other infrastructure provider.

---

# STATE MANAGEMENT

Approved:

Riverpod

Responsibilities:

- State Management
- Dependency Injection
- Provider lifecycle
- Repository Providers
- Service Providers
- Application state coordination

Riverpod is the primary dependency injection mechanism used by the Flutter application.

---

# NAVIGATION

Approved:

go_router

Navigation must remain:

- centralized
- declarative
- independent from infrastructure services

Routing configuration belongs to the application layer.

---

# BACKEND STRATEGY

The initial production backend is based on managed services.

Primary backend services:

- Supabase Auth
- Supabase PostgreSQL
- Cloudflare R2

A dedicated backend may be introduced later when server-side requirements justify it.

The application architecture must allow backend infrastructure to change without rewriting Presentation or Domain.

---

# AUTHENTICATION

## Provider

Supabase Auth

Responsibilities:

- User registration
- User authentication
- Session management
- Session persistence
- Password reset
- Email verification
- OAuth providers when required

Initial authentication method:

- Email
- Password

OAuth providers may be introduced later.

Examples:

- Google
- Apple

---

# AUTHENTICATION ARCHITECTURE

Authentication is a platform-level feature.

Authentication must remain independent from:

- Content
- Player
- Subscription UI
- Storage
- Individual content types

The Flutter UI must not communicate directly with Supabase Auth.

Supabase-specific implementation must remain behind authentication abstractions.

---

# DATABASE

## Provider

Supabase PostgreSQL

The database stores structured application data only.

Initial responsibilities include:

- User profiles
- Content metadata
- Categories
- Subscription state
- Content access metadata

Future responsibilities may include:

- Favorites
- Playback progress
- Play history
- User preferences
- Courses
- Books
- Articles
- Tests
- Diary metadata

---

# DATABASE RULES

PostgreSQL stores structured data.

Examples:

- User profile
- Content title
- Content description
- Content type
- Premium flag
- Media object key
- Cover object key
- Category
- Subscription status
- Subscription expiration
- Playback progress

Large binary assets must never be stored directly in PostgreSQL.

Never store database binary copies of:

- Audio
- Images
- Videos
- Books
- Large downloadable resources

Instead, store object identifiers, keys, or controlled references to external object storage.

---

# CONTENT METADATA

Content metadata belongs in Supabase PostgreSQL.

A content record may contain information such as:

- id
- title
- description
- content type
- premium status
- category
- audio object key
- image object key
- video object key
- publication state

Media files themselves belong in object storage.

Content metadata and media storage must remain independent.

---

# OBJECT STORAGE

## Provider

Cloudflare R2

Cloudflare R2 is the initial production object storage provider.

Responsibilities:

- Audio files
- Images
- Cover images
- Preview videos
- Future downloadable resources
- Future book or document assets

Example logical structure:

audio/

images/

video/

documents/

The exact physical object structure may evolve without affecting Domain or Presentation.

---

# STORAGE ABSTRACTION

The application must not depend directly on Cloudflare R2.

Only infrastructure services or datasource implementations may know:

- R2 bucket configuration
- R2 object keys
- R2 URLs
- signed URL implementation
- CDN configuration

The Player must receive a playable resource through an application abstraction.

It must not construct Cloudflare URLs itself.

---

# FREE MEDIA ACCESS

Free content may use publicly accessible media URLs when appropriate.

Example flow:

Content

↓

Media Service

↓

Public Media URL

↓

Player

Public media access must still remain behind the media abstraction so the storage provider can be replaced later.

---

# PREMIUM MEDIA ACCESS

Premium media must not rely on permanent publicly accessible URLs.

Target production flow:

User requests premium content

↓

Authentication check

↓

Subscription check

↓

Server-side authorization

↓

Temporary signed media URL

↓

Cloudflare R2

↓

Player

Signed URLs should have a limited lifetime.

The Flutter client must never be considered the authority for premium access.

UI-level premium checks are for user experience only.

Actual protected resource authorization must be enforced server-side.

---

# AUDIO

## Requirements

Audio playback must support:

- Streaming playback
- Local development playback
- Pause
- Resume
- Seeking
- Duration detection
- Progress tracking
- Background playback where supported
- Premium access
- Remote media URLs

Audio implementation must remain isolated behind abstractions.

The UI must never communicate directly with:

- file storage
- Cloudflare R2
- Supabase
- platform audio backends

---

# AUDIO IMPLEMENTATION

Current implementation:

just_audio

Platform-specific backend packages may be used when required by the target platform.

Audio playback infrastructure must remain replaceable.

Domain and Presentation must not depend directly on just_audio.

---

# VIDEO

Video is used primarily for visual meditation content and animated content previews.

Requirements:

- Local development playback
- Remote playback
- Looping
- Muted playback when used as visual ambience
- Responsive presentation
- Graceful fallback to static images

Current implementation:

video_player

Video implementation must remain isolated from content business logic.

---

# MEDIA DEVELOPMENT STRATEGY

During local development, media files may be loaded from external local directories.

Current development media is temporary and must not be committed to the application repository unless explicitly required.

Local filesystem paths are development infrastructure only.

Production media must use remote object storage.

The transition from local files to Cloudflare R2 must not require changes to Presentation or Domain.

---

# SUBSCRIPTIONS

Subscriptions are a platform-level service.

Subscription access must apply independently of content type.

Premium access may protect:

- Meditations
- Audio
- Audiobooks
- Books
- Articles
- Courses
- Tests
- Future content types

Content features must not implement their own subscription systems.

---

# SUBSCRIPTION STATE

The application requires a normalized subscription state.

Typical states may include:

- active
- inactive
- expired
- cancelled

The exact model may evolve as payment integration is implemented.

Subscription state belongs to backend-controlled data.

The Flutter client may cache subscription state for presentation purposes but must not be the authoritative source.

---

# ACCESS CONTROL

Premium access must be centralized.

Target logical flow:

Content selected

↓

Content is free?

↓

Yes → Allow access

No

↓

Check authenticated user

↓

Check active subscription

↓

Allow or deny access

Access control must not be duplicated inside individual content features.

A shared access service or equivalent Domain abstraction should determine whether content can be opened.

---

# PAYMENT PROVIDER

Initial planned provider:

Stripe

Stripe is responsible for payment processing.

Stripe must not become the authoritative source used directly by the Flutter UI for content access.

Target flow:

User

↓

Stripe Checkout

↓

Payment

↓

Server-side webhook

↓

Subscription state updated

↓

Application access state updated

Payment provider integration must remain replaceable.

---

# PAYMENT SECURITY

Payment confirmation must be processed server-side.

The Flutter application must never mark a subscription as active based only on a client-side payment result.

Webhook processing must verify payment provider events before modifying subscription state.

Secrets must never be embedded in the Flutter client.

Examples:

- Stripe secret keys
- Supabase service-role keys
- Cloudflare R2 secret keys

---

# SUBSCRIPTION DEVELOPMENT STRATEGY

Payment integration is not required for the first subscription implementation.

Development order:

1. Implement authentication.
2. Implement user profile.
3. Implement subscription state.
4. Manually assign active/inactive subscription state for test users.
5. Implement premium access control.
6. Implement Paywall.
7. Implement protected media access.
8. Integrate Stripe.
9. Integrate payment webhooks.
10. Automate subscription lifecycle.

This allows access-control logic to be tested independently from payment processing.

---

# SERVER-SIDE LOGIC

Some operations cannot safely run inside the Flutter client.

Examples:

- Payment webhooks
- Signed premium media URL generation
- Subscription verification
- Administrative operations
- Secret-key operations

Initial server-side implementation may use managed serverless functionality associated with the selected backend infrastructure.

A dedicated backend may be introduced later.

---

# INFRASTRUCTURE STRATEGY

## Stage 1 — Local Application Foundation

Current foundation:

- Flutter
- Dart
- Riverpod
- go_router
- Local content datasource
- Local filesystem media
- just_audio
- video_player

Purpose:

Validate:

- architecture
- navigation
- content flow
- Player
- audio playback
- video playback

This stage is operational.

---

## Stage 2 — Cloud Backend

Target infrastructure:

- Supabase Auth
- Supabase PostgreSQL
- Cloudflare R2

Goals:

- User registration
- Login
- Session persistence
- User profiles
- Cloud content metadata
- Remote audio
- Remote images
- Remote video

Local repositories and datasources are replaced by cloud implementations.

Presentation and Domain must remain unchanged.

---

## Stage 3 — Subscription Platform

Add:

- Subscription model
- Access control
- Premium / Free content rules
- Paywall
- Protected media
- Temporary signed URLs
- Stripe
- Payment webhooks
- Subscription lifecycle management

The subscription system must remain independent from individual content features.

---

## Stage 4 — Extended Platform

Possible additions:

- Favorites
- Play history
- Progress synchronization
- Offline support
- Push notifications
- Analytics
- Search
- Recommendations
- Additional content types

---

## Stage 5 — Dedicated Backend

A dedicated backend may be introduced if managed infrastructure becomes insufficient.

Possible infrastructure:

- Hetzner VPS or equivalent
- Dedicated backend API
- PostgreSQL
- S3-compatible object storage
- Background workers
- Caching
- CDN

Migration to a dedicated backend must not require rewriting Presentation or Domain.

---

# STORAGE STRATEGY

## Development

Local Dart collections

Local filesystem media

## Initial Production

Supabase PostgreSQL

Cloudflare R2

## Future

Dedicated Backend API

PostgreSQL

S3-compatible object storage

The application must not depend on any specific storage provider.

Only datasource and infrastructure implementations may know which provider is used.

---

# DEPLOYMENT

## Source Control

GitHub

## Branch Strategy

feature/*

↓

dev

↓

main

The main branch represents the production state.

---

# PWA DEPLOYMENT

Initial deployment:

GitHub Pages or equivalent static hosting

The PWA frontend must remain independently deployable from backend infrastructure.

A future hosting migration must not affect application architecture.

---

# DEVELOPMENT TOOLS

## Primary Development Environment

Cursor

Used for:

- Project navigation
- AI-assisted development
- Code review
- Editing
- Terminal workflow

## Secondary IDE

Rider

Useful for:

- Advanced refactoring
- Debugging
- Code navigation
- Static analysis
- Complex Flutter/Dart development

## Additional Development Agent

Codex

Used for:

- Implementation tasks
- Repository-wide changes
- Architecture-aware modifications
- Repetitive development operations

## Version Control

Git

GitHub

---

# SECURITY PRINCIPLES

- Never store backend secrets in Flutter source code.
- Never expose Supabase service-role credentials to the client.
- Never expose Cloudflare R2 secret credentials to the client.
- Never expose Stripe secret credentials to the client.
- Do not trust client-side subscription state for protected resources.
- Validate premium access server-side.
- Use temporary access mechanisms for protected media.
- Keep authentication and authorization separate.
- Keep infrastructure providers behind abstractions.

---

# DESIGN PRINCIPLES

- Feature First Architecture
- Clean Architecture
- Repository Pattern
- Explicit Dependency Injection
- Infrastructure Independence
- Provider Independence
- Platform Independence
- Centralized Access Control
- Separation of Metadata and Media

---

# DO

- Prefer stable libraries.
- Keep external dependencies minimal.
- Wrap third-party SDKs behind abstractions.
- Prefer cross-platform solutions.
- Keep backend providers replaceable.
- Keep storage providers replaceable.
- Keep payment providers replaceable.
- Keep media playback infrastructure replaceable.
- Separate authentication from authorization.
- Separate metadata from media.
- Verify premium access server-side.

---

# DON'T

- Add platform-specific code without necessity.
- Access backend SDKs directly from UI.
- Access storage SDKs directly from UI.
- Access payment SDKs directly from content features.
- Store large binary assets in PostgreSQL.
- Store secret credentials in Flutter.
- Trust the Flutter client as the authority for subscriptions.
- Use permanent public URLs for protected premium media.
- Couple Presentation to Supabase.
- Couple Presentation to Cloudflare R2.
- Couple Domain to Stripe.
- Replace core technologies without architectural review.

---

# FUTURE TECHNOLOGIES

Possible future additions:

- Dedicated REST API
- GraphQL
- AI Services
- Push Notifications
- Offline Synchronization
- Analytics
- CDN
- Background Processing
- Search Infrastructure
- Recommendation System
- Dedicated Backend

These technologies must integrate through abstractions without changing core business logic.

---

# CURRENT APPROVED STACK

Frontend:

Flutter + Dart + Material 3

State Management / DI:

Riverpod

Navigation:

go_router

Authentication:

Supabase Auth

Structured Data:

Supabase PostgreSQL

Object Storage:

Cloudflare R2

Audio:

just_audio

Video:

video_player

Payments:

Stripe (planned)

Source Control:

Git + GitHub

Primary Development Environment:

Cursor

Secondary IDE:

Rider

Development Agent:

Codex

---

# RELATED DOCUMENTS

- 01_Architecture.md
- 04_ContentModel.md
- 05_DataFlow.md
- 07_GitWorkflow.md
- 08_Roadmap.md
- 09_Packages.md
- ADR_001_Architecture.md