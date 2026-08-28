# Framework Requirements

## Document status

**Status:** Draft

This document defines the functional, technical, educational, and safety
requirements of the PCF Development Framework.

The requirements describe what the framework must provide to developers who
have limited experience with TypeScript, React, and Power Apps Component
Framework development.

The requirements should be validated through working reference controls.

The first reference implementation is the `StatusBadge` field control. The
reference control is not the final product. It is used to identify, implement,
and validate reusable framework patterns.

## 1. Framework objective

The framework must help developers create safe, consistent, understandable,
and maintainable PCF controls for Power Platform model-driven apps.

The framework must support developers who:

- Understand Power Platform but have limited pro-code experience
- Are creating a PCF control for the first time
- Are learning TypeScript
- Are learning React
- Use GitHub Copilot to assist with development
- Need clear validation and troubleshooting guidance
- Need to package controls in Dataverse solutions

The framework must reduce unnecessary complexity without hiding the PCF
concepts that developers need to understand.

## 2. Initial scope

The initial framework must support:

- Power Platform model-driven apps
- Dataverse
- Field PCF controls
- Dataset PCF controls
- TypeScript
- React
- Microsoft Fluent UI
- Microsoft Power Platform CLI
- Local PCF development
- Local PCF test harness usage
- Unit testing
- Production builds
- Dataverse solution packaging
- Git source control
- GitHub Copilot-assisted development

The initial framework does not need to support:

- Canvas apps
- Power Pages
- Alternative user-interface frameworks
- Automatic production deployment
- A visual drag-and-drop control designer
- Fully autonomous code generation
- Every PCF API
- Publishing reusable packages to npm
- Distribution through Microsoft AppSource

Support for these capabilities may be considered later.

## 3. Design principles

The framework must follow these principles.

### 3.1 Official tooling first

The framework must use official Microsoft PCF tooling.

The framework must not replace:

- `pac pcf init`
- PCF project files
- PCF manifests
- PCF lifecycle methods
- PCF build tooling
- Dataverse solution packaging

Framework commands may simplify or orchestrate official tools, but generated
projects must remain compatible with official Power Platform CLI commands.

### 3.2 Usable without GitHub Copilot

The framework must remain usable without GitHub Copilot.

A developer must be able to:

- Create a control
- Build a control
- Run linting
- Run tests
- Validate a control
- Package a solution

using documented commands and deterministic scripts.

GitHub Copilot may guide and orchestrate these operations, but it must not be
the only way to execute them.

### 3.3 Learning before abstraction

Reusable abstractions must be derived from working reference controls.

A pattern should not be added to the reusable framework only because it might
be useful in the future.

Before a pattern becomes reusable, the team should understand:

- What problem the pattern solves
- Which controls need the pattern
- Which parts vary between controls
- Which parts should remain visible to beginners
- How the pattern can be tested
- How the pattern can fail

### 3.4 Deterministic validation

The framework must use deterministic tools for checks that can be automated.

Examples include:

- Manifest validation
- TypeScript compilation
- ESLint
- Unit tests
- Production builds
- Generated-file checks
- Dependency checks
- Solution packaging checks

GitHub Copilot must not be solely responsible for determining whether a
control is valid.

### 3.5 Human review

The framework must require human review before a generated control is deployed
to a shared or production environment.

Human review should include:

- Manifest properties
- Data access
- Security implications
- External dependencies
- User experience
- Accessibility
- Responsive behavior
- Dataverse behavior
- Deployment target
- Solution packaging

## 4. Intended development workflow

The target workflow is:

```text
Developer describes the control requirement
                    ↓
Framework helps classify the control
                    ↓
Developer creates a field or dataset control
                    ↓
Framework generates or copies approved project patterns
                    ↓
Developer or GitHub Copilot implements control-specific behavior
                    ↓
Framework runs deterministic validation
                    ↓
Developer tests the control locally
                    ↓
Developer tests the control in a model-driven app
                    ↓
Framework creates a production build
                    ↓
Framework packages the control in a Dataverse solution
                    ↓
Human reviews the result
                    ↓
Approved solution is deployed
```

Each step must be documented.

The framework should explain:

- What the step does
- Why the step is necessary
- Which command must be executed
- Where the command must be executed
- Which files the command creates or modifies
- What successful output looks like
- What common failures mean
- How the developer can recover from a failure

## 5. Control classification requirements

The framework must help developers decide whether a requirement needs a field
control or a dataset control.

### 5.1 Field control guidance

The framework should recommend a field control when the requirement primarily
works with one bound Dataverse value.

Examples include:

- Displaying a status badge
- Providing a specialized text input
- Displaying a rating
- Displaying formatted currency
- Selecting a value through a custom picker
- Displaying a URL preview

### 5.2 Dataset control guidance

The framework should recommend a dataset control when the requirement works
with multiple records or columns.

Examples include:

- Displaying records as cards
- Creating a specialized grid
- Displaying records on a timeline
- Displaying records in a calendar
- Supporting record selection
- Supporting paging, sorting, or filtering

### 5.3 Classification output

Before creating a control, the framework should record:

- Control name
- Control type
- User requirement
- Bound properties
- Input properties
- Output properties
- Expected field or dataset type
- Read-only or editable behavior
- Dataverse APIs required
- External services required
- Responsive behavior
- Accessibility requirements
- Localization requirements
- Testing requirements

This information may eventually be represented by a control blueprint.

The control blueprint format has not yet been selected.

## 6. Project creation requirements

The framework must provide a repeatable way to create new PCF projects.

Project creation must:

- Use `pac pcf init`
- Use a valid namespace
- Use a valid control name
- Select the correct field or dataset template
- Select the React rendering framework
- Create the control in the approved repository location
- Install dependencies through npm
- Preserve compatibility with official PCF tooling
- Produce a project that can build before custom implementation begins

The framework should prevent or detect:

- Invalid control names
- Invalid namespaces
- Incorrect output directories
- Existing directory conflicts
- Unsupported control types
- Missing Node.js
- Missing npm
- Missing Power Platform CLI
- Failed dependency installation

A newly created project should be built before custom development starts.

The untouched generated project should serve as a known-good baseline.

## 7. Standard control structure requirements

Each control should have a predictable structure.

A field control may eventually follow a structure similar to:

```text
ControlName/
├── ControlManifest.Input.xml
├── components/
│   └── ControlName.tsx
├── services/
├── types/
├── tests/
├── index.ts
└── generated/
```

The exact structure must be derived from validated reference controls.

The framework should maintain separation between:

- PCF lifecycle integration
- React presentation
- Business logic
- Dataverse operations
- Shared types
- Automated tests

Control-specific files should remain close to the control.

Shared files should move into the framework only when they are genuinely reused
by multiple controls.

## 8. PCF lifecycle requirements

The framework must teach and preserve the standard PCF lifecycle.

### 8.1 `init`

The framework must explain that `init` is used for one-time initialization.

Possible responsibilities include:

- Storing `notifyOutputChanged`
- Requesting resize notifications
- Initializing services
- Starting required asynchronous initialization
- Registering event handlers

React rendering should not be placed in `init`.

### 8.2 `updateView`

The framework must explain that `updateView` receives the current PCF context
and returns the React element for a React virtual control.

`updateView` should:

- Read manifest properties
- Handle null or temporarily unavailable values
- Read read-only state
- Read security-related state where applicable
- Create typed React properties
- Return the root React element
- Avoid unnecessary side effects

### 8.3 `notifyOutputChanged`

The framework must explain that `notifyOutputChanged` tells the Power Platform
host that new output values are available.

The framework should discourage unnecessary calls to
`notifyOutputChanged`.

Editable controls should call it only when a meaningful output change is ready.

### 8.4 `getOutputs`

The framework must explain that `getOutputs` returns changed values to the
Power Platform host.

Output names must match bound or output properties in the manifest.

Display-only controls may return an empty output object.

### 8.5 `destroy`

The framework must explain that `destroy` is used for cleanup.

Cleanup may include:

- Removing event listeners
- Cancelling timers
- Cancelling pending operations
- Closing subscriptions
- Releasing external resources

Controls without cleanup requirements may keep this method empty.

## 9. React requirements

React components should focus on presentation and user interaction.

React components should:

- Receive typed properties
- Use callback properties for user actions
- Handle null values
- Handle read-only states
- Handle loading states where applicable
- Handle empty states where applicable
- Handle error states where applicable
- Support keyboard use
- Provide accessible names and descriptions
- Support responsive layouts
- Use Fluent UI where appropriate
- Avoid direct dependence on the complete PCF context
- Avoid direct host-page access

React components should not:

- Update Dataverse values directly
- Use the model-driven app form context directly
- Edit generated manifest types
- Depend on undocumented platform APIs
- Store sensitive information in browser storage
- Perform unsupported host DOM manipulation

## 10. Manifest requirements

The framework must help developers create and maintain valid PCF manifests.

The manifest must define:

- Control namespace
- Constructor name
- Control version
- Display name key
- Description key
- Control type
- Bound properties
- Input properties
- Output properties where required
- Dataset definitions where required
- Code resources
- Platform libraries
- Required features
- External-service usage where applicable

The framework should validate:

- Namespace format
- Constructor-name alignment
- Version format
- Property-name uniqueness
- Property types
- Required property attributes
- Resource paths
- Platform-library declarations
- Feature declarations
- External-service declarations

Manifest changes must be followed by type generation or a control build.

Generated manifest types must not be manually edited.

## 11. File safety requirements

The framework must clearly identify files and directories that developers
should not edit manually.

Developers and GitHub Copilot should not directly modify:

```text
node_modules/
out/
generated/
```

Developers should not normally modify:

```text
package-lock.json
*.pcfproj
```

These files may change through approved commands or when a documented
requirement exists.

The framework should explain that:

- `node_modules` contains installed dependencies.
- `out` contains generated build output.
- `generated` contains types generated from the manifest.
- `package-lock.json` records exact dependency versions.
- `.pcfproj` defines the PCF project and build configuration.

The framework should detect when protected generated files are accidentally
staged for commit.

## 12. Dependency requirements

The framework must minimize unnecessary dependencies.

Before adding a dependency, the developer should understand:

- What problem the dependency solves
- Whether the requirement can be implemented without it
- Whether the dependency is maintained
- Whether the dependency is compatible with PCF tooling
- Whether the dependency affects bundle size
- Whether the dependency has known security findings
- Whether the dependency introduces licensing concerns
- Whether the dependency is needed at runtime or only during development

New dependencies should be added through npm commands.

Dependency changes must update the lock file.

Automatic dependency-fix commands should not be run without reviewing their
impact.

The framework should discourage unreviewed use of:

```bash
npm audit fix
```

The framework should strongly discourage unreviewed use of:

```bash
npm audit fix --force
```

Security findings should be reviewed to determine:

- Affected package
- Direct or transitive dependency
- Runtime or development-only impact
- Available compatible update
- Relationship to official PCF tooling
- Actual exposure in the generated control

## 13. Validation requirements

Every control must pass validation before packaging.

The minimum validation should include:

1. Manifest validation
2. TypeScript compilation
3. ESLint
4. Unit tests
5. Development build
6. Production build
7. Generated-file checks
8. Protected-file checks

The validation result should distinguish between:

- Errors
- Warnings
- Recommendations
- Successful checks

Errors should block packaging.

Warnings should require review.

Recommendations should describe optional improvements.

Successful checks should help inexperienced developers understand what was
validated.

The framework should eventually provide one command that executes all required
validation steps.

The command name has not yet been selected.

## 14. Testing requirements

The framework must support multiple levels of testing.

### 14.1 Unit tests

Unit tests should validate isolated React components, services, data mappings,
and business logic.

Possible tests include:

- Rendering a value
- Rendering a null value
- Rendering a read-only state
- Applying correct badge appearance
- Calling an event callback
- Displaying a loading state
- Displaying an error state
- Mapping Dataverse values into UI models

### 14.2 Local PCF test harness

The local PCF test harness should validate:

- Manifest properties
- Basic rendering
- Input changes
- Output values
- Form factors
- Available width and height
- Local development behavior

The documentation must explain that the test harness does not fully reproduce a
model-driven app.

### 14.3 Model-driven app testing

Every reference control and generated production control should be tested in a
real model-driven app before release.

Testing should include:

- Correct field or dataset binding
- Read-only behavior
- Security-related behavior
- Responsive layout
- Model-driven app styling
- Browser behavior
- Form behavior
- Grid or subgrid behavior where applicable
- Updated component version behavior
- Solution import behavior

### 14.4 Regression testing

Reusable templates and framework utilities should have regression tests.

A framework change should not silently break previously generated controls.

## 15. Accessibility requirements

Controls must be usable by keyboard and assistive technologies where
applicable.

The framework should guide developers to provide:

- Accessible names
- Labels
- Keyboard interaction
- Visible focus behavior
- Appropriate color contrast
- Non-color indicators for important meaning
- Read-only communication
- Error communication
- Loading-state communication

A status must not be communicated through color alone.

For example, a red badge should also display text or another accessible
indicator that communicates the status.

Accessibility requirements should be included in templates, tests, review
checklists, and Copilot instructions.

## 16. Responsive-design requirements

Controls must handle different available widths and form factors.

The framework should guide controls to:

- Avoid fixed widths unless required
- Handle constrained form columns
- Handle mobile layouts where applicable
- Avoid clipped text
- Provide wrapping or truncation behavior deliberately
- Respond to available container size where needed
- Test multiple form factors in the local test harness
- Test the final control inside a model-driven app

Dataset controls must also account for available height.

## 17. Security requirements

Controls must use supported PCF and browser APIs.

Controls must not:

- Access the host application DOM outside the control boundary
- Depend directly on model-driven app `formContext`
- Use undocumented PCF APIs
- Store sensitive information in local storage
- Store sensitive information in session storage
- Hardcode credentials
- Commit secrets
- Automatically deploy to an unspecified environment
- Contact undeclared external services
- Introduce unreviewed external scripts

External-service use must be:

- Explicitly required
- Documented
- Declared in the manifest where applicable
- Reviewed for licensing impact
- Reviewed for security impact
- Reviewed for privacy impact

Dataverse Web API calls should be minimized and should request only the data
required by the control.

## 18. Error-handling requirements

The framework must provide beginner-friendly error messages.

Errors should explain:

- What operation failed
- Which file or configuration caused the failure
- Whether any files were changed
- Which command can provide more detail
- What the recommended next action is

Controls should provide appropriate user-interface states for:

- Loading
- No data
- Invalid configuration
- Failed data retrieval
- Unsupported values
- Restricted access

Technical error details should not expose sensitive information to end users.

## 19. Documentation requirements

Every reference control should document:

- Control purpose
- Supported hosts
- Supported field or dataset types
- Manifest properties
- Project structure
- Development commands
- Test commands
- Production build command
- Packaging process
- Known limitations
- Accessibility behavior
- Responsive behavior
- Security considerations
- Example configuration

Framework documentation should explain unfamiliar terms.

Documentation should not assume prior knowledge of:

- Git
- Terminal navigation
- npm
- TypeScript
- React
- PCF lifecycle methods
- Dataverse solution packaging

Commands should be copy-paste-ready and should identify the directory from
which they must be executed.

## 20. GitHub Copilot requirements

GitHub Copilot must operate inside documented framework boundaries.

Repository-wide instructions should eventually require GitHub Copilot to:

- Read the relevant architecture and requirements documentation
- Inspect the current control before changing it
- Keep PCF lifecycle logic separate from React presentation logic
- Avoid editing generated files
- Avoid editing build output
- Avoid unsupported PCF APIs
- Avoid unnecessary dependencies
- Explain new dependencies
- Run validation after changes
- Report validation failures accurately
- Explain changes in beginner-friendly language
- Distinguish implemented functionality from planned functionality

Path-specific instructions should provide additional rules for:

- PCF manifests
- TypeScript lifecycle files
- React components
- Tests
- Scripts
- GitHub Actions workflows

GitHub Copilot should not:

- Deploy automatically without an explicit target
- Change dependency versions without explaining the reason
- Run forced dependency updates without review
- Claim that validation passed without running it
- Invent Dataverse schema names
- Assume a requirement is implemented when it is only planned
- Hide generated code from the developer
- replace deterministic validation with subjective review

## 21. Agent-skill requirements

Agent skills should be created only for stable, repeatable workflows.

The first proposed skills are:

1. Validate a PCF control
2. Create a PCF control
3. Diagnose a PCF problem
4. Package a PCF solution

Each agent skill should:

- Have a narrow and clear trigger
- Reference the relevant framework documentation
- Use deterministic scripts where possible
- Execute steps in a defined order
- Stop when a blocking error occurs
- Report commands that were executed
- Report files that were created or modified
- Report validation results
- Avoid destructive actions without explicit instruction
- Avoid automatic deployment without an explicit target
- Provide beginner-friendly explanations

Agent skills should orchestrate the framework.

Agent skills should not contain the entire framework implementation.

## 22. Packaging requirements

The framework must support packaging PCF controls in Dataverse solutions.

Packaging must:

- Use a production PCF build
- Use an approved publisher name and prefix
- Include the intended controls
- Use a documented solution version
- Produce a reviewable solution artifact
- Fail clearly when a referenced control cannot build
- Avoid including unnecessary development files

The framework should distinguish between:

- Unmanaged development solutions
- Managed downstream solutions
- Direct development deployment
- Release artifacts

Automatic production deployment is outside the initial scope.

## 23. Versioning requirements

The framework must define a consistent versioning approach for:

- PCF control versions
- Dataverse solution versions
- Framework versions
- Template versions
- Release tags

A deployable control change must update the relevant component version.

Version changes should eventually be automated.

Version automation must be deterministic and reviewable.

The exact versioning strategy will be finalized after the first reference
control is packaged successfully.

## 24. Source-control requirements

Framework and control development should use short-lived branches.

Changes should be reviewed through pull requests before being merged into the
default branch.

Generated files, dependency folders, build output, and secrets must not be
committed.

Commits should represent logical changes.

A control-creation workflow should preserve a known-good generated baseline
before custom implementation begins.

This makes it possible to compare:

- Official generated code
- Framework-generated code
- Control-specific implementation

## 25. Framework safety boundaries

The framework must not create the impression that generated code is
automatically production-ready.

The framework must clearly distinguish between:

- Generated
- Built
- Linted
- Unit tested
- Tested in the local harness
- Tested in Dataverse
- Packaged
- Reviewed
- Approved for deployment

A successful build does not prove that:

- The user experience is correct
- The control is accessible
- Dataverse security is respected
- The control behaves correctly in a model-driven app
- The control is ready for production

These states should be reported separately.

## 26. Definition of done for a reference control

A reference control is complete when:

- The requirement is documented.
- The control type is justified.
- The manifest is valid.
- The control builds successfully.
- The production build succeeds.
- ESLint passes.
- Unit tests pass.
- Null values are handled.
- Read-only behavior is handled.
- Accessibility is reviewed.
- Responsive behavior is reviewed.
- The local test harness is used.
- The control is tested in a model-driven app.
- The control is packaged in a Dataverse solution.
- The solution imports successfully.
- The control documentation is complete.
- Known limitations are documented.
- Reusable patterns are identified.
- Framework-specific validation rules are identified.

## 27. Definition of done for a generated control

A control created using the future framework is ready for review when:

- Project creation completed successfully.
- The control requirement is documented.
- The manifest matches the requirement.
- Protected files were not modified improperly.
- Required validation passes.
- Unit tests pass.
- The production build succeeds.
- Accessibility requirements are addressed.
- Responsive behavior is addressed.
- Security considerations are documented.
- Dependencies are reviewed.
- The control is tested in the local test harness.
- Model-driven app testing instructions are provided.
- Packaging instructions are provided.
- Human review is requested.

A generated control is not automatically approved for deployment.

## 28. Initial reference implementation requirements

The first reference implementation is:

```text
controls/field/StatusBadge/
```

The first implementation should remain deliberately simple.

The initial control should:

- Bind to a single-line text field
- Display the current text value as a badge
- Handle null and empty values
- Be display-only
- Respect read-only presentation
- Use Fluent UI
- Display meaningful text
- Avoid communicating status through color alone
- Use a predictable status-to-appearance mapping
- Provide a default appearance for unknown values
- Build in development mode
- Build in production mode
- Pass ESLint
- Be testable independently from PCF where practical
- Be documented

The initial status mapping may support values such as:

- Active
- Pending
- Blocked
- Inactive
- Unknown

The exact visual mapping will be decided during implementation.

The first control is not a reusable template yet.

A field-control template should be extracted only after the control is
implemented, tested, reviewed, and packaged successfully.

## 29. Framework validation through additional controls

The framework should not be considered reusable after one control.

After the `StatusBadge` reference control is complete, a second field control
should be created using the emerging framework pattern.

The second field control should test whether:

- The structure is understandable
- The instructions are complete
- The reusable code is genuinely reusable
- The validation rules detect mistakes
- GitHub Copilot follows the conventions
- A developer can create the control without copying undocumented knowledge

After field-control patterns are validated, the framework should create a
dataset reference control.

The dataset control will validate additional requirements for:

- Records
- Columns
- Loading
- Empty states
- Paging
- Sorting
- Filtering
- Selection
- Responsive height
- Grid and subgrid behavior

## 30. Open requirements questions

The following questions remain open:

- What should the control blueprint format be?
- Should project scaffolding use a shell script, Node.js script, or custom CLI?
- Should the framework use Vitest or Jest?
- Which validation rules should block a build?
- Which validation rules should produce warnings?
- How should shared framework code be included in each PCF build?
- Should shared utilities be copied into controls or imported from a package?
- When should npm workspaces be introduced?
- How should component and solution versions be synchronized?
- Should each control eventually have its own solution project?
- Which dependency-security findings should block release?
- Which accessibility checks can be automated?
- How should the framework verify that Copilot did not edit generated files?
- How should the framework test templates against newer PAC CLI versions?
- How should the framework record compatibility with Node.js versions?
- How should the framework record compatibility with React and Fluent UI
  platform-library versions?

These questions should be resolved through reference implementations and
documented architecture decisions.

## 31. Next step

After this document is reviewed, the next step is to implement the first
version of the `StatusBadge` reference control.

The implementation should remain small and transparent.

During implementation, each manual step should be evaluated using these
questions:

1. Does every future control need this step?
2. Is the step difficult for a beginner?
3. Can the step be automated safely?
4. Can the result be validated deterministically?
5. Should the step become part of a template?
6. Should the step become a script?
7. Should the step become a Copilot instruction?
8. Should the step become an agent skill?
9. Does the developer still need to understand the underlying concept?

The answers should be recorded as the framework evolves.