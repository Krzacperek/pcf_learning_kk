# StatusBadge PCF Control

## Status

**Implementation status:** Initial metadata-driven implementation complete

**Validation status:**

- ESLint passed
- Development build passed
- Production build passed
- Local PCF test harness passed
- Dataverse model-driven app testing passed
- Unit tests passed: 8 tests
- Solution packaging pending

This control is the first reference field control for the PCF Development
Framework.

The purpose of the control is not only to provide a status badge. The control
is also used to identify and validate patterns that may later become:

- Field-control templates
- Shared React components
- Validation scripts
- GitHub Copilot instructions
- Reusable prompts
- Agent skills
- Beginner-friendly development documentation

The control must remain understandable as a standalone PCF project.

## 1. Purpose

`StatusBadge` displays the selected value of a Dataverse single-select Choice
column as a visually distinct badge.

A Dataverse Choice column stores the selected choice as a numeric value and
provides metadata describing the available choices. The metadata includes the
display label associated with each numeric value.

For example, a Choice column may contain an option with:

```text
Numeric value: 100000000
Display label: Active
```

The control should display:

```text
Active
```

The control must retrieve the visible label from the metadata associated with
the bound Choice column.

The control must not assume that a particular numeric value always represents
a particular label.

The badge appearance may change according to the resolved label, but status
meaning must not be communicated through color alone. The choice label must
remain visible.

## 2. Initial scope

The first version will:

- Be a field PCF control
- Target Power Platform model-driven apps
- Bind to a single-select Dataverse Choice column
- Read the selected numeric choice value
- Read the available choice metadata
- Resolve the selected choice label
- Use TypeScript
- Use React
- Use Fluent UI
- Be display-only
- Handle a null or unselected value
- Handle missing or temporarily unavailable metadata
- Handle expected choice labels
- Handle unexpected choice labels
- Support constrained form-column widths
- Provide accessible visible text
- Build in development mode
- Build in production mode
- Pass ESLint

## 3. Out of scope for the first version

The first version will not:

- Update the bound Dataverse value
- Use `notifyOutputChanged`
- Return a changed value from `getOutputs`
- Call the Dataverse Web API
- Contact an external service
- Use browser local storage
- Use browser session storage
- Use the model-driven app form context
- Access the host application DOM
- Support a dataset
- Allow makers to configure custom colors
- Allow makers to configure custom status mappings
- Provide localization resources
- Deploy automatically to a Power Platform environment
- Support a multi-select Choices column
- Modify the available choices
- Hardcode environment-specific numeric choice values
- Replace Dataverse choice metadata with a separately maintained list

These capabilities may be considered later if they support a documented
framework requirement.

## 4. Bound property

The control will define one required bound property representing a
single-select Dataverse Choice column.

| Attribute               | Value       |
| ----------------------- | ----------- |
| Property name           | `value`     |
| Property type           | `OptionSet` |
| Usage                   | `bound`     |
| Required                | `true`      |
| Editable by the control | No          |

The selected numeric choice value will be read from:

```typescript
context.parameters.value.raw;
```

The value may be:

```typescript
number | null;
```

The choice metadata will be read from:

```typescript
context.parameters.value.attributes?.Options;
```

The metadata should be used to find the option whose numeric value matches the
selected raw value.

The selected option label should be passed to the React component for display.

The property name `sampleProperty` from the generated PCF template will be
replaced with `value`.

The property type `SingleLine.Text` from the generated PCF template will be
replaced with `OptionSet`.

## 5. Choice resolution and appearance

The control must resolve the displayed text from the metadata of the bound
Dataverse Choice column.

The bound property provides:

- The selected numeric choice value
- Metadata describing the available choices

The control must locate the option whose metadata value matches the selected
numeric value.

For example:

```text
Selected raw value: 100000000

Available options:
- Value: 100000000, Label: Active
- Value: 100000001, Label: Pending
- Value: 100000002, Label: Blocked
```

For the selected value `100000000`, the badge should display:

```text
Active
```

The control must use the `Label` supplied by Dataverse.

The control must not:

- Hardcode numeric choice values
- Maintain a separate copy of the available labels
- Assume that the same numeric value has the same meaning in every Choice
  column
- Infer the displayed label from an environment-specific mapping

The first implementation should use a neutral Fluent UI badge appearance for
all resolved values.

This ensures that the control can render any single-select Choice column
without depending on specific labels such as `Active`, `Pending`, or
`Blocked`.

A future framework feature may support configurable appearance mappings.

Possible future mapping strategies include:

- Mapping by numeric choice value
- Using Dataverse option color metadata where available
- Using a maker-provided configuration property

Configurable appearance mapping is outside the first implementation.

## 6. Null, unselected, and unavailable-metadata behavior

The PCF runtime may provide a null selected value.

The choice metadata may also be temporarily unavailable during an
`updateView` call.

The control must not throw an error when:

- The selected raw value is `null`
- The choice attributes are unavailable
- The available-options collection is unavailable
- The selected value is not present in the available options
- An option has an empty or unavailable label

The behavior should be:

| Condition                               | Display                                        |
| --------------------------------------- | ---------------------------------------------- |
| Selected raw value is `null`            | `No status`                                    |
| Metadata is temporarily unavailable     | `No status` or a neutral loading-safe fallback |
| Selected value is not found in metadata | `Unknown status`                               |
| Resolved label is empty                 | `Unknown status`                               |
| Resolved label is available             | Resolved Dataverse choice label                |

All fallback states should use a neutral appearance.

The initial implementation does not require an animated loading indicator
because metadata should normally be available shortly after the control is
rendered.

The implementation must still tolerate a later `updateView` call containing
the completed metadata.

## 7. Read-only behavior

The first version is display-only.

The control must not provide an interaction that changes the bound value.

The React component may receive a read-only or disabled property so that the
architecture can support editable controls later, but the first visual
implementation does not require an editable state.

The absence of editing behavior must be clear in the implementation and
documentation.

## 8. React architecture

The PCF lifecycle and React user interface must remain separate.

The expected source structure is:

```text
StatusBadge/
├── ControlManifest.Input.xml
├── StatusBadge.tsx
├── index.ts
└── generated/
```

`index.ts` is responsible for:

- Implementing the PCF React control
- Reading the selected numeric choice value
- Reading the Choice column metadata
- Resolving the selected choice label
- Reading relevant PCF state
- Creating typed React properties
- Returning the React element
- Implementing required lifecycle methods

`StatusBadge.tsx` is responsible for:

- Receiving the resolved display label
- Normalizing the label for appearance selection
- Selecting the Fluent UI visual appearance
- Rendering the badge
- Rendering accessible visible text
- Handling null, unresolved, and unexpected labels

The complete PCF context must not be passed to `StatusBadge.tsx`.

The React component should not need to understand the PCF Choice property
structure.

The proposed React property interface is:

```typescript
export interface IStatusBadgeProps {
  label: string;
  selectedValue: number | null;
  disabled: boolean;
}
```

The `selectedValue` property is included for future extensibility and testing,
but the first React implementation should not use it to hardcode
environment-specific mappings.

The resolved `label` remains the source of visible text.

`index.ts` is responsible for:

- Implementing the PCF React control
- Reading the bound manifest property
- Reading relevant PCF state
- Creating typed React properties
- Returning the React element
- Implementing required lifecycle methods

`StatusBadge.tsx` is responsible for:

- Normalizing the status value
- Selecting the visual appearance
- Rendering the badge
- Rendering accessible visible text
- Handling null and unexpected values

The complete PCF context should not be passed to `StatusBadge.tsx`.

## 9. Styling requirements

The control should use Fluent UI components and styling.

The first version should not introduce a separate CSS file unless Fluent UI
cannot satisfy the documented requirement.

The badge should:

- Fit inside a model-driven app form column
- Avoid enforcing a large fixed width
- Preserve readable text
- Provide a neutral fallback appearance
- Avoid using color as the only status indicator

Custom status colors are outside the initial scope.

## 10. Accessibility requirements

The displayed status text must remain visible.

The meaning of the status must not depend only on badge color.

The control should use a Fluent UI component with appropriate semantic
behavior.

The control should not create an unnecessary keyboard focus target because the
first version is display-only and has no interactive action.

If additional accessible text is required, it should describe the displayed
status without duplicating confusing information.

## 11. PCF lifecycle behavior

### `init`

`init` may store the `notifyOutputChanged` callback if the generated interface
requires it.

The display-only implementation must not call the callback.

### `updateView`

`updateView` must:

1. Read `context.parameters.value.raw`.
2. Read `context.parameters.value.attributes?.Options`.
3. Handle a null selected value.
4. Handle temporarily unavailable metadata.
5. Find the metadata option matching the selected numeric value.
6. Resolve the selected option label.
7. Read relevant disabled or read-only state.
8. Create typed React properties.
9. Return the `StatusBadge` React element.

`updateView` must not assume that metadata is available on every call.

`updateView` must not hardcode the numeric values of Dataverse choices.

### `getOutputs`

The first version must return an empty object because the control does not
change the bound value.

### `destroy`

The first version does not register external event handlers, timers, or
subscriptions.

No custom cleanup is expected.

## 12. Validation requirements

Before the implementation is considered ready for model-driven app testing,
the following commands must succeed from:

```text
controls/field/StatusBadge/
```

Run linting:

```bash
npm run lint
```

Run the development build:

```bash
npm run build
```

Run the production build:

```bash
npm run build -- --buildMode production
```

The control must not introduce changes under:

```text
node_modules/
out/
StatusBadge/generated/
```

These directories contain installed or generated content and must remain
ignored by Git.

## 13. Test scenarios

The implementation must be checked with at least the following scenarios.

### 13.1 Selected-choice scenarios

| Selected value | Available metadata          | Expected display |
| -------------- | --------------------------- | ---------------- |
| `100000000`    | `100000000 → Active`        | Active           |
| `100000001`    | `100000001 → Pending`       | Pending          |
| `100000002`    | `100000002 → Blocked`       | Blocked          |
| `100000003`    | `100000003 → Inactive`      | Inactive         |
| `100000004`    | `100000004 → Custom status` | Custom status    |

The actual numeric values above are test examples only.

The production implementation must get the numeric values and labels from the
bound Dataverse Choice column.

### 13.2 Fallback scenarios

| Condition                                            | Expected display                       |
| ---------------------------------------------------- | -------------------------------------- |
| Selected raw value is null                           | No status                              |
| Available metadata is unavailable                    | Neutral safe fallback                  |
| Selected value is not found in metadata              | Unknown status                         |
| Resolved label is empty                              | Unknown status                         |
| Resolved label is not part of the appearance mapping | Original label with neutral appearance |

### 13.3 Appearance scenarios

The test should verify that:

- `Active` receives the positive appearance.
- `Pending` receives the informative appearance.
- `Blocked` receives the severe appearance.
- `Inactive` receives the neutral appearance.
- Unknown labels receive the neutral appearance.
- Matching appearance labels is case-insensitive.
- The original Dataverse label remains visible.
- The numeric choice value is not shown to the user.
- The component does not change the bound value.
- The component does not call `notifyOutputChanged`.
- Long labels do not break the surrounding form layout.

Automated unit tests will be added after the initial React implementation and
after the testing framework has been selected.

The local PCF test harness may provide simplified sample option metadata.
Final behavior must be tested with an actual Dataverse Choice column in a
model-driven app.

## Dataverse model-driven app test results

The control was imported through the `PCFLab` unmanaged solution and
configured on a single-select Dataverse Choice column in a model-driven app.

The test confirmed that:

- The code component was available for a compatible Choice column.
- The selected numeric Choice value was resolved through Dataverse metadata.
- The Dataverse Choice label was displayed in the badge.
- No environment-specific numeric Choice values were hardcoded.
- Changing the selected Choice updated the displayed label.
- An unselected value displayed `No status`.
- The control remained display-only.
- The control rendered on the published model-driven form.
- No browser runtime errors were observed.

The following additional scenarios were reviewed:

- Read-only field behavior
- Long Choice labels
- Constrained form-column width
- Browser refresh and component caching

Any limitations discovered during testing are documented below.

## Known limitations

- The first implementation uses one neutral Fluent UI appearance for all
  Choice values.
- Maker-configurable appearance mappings are not yet supported.
- Multi-select Choices columns are not supported.
- Translated Choice labels have not yet been tested.

## 14. Definition of done

The first reference implementation is ready for packaging work when:

- The manifest uses the `value` bound property.
- The `value` property uses the `OptionSet` type.
- The generated manifest types match the updated manifest.
- `index.ts` reads the selected numeric choice value.
- `index.ts` reads the available choice metadata.
- `index.ts` resolves the visible label from metadata.
- Numeric choice values are not hardcoded.
- `HelloWorld.tsx` has been replaced by `StatusBadge.tsx`.
- `index.ts` passes the bound value through typed React properties.
- A null or unselected value displays `No status`.
- Missing metadata is handled without an exception.
- An unresolved selected value displays `Unknown status`.
- Known statuses receive the intended appearance.
- Unknown statuses receive a neutral appearance.
- Displayed text remains visible.
- ESLint passes.
- The development build succeeds.
- The production build succeeds.
- The local PCF test harness has been used.
- The implementation is documented.
- No generated files are committed.
- Reusable framework candidates have been recorded.
- Model-driven app testing instructions are documented.

Successful local validation does not mean that the control is approved for
production deployment.

## 15. Framework observations

During implementation, observations should be classified as one of the
following:

- Control-specific behavior
- Reusable field-control pattern
- Framework automation candidate
- Validation candidate
- GitHub Copilot instruction candidate
- Agent-skill candidate
- Human-review requirement

The observations will be used to decide what should be extracted from the
reference control into the reusable framework.

No reusable abstraction should be created until the corresponding pattern has been implemented and validated.

## Local test harness results

The initial implementation was tested using the local PCF test harness.

The harness provided the following simulated Choice metadata:

```text
0 → Option A
1 → Option B
2 → Option C
```

The control successfully:

- Read the selected numeric Choice value
- Matched the selected value to the available option metadata
- Displayed the option label
- Updated when the selected value changed
- Displayed `Unknown status` when the selected value was not present in the
  available metadata
- Continued rendering when the available container width changed
- Maintained a content-based badge width rather than stretching to fill the
  container
- Produced no observed browser runtime errors

The local test harness confirms the basic Choice metadata-resolution and React
rendering behavior.

The harness does not replace testing with an actual Dataverse Choice column in
a model-driven app.

The following scenarios still require verification:

- A null or unselected Dataverse Choice value
- A Choice column with translated labels
- A Choice option with a long label
- Read-only form behavior
- Column-level security behavior
- Real Dataverse Choice metadata
- Model-driven app form styling

## Unit test results

Choice-label resolution is implemented as a pure TypeScript function:

```text
StatusBadge/utils/resolveChoiceLabel.ts
```

The function is tested independently from React and the PCF runtime.

The initial test suite verifies:

- A matching Choice label is returned.
- `No status` is returned when no value is selected.
- `Unknown status` is returned when the selected value is not found.
- `Unknown status` is returned when metadata is unavailable.
- `Unknown status` is returned when the resolved label is empty.
- `Unknown status` is returned when the resolved label contains only
  whitespace.
- Surrounding whitespace is removed from valid labels.
- Numeric Choice values are not assumed to have fixed labels.

The initial validation result is:

```text
Test files: 1 passed
Tests:      8 passed
```

The test command is:

```bash
npm test
```

The interactive test command is:

```bash
npm run test:watch
```

The current tests validate the Choice-resolution logic.

React component tests and PCF integration tests have not yet been added.
