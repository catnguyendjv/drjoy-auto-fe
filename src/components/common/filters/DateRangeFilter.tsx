import { Input } from "@heroui/react";

interface DateRangeFilterProps {
  label: string;
  fromDate: string;
  toDate: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
}

export function DateRangeFilter({
  label,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}: DateRangeFilterProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">{label}</span>
      <div className="flex items-center gap-2">
        <Input
          type="date"
          size="sm"
          variant="bordered"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
        />
        <span className="text-sm text-gray-500 dark:text-gray-400">to</span>
        <Input
          type="date"
          size="sm"
          variant="bordered"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
        />
      </div>
    </div>
  );
}
