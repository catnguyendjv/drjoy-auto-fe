# Redmine Custom Fields Configuration - Summary

## ✅ Đã hoàn thành

Tôi đã kiểm tra và thiết kế lại cấu trúc `CUSTOM_FIELDS` trong project với đầy đủ thông tin từ Redmine API.

### 1. **Kiểm tra Custom Fields trên Redmine**

Kết quả kiểm tra:
- ✅ Tất cả 101 custom fields trên Redmine đều có tên theo format chuẩn (tiếng Nhật/Anh)
- ✅ KHÔNG có custom field nào có tên tiếng Việt thuần túy
- ✅ Các custom field giữ đúng tên gốc như: `担当チーム (Assigned team)`, `重要度`, `緊急リリースフラグ(Emergency release)`, etc.

### 2. **Tạo File Mới: `redmine-custom-fields.ts`**

File này được auto-generated từ Redmine REST API và bao gồm:

```typescript
export const CUSTOM_FIELDS = {
  FUNC_CODE: { id: 1, name: 'Func Code', fieldFormat: 'string', multiple: false },
  TEAM: { id: 86, name: '担当チーム (Assigned team)', fieldFormat: 'list', multiple: false },
  TEST_PLAN: { id: 14, name: 'テスト計画(Test plan)', fieldFormat: 'text', multiple: false },
  FEATURE: { id: 37, name: '機能区分(Feature)', fieldFormat: 'list', multiple: true },
  ISSUE_TYPE: { id: 50, name: 'Issue Type', fieldFormat: 'list', multiple: false },
  // ... và 33 fields khác
}
```

**Các possible values cho list fields:**

```typescript
export const TEAM_OPTIONS = [
  { value: '未選択', label: '未選択' },
  { value: 'DEV01：ゴク', label: 'DEV01：ゴク' },
  { value: 'DEV02：チャン', label: 'DEV02：チャン' },
  // ... 15 teams
]

export const FEATURE_OPTIONS = [
  { value: 'AM: 社内システム', label: 'AM: 社内システム' },
  { value: 'AP: モバイルアプリ', label: 'AP: モバイルアプリ' },
  // ... 40 features
]

export const SEVERITY_OPTIONS = [
  { value: '1 文言、レイアウトなど、ユーザーの業務に影響しない', label: '...' },
  { value: '2 特別なケース、少数のユーザーに影響する、データ更新などで解決出来る', label: '...' },
  // ... 5 levels
]

// và nhiều OPTIONS khác...
```

### 3. **Cập nhật `redmine-config.ts`**

File này bây giờ:
- ✅ Re-export `CUSTOM_FIELDS` và các `OPTIONS` từ `redmine-custom-fields.ts`
- ✅ Giữ lại `LEGACY_CUSTOM_FIELDS` cho backward compatibility
- ✅ Re-export types: `CustomFieldId`, `CustomFieldFormat`, `CustomFieldDefinition`, `CustomFieldOption`

### 4. **Type Definitions**

```typescript
export interface CustomFieldDefinition {
  id: number;
  name: string;
  fieldFormat: CustomFieldFormat;
  multiple: boolean;
}

export interface CustomFieldOption {
  value: string;
  label: string;
}

export type CustomFieldFormat = 
  | 'list' 
  | 'string' 
  | 'text' 
  | 'date' 
  | 'bool' 
  | 'user' 
  | 'link' 
  | 'float';
```

## 📝 Các Custom Fields được include

### General Fields
- `FUNC_CODE` (id: 1) - Func Code
- `TEAM` (id: 86) - 担当チーム (Assigned team)  
- `FEATURE` (id: 37) - 機能区分(Feature)
- `CATEGORY` (id: 97) - 分類(Category)
- `ISSUE_TYPE` (id: 50) - Issue Type
- `FUNCTION_TYPE` (id: 60) - 機能種別（Funcrion Type）
- `NOTE` (id: 67) - Note

### Management Fields  
- `MANAGED_TICKET` (id: 85) - 管理対象のチケットである
- `SIMPLE_TASK` (id: 96) - 簡単なチケット・simple task
- `SEVERITY` (id: 105) - 重要度
- `ESTIMATE_REQUEST` (id: 126) - 見積依頼

### Development Fields
- `STORY_POINT` (id: 125) - ストーリーポイント(Story point)
- `REVIEWER` (id: 122) - レビュー者(Reviewer)
- `ACCEPTANCE_PERSON` (id: 101) - 受入担当者（Acceptance person）

### Documentation Fields
- `SPEC_TICKET_FILE` (id: 124) - チケット仕様書ファイル（Spec Ticket file）
- `FILE_SPEC_STUDY` (id: 128) - 仕様検討ファイル (FileSpecStudy)
- `INVESTIGATION_FILE` (id: 102) - 調査ファイル (Investigation File)
- `BUG_REPORT_LINK` (id: 103) - バグ報告リンク (Report bug)
- `TESTCASE_FILE` (id: 104) - 試験事例ファイル （Testcase File）
- `TEST_PLAN` (id: 14) - テスト計画(Test plan)
- `SCOPE_OF_IMPACT` (id: 100) - 影響範囲(Scope of impact)

### Date Fields
- `RECOVERY_DATE` (id: 109) - リカバリー期日(Recovery date)
- `PROVISIONAL_HANDLING_DATE` (id: 114) - 暫定対応予定日(PHD)
- `PROVISIONAL_HANDLING_COMPLETED_DATE` (id: 115) - 暫定対応完了日(PHCD)
- `PERMANENT_SOLUTION_PLANNED_DATE` (id: 118) - 恒久対応予定日(PSPD)
- `PERMANENT_SOLUTION_COMPLETED_DATE` (id: 119) - 恒久対応完了日(PSCD)

### Text Content Fields
- `PROVISIONAL_HANDLING_CONTENT` (id: 111) - 暫定対応内容(PHC)
- `WORKAROUND` (id: 112) - 運用回避方法(Workaround)
- `RECOVERY_CONTENT` (id: 113) - リカバリー内容(Recovery content)
- `PERMANENT_SOLUTION_CONTENT` (id: 117) - 恒久対応内容(PSC)
- `PREVENTION_MEASURES` (id: 123) - 再発防止策(Prevention measures)

### Status Fields
- `RECOVERY_COMPLETED` (id: 110) - リカバリー完了(Recovery completed)
- `PROVISIONAL_HANDLING_IS_COMPLETED` (id: 116) - 暫定対応完了(PHIC)
- `EMERGENCY_RELEASE` (id: 120) - 緊急リリースフラグ(Emergency release)
- `PAID_FUNCTION` (id: 121) - 有償／無償(Paid function)
- `PROD_RELEASE` (id: 131) - Prod Release (本番反映)

### Other Fields
- `GIT_REPOSITORY` (id: 40) - ENV: Gitリポジトリ
- `OCCURRENCE_TIME` (id: 106) - 発生日時(Occurrence time)
- `ORIGINAL_TICKET` (id: 127) - 発生元チケット

## 🔄 Cách sử dụng

### Import từ redmine-config.ts (Recommended):
```typescript
import { 
  CUSTOM_FIELDS, 
  TEAM_OPTIONS, 
  SEVERITY_OPTIONS,
  FEATURE_OPTIONS
} from '@/lib/redmine-config';

// Sử dụng
const teamFieldId = CUSTOM_FIELDS.TEAM.id; // 86
const teamOptions = TEAM_OPTIONS; // Array of team options
```

### Import trực tiếp từ redmine-custom-fields.ts:
```typescript
import { 
  CUSTOM_FIELDS, 
  TEAM_OPTIONS 
} from '@/lib/redmine-custom-fields';
```

## ⚠️ Lưu ý

### Các file cần update:
Một số file vẫn đang sử dụng custom field cũ (không tồn tại trong Redmine thực tế):
- `src/lib/utils/redmine-helpers.ts` - References to BUG_LEVEL, BUG_TYPE, BUG_ENV, RELEASED_DATE
- `src/lib/utils/redmine-queries.ts` - References to BUG_LEVEL

Cần cập nhật các file này để:
1. Sử dụng `LEGACY_CUSTOM_FIELDS` nếu muốn giữ logic cũ
2. Hoặc tốt hơn: Cập nhật để sử dụng custom fields thực tế từ Redmine

### Backward Compatibility:
File `redmine-config.ts` vẫn export `LEGACY_CUSTOM_FIELDS` chứa các field cũ để không break code hiện tại.

## 📚 Tài liệu thêm

Xem file `CUSTOM_FIELDS_MIGRATION.md` để biết chi tiết về:
- Migration guide
- Field name mapping (old → new)
- Code examples
- How to regenerate từ Redmine API

## 🎯 Tổng kết

✅ Custom fields trên Redmine đã được giữ nguyên tên (không có tên tiếng Việt thuần túy)
✅ Đã tạo file mới `redmine-custom-fields.ts` với data chính xác từ Redmine API
✅ Include đầy đủ 38 custom fields quan trọng với all possible values
✅ Backward compatible với code cũ thông qua `LEGACY_CUSTOM_FIELDS`
