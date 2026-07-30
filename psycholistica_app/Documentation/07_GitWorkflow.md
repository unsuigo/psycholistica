Psycholistica

Document: 07_GitWorkflow Version: 1.0 Status: Active Last Updated:2026-07-30

PURPOSE

This document defines the Git workflow used throughout the project.

The workflow should remain simple, predictable and safe for continuousdevelopment.

REPOSITORY

Source Control

Git

GitHub

The GitHub repository is the single source of truth.

BRANCH STRATEGY

feature/*
│
▼
dev
│
▼
main

feature/*

Used for individual tasks or features.

Examples:

feature/home

feature/player

feature/subscription

feature/books

Never commit unfinished work directly to dev or main.

dev

Integration branch.

All completed features are merged here first.

Purpose:

integration

testing

bug fixing

main

Production branch.

The main branch must always remain stable.

It is automatically deployed to GitHub Pages.

DEPLOYMENT

Current deployment target:

GitHub Pages

The first public release is delivered as a Progressive Web App (PWA).

Future platform builds (Android, iOS, Windows, macOS, Linux) use thesame source code.

DEVELOPMENT WORKFLOW

Create feature branch

↓

Implement feature

↓

Test locally

↓

Merge into dev

↓

Integration testing

↓

Merge into main

↓

Automatic deployment

COMMIT GUIDELINES

Each commit should represent one logical change.

Examples:

Add meditation repository

Implement audio player

Fix subscription validation

Avoid combining unrelated changes.

BEFORE MERGING

Checklist:

Project builds successfully.

Analyzer reports no errors.

Formatting applied.

Architecture rules respected.

No temporary debug code.

Feature tested.

HOTFIXES

Critical production fixes:

main

↓

hotfix/*

↓

main

↓

dev

The fix must also be merged back into dev.

VERSIONING

Prefer semantic versioning.

Example:

0.1.0

0.2.0

1.0.0

DO

Small commits.

Meaningful commit messages.

Frequent pushes.

Keep main deployable.

DON'T

Commit generated files unless required.

Commit secrets or API keys.

Work directly on main.

Skip testing before merge.

RELATED DOCUMENTS

00_ProjectOverview.md

01_Architecture.md

06_TechStack.md

08_Roadmap.md
