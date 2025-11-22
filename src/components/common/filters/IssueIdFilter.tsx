import { Input } from "@heroui/react";

interface IssueIdFilterProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function IssueIdFilter({ value, onChange, label = "Issue ID:" }: IssueIdFilterProps) {
  return (
    <Input
      label={label}
      variant="bordered"
      size="sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search ID..."
      classNames={{
        base: "w-32",
      }}
    />
  );
}
