interface IssueIdFilterProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function IssueIdFilter({ value, onChange, label = "Issue ID:" }: IssueIdFilterProps) {
  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search ID..."
        className="px-3 py-1 border rounded text-sm bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white w-24"
      />
    </div>
  );
}
