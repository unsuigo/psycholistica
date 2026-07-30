# Psycholistica Architecture

## Overview

Psycholistica follows a **Feature First Architecture** combined with principles of **Clean Architecture**.

The project is designed to remain scalable as new content types are introduced, including:

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

Each feature follows the same structure.

```
feature/

data/
domain/
presentation/
```

---

## Presentation

Responsible for:

- UI
- Widgets
- Pages
- Riverpod Providers
- User interaction

Presentation must never communicate directly with Supabase or any datasource.

---

## Domain

Contains business logic.

Includes:

- Entities
- Repository interfaces
- Use cases
- Business rules

The Domain layer must not depend on Flutter.

---

## Data

Responsible for:

- Repository implementations
- Remote datasources
- Local datasources
- DTO mapping
- API communication

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

External services are accessed only through repositories.

---

# Shared

Shared contains reusable components used by multiple features.

Examples:

- Buttons
- Dialogs
- Common widgets
- Shared models
- Extensions

Shared must not contain business logic.

---

# Core

Core contains application-wide infrastructure.

Examples:

- Theme
- Constants
- Utilities
- Services
- Extensions
- Error handling

Core must not depend on individual features.

---

# Routing

Navigation is implemented with **go_router**.

Routes are configured centrally inside:

```
app/router/
```

Features expose pages, but do not configure routing themselves.

---

# State Management

Riverpod is used for:

- Dependency Injection
- State Management
- Repository Providers
- Services

Global mutable state should be avoided whenever possible.

---

# Data Flow

```
UI
    ↓

Riverpod Provider
    ↓

Repository Interface
    ↓

Repository Implementation
    ↓

Datasource
    ↓

Supabase
```

---

# Dependency Injection

Dependencies are injected explicitly using Riverpod providers.

No global service locators.

No hidden dependencies.

---

# Content Model

The application is built around a universal Content model.

Different content types extend the same conceptual model rather than creating isolated systems.

This allows subscriptions, search, favorites and recommendations to work consistently.

---

# Project Principles

- Feature First Architecture
- Clean Architecture
- Composition over inheritance
- Explicit dependencies
- Small focused classes
- Reusable components
- Minimal external packages
- Scalable folder structure

---

# Avoid

- Event Bus
- Global mutable state
- Massive Managers
- Feature coupling
- Duplicate business logic
- Tight dependencies
- Premature optimization

---

# Goal

The architecture should support long-term growth without requiring large structural refactoring as new features are added.