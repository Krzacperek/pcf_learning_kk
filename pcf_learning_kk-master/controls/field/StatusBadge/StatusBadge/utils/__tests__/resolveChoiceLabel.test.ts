import { describe, expect, it } from "vitest";
import { IChoiceOption, resolveChoiceLabel } from "../resolveChoiceLabel";

const options: IChoiceOption[] = [
  {
    Value: 0,
    Label: "Option A",
  },
  {
    Value: 1,
    Label: "Option B",
  },
  {
    Value: 2,
    Label: "Option C",
  },
];

describe("resolveChoiceLabel", () => {
  it("returns the matching Dataverse Choice label", () => {
    expect(resolveChoiceLabel(1, options)).toBe("Option B");
  });

  it("returns No status when no Choice value is selected", () => {
    expect(resolveChoiceLabel(null, options)).toBe("No status");
  });

  it("returns Unknown status when the selected value is not found", () => {
    expect(resolveChoiceLabel(99, options)).toBe("Unknown status");
  });

  it("returns Unknown status when metadata is unavailable", () => {
    expect(resolveChoiceLabel(1, undefined)).toBe("Unknown status");
  });

  it("returns Unknown status when the resolved label is empty", () => {
    const optionsWithEmptyLabel: IChoiceOption[] = [
      {
        Value: 1,
        Label: "",
      },
    ];

    expect(resolveChoiceLabel(1, optionsWithEmptyLabel)).toBe("Unknown status");
  });

  it("returns Unknown status when the resolved label contains only whitespace", () => {
    const optionsWithWhitespaceLabel: IChoiceOption[] = [
      {
        Value: 1,
        Label: "   ",
      },
    ];

    expect(resolveChoiceLabel(1, optionsWithWhitespaceLabel)).toBe(
      "Unknown status",
    );
  });

  it("removes surrounding whitespace from the resolved label", () => {
    const optionsWithWhitespace: IChoiceOption[] = [
      {
        Value: 1,
        Label: "  Pending  ",
      },
    ];

    expect(resolveChoiceLabel(1, optionsWithWhitespace)).toBe("Pending");
  });

  it("does not assume that a numeric value has a fixed label", () => {
    const environmentSpecificOptions: IChoiceOption[] = [
      {
        Value: 1,
        Label: "Environment-specific label",
      },
    ];

    expect(resolveChoiceLabel(1, environmentSpecificOptions)).toBe(
      "Environment-specific label",
    );
  });
});
