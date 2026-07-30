Psycholistica
Document: 11_Terminology Version: 1.0 Status: Active Last Updated:
2026-07-30

PURPOSE
This document defines the official terminology used throughout the
project.
Using consistent terminology improves communication, documentation, code
readability and AI-generated code quality.

CORE TERMS
Content
A generic piece of information presented to the user.
Examples:
    • Meditation
    • Book
    • Article
    • Audiobook
    • Course
Never create architecture around a specific content type.

Content Type
A category describing a specific kind of Content.
Examples:
    • Meditation
    • Book
    • Article
    • Audiobook
    • Course

Feature
An isolated functional module.
Examples:
    • Home
    • Library
    • Subscription
    • Authentication
Every feature contains:
    • data
    • domain
    • presentation

Repository
The abstraction between presentation and data sources.
Presentation never communicates directly with external storage.

Datasource
The implementation responsible for reading or writing data.
Examples:
    • LocalDatasource
    • SupabaseDatasource

Provider
A Riverpod provider responsible for dependency injection or state
management.
Business logic should not depend on provider implementations.

Entity
A domain object that represents business data.
Entities should remain independent of UI and external frameworks.

Model
A data representation used for serialization or communication with
external systems.
Models may differ from Entities.

Platform
The application as a whole.
Subscriptions, authentication and shared infrastructure belong to the
platform.

Premium Content
Content that requires an active subscription or another access rule.
Access control should be implemented centrally.

Subscription
The mechanism that grants access to premium functionality.
It is a platform feature, not a content feature.

Shared
Reusable code used by multiple features.
Contains:
    • reusable widgets
    • common utilities
    • shared UI components

Core
Application infrastructure.
Examples:
    • routing
    • configuration
    • themes
    • services
    • base abstractions

NAMING PRINCIPLES
Use one official term for one concept.
Avoid synonyms for the same architectural element.
Examples:
Preferred:
    • Content
    • Repository
    • Datasource
    • Feature
    • Provider
Avoid:
    • Module (when Feature is intended)
    • Service (when Repository is intended)
    • Item (when Content is intended)

RELATED DOCUMENTS
    • 00_ProjectOverview.md
    • 01_Architecture.md
    • 03_FolderStructure.md
    • 04_ContentModel.md
    • 10_ProjectRules.md

