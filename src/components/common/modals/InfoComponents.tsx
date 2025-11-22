import React from 'react';

interface InfoFieldProps {
    label: string;
    value: string | number | undefined | null;
    className?: string;
}

export function InfoField({ label, value, className = '' }: InfoFieldProps) {
    return (
        <div className={className}>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</label>
            <div className="font-medium text-gray-900 dark:text-white">{value || '-'}</div>
        </div>
    );
}

interface TimestampSectionProps {
    createdOn: string;
    updatedOn: string;
    closedOn?: string | null;
}

export function TimestampSection({ createdOn, updatedOn, closedOn }: TimestampSectionProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
            <InfoField 
                label="Created" 
                value={new Date(createdOn).toLocaleString()} 
            />
            <InfoField 
                label="Updated" 
                value={new Date(updatedOn).toLocaleString()} 
            />
            {closedOn && (
                <InfoField 
                    label="Closed" 
                    value={new Date(closedOn).toLocaleString()} 
                />
            )}
        </div>
    );
}
