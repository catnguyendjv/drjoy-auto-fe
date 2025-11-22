"use client";

import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Divider, Input } from "@heroui/react";
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Redmine Settings</h1>

            <Card shadow="sm" className="border border-gray-200 dark:border-zinc-700">
                <CardHeader className="flex flex-col items-start gap-1">
                    <p className="text-small text-gray-500 dark:text-gray-400">Configuration</p>
                    <h2 className="text-large font-semibold text-gray-900 dark:text-white">API access</h2>
                </CardHeader>
                <Divider />
                <CardBody className="space-y-6">
                    {/* Base URL Display (read-only from env) */}
                    <Input
                        label="Redmine Base URL"
                        value={baseUrl}
                        readOnly
                        variant="bordered"
                        description="Configured from environment variables (read-only)"
                    />

                    {/* API Key Setting */}
                    <Input
                        type={showApiKey ? "text" : "password"}
                        label="Redmine API Key"
                        labelPlacement="outside"
                        value={apiKey}
                        onChange={(e) => {
                            setApiKey(e.target.value);
                            setValidationError("");
                        }}
                        placeholder="Enter your Redmine API key (40 hex characters)"
                        variant="bordered"
                        isInvalid={Boolean(validationError)}
                        errorMessage={validationError}
                        description="Your API key is stored locally in your browser. Find it in: Redmine → My account → API access key"
                        endContent={
                            <Button
                                isIconOnly
                                variant="light"
                                radius="full"
                                onPress={() => setShowApiKey(!showApiKey)}
                                aria-label={showApiKey ? "Hide API key" : "Show API key"}
                                className="text-default-500"
                            >
                                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                        }
                    />

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <Button color="primary" onPress={handleSave} radius="md">
                            Save Settings
                        </Button>

                        <Button
                            color="success"
                            onPress={handleTestConnection}
                            isDisabled={isTesting}
                            isLoading={isTesting}
                            startContent={<TestTube2 className="w-4 h-4" />}
                            radius="md"
                        >
                            {isTesting ? "Testing..." : "Test Connection"}
                        </Button>

                        <Button
                            color="danger"
                            onPress={handleClearSettings}
                            startContent={<Trash2 className="w-4 h-4" />}
                            radius="md"
                            variant="flat"
                        >
                            Clear Settings
                        </Button>

                        {isSaved && (
                            <span className="text-sm text-green-600 dark:text-green-400 font-medium animate-fade-in">
                                ✅ Saved!
                            </span>
                        )}
                    </div>
                </CardBody>
            </Card>

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
