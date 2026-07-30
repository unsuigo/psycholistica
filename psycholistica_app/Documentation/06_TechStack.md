Psycholistica

Document: 06_TechStack Version: 1.0 Status: Active Last Updated:2026-07-30

PURPOSE

This document defines the technologies approved for the Psycholisticaproject.

New technologies should only be introduced when they provide a cleararchitectural or maintenance benefit.

FRONTEND

Framework

Flutter

Language

Dart

Design System

Material 3

TARGET PLATFORMS

A single codebase should support:

Progressive Web App (PWA)

Android

iOS

Windows

macOS

Linux

The architecture must remain identical across all targets.

BACKEND

Platform

Supabase

Planned services:

Authentication

PostgreSQL Database

Storage

Edge Functions (if required)

Realtime (only if required)

The application must work with local data before Supabase integration.

STATE MANAGEMENT

Approved:

Riverpod

Purpose:

State management

Dependency Injection

Provider lifecycle

NAVIGATION

Approved:

go_router

Navigation should be centralized and declarative.

AUDIO

Requirements:

Streaming playback

Background playback (where supported)

Progress tracking

Pause / Resume

Premium access support

Audio implementation should be isolated behind an abstraction.

AUTHENTICATION

Current:

None (local development)

Future:

Supabase Authentication

Authentication must remain independent from content features.

SUBSCRIPTIONS

The subscription system is a platform service.

It controls access to premium content regardless of content type.

The implementation should be replaceable without affecting UI.

STORAGE STRATEGY

Stage 1

Local Dart collections

Stage 2

Supabase Database

Supabase Storage

The UI must not know which storage is used.

DEPLOYMENT

Source Control

GitHub

Branch Strategy

feature/* ↓ dev ↓ main

Deployment

GitHub Pages (PWA)

The main branch is the production branch.

DEVELOPMENT TOOLS

Primary IDE

Rider

Supported IDE

Visual Studio Code

Version Control

Git

GitHub

DO

Prefer stable libraries.

Keep external dependencies minimal.

Wrap third-party SDKs behind abstractions.

Prefer cross-platform solutions.

DON'T

Platform-specific code without necessity.

Direct dependency on backend SDKs inside UI.

Replace core technologies without architectural review.

RELATED DOCUMENTS

01_Architecture.md

04_ContentModel.md

05_DataFlow.md

07_GitWorkflow.md