Psycholistica 
Document: 10_ProjectRules Version: 1.0 Status: Active Last Updated:
2026-07-30 

PURPOSE 
This document contains the high-level implementation rules for the
entire project. 
It is intended to be the primary reference for developers and AI coding
assistants. 

ALWAYS 
    Follow Feature First Architecture. 
    Build generic systems before feature-specific implementations. 
    Keep every feature isolated. 
    Keep UI independent from the data source. 
    Use Riverpod for state management and dependency injection. 
    Use go_router for navigation. 
    Use repository interfaces between UI and storage. 
    Prefer reusable components. 
    Keep widgets small and focused. 
    Keep methods short and readable. 
    Prefer explicit dependencies. 
    Design for future expansion. 

NEVER 
    Access Supabase directly from UI. 
    Put business logic inside widgets. 
    Create global models, controllers or screens folders. 
    Couple one feature directly to another. 
    Use Event Bus. 
    Introduce hidden dependencies. 
    Duplicate business logic. 
    Optimize prematurely. 

CONTENT PLATFORM RULE 
Always think in terms of Content, not individual content types. 
Every new feature should extend the platform rather than creating a
parallel architecture. 

SUBSCRIPTION RULE 
Subscriptions belong to the platform. 
Never implement subscription logic separately inside individual
features. 

DATA RULE 
Presentation 
? 
Repository 
? 
Datasource 
Only datasources communicate with external storage. 

FEATURE RULE 
Every new feature should contain: 
data/ 
domain/ 
presentation/ 
Do not bypass this structure. 

SHARED CODE 
Place reusable UI components in: 
shared/ 
Place reusable infrastructure in: 
core/ 
Do not move feature-specific code into shared. 

DEVELOPMENT RULES 
Before adding a new class ask: 
    Is it really needed? 
    Can an existing abstraction be reused? 
    Does it follow the architecture? 
Before adding a package ask: 
    Does Flutter already solve this? 
    Is there an approved package? 

CODE QUALITY 
Every change should improve one of the following: 
    readability 
    maintainability 
    scalability 
    testability 
If it improves none of them, reconsider the change. 

PROJECT PHILOSOPHY 
The project is built for long-term evolution. 
Adding a new content type should be straightforward. 
Adding a new platform should require little or no architectural changes. 

RELATED DOCUMENTS 
    01_Architecture.md 
    02_CodingStandards.md 
    03_FolderStructure.md 
    09_Packages.md 
    ADR-001_Architecture.md 

