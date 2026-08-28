export interface IChoiceOption {
  Value: number;
  Label: string;
}

export const resolveChoiceLabel = (
  selectedValue: number | null,
  options: readonly IChoiceOption[] | undefined,
): string => {
  if (selectedValue === null) {
    return "No status";
  }

  const selectedOption = options?.find(
    (option) => option.Value === selectedValue,
  );

  const resolvedLabel = selectedOption?.Label?.trim();

  if (resolvedLabel === undefined || resolvedLabel.length === 0) {
    return "Unknown status";
  }

  return resolvedLabel;
};
