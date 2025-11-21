"use client";

import { useEffect, useState } from "react";
import { getRedmineApiKey, setRedmineApiKey, isValidRedmineApiKey, removeRedmineApiKey } from "@/lib/redmine-api-key";
import { Eye, EyeOff, TestTube2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
    const [apiKey, setApiKey] = useState("");
    const [showApiKey, setShowApiKey] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [validationError, setValidationError] = useState("");

    // Get base URL from env
    const baseUrl = process.env.NEXT_PUBLIC_REDMINE_BASE_URL || 'http://localhost:5000/redmine';

    useEffect(() => {
        // Load saved API key
        const storedKey = getRedmineApiKey();
        if (storedKey) {
            setApiKey(storedKey);
        }
    }, []);

    const handleSave = () => {
        // Validate API key format
        if (!apiKey.trim()) {
            setValidationError("API key cannot be empty");
            return;
        }

        if (!isValidRedmineApiKey(apiKey)) {
            setValidationError("Invalid API key format. Expected 40 hex characters.");
            return;
        }

        // Save to localStorage
        setRedmineApiKey(apiKey);
        setValidationError("");
        setIsSaved(true);
        toast.success("Settings saved successfully!");
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleTestConnection = async () => {
        if (!apiKey.trim()) {
            toast.error("Please enter API key first");
            return;
        }

        setIsTesting(true);
        try {
            // Test connection by fetching users
            const response = await fetch(`${baseUrl}/project/memberships?limit=1`, {
                headers: {
                    'X-Redmine-API-Key': apiKey,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                toast.success("✅ Connection successful!");
            } else {
                toast.error(`Connection failed: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            toast.error(`Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsTesting(false);
        }
    };

    const handleClearSettings = () => {
        if (confirm("Are you sure you want to clear all settings? This cannot be undone.")) {
            removeRedmineApiKey();
            setApiKey("");
            toast.success("Settings cleared");
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Redmine Settings
            </h1>
            
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-zinc-700">
                <div className="space-y-6">
                    {/* Base URL Display (read-only from env) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Redmine Base URL
                        </label>
                        <div className="px-3 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 rounded-lg text-gray-600 dark:text-gray-400 font-mono text-sm">
                            {baseUrl}
                        </div>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Configured from environment variables (read-only)
                        </p>
                    </div>

                    {/* API Key Setting */}
                    <div>
                        <label
                            htmlFor="apiKey"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Redmine API Key
                        </label>
                        <div className="relative">
                            <input
                                type={showApiKey ? "text" : "password"}
                                id="apiKey"
                                value={apiKey}
                                onChange={(e) => {
                                    setApiKey(e.target.value);
                                    setValidationError("");
                                }}
                                className={`w-full px-3 py-2 pr-10 border rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                                    validationError 
                                        ? 'border-red-500 dark:border-red-500' 
                                        : 'border-gray-300 dark:border-zinc-600'
                                }`}
                                placeholder="Enter your Redmine API key (40 hex characters)"
                            />
                            <button
                                type="button"
                                onClick={() => setShowApiKey(!showApiKey)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                title={showApiKey ? "Hide API key" : "Show API key"}
                            >
                                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {validationError && (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                {validationError}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Your API key is stored locally in your browser. Find it in: Redmine → My account → API access key
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2 border-t border-gray-200 dark:border-zinc-700">
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Save Settings
                        </button>
                        
                        <button
                            onClick={handleTestConnection}
                            disabled={isTesting}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <TestTube2 className="w-4 h-4" />
                            {isTesting ? "Testing..." : "Test Connection"}
                        </button>

                        <button
                            onClick={handleClearSettings}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear Settings
                        </button>

                        {isSaved && (
                            <span className="text-sm text-green-600 dark:text-green-400 font-medium animate-fade-in">
                                ✅ Saved!
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    ℹ️ How to get your API key
                </h3>
                <ol className="text-xs text-blue-800 dark:text-blue-300 space-y-1 ml-4 list-decimal">
                    <li>Log in to your Redmine account</li>
                    <li>Click on your name (top right) → My account</li>
                    <li>On the right side, click "Show" under "API access key"</li>
                    <li>Copy the 40-character key and paste it above</li>
                    <li>Click "Save Settings" then "Test Connection" to verify</li>
                </ol>
            </div>
        </div>
    );
}
