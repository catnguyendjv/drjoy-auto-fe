"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
    const [apiKey, setApiKey] = useState("");
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const storedKey = localStorage.getItem("redmine_api_key");
        if (storedKey) {
            setApiKey(storedKey);
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem("redmine_api_key", apiKey);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Settings
            </h1>
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-zinc-700">
                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="apiKey"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Redmine API Key
                        </label>
                        <input
                            type="password"
                            id="apiKey"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="Enter your Redmine API key"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Your API key is stored locally in your browser.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Save Settings
                        </button>
                        {isSaved && (
                            <span className="text-sm text-green-600 dark:text-green-400 font-medium animate-fade-in">
                                Saved successfully!
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
