00_ProjectOverview.md


Psycholistica
00_ProjectOverview
PROJECT
Psycholistica is a scalable cross-platform content platform focused on
psychology, self-development and education.

The first implemented content type is guided meditation audio
delivered through streaming and protected by a subscription.

The platform is intentionally designed so that future content types can
be added without changing the existing architecture.

GOAL
Build a Flutter application that:

launches first as a Progressive Web App (PWA);

can later be compiled for Android, iOS, Windows, macOS and Linux;

keeps one shared architecture across all platforms.

CORE IDEA
The application is not a meditation app.

It is a universal psychological content platform.

Meditations are only the first implementation of the platform.

Future content may include:

Guided Meditations

Books

Articles

Audiobooks

Courses

Psychological Tests

Personal Diary

AI Assistant

Any future content type

The architecture must allow adding new content types without refactoring
existing modules.

FIRST RELEASE (MVP)
The MVP includes:

Home screen

Meditation catalog

Meditation details

Streaming audio playback

Premium access control

Subscription system

Local data source

No backend integration during the first stage.

CONTENT PLATFORM PRINCIPLE
Always build a generic system first.

Never build a feature that only works for meditations.

Every feature should be reusable by future content types.

Example:

Content ↓ Meditation Book Article Course Audiobook

MONETIZATION
The platform is based on subscriptions.

The subscription controls access to premium content regardless of its
type.

The access layer must not depend on whether the content is:

meditation

book

article

course

audiobook

BACKEND STRATEGY
Stage 1

Local Dart data

Stage 2

Replace repositories with Supabase.

Planned services:

Authentication

PostgreSQL

Storage

Edge Functions (if required)

Realtime (if required)

The UI must never depend on the storage implementation.

SOURCE CONTROL
Repository:

GitHub

Workflow:

feature/* ↓ dev ↓ main

The main branch is automatically deployed to GitHub Pages.

The first production release is delivered as a PWA hosted from GitHub
Pages.

ARCHITECTURAL PRIORITIES
Scalability

Maintainability

Feature isolation

Cross-platform compatibility

Clean architecture

Simple development workflow

SUCCESS CRITERIA
The architecture is successful if:

new content types require creating a new feature only;

replacing the backend does not change the UI;

subscriptions work independently of content type;

the same codebase builds for Web, Android, iOS, Windows, macOS and
Linux.

RELATED DOCUMENTS
01_Architecture.md 02_CodingStandards.md 03_FolderStructure.md
04_ContentModel.md 05_DataFlow.md 06_TechStack.md 07_GitWorkflow.md
08_Roadmap.md ADR-001-Architecture.md