import { useState, useEffect, useId } from 'react';
import Select, { Props as SelectProps, StylesConfig } from 'react-select';
import { useTheme } from 'next-themes';

export interface Option<T = string> {
  value: T;
  label: string;
}

interface SearchableSelectProps<T = string> extends Omit<SelectProps<Option<T>, false>, 'options' | 'value' | 'onChange'> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
}

export function SearchableSelect<T = string>({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
  ...restProps
}: SearchableSelectProps<T>) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const instanceId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`h-[32px] w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 ${className}`} />
    );
  }

  const isDark = theme === 'dark';

  const selectedOption = options.find(opt => opt.value === value) || null;

  const customStyles: StylesConfig<Option<T>, false> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: isDark ? 'rgb(39 39 42)' : 'white',
      borderColor: isDark ? 'rgb(63 63 70)' : 'rgb(209 213 219)',
      color: isDark ? 'white' : 'rgb(17 24 39)',
      minHeight: '32px',
      height: '32px',
      fontSize: '0.875rem',
      boxShadow: state.isFocused ? (isDark ? '0 0 0 1px rgb(63 63 70)' : '0 0 0 1px rgb(209 213 219)') : 'none',
      '&:hover': {
        borderColor: isDark ? 'rgb(82 82 91)' : 'rgb(156 163 175)',
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: '32px',
      padding: '0 8px',
    }),
    input: (provided) => ({
      ...provided,
      margin: '0',
      padding: '0',
      color: isDark ? 'white' : 'rgb(17 24 39)',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '32px',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: isDark ? 'rgb(39 39 42)' : 'white',
      borderColor: isDark ? 'rgb(63 63 70)' : 'rgb(209 213 219)',
      border: isDark ? '1px solid rgb(63 63 70)' : '1px solid rgb(209 213 219)',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? isDark ? 'rgb(63 63 70)' : 'rgb(219 234 254)'
        : state.isFocused
        ? isDark ? 'rgb(39 39 42)' : 'rgb(243 244 246)'
        : isDark ? 'rgb(39 39 42)' : 'white',
      color: isDark ? 'white' : 'rgb(17 24 39)',
      fontSize: '0.875rem',
      '&:active': {
        backgroundColor: isDark ? 'rgb(63 63 70)' : 'rgb(219 234 254)',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isDark ? 'white' : 'rgb(17 24 39)',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: isDark ? 'rgb(161 161 170)' : 'rgb(107 114 128)',
    }),
  };

  return (
    <Select<Option<T>>
      instanceId={instanceId}
      options={options}
      value={selectedOption}
      onChange={(option) => onChange(option?.value as T)}
      placeholder={placeholder}
      styles={customStyles}
      className={className}
      isClearable={false}
      isSearchable
      {...restProps}
    />
  );
}
