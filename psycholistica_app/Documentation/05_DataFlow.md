Psycholistica

Document: 05_DataFlow Version: 1.0 Status: Active Last Updated:2026-07-30

PURPOSE

This document defines how data moves through the application.

The data flow must remain identical regardless of whether the source islocal storage or Supabase.

CORE PRINCIPLE

The UI must never know where the data comes from.

Changing the backend must not require changes in the presentation layer.

DATA FLOW

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
Repository Interface
│
▼
Repository Implementation
│
▼
Datasource
(Local / Supabase)
│
▼
Domain Entity
│
▼
Presentation

Every layer has a single responsibility.

PRESENTATION

Responsibilities:

Display data

Receive user input

Trigger actions

Must not:

Query databases

Call Supabase directly

Parse JSON

Implement business rules

PROVIDERS

Riverpod providers coordinate communication between UI and repositories.

Responsibilities:

Load data

Refresh state

Expose UI state

Providers should remain lightweight.

REPOSITORIES

Repositories provide a stable API for the rest of the application.

Current implementation:

Local repositories.

Future implementation:

Supabase repositories.

Nothing above the repository layer should notice the difference.

DATASOURCES

Datasource implementations communicate with external storage.

Examples:

Current:

Local Dart collections

Future:

Supabase Database

Supabase Storage

Only datasources know how data is stored.

DOMAIN

Domain entities represent business objects.

They are independent of:

Flutter

Supabase

JSON

HTTP

CONTENT FLOW

Example:

User opens Home

↓

Provider requests content

↓

ContentRepository

↓

LocalContentDatasource

↓

List<Content>

↓

Home UI

Later:

ContentRepository

↓

SupabaseContentDatasource

The UI remains unchanged.

SUBSCRIPTION FLOW

User selects premium content

↓

Access Service

↓

Subscription Status

↓

Access Granted / Access Denied

↓

Open Player or Purchase Screen

The content type is irrelevant.

The access system treats every Content object the same.

ERROR FLOW

External errors are converted into application-friendly states.

Example:

Datasource Error

↓

Repository

↓

Failure / Empty Result

↓

Provider

↓

UI Message

The UI should never display raw backend errors.

DO

Keep one-way data flow.

Keep repositories replaceable.

Keep UI independent.

Keep domain pure.

DON'T

UI talking directly to Supabase.

Providers parsing JSON.

Business logic inside widgets.

Feature bypassing repositories.

RELATED DOCUMENTS

01_Architecture.md

03_FolderStructure.md

04_ContentModel.md

06_TechStack.md