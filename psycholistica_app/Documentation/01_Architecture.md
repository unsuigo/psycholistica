# Psycholistica Architecture

## Overview

Psycholistica follows a **Feature First Architecture** combined with **Clean Architecture** principles.

The project is designed for long-term scalability as new content types and services are introduced.

Current and planned content includes:

- Meditations
- Articles
- Books
- Audiobooks
- Courses
- Tests
- Diary
- AI Assistant
- Future content types

Every feature is isolated and owns its own business logic.

The architecture is designed to keep the UI independent from backend services and infrastructure providers.

---

# High Level Structure

```
lib/

app/
core/
shared/
features/
```

---

# Layers

Every feature follows the same internal structure.

```
feature/

data/
domain/
presentation/
```

---

# Presentation

Responsible for:

- UI
- Widgets
- Pages
- Riverpod Providers
- User interaction

Presentation never communicates directly with:

- Supabase
- Cloudflare
- HTTP clients
- Databases
- Storage providers

Presentation only communicates with the Domain layer.

---

# Domain

Contains the business logic.

Includes:

- Entities
- Repository interfaces
- Use cases
- Business rules

The Domain layer:

- does not depend on Flutter
- does not know about Supabase
- does not know about Cloudflare R2
- does not know about any backend implementation

This layer should remain portable and testable.

---

# Data

Responsible for:

- Repository implementations
- Remote datasources
- Local datasources
- DTO mapping
- API communication
- File storage communication

Only the Data layer communicates with external services.

---

# Dependency Direction

Dependencies always point inward.

```
Presentation
        ↓
Domain
        ↓
Data
```

Business logic never depends on infrastructure.

---

# Data Sources

The Data layer communicates with infrastructure through dedicated datasource implementations.

Example:

```
Repository

        ↓

Datasource Interface

        ↓

SupabaseDatasource

CloudflareStorageDatasource

LocalDatasource
```

Repositories coordinate multiple datasources when required.

---

# Infrastructure

Infrastructure is intentionally separated into independent services.

## Authentication

Supabase Auth

Responsible for:

- Sign In
- Sign Up
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
- Progress
- Favorites
- Play history
- Subscription status

The database stores only structured application data.

---

## Object Storage

Object storage is responsible for binary assets.

Examples:

- MP3
- Images
- Cover images
- Future videos
- Downloadable files

Current provider:

- Cloudflare R2

The architecture allows replacing Cloudflare R2 without affecting business logic.

---

# Data Flow

```
UI

↓

Riverpod Provider

↓

Use Case

↓

Repository Interface

↓

Repository Implementation

↓

Datasource

↓

Infrastructure

├── Supabase Auth
├── Supabase PostgreSQL
└── Cloudflare R2
```

---

# Repository Pattern

Repositories isolate business logic from infrastructure.

Example:

```
MeditationRepository

↓

MeditationRepositoryImpl

↓

SupabaseDatasource

CloudflareStorageDatasource
```

A single repository may use multiple datasources.

---

# Shared

Shared contains reusable components used by multiple features.

Examples:

- Buttons
- Dialogs
- Common widgets
- Shared models
- Extensions
- Formatters

Shared must not contain business logic.

---

# Core

Core contains application-wide infrastructure.

Examples:

- Theme
- Constants
- Error handling
- Logging
- Utilities
- Network helpers
- Configuration

Core must not depend on individual features.

---

# Routing

Navigation is implemented with **go_router**.

Routes are configured centrally inside:

```
app/router/
```

Features expose pages but do not configure routing themselves.

---

# State Management

Riverpod is responsible for:

- Dependency Injection
- State Management
- Repository Providers
- Service Providers

Global mutable state should be avoided whenever possible.

---

# Dependency Injection

Dependencies are injected explicitly using Riverpod providers.

No service locator.

No hidden dependencies.

Every dependency should be visible and replaceable.

---

# Storage Strategy

Large binary files are stored separately from relational data.

Examples:

- MP3
- Images
- Cover images
- Future videos

Only metadata is stored inside PostgreSQL.

Typical metadata includes:

- title
- description
- duration
- premium flag
- storage URL
- thumbnail URL

This keeps the database small while allowing media storage to scale independently.

---

# Backend Independence

The application must never depend directly on a specific backend provider.

Today the infrastructure is:

- Supabase Auth
- Supabase PostgreSQL
- Cloudflare R2

In the future it may become:

- Custom Backend API
- PostgreSQL
- S3-compatible storage
- Hetzner VPS

Such migration should not require changes in Presentation or Domain layers.

Only datasource implementations should change.

---

# Content Model

The application is built around a universal Content model.

Different content types extend the same conceptual model rather than creating isolated systems.

This allows:

- subscriptions
- search
- favorites
- recommendations
- progress tracking

to work consistently across the application.

---

# Project Principles

- Feature First Architecture
- Clean Architecture
- Repository Pattern
- Explicit Dependency Injection
- Composition over inheritance
- Infrastructure independence
- Reusable components
- Small focused classes
- Minimal external packages
- Scalable folder structure

---

# Avoid

- Event Bus
- Global mutable state
- Massive Managers
- Feature coupling
- Duplicate business logic
- Tight backend coupling
- Vendor lock-in
- Premature optimization

---

# Goal

The architecture should support long-term growth without requiring large structural refactoring.

New content types, backend providers and infrastructure services should be added by extending the Data layer rather than modifying business logic.