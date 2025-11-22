import { SearchableSelect, Option } from '@/components/ui/SearchableSelect';
import { TRACKERS_ARRAY } from '@/lib/redmine-config';

interface TrackerFilterProps {
  value: string;
  onChange: (value: string) => void;
  availableTrackerIds?: number[];
}

export function TrackerFilter({ value, onChange, availableTrackerIds }: TrackerFilterProps) {
  const trackers = availableTrackerIds
    ? TRACKERS_ARRAY.filter(t => availableTrackerIds.includes(t.id))
    : TRACKERS_ARRAY;

  const options: Option[] = [
    { value: 'all', label: 'All Trackers' },
    ...trackers.map(tracker => ({
      value: tracker.id.toString(),
      label: tracker.name,
    }))
  ];

  // Handle 'all' value mapping
  const currentValue = value === '' ? 'all' : value;

  const handleChange = (newValue: string) => {
    onChange(newValue === 'all' ? '' : newValue);
  };

  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Tracker:
      </label>
      <div className="w-40">
        <SearchableSelect
          options={options}
          value={currentValue}
          onChange={handleChange}
          placeholder="Select tracker"
        />
      </div>
    </div>
  );
}
