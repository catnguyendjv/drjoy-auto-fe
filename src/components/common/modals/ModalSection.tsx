import React from 'react';

interface ModalSectionProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
    collapsible?: boolean;
    defaultExpanded?: boolean;
}

export function ModalSection({ 
    title, 
    children, 
    className = '',
    collapsible = false,
    defaultExpanded = true
}: ModalSectionProps) {
    const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

    if (!title) {
        return <div className={className}>{children}</div>;
    }

    return (
        <div className={className}>
            {collapsible ? (
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                        {title}
                    </h3>
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none"
                    >
                        {isExpanded ? (
                            <>
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                                Show Less
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                Show More
                            </>
                        )}
                    </button>
                </div>
            ) : (
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                    {title}
                </h3>
            )}
            {(!collapsible || isExpanded) && (
                <div className={collapsible ? 'animate-in fade-in slide-in-from-top-2 duration-200' : ''}>
                    {children}
                </div>
            )}
        </div>
    );
}
