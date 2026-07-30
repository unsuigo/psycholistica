Psycholistica
Document: ADR-001_Architecture Version: 1.0 Status: Accepted Date:
2026-07-30

ARCHITECTURE DECISION RECORD
ADR-001
Title:
Core Architecture Decisions
Status:
Accepted

CONTEXT
Psycholistica is designed as a long-term psychological content platform.
The project must support continuous growth without requiring
architectural rewrites.
The same codebase should serve multiple platforms and accommodate new
content types over time.

DECISION 1
Flutter
Decision
Flutter is the primary application framework.
Reason
    • Single codebase
    • Excellent web support
    • Native mobile support
    • Desktop support
    • Mature ecosystem
Consequences
Positive
    • One shared UI
    • Lower maintenance cost
    • Faster feature delivery
Negative
    • Larger web bundle compared to traditional web frameworks

DECISION 2
Feature First Architecture
Decision
Organize the application by features instead of technical layers.
Reason
    • Better scalability
    • Easier navigation
    • Clear ownership
    • Independent feature development
Consequences
Features remain isolated and easier to maintain.

DECISION 3
Repository Pattern
Decision
Presentation communicates only through repositories.
Reason
    • UI independence
    • Easy datasource replacement
    • Better testing
    • Cleaner separation of concerns
Consequences
Switching from local storage to Supabase requires repository
implementation changes only.

DECISION 4
Riverpod
Decision
Use Riverpod for state management and dependency injection.
Reason
    • Compile-time safety
    • Explicit dependencies
    • Testability
    • Excellent Flutter integration
Consequences
No global mutable state.

DECISION 5
go_router
Decision
Use go_router as the routing solution.
Reason
    • Official Flutter recommendation
    • Strong web support
    • Deep linking
    • Declarative navigation

DECISION 6
Supabase
Decision
Supabase is the primary backend.
Reason
    • Authentication
    • PostgreSQL
    • Storage
    • Realtime capabilities
    • Flutter support
Consequences
Backend services remain centralized and replaceable.

DECISION 7
Progressive Web App First
Decision
Develop the web application first.
Reason
    • Fast delivery
    • Easy deployment
    • Rapid iteration
    • Immediate accessibility
Consequences
The architecture must remain platform-independent.

DECISION 8
Universal Content Model
Decision
Build around the concept of Content instead of specific content types.
Reason
    • Unlimited extensibility
    • Shared business logic
    • Consistent architecture
Consequences
New content types should require minimal additional infrastructure.

REJECTED ALTERNATIVES
    • Architecture centered on Meditations only.
    • Global singleton-based state management.
    • Direct database access from UI.
    • Separate architectures for Web and Mobile.
    • Feature coupling through shared business logic.

RESULT
The selected architecture prioritizes:
    • scalability
    • maintainability
    • portability
    • testability
    • long-term evolution
All future architectural decisions should remain consistent with this
ADR.

RELATED DOCUMENTS
    • 00_ProjectOverview.md
    • 01_Architecture.md
    • 04_ContentModel.md
    • 06_TechStack.md
    • 10_ProjectRules.md

