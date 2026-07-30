Psycholistica

Document: 04_ContentModel Version: 1.0 Status: Active Last Updated:2026-07-30

PURPOSE

This document defines the universal content model used throughout theapplication.

The platform is built around a single concept:

Content

Every new content type must integrate into this model rather thancreating a separate architecture.

CORE PRINCIPLE

Build generic systems first.

Meditations are the first implementation, not the foundation of thearchitecture.

Future content types should plug into the same model.

CONTENT HIERARCHY

Content
│
├── Meditation
├── Book
├── Article
├── Audiobook
├── Course
├── PsychologicalTest
├── DiaryEntry
└── FutureContent

BASE CONTENT

Every content item shares these fields:

id

title

description

image

premium

tags

Optional common fields:

author

language

createdAt

updatedAt

category

CONTENT TYPES

Meditation

Additional fields:

audioUrl

duration

narrator

Book

Additional fields:

pdfUrl

pages

Article

Additional fields:

html

readingTime

Audiobook

Additional fields:

audioUrl

duration

chapters

Course

Additional fields:

lessons

progress

PREMIUM MODEL

Premium access belongs to Content, not to individual features.

Every content type can be:

Free

Premium

The subscription system checks access independently of content type.

DATA SOURCE

Current:

Local Dart objects

Future:

Supabase

The UI must receive the same Content entities regardless of where theyoriginate.

EXTENDING THE PLATFORM

When introducing a new content type:

Create a new feature.

Extend the Content model.

Implement a repository.

Build the UI.

Register navigation.

Existing features should not require modification.

DO

Reuse the Content abstraction.

Keep shared fields in the base model.

Isolate type-specific fields.

DON'T

Duplicate common properties.

Build feature-specific subscription logic.

Create independent content systems.

RELATED DOCUMENTS

00_ProjectOverview.md

01_Architecture.md

03_FolderStructure.md

05_DataFlow.md