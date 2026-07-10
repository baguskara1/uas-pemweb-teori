'use client';

import { Calendar as CalendarIcon } from 'lucide-react';

type DatePickerProps = {
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
  label: string;
};

export function DatePicker({ value, onChange, minDate, label }: DatePickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-text text-xs font-medium text-text-tertiary uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <CalendarIcon className="h-4 w-4 text-text-tertiary" />
        </div>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={minDate}
          className="block w-full rounded-input border border-surface-light bg-white py-2 pl-10 pr-3 font-text text-sm placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
}
