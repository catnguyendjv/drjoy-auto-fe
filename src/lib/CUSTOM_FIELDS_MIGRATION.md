# Custom Fields Migration Guide

## Overview

The custom fields configuration has been updated to use accurate data from Redmine API. This document explains the changes and how to migrate your code.

## What Changed?

### New Files

- **`redmine-custom-fields.ts`**: Auto-generated from Redmine API containing:
  - Accurate custom field definitions
  - All possible values for list-type fields
  - Proper field formats and types

### Updated Files

- **`redmine-config.ts`**: Now re-exports from `redmine-custom-fields.ts`
  - `CUSTOM_FIELDS` - Accurate field definitions from Redmine
  - `TEAM_OPTIONS`, `FEATURE_OPTIONS`, etc. - Accurate possible values

## Migration Steps

### 1. Field Names Changed

Some custom fields have different names in the actual Redmine system. Here's a mapping of old to new field names:

| Old Field Name (in config) | Actual Redmine Name | New Key in CUSTOM_FIELDS |
|----------------------------|---------------------|--------------------------|
| Team (id: 1) | Func Code | FUNC_CODE |
| Test case type (id: 10) | ソースコード修正箇所（Changed content） | N/A (not in new config) |
| Bug env (id: 14) | テスト計画(Test plan) | TEST_PLAN |
| Team (actual) | 担当チーム (Assigned team) | TEAM |

### 2. Update Your Code

#### Before:
```typescript
import { CUSTOM_FIELDS } from '@/lib/redmine-config';

// Old field that doesn't exist anymore
const bugLevelId = CUSTOM_FIELDS.BUG_LEVEL.id; // ❌ Error!
```

#### After:
```typescript
import { CUSTOM_FIELDS, LEGACY_CUSTOM_FIELDS } from '@/lib/redmine-config';

// Use legacy fields if you need the old IDs (not recommended)
const bugLevelId = LEGACY_CUSTOM_FIELDS.BUG_LEVEL.id;

// Or better: Use the actual Redmine fields
// Check redmine-custom-fields.ts for available fields
const teamId = CUSTOM_FIELDS.TEAM.id; // ✅ Correct!
```

### 3. Available New Fields

The new `CUSTOM_FIELDS` contains these fields (all from actual Redmine):

- `FUNC_CODE` - Func Code (id: 1)
- `TEAM` - 担当チーム (Assigned team) (id: 86)
- `TEST_PLAN` - テスト計画(Test plan) (id: 14)
- `FEATURE` - 機能区分(Feature) (id: 37)
- `ISSUE_TYPE` - Issue Type (id: 50)
- `FUNCTION_TYPE` - 機能種別（Funcrion Type） (id: 60)
- `NOTE` - Note (id: 67)
- `SIMPLE_TASK` - 簡単なチケット・simple task (id: 96)
- `CATEGORY` - 分類(Category) (id: 97)
- `SEVERITY` - 重要度 (id: 105)
- `EMERGENCY_RELEASE` - 緊急リリースフラグ(Emergency release) (id: 120)
- `PAID_FUNCTION` - 有償／無償(Paid function) (id: 121)
- `REVIEWER` - レビュー者(Reviewer) (id: 122)
- `STORY_POINT` - ストーリーポイント(Story point) (id: 125)
- `ESTIMATE_REQUEST` - 見積依頼 (id: 126)
- `PROD_RELEASE` - Prod Release (本番反映) (id: 131)
- And more... (see `redmine-custom-fields.ts` for full list)

### 4. Using Options

#### Before:
```typescript
import { TEAM_OPTIONS } from '@/lib/redmine-config';

// Old team options (not accurate)
const teams = TEAM_OPTIONS; // ❌ Old data
```

#### After:
```typescript
import { TEAM_OPTIONS } from '@/lib/redmine-config';
// or
import { TEAM_OPTIONS } from '@/lib/redmine-custom-fields';

// New accurate team options from Redmine
const teams = TEAM_OPTIONS; // ✅ Accurate data!
/*
[
  { value: '未選択', label: '未選択' },
  { value: 'DEV01：ゴク', label: 'DEV01：ゴク' },
  { value: 'DEV02：チャン', label: 'DEV02：チャン' },
  ...
]
*/
```

## Regenerating Custom Fields

To update the custom fields from Redmine:

1. Get the latest data:
```bash
curl -s -H "X-Redmine-API-Key: YOUR_API_KEY" \
  "https://redmine.famishare.jp/custom_fields.json" \
  -o /tmp/custom_fields.json
```

2. Run the generation script (to be created):
```bash
# TODO: Create a generation script
npm run generate:custom-fields
```

## Known Issues

Some files still reference old field names:
- `src/lib/utils/redmine-helpers.ts` 
- `src/lib/utils/redmine-queries.ts`

These files need to be updated to use either:
- The new `CUSTOM_FIELDS` (recommended)
- Or `LEGACY_CUSTOM_FIELDS` (temporary fix)

## Support

If you encounter issues:
1. Check which custom field ID you need
2. Look it up in `redmine-custom-fields.ts`
3. Use the correct FIELD_NAME from `CUSTOM_FIELDS`

For fields not in the new configuration:
- Check if they still exist in Redmine
- Use `LEGACY_CUSTOM_FIELDS` as a temporary workaround
- Consider updating your code to use actual Redmine fields
