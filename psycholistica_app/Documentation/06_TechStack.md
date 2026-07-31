# Psycholistica

**Document:** 06_TechStack

**Version:** 1.1

**Status:** Active

**Last Updated:** 2026-07-30

---

# PURPOSE

This document defines the technologies approved for the Psycholistica project.

The project prioritizes maintainability, scalability and infrastructure independence.

New technologies should only be introduced when they provide a clear architectural or long-term maintenance benefit.

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

A single codebase should support:

- Progressive Web App (PWA)
- Android
- iOS
- Windows
- macOS
- Linux

The application architecture must remain identical across all platforms.

---

# BACKEND

## Authentication

Supabase Auth

Responsible for:

- User Authentication
- Session Management
- Password Reset
- OAuth Providers

---

## Database

Supabase PostgreSQL

Responsible for:

- Users
- Content metadata
- Categories
- Favorites
- Progress
- Subscription status
- Play history

The database stores only structured application data.

---

## Object Storage

Current provider:

Cloudflare R2

Responsible for storing:

- MP3
- Images
- Cover images
- Future videos
- Downloadable resources

Large binary assets must never be stored inside the database.

---

# INFRASTRUCTURE STRATEGY

## Stage 1

- Flutter
- Local data
- Supabase Auth
- Supabase PostgreSQL
- Cloudflare R2

## Stage 2

- REST API (optional)
- Background processing
- Server-side business logic

## Stage 3

- Dedicated backend
- Hetzner VPS (or equivalent)
- PostgreSQL
- S3-compatible object storage

The architecture must allow migration between stages without affecting the Presentation or Domain layers.

---

# STATE MANAGEMENT

Approved:

Riverpod

Purpose:

- State Management
- Dependency Injection
- Provider lifecycle
- Repository Providers
- Service Providers

---

# NAVIGATION

Approved:

go_router

Navigation should remain centralized and declarative.

---

# AUDIO

Requirements:

- Streaming playback
- Background playback (where supported)
- Progress tracking
- Pause / Resume
- Premium access support

Audio implementation must remain isolated behind abstractions.

The UI must never communicate directly with storage providers.

---

# AUTHENTICATION

Current:

Local development

Production:

Supabase Auth

Authentication must remain independent from content features.

---

# SUBSCRIPTIONS

The subscription system is a platform service.

It controls access to premium content regardless of content type.

The implementation should remain replaceable without affecting UI or business logic.

---

# STORAGE STRATEGY

## Stage 1

Local Dart collections

## Stage 2

Supabase PostgreSQL

Cloudflare R2

## Stage 3

Custom Backend API

Object Storage

The application must not depend on any specific storage provider.

Only datasource implementations should know which storage service is being used.

---

# DATABASE STRATEGY

Store only structured data.

Examples:

- User profile
- Meditation metadata
- Categories
- Favorites
- Progress
- Subscription state

Never store:

- MP3
- Images
- Videos
- Binary resources

Instead, store references (URLs) to object storage.

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

## Deployment

GitHub Pages (PWA)

The main branch is always the production branch.

---

# DEVELOPMENT TOOLS

## Primary IDE

Rider

## Supported IDE

Visual Studio Code

## Version Control

Git

GitHub

---

# DESIGN PRINCIPLES

- Feature First Architecture
- Clean Architecture
- Repository Pattern
- Explicit Dependency Injection
- Infrastructure Independence

---

# DO

- Prefer stable libraries.
- Keep external dependencies minimal.
- Wrap third-party SDKs behind abstractions.
- Prefer cross-platform solutions.
- Keep backend providers replaceable.
- Keep storage providers replaceable.

---

# DON'T

- Platform-specific code without necessity.
- Direct dependency on backend SDKs inside UI.
- Direct dependency on storage SDKs inside UI.
- Tight coupling to Supabase.
- Tight coupling to Cloudflare.
- Replace core technologies without architectural review.

---

# FUTURE TECHNOLOGIES

Possible future additions:

- REST API
- GraphQL
- AI Services
- Push Notifications
- Offline Synchronization
- Analytics
- CDN
- Dedicated Backend

These technologies should integrate through abstractions without changing business logic.

---

# RELATED DOCUMENTS

- 01_Architecture.md
- 04_ContentModel.md
- 05_DataFlow.md
- 07_GitWorkflow.md