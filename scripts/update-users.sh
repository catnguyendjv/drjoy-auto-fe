#!/bin/bash

# Update Redmine Users Data
# Fetches latest users from Redmine API and regenerates TypeScript file

set -e

API_KEY="93ab302da634135f392e959c4789811857b3e832"
BASE_URL="https://redmine.famishare.jp"

echo "🔄 Updating Redmine Users Data..."
echo ""

# Fetch users (batch 1)
echo "📡 Fetching users (batch 1: 0-99)..."
curl -s -H "Content-Type: application/json" \
  "${BASE_URL}/users.json?key=${API_KEY}&limit=100" \
  -o users_raw.json

# Fetch users (batch 2)
echo "📡 Fetching users (batch 2: 100-199)..."
curl -s -H "Content-Type: application/json" \
  "${BASE_URL}/users.json?key=${API_KEY}&limit=100&offset=100" \
  -o users_raw_2.json

echo ""

# Generate TypeScript file
echo "⚙️  Generating TypeScript file..."
node scripts/generate-users.js

# Cleanup temporary files
echo "🧹 Cleaning up temporary files..."
rm -f users_raw.json users_raw_2.json

echo ""
echo "✅ Redmine users data updated successfully!"
echo "📝 File: src/lib/redmine-users.ts"
echo ""
