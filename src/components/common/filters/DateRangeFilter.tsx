
import { useState, useRef, useEffect } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, parse, isValid } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import "react-day-picker/style.css";

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
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Convert strings to Date objects for the picker
  const selectedRange: DateRange | undefined = {
    from: fromDate ? parse(fromDate, 'yyyy-MM-dd', new Date()) : undefined,
    to: toDate ? parse(toDate, 'yyyy-MM-dd', new Date()) : undefined,
  };

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (range: DateRange | undefined) => {
    if (range?.from) {
      onFromDateChange(format(range.from, 'yyyy-MM-dd'));
    } else {
      onFromDateChange('');
    }

    if (range?.to) {
      onToDateChange(format(range.to, 'yyyy-MM-dd'));
    } else {
      onToDateChange('');
    }
  };

  const clearFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFromDateChange('');
    onToDateChange('');
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = parse(dateStr, 'yyyy-MM-dd', new Date());
    return isValid(date) ? format(date, 'MMM d, yyyy') : dateStr;
  };

  const displayText = fromDate && toDate
    ? `${formatDisplayDate(fromDate)} - ${formatDisplayDate(toDate)}`
    : fromDate
    ? `${formatDisplayDate(fromDate)} - ...`
    : "Select dates";

  return (
    <div className="flex items-center gap-2" ref={containerRef}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
        {label}
      </label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[220px] justify-between"
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-gray-500" />
            <span>{displayText}</span>
          </div>
          {(fromDate || toDate) && (
            <div
              role="button"
              onClick={clearFilter}
              className="p-0.5 hover:bg-gray-200 dark:hover:bg-zinc-600 rounded-full"
            >
              <X className="w-3 h-3 text-gray-500" />
            </div>
          )}
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 z-50 mt-2 p-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-xl">
            <DayPicker
              mode="range"
              selected={selectedRange}
              onSelect={handleSelect}
              numberOfMonths={1}
              className="rdp-custom"
              styles={{
                caption: { color: 'inherit' },
              }}
            />
          </div>
        )}
      </div>
      <style jsx global>{`
        .rdp-custom {
          --rdp-cell-size: 40px;
          --rdp-accent-color: #3b82f6;
          --rdp-background-color: #eff6ff;
          margin: 0;
        }
        .dark .rdp-custom {
          --rdp-accent-color: #3b82f6;
          --rdp-background-color: #1e3a8a;
          color: #e4e4e7;
        }
        .dark .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
          background-color: #27272a;
        }
      `}</style>
    </div>
  );
}
