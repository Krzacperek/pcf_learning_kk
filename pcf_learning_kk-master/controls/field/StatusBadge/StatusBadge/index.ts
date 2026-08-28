import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { resolveChoiceLabel } from "./utils/resolveChoiceLabel";
import {
  StatusBadge as StatusBadgeComponent,
  IStatusBadgeProps,
} from "./StatusBadge";
import * as React from "react";

export class StatusBadge implements ComponentFramework.ReactControl<
  IInputs,
  IOutputs
> {
  /**
   * Initializes the control instance.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
  ): void {
    // No initialization is required for this display-only control.
  }

  /**
   * Creates the React element that represents the current Choice value.
   */
  public updateView(
    context: ComponentFramework.Context<IInputs>,
  ): React.ReactElement {
    const selectedValue = context.parameters.value.raw;
    const options = context.parameters.value.attributes?.Options;

    const label = resolveChoiceLabel(selectedValue, options);

    const props: IStatusBadgeProps = {
      label,
    };

    return React.createElement(StatusBadgeComponent, props);
  }

  /**
   * Returns changed values to the Power Platform host.
   *
   * This control is display-only, so it does not return an output value.
   */
  public getOutputs(): IOutputs {
    return {};
  }

  /**
   * Cleans up resources when the control is removed.
   *
   * This control does not register external resources that require cleanup.
   */
  public destroy(): void {
    // No cleanup is required.
  }
}
