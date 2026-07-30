Psycholistica

Document: 03_FolderStructure Version: 1.0 Status: Active Last Updated:2026-07-30

PURPOSE

This document defines the directory structure of the project.

The folder structure is part of the architecture and should remainstable.

Every new feature must follow this layout.

ROOT STRUCTURE

psycholistica_app/

    assets/

    Documentation/

    lib/

    test/

    web/

    pubspec.yaml

    README.md

LIB STRUCTURE

lib/

    app/

    core/

    shared/

    features/

    main.dart

app

Purpose:

Application bootstrap.

Contains:

App

MaterialApp

Router

Theme

Localization

Must not contain business logic.

core

Purpose:

Global infrastructure.

Structure:

core/

    constants/

    router/

    services/

    theme/

    utils/

    extensions/

Core contains only reusable infrastructure.

Never feature-specific code.

shared

Purpose:

Reusable components shared across multiple features.

Structure:

shared/

    widgets/

    models/

    dialogs/

    components/

Examples:

PrimaryButton

ContentCard

LoadingView

ErrorView

features

Every business feature owns its own code.

Example:

features/

    home/

    meditation/

    player/

    subscription/

    profile/

    books/

    articles/

Each feature is independent.

FEATURE STRUCTURE

Every feature follows the same layout.

feature/

    data/

        datasources/

        models/

        repositories/

    domain/

        entities/

        repositories/

    presentation/

        pages/

        widgets/

        providers/

DATA LAYER

Responsibilities:

Read data

Write data

Convert DTOs

Repository implementation

Never contains UI.

DOMAIN LAYER

Responsibilities:

Business entities

Business rules

Repository interfaces

Never imports Flutter widgets.

PRESENTATION LAYER

Responsibilities:

Pages

Widgets

Riverpod Providers

UI state

Must not communicate directly with databases.

ASSETS

assets/

    images/

    icons/

    audio/

    fonts/

    animations/

All assets are registered inside pubspec.yaml.

DOCUMENTATION

Documentation/

    00_ProjectOverview.md

    01_Architecture.md

    02_CodingStandards.md

    03_FolderStructure.md

    04_ContentModel.md

    05_DataFlow.md

    06_TechStack.md

    07_GitWorkflow.md

    08_Roadmap.md

    ADR-001-Architecture.md

RULES

DO

Keep every feature self-contained.

Place reusable code in shared.

Place infrastructure in core.

Keep folder names consistent.

DON'T

Create global models folder.

Create global controllers folder.

Create global screens folder.

Mix business logic with infrastructure.

WHEN ADDING A NEW FEATURE

Create:

features/

    new_feature/

        data/

        domain/

        presentation/

No existing feature should be modified unless absolutely necessary.

RELATED DOCUMENTS

00_ProjectOverview.md

01_Architecture.md

02_CodingStandards.md

04_ContentModel.md