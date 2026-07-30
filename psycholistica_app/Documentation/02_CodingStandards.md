# Coding Standards

## Purpose

This document defines the coding standards used throughout the Psycholistica project.

The goal is to ensure that the codebase remains:

- Consistent
- Readable
- Maintainable
- Scalable
- Easy for both developers and AI assistants to understand

The project follows the official Dart Style Guide whenever possible.

---

# General Principles

## Keep Code Simple

Write the simplest solution that correctly solves the problem.

Avoid unnecessary abstractions.

---

## Single Responsibility

Every class should have one clear responsibility.

Avoid "God Objects" that manage multiple unrelated concerns.

---

## Composition Over Inheritance

Prefer composition whenever possible.

Avoid deep inheritance hierarchies.

---

## Explicit Dependencies

All dependencies should be injected.

Never hide dependencies inside classes.

---

## Small Classes

Prefer many small focused classes instead of large multi-purpose classes.

---

## Small Methods

Methods should be easy to understand.

Prefer extracting logic into private helper methods instead of writing very long methods.

---

# Dart Style Guide

Psycholistica follows the official Dart coding conventions.

Whenever this document does not define a rule, use the official Dart recommendations.

---

# Naming Conventions

## Classes

Use PascalCase.

Examples:

```dart
class HomePage {}

class AudioPlayerService {}

class SubscriptionRepository {}
```

---

## Methods

Use lowerCamelCase.

Examples:

```dart
void playAudio() {}

Future<void> loadContent() async {}

bool isPremiumUser() {}
```

---

## Variables

Use lowerCamelCase.

Examples:

```dart
final currentUser;

var selectedContent;

int pageIndex;
```

---

## Private Fields

Private members begin with `_`.

Examples:

```dart
final _repository;

bool _isLoading;

String _title;
```

---

## Constants

Use lowerCamelCase.

Examples:

```dart
const animationDuration = Duration(milliseconds: 300);

const maxRetryCount = 3;
```

---

## Enums

Enum names use PascalCase.

Enum values use lowerCamelCase.

```dart
enum ContentType {
  meditation,
  article,
  audiobook,
  course,
}
```

---

## Extensions

Use PascalCase.

```dart
extension DurationExtensions on Duration {}
```

---

## Files

Use snake_case.

Examples:

```
audio_player_service.dart

subscription_repository.dart

content_card.dart

app_router.dart
```

---

## Folders

Use snake_case.

Examples:

```
audio_player/

subscription/

shared/

content_library/
```

---

## Providers

Always end provider names with `Provider`.

Examples:

```dart
final authProvider = Provider(...);

final settingsProvider = Provider(...);

final contentRepositoryProvider = Provider(...);
```

---

## Repository Interfaces

Use abstract classes.

```dart
abstract class ContentRepository {}
```

---

## Repository Implementations

Append `Impl`.

```dart
class ContentRepositoryImpl
    implements ContentRepository {}
```

---

## Widgets

Widgets are regular Dart classes.

Use PascalCase.

```dart
class HomePage extends StatelessWidget {}

class ContentCard extends StatelessWidget {}
```

---

## Boolean Variables

Use meaningful boolean names.

Examples:

```dart
isLoading

isPremium

hasAccess

canDownload

shouldRefresh
```

---

# File Organization

One primary public class per file.

The filename must match the class name.

Example:

```
content_repository.dart
    ContentRepository

content_repository_impl.dart
    ContentRepositoryImpl

home_page.dart
    HomePage
```

---

# Folder Organization

Project structure follows Feature First Architecture.

```
lib/

app/
core/
shared/
features/
```

Each feature contains:

```
feature/

data/
domain/
presentation/
```

---

# Imports

Prefer package imports.

Example:

```dart
import 'package:psycholistica/features/audio/...';
```

Avoid unnecessary relative imports.

Remove unused imports.

---

# Class Design

Prefer immutable classes whenever possible.

Use `final` by default.

Avoid mutable shared state.

---

# Methods

Keep methods short.

Prefer early return instead of deeply nested conditions.

Extract repeated logic into private helper methods.

---

# Widgets

Prefer small reusable widgets.

Avoid build methods longer than approximately 100 lines.

Extract complex UI into separate widgets.

---

# State Management

Riverpod is the only state management solution.

Do not introduce additional state management libraries.

Business logic belongs outside widgets.

---

# Dependency Injection

Use Riverpod providers for dependency injection.

Avoid global service locators.

Avoid hidden dependencies.

---

# Error Handling

Handle expected failures explicitly.

Avoid swallowing exceptions.

Use meaningful error messages.

---

# Async Code

Always use async/await instead of callback chains.

Avoid unawaited Futures unless intentionally fire-and-forget.

---

# Comments

Write self-explanatory code.

Comments should explain **why**, not **what**.

Remove outdated comments immediately.

---

# Formatting

Always run:

```bash
dart format .
```

before committing.

Run:

```bash
flutter analyze
```

before every commit.

---

# Performance

Do not optimize prematurely.

Measure first.

Optimize only confirmed bottlenecks.

---

# Testing

New business logic should be testable.

Prefer unit tests for repositories, services and use cases.

---

# Git Rules

Feature development:

```
feature/*
    ↓

dev
    ↓

main
```

Never commit broken code.

---

# Code Review Checklist

Before considering a task complete, verify:

- Code compiles
- flutter analyze passes
- Formatting applied
- No unused imports
- No dead code
- Naming follows Dart conventions
- Architecture is respected
- No duplicated logic
- Dependencies remain explicit
- Business logic is outside widgets

---

# Related Documents

- 01_Architecture.md
- 03_FolderStructure.md
- ADR-001_Architecture.md