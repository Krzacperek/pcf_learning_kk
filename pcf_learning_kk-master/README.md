# PCF Development Framework

A beginner-friendly framework for developing Power Apps Component Framework
controls for Power Platform model-driven apps using TypeScript and React.

## Project status

This project is currently in the initial design and proof-of-concept phase.

The repository structure, framework APIs, templates, dependencies, and
development workflows are not yet finalized.

## Purpose

Developing a PCF control requires knowledge of several technologies and
processes, including:

- Power Apps Component Framework
- TypeScript
- React
- Microsoft Fluent UI
- Node.js and npm
- Power Platform CLI
- Dataverse solutions
- Testing and debugging
- Application lifecycle management

This framework aims to reduce that complexity for developers with limited
PCF or pro-code experience.

The framework should provide:

- Beginner-friendly documentation
- Reusable TypeScript and React patterns
- Templates for field controls
- Templates for dataset controls
- Standard project structures
- Automated validation
- Testing guidance
- Solution packaging guidance
- GitHub Copilot instructions
- Reusable Copilot prompts
- Dedicated agent skills for repeatable workflows

## Target users

The primary audience is:

- Power Platform developers moving from low-code to pro-code development
- Developers who are new to TypeScript or React
- Developers creating their first PCF control
- Teams that want consistent PCF development standards
- Developers using GitHub Copilot to assist with PCF development

## Initial scope

The framework will initially target:

- Power Platform model-driven apps
- Microsoft Dataverse
- Field PCF controls
- Dataset PCF controls
- TypeScript
- React
- Microsoft Fluent UI
- Microsoft Power Platform CLI
- GitHub Copilot

## Design principles

The framework should follow these principles:

1. Use official Microsoft PCF tooling rather than replacing it.
2. Hide unnecessary complexity without hiding important PCF concepts.
3. Explain generated code in beginner-friendly language.
4. Prefer reusable and testable components.
5. Separate PCF lifecycle logic from React presentation logic.
6. Use deterministic scripts for generation and validation.
7. Use GitHub Copilot to orchestrate workflows, not to generate unverified code.
8. Validate generated code before it is packaged or deployed.
9. Follow accessibility and responsive-design practices.
10. Keep the framework usable without GitHub Copilot.

## Planned capabilities

The framework is expected to provide the following capabilities over time.

### Control creation

- Create a React field control
- Create a React dataset control
- Generate a valid PCF manifest
- Generate standard React components
- Generate starter tests
- Generate beginner-friendly documentation

### Validation

- Validate the PCF manifest
- Run TypeScript compilation
- Run linting
- Run unit tests
- Check PCF-specific development rules
- Produce a production build

### Packaging

- Package controls in a Dataverse solution
- Support managed and unmanaged solution builds
- Apply consistent component versioning
- Produce deployment artifacts

### GitHub Copilot integration

- Repository-wide development instructions
- Path-specific coding instructions
- Reusable prompt files
- Dedicated agent skills
- Standardized code-review workflows

## Out of scope for the first version

The first version will not attempt to provide:

- A visual drag-and-drop control designer
- Automatic deployment to production environments
- Support for every PCF API
- Support for Power Pages
- Support for every JavaScript UI framework
- A replacement for Microsoft Power Platform CLI
- Fully autonomous code generation without human review

## Proposed development approach

The framework will be developed incrementally.

1. Document the fundamentals and architecture.
2. Create one small reference field control.
3. Establish coding and folder conventions.
4. Add deterministic build and validation commands.
5. Extract reusable templates.
6. Add a simple scaffolding workflow.
7. Add a reference dataset control.
8. Add GitHub Copilot instructions and prompt files.
9. Add dedicated agent skills.
10. Add solution packaging and CI/CD automation.

## First reference control

The proposed first reference control is a status badge field control.

The control should:

- Bind to a Dataverse field
- Display the value using a Fluent UI badge
- Support read-only behavior
- Support null values
- Use responsive styling
- Follow accessibility practices
- Include unit tests
- Build successfully in production mode
- Be deployable through a Dataverse solution

This reference control will be used to establish the framework's first
development patterns and conventions.

## Documentation approach

Documentation should be written for readers who may be unfamiliar with:

- Terminal commands
- npm
- TypeScript
- React
- PCF lifecycle methods
- Dataverse solution packaging

Instructions should explain:

- What each command does
- Where each command must be executed
- What files the command creates or changes
- What successful output should look like
- What common errors mean
- How to verify each step

## License

A license has not yet been selected.