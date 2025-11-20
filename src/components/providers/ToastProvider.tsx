'use client';

import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { useTheme } from 'next-themes';

export function ToastProvider() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Don't render anything until mounted on client
    if (!mounted) {
        return null;
    }

    return (
        <Toaster
            theme={resolvedTheme as 'light' | 'dark'}
            position="top-right"
            richColors
            closeButton
            duration={4000}
        />
    );
}
