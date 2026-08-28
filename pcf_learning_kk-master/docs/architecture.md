# Framework Architecture

## Document status

**Status:** Draft

This document describes the proposed architecture of the PCF Development
Framework.

The architecture will evolve as the first reference controls, validation
scripts, templates, and reusable framework utilities are implemented.

This document should be updated whenever an important architectural decision
is made.

## 1. Purpose

The framework is intended to help developers with limited coding experience
create Power Apps Component Framework controls for Power Platform model-driven
apps.

The framework will provide:

- Beginner-friendly documentation
- Standard project structures
- Templates for field controls
- Templates for dataset controls
- Reusable TypeScript and React patterns
- Automated validation
- Testing guidance
- Dataverse solution packaging
- GitHub Copilot instructions
- Reusable GitHub Copilot prompts
- Dedicated agent skills for repeatable workflows

The framework will use official Microsoft PCF tooling rather than replacing it.

The initial version will target PCF controls for Power Platform model-driven
apps. Support for canvas apps and Power Pages is outside the initial scope.

## 2. Architectural goals

The architecture should:

1. Keep individual PCF controls easy to understand.
2. Separate PCF lifecycle code from React user-interface code.
3. Allow reusable functionality to be shared between controls.
4. Support both field and dataset controls.
5. Make generated code predictable and testable.
6. Allow controls to be developed without GitHub Copilot.
7. Allow GitHub Copilot to follow repeatable and validated workflows.
8. Support local development, testing, packaging, and deployment.
9. Prevent common PCF development mistakes.
10. Remain simple enough for developers who are new to TypeScript and React.
11. Keep controls compatible with the official Power Platform CLI build
    process.
12. Use deterministic scripts and tools for operations that can be validated
    automatically.
13. Provide clear error messages and recovery instructions for inexperienced
    developers.
14. Introduce dependencies only when they solve a documented requirement.
15. Keep generated and reusable code documented in beginner-friendly language.

## 3. Initial architectural approach

The repository will initially use a simple multi-control structure.

The repository will not begin as a complex monorepo or a published npm package.

The initial repository will contain:

- Documentation
- Reference PCF controls
- Reusable framework utilities
- Control templates
- Validation scripts
- Dataverse solution packaging
- GitHub Copilot configuration

This structure may later be converted into an npm workspace if the number of
controls and shared packages makes that necessary.

Reusable abstractions should be introduced only after a pattern has been
implemented and validated in at least one complete reference control.

The framework should not create abstractions only because they might be useful
in the future.

The initial implementation sequence will therefore be:

1. Create and understand one complete field control.
2. Validate the development, testing, and packaging process.
3. Document the patterns used by the field control.
4. Extract only the patterns that are genuinely reusable.
5. Create one complete dataset control.
6. Review which field and dataset patterns can be shared.
7. Introduce templates and automation.
8. Add GitHub Copilot instructions and agent skills.

## 4. Proposed repository structure

The proposed target structure is:

```text
pcf_learning_kk/
├── .github/
│   ├── copilot-instructions.md
│   ├── instructions/
│   ├── prompts/
│   ├── skills/
│   └── workflows/
├── controls/
│   ├── field/
│   └── dataset/
├── docs/
│   └── architecture.md
├── examples/
├── framework/
│   ├── components/
│   ├── services/
│   ├── types/
│   └── validation/
├── scripts/
├── solutions/
├── templates/
│   ├── field-control/
│   └── dataset-control/
├── .gitignore
├── package.json
└── README.md
```

This is a proposed target structure, not the current repository structure.

Directories should be created only when the corresponding capability is
introduced. Empty directories should not be created only to reproduce this
diagram.

The structure may change after the first reference controls provide practical
evidence about which folders and abstractions are actually required.

## 5. Directory responsibilities

### 5.1 `.github`

The `.github` directory will contain GitHub-specific configuration and GitHub
Copilot customizations.

Planned content includes:

- Repository-wide GitHub Copilot instructions
- Path-specific GitHub Copilot instructions
- Reusable prompt files
- Dedicated agent skills
- GitHub Actions workflows
- Pull request templates

Repository-wide instructions will define conventions that apply throughout the
repository.

Path-specific instructions will define conventions for particular files or
directories, such as:

- TypeScript files
- React components
- PCF manifest files
- Unit tests
- GitHub Actions workflows

Agent skills will be introduced only after the corresponding framework
workflows can be executed and validated without artificial intelligence.

### 5.2 `controls`

The `controls` directory will contain complete and buildable PCF control
projects.

Field and dataset controls will be separated to make their different
architectural patterns clear to developers.

The proposed structure is:

```text
controls/
├── field/
│   └── StatusBadge/
└── dataset/
    └── RecordCardList/
```

Each control should remain compatible with official Power Platform CLI
tooling.

Each control should be independently understandable and buildable.

The first reference control will be a field control. A dataset reference
control will be introduced after the field-control patterns and validation
workflow are stable.

### 5.3 `docs`

The `docs` directory will contain educational, architectural, and
troubleshooting documentation.

Planned documentation includes:

- Local development environment setup
- PCF fundamentals
- Field control development
- Dataset control development
- TypeScript fundamentals used by the framework
- React fundamentals used by the framework
- Testing
- Debugging
- Dataverse deployment
- Solution packaging
- GitHub Copilot usage
- Troubleshooting
- Architectural decisions

Documentation should assume that the reader may be unfamiliar with:

- Git
- Terminal commands
- Node.js and npm
- TypeScript
- React
- PCF lifecycle methods
- Dataverse solution packaging

Instructions should explain:

- What each command does
- Where each command must be executed
- Which files the command creates or changes
- What successful output should look like
- What common errors mean
- How the developer can verify each step

### 5.4 `examples`

The `examples` directory may contain small, focused demonstrations of
individual framework patterns.

Possible examples include:

- Reading a bound manifest property
- Returning a changed value
- Handling null values
- Handling read-only state
- Displaying loading and error states
- Using Fluent UI components
- Handling dataset paging
- Handling record selection

Complete and buildable reference controls should remain in `controls`.

Examples should not unnecessarily duplicate complete control projects.

The need for a separate `examples` directory will be reviewed after the first
reference controls have been implemented.

### 5.5 `framework`

The `framework` directory will contain code that is reusable across multiple
controls.

Possible content includes:

- Shared React components
- PCF adapter utilities
- Dataverse service wrappers
- Shared TypeScript types
- Formatting utilities
- Validation utilities
- Localization helpers
- Logging helpers
- Error-handling helpers

Reusable abstractions should be added only after a pattern has been implemented
and validated in at least one complete reference control.

Framework code should not hide important PCF concepts from developers.
Documentation should explain what the reusable code does and how it relates to
the standard PCF lifecycle.

#### `framework/components`

This directory may contain React components shared by multiple controls.

Examples may include:

- Loading indicators
- Error messages
- Empty-state components
- Read-only value displays
- Accessible labels

A component should be moved into this directory only when it is genuinely used
by more than one control.

#### `framework/services`

This directory may contain reusable services.

Examples may include:

- Dataverse access
- Logging
- Formatting
- Localization
- Error handling

Services should be small, independently testable, and isolated from React
presentation logic where possible.

#### `framework/types`

This directory may contain TypeScript types shared between multiple controls
or framework utilities.

Types that are specific to one control should remain inside that control.

#### `framework/validation`

This directory may eventually contain reusable validation logic.

Executable validation entry points may remain in `scripts`.

The distinction should be:

- `framework/validation` contains reusable validation logic.
- `scripts` contains commands that developers, CI workflows, and agent skills
  can execute.

This separation should be introduced only when shared validation logic is
actually required.

### 5.6 `scripts`

The `scripts` directory will contain deterministic automation used by
developers, continuous integration workflows, and future agent skills.

Planned scripts include:

- Repository validation
- PCF manifest validation
- Production builds
- Component version updates
- Dataverse solution packaging
- Control scaffolding
- Dependency checks

Scripts should:

- Provide clear and beginner-friendly output
- Return a nonzero exit code when an operation fails
- Avoid making destructive changes without an explicit command
- Explain which file or configuration caused a failure
- Provide a recommended next step when possible

A developer should be able to run the scripts without GitHub Copilot.

### 5.7 `solutions`

The `solutions` directory will contain Dataverse solution projects used to
package one or more PCF controls.

The initial version will use one solution project for the reference controls.

This approach may be reconsidered if controls later require:

- Independent versioning
- Independent release cycles
- Separate ownership
- Separate deployment schedules
- Distribution to different Power Platform environments

Development builds should not be distributed as release artifacts.

Solution packaging should use production builds of the included controls.

### 5.8 `templates`

The `templates` directory will contain source files used to scaffold new field
and dataset controls.

Templates should be based on working reference controls.

A template should not be created before the corresponding reference control has
been:

1. Built successfully
2. Tested locally
3. Tested in a model-driven app
4. Reviewed for accessibility
5. Reviewed for responsive behavior
6. Packaged in a Dataverse solution
7. Documented

Templates may eventually include:

- PCF lifecycle adapter files
- React component files
- Test files
- Styling files
- Localization files
- Framework configuration
- Documentation templates

Templates should contain clearly identified placeholders for values such as:

- Control name
- Namespace
- Publisher prefix
- Bound property name
- Property type
- Display name
- Description
- Component version

## 6. PCF control architecture

Each PCF control will be divided into clear responsibilities.

The main parts of a control are:

1. PCF manifest
2. PCF lifecycle adapter
3. React user interface
4. Services and utilities
5. Tests
6. Styles and localization resources

### 6.1 PCF manifest

`ControlManifest.Input.xml` defines the contract between the control and the
Power Platform host.

The manifest is responsible for declaring:

- Control namespace
- Control constructor name
- Control version
- Display name
- Description
- Bound properties
- Input properties
- Dataset definitions
- Required resources
- Platform libraries
- Required platform features

The manifest should remain explicit and understandable.

Changes to the manifest should be followed by a build so that generated
TypeScript types are updated.

Generated manifest types should not be manually edited.

### 6.2 PCF lifecycle adapter

The PCF lifecycle adapter connects the Power Platform host to the React user
interface.

The adapter is responsible for:

- Receiving the PCF context
- Reading properties defined in the manifest
- Handling `init`
- Handling `updateView`
- Calling `notifyOutputChanged`
- Returning values through `getOutputs`
- Cleaning up resources through `destroy`
- Passing typed values and callbacks to React components
- Responding to changes in available width and height where required
- Respecting read-only and security-related states

The adapter should contain as little presentation logic as possible.

The complete PCF context should not be passed into React components unless
there is a documented reason.

### 6.3 React user interface

React components are responsible for rendering the user interface.

React components should:

- Receive data through typed properties
- Notify the adapter through callback functions
- Support loading states
- Support empty states
- Support error states
- Support read-only behavior
- Support null values
- Support accessibility
- Support responsive layouts
- Use Microsoft Fluent UI where appropriate
- Avoid depending directly on the complete PCF context
- Avoid performing Dataverse operations directly where a service can provide
  a clearer separation

React components should be testable independently from the PCF runtime wherever
possible.

### 6.4 Services and utilities

Services and utilities will contain reusable logic that should not be coupled
to a specific React component.

Possible responsibilities include:

- Dataverse operations
- Data formatting
- Input validation
- Localization
- Logging
- Error handling
- Mapping PCF data into UI-friendly models

Services should be small and independently testable.

Services should not be introduced before a clear use case exists.

### 6.5 Tests

Tests should verify business logic and React behavior independently from the
PCF runtime where practical.

Possible tests include:

- Rendering a value
- Rendering a null value
- Rendering a read-only state
- Invoking a callback after user interaction
- Displaying loading and error states
- Mapping Dataverse values to UI models
- Validating configuration input

The local PCF test harness and unit tests serve different purposes.

Unit tests validate isolated logic and components.

The PCF test harness validates how the control behaves within the simulated PCF
development environment.

Testing inside a real model-driven app remains necessary for platform features
that cannot be fully simulated locally.

### 6.6 Styles and localization

Styles should be scoped to the control to prevent conflicts with the
model-driven app host.

The framework should prefer Fluent UI styling and theming where practical.

User-facing text should not be unnecessarily hardcoded inside React
components.

Localization resources should be introduced when the first control contains
user-facing text that requires translation or environment-specific labels.

## 7. Field control architecture

A field control normally works with one primary bound value.

The expected data flow is:

```text
Dataverse column
    ↓
PCF context
    ↓
Field control adapter
    ↓
React component properties
    ↓
User interaction
    ↓
React callback
    ↓
notifyOutputChanged
    ↓
getOutputs
    ↓
Dataverse column
```

The field control adapter reads the current value from the PCF context and
passes the value to the React component.

When a user changes the value, the React component calls a callback provided by
the adapter.

The adapter stores the changed value and calls `notifyOutputChanged`.

The Power Platform host then calls `getOutputs` to retrieve the changed value.

A field control should account for:

- Null values
- Undefined or temporarily unavailable values
- Read-only state
- Column-level security where applicable
- User input validation
- Responsive behavior
- Accessibility
- Output notification frequency
- Cleanup when the control is destroyed

## 8. First reference control

The first reference control will be a status badge field control.

The purpose of this control is to establish the first complete development
pattern without introducing unnecessary functional complexity.

The control should demonstrate:

- A bound Dataverse value
- Null-value handling
- Read-only behavior
- React rendering
- Fluent UI styling
- Accessible output
- Responsive behavior
- Unit testing
- Local test harness usage
- Production build
- Dataverse solution packaging

The first version should be primarily display-oriented.

Editable behavior may be introduced later if it provides additional learning value.

The reference control should be fully understood and documented before reusable
framework abstractions or templates are extracted from it.

## 9. Dataset control architecture

A dataset control works with multiple records and columns.

The expected data flow is:

```text
Dataverse view or subgrid
    ↓
PCF dataset context
    ↓
Dataset control adapter
    ↓
Normalized records and columns
    ↓
React dataset component
    ↓
Paging, sorting, filtering, or selection actions
    ↓
PCF dataset APIs
```

Dataset controls introduce additional concerns:

- Record collections
- Column metadata
- Loading states
- Empty states
- Error states
- Paging
- Sorting
- Filtering
- Record selection
- Dataset refresh
- Main-grid behavior
- Subgrid behavior
- Responsive height and width
- Record navigation
- Large result sets
- Performance

The dataset adapter should translate PCF-specific dataset objects into simpler,
typed models for React components.

The React component should not need to understand every detail of the PCF
dataset API.

Dataset framework abstractions will be introduced only after:

1. The field-control architecture is stable.
2. The validation workflow is operational.
3. The first field control has been packaged successfully.
4. The team understands which patterns are specific to field controls.
5. A complete dataset reference control has been implemented and tested.

## 10. GitHub Copilot architecture

GitHub Copilot integration will use several complementary customization
mechanisms.

These mechanisms serve different purposes and should not duplicate or
contradict one another.

### 10.1 Repository instructions

Repository instructions will define permanent project conventions, validated
commands, and architectural boundaries.

The repository-wide instruction file will eventually be located at:

```text
.github/copilot-instructions.md
```

Possible instructions include:

- Use TypeScript and React.
- Follow the documented PCF and React separation.
- Do not edit generated files.
- Do not edit build output.
- Use official Power Platform CLI commands.
- Run validation after making changes.
- Explain changes in beginner-friendly language.
- Do not introduce dependencies without explaining why they are required.

Repository instructions should be concise and should contain rules that apply
to most work in the repository.

### 10.2 Path-specific instructions

Path-specific instructions will define rules that apply to particular file
types or directories.

Possible instruction files include:

```text
.github/instructions/pcf.instructions.md
.github/instructions/react.instructions.md
.github/instructions/tests.instructions.md
.github/instructions/manifests.instructions.md
```

Examples of path-specific rules include:

- React component conventions
- PCF lifecycle conventions
- Manifest property conventions
- Test naming conventions
- Generated-file restrictions

### 10.3 Prompt files

Prompt files will provide reusable, user-initiated workflows.

Possible prompt files include:

- Create a field control
- Create a dataset control
- Add a manifest property
- Generate unit tests
- Review a PCF control
- Explain a control to a beginner
- Diagnose a build failure

Prompt files should reference the minimum number of files needed for the task.

This should reduce unnecessary repository scanning and unnecessary GitHub
Copilot usage.

### 10.4 Agent skills

Agent skills will define specialized, repeatable, multi-step processes.

The first proposed skills are:

1. Validate a PCF control
2. Create a PCF control
3. Diagnose a PCF problem
4. Package a PCF solution

Agent skills should orchestrate deterministic framework commands and report
their results.

Agent skills should not replace:

- TypeScript compilation
- ESLint
- Unit tests
- Manifest validation
- PCF production builds
- Dataverse solution builds

Agent skills should be introduced only after the underlying workflow works
without an agent.

### 10.5 GitHub Copilot limitations

GitHub Copilot output must be reviewed.

Generated code should not be assumed to be correct because it compiles.

Validation should include:

- Architectural review
- TypeScript compilation
- Linting
- Unit tests
- PCF build
- Accessibility review
- Model-driven app testing
- Solution packaging validation

The framework should use GitHub Copilot as a development assistant rather than
as the only source of technical decisions.

## 11. Validation architecture

Validation should use deterministic tools wherever possible.

The validation workflow should eventually include:

1. Repository structure validation
2. PCF manifest validation
3. TypeScript compilation
4. ESLint
5. Unit tests
6. Production PCF build
7. Generated-file checks
8. Dependency checks
9. Solution packaging validation
10. Optional Power Platform solution analysis

Validation results should be grouped into:

- Errors
- Warnings
- Recommendations
- Successful checks

Errors should block packaging or release.

Warnings should describe a potential problem that requires human review.

Recommendations should identify optional improvements.

Successful checks should help beginners understand what was validated.

## 12. Common PCF mistakes to prevent

The framework should help prevent common mistakes, including:

- Editing generated files
- Committing dependency folders
- Committing build output
- Deploying development builds
- Forgetting to update the control version
- Using unsupported host application APIs
- Accessing the host page directly
- Calling output notifications too frequently
- Refreshing datasets unnecessarily
- Ignoring null values
- Ignoring read-only behavior
- Ignoring column-level security behavior
- Using unscoped CSS
- Using browser storage for sensitive or persistent state
- Hardcoding environment-specific identifiers
- Hardcoding user-facing text unnecessarily
- Failing to clean up resources
- Assuming the local test harness behaves exactly like Dataverse
- Adding dependencies without understanding their impact

Where possible, these rules should be enforced through scripts, linting, tests,
or build checks.

Rules that cannot be validated automatically should be included in review
checklists and GitHub Copilot instructions.

## 13. Dependency strategy

Dependencies will be introduced gradually.

The initial technology choices are:

- Node.js Long-Term Support
- npm
- TypeScript
- React
- Microsoft Fluent UI
- Microsoft Power Platform CLI
- Official PCF build tooling
- ESLint
- A unit-testing framework to be selected later

Exact dependency versions will be documented after the first PCF project has
been initialized and the generated dependency versions have been reviewed.

Dependencies should be locked using the npm lock file.

Additional dependencies should be introduced only when they solve a documented
requirement.

Before adding a dependency, the following questions should be answered:

1. What problem does the dependency solve?
2. Can the requirement be met without the dependency?
3. Is the dependency actively maintained?
4. Is the dependency compatible with the PCF build process?
5. Does the dependency increase the control bundle size?
6. Does the dependency introduce security or licensing concerns?
7. Will beginners need to understand the dependency?
8. Can the dependency be validated in automated builds?

The repository should initially use npm because the official PCF tooling and
generated project scripts use the Node.js package ecosystem.

An npm workspace should be introduced only if multiple controls and shared
packages create a demonstrated need for workspace management.

## 14. Build strategy

Each PCF control should support:

- Dependency installation
- Local development build
- Local test harness
- Unit tests
- Linting
- Production build

The exact commands will be documented after the first control is initialized.

Production artifacts should be generated by deterministic build commands.

Generated build output should not be treated as source code.

Build output should not normally be committed to the repository.

Continuous integration should eventually reproduce the same validation and
production build steps used locally.

## 15. Packaging and deployment strategy

PCF controls will be packaged in Dataverse solutions.

The initial repository will use one solution project for the reference
controls.

The intended development flow is:

```text
Source code
    ↓
Install dependencies
    ↓
Run validation
    ↓
Run tests
    ↓
Create production PCF build
    ↓
Build Dataverse solution
    ↓
Produce solution artifact
    ↓
Import into target environment
```

Direct development deployment may be used for testing