# Psycholistica

**Document:** 05_DataFlow

**Version:** 1.1

**Status:** Active

**Last Updated:** 2026-07-30

---

# PURPOSE

This document defines how data moves through the application.

The data flow must remain identical regardless of whether the application uses local storage, cloud services or a dedicated backend.

---

# CORE PRINCIPLE

The UI must never know where the data comes from.

Changing infrastructure providers must never require changes in:

- Presentation
- Domain
- Business Logic

Only datasource implementations should change.

---

# DATA FLOW

```
User Action
        │
        ▼
Presentation
(Page / Widget)
        │
        ▼
Riverpod Provider
        │
        ▼
Use Case
        │
        ▼
Repository Interface
        │
        ▼
Repository Implementation
        │
        ▼
Datasource
        │
        ▼
Infrastructure
```

Every layer has a single responsibility.

---

# PRESENTATION

Responsibilities:

- Display data
- Receive user input
- Trigger actions
- Display loading and error states

Presentation must not:

- Query databases
- Call Supabase
- Call Cloudflare
- Parse JSON
- Implement business rules

---

# PROVIDERS

Riverpod providers coordinate communication between the UI and the Domain layer.

Responsibilities:

- Load data
- Refresh state
- Expose UI state
- Coordinate user actions

Providers should remain lightweight.

---

# USE CASES

Use cases contain application-specific business actions.

Examples:

- Load Meditations
- Load Books
- Login User
- Play Meditation
- Toggle Favorite

Use cases communicate only with repository interfaces.

---

# REPOSITORIES

Repositories provide a stable API for the application.

Responsibilities:

- Hide infrastructure details
- Combine multiple datasources
- Return domain entities
- Convert datasource errors into application failures

Nothing above the repository layer should know how data is stored.

---

# DATASOURCES

Datasource implementations communicate with infrastructure.

Examples:

## Local

- Dart collections
- Local JSON
- Local cache

## Cloud

- Supabase Auth
- Supabase PostgreSQL
- Cloudflare R2

## Future

- REST API
- Dedicated Backend
- Object Storage

Only datasources know how data is stored or retrieved.

---

# INFRASTRUCTURE

Infrastructure services have separate responsibilities.

## Supabase Auth

Responsible for:

- Login
- Registration
- Session
- User identity

---

## Supabase PostgreSQL

Responsible for:

- Users
- Content metadata
- Favorites
- Progress
- Subscription state

---

## Cloudflare R2

Responsible for:

- MP3
- Images
- Cover images
- Future videos

Large binary files are never stored in PostgreSQL.

---

# DOMAIN

Domain entities represent business objects.

The Domain layer is completely independent from:

- Flutter
- JSON
- HTTP
- Supabase
- Cloudflare
- Storage providers

---

# CONTENT FLOW

Example:

```
User opens Home

        ↓

HomeProvider

        ↓

LoadContentUseCase

        ↓

ContentRepository

        ↓

ContentDatasource

        ↓

Supabase PostgreSQL

        ↓

List<Content>

        ↓

Home UI
```

The UI never knows where the data originated.

---

# MEDIA FLOW

Example:

```
User presses Play

        ↓

PlayerProvider

        ↓

PlayMeditationUseCase

        ↓

ContentRepository

        ↓

StorageDatasource

        ↓

Cloudflare R2

        ↓

Audio Stream

        ↓

Player
```

Metadata and media are loaded independently.

---

# SUBSCRIPTION FLOW

```
User selects Premium Content

        ↓

Access Service

        ↓

Subscription Repository

        ↓

Supabase PostgreSQL

        ↓

Access Granted / Access Denied

        ↓

Player or Subscription Screen
```

The subscription system works independently from the content type.

---

# ERROR FLOW

Infrastructure errors are converted into application-friendly states.

```
Datasource Error

        ↓

Repository

        ↓

Application Failure

        ↓

Provider

        ↓

UI Message
```

The UI should never display raw backend errors.

---

# DESIGN RULES

Every layer has one responsibility.

Dependencies always point downward.

```
Presentation

        ↓

Domain

        ↓

Repository

        ↓

Datasource

        ↓

Infrastructure
```

Communication must never bypass a layer.

---

# DO

- Keep one-way data flow.
- Keep repositories replaceable.
- Keep datasources replaceable.
- Keep infrastructure independent.
- Keep domain pure.
- Return domain entities from repositories.

---

# DON'T

- UI talking directly to Supabase.
- UI talking directly to Cloudflare.
- Providers parsing JSON.
- Business logic inside widgets.
- Features bypassing repositories.
- Tight coupling to infrastructure.

---

# RELATED DOCUMENTS

- 01_Architecture.md
- 03_FolderStructure.md
- 04_ContentModel.md
- 06_TechStack.md