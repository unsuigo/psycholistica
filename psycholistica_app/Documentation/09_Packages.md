Psycholistica
Document: 09_Packages Version: 1.0 Status: Active Last Updated:
2026-07-30

PURPOSE
This document defines the approved third-party packages for the
Psycholistica project.
The goal is to keep the dependency tree small, stable and maintainable.
Every new package should provide clear architectural value.

CORE RULES
DO
    • Prefer official Flutter packages.
    • Prefer actively maintained libraries.
    • Prefer well-documented packages.
    • Wrap third-party packages behind project abstractions.
DON'T
    • Add packages for small convenience features.
    • Introduce multiple libraries solving the same problem.
    • Access package APIs directly from unrelated features.

APPROVED PACKAGES
State Management
Package
flutter_riverpod
Purpose
    • State Management
    • Dependency Injection
Status
APPROVED

Navigation
Package
go_router
Purpose
    • Declarative navigation
    • Deep linking
    • Web routing
Status
APPROVED

Backend
Package
supabase_flutter
Purpose
    • Authentication
    • Database
    • Storage
Status
APPROVED

Audio Playback
Preferred package
just_audio
Purpose
    • Streaming audio
    • Playback control
    • Position updates
Status
APPROVED
Optional companion package
audio_service
Purpose
    • Background playback
    • Media controls
Status
OPTIONAL

Network Images
Preferred package
cached_network_image
Purpose
    • Image caching
    • Performance
Status
APPROVED

Utilities
Use only when required.
Every utility package should be evaluated individually.

PACKAGE APPROVAL PROCESS
Before adding a dependency:
    1. Is Flutter SDK already providing this functionality?
    2. Is there an approved package already solving this?
    3. Is the package actively maintained?
    4. Is it cross-platform?
    5. Does it increase long-term maintenance cost?
Only after answering these questions should a new dependency be
introduced.

PACKAGE REMOVAL
Unused packages should be removed as soon as possible.
The project should not accumulate obsolete dependencies.

VERSION POLICY
Prefer stable releases.
Avoid beta or experimental packages unless explicitly approved.
Update packages gradually.
Never update many core packages simultaneously.

DO
    • Keep dependencies minimal.
    • Prefer mature libraries.
    • Document every important dependency.
    • Review dependencies regularly.

DON'T
    • Duplicate functionality.
    • Use abandoned packages.
    • Depend on platform-specific libraries without necessity.

RELATED DOCUMENTS
    • 01_Architecture.md
    • 06_TechStack.md
    • ADR-001_Architecture.md

