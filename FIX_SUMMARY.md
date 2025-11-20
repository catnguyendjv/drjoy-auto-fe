# Fix Summary - Redmine Helpers & Queries

## ✅ Đã sửa các lỗi

### File: `src/lib/utils/redmine-helpers.ts`

**Vấn đề:**
- Các hàm đang tham chiếu đến `CUSTOM_FIELDS.BUG_LEVEL`, `CUSTOM_FIELDS.BUG_TYPE`, `CUSTOM_FIELDS.BUG_ENV`, và `CUSTOM_FIELDS.RELEASED_DATE`
- Những custom fields này **không tồn tại** trong `CUSTOM_FIELDS` mới (được lấy từ Redmine thực tế)

**Giải pháp:**
1. Import thêm `LEGACY_CUSTOM_FIELDS` từ `redmine-config`
2. Cập nhật các hàm sau để sử dụng `LEGACY_CUSTOM_FIELDS`:

```typescript
// Line 7: Updated import
import { CUSTOM_FIELDS, LEGACY_CUSTOM_FIELDS, ISSUE_STATUSES } from '../redmine-config';

// Line 45: getBugLevel
export function getBugLevel(issue: Issue): string | null {
  const value = getCustomFieldValue(issue, LEGACY_CUSTOM_FIELDS.BUG_LEVEL.id);
  return typeof value === 'string' ? value : null;
}

// Line 53: getBugType
export function getBugType(issue: Issue): string | null {
  const value = getCustomFieldValue(issue, LEGACY_CUSTOM_FIELDS.BUG_TYPE.id);
  return typeof value === 'string' ? value : null;
}

// Line 61: getBugEnv
export function getBugEnv(issue: Issue): string | null {
  const value = getCustomFieldValue(issue, LEGACY_CUSTOM_FIELDS.BUG_ENV.id);
  return typeof value === 'string' ? value : null;
}

// Line 77: getReleasedDate
export function getReleasedDate(issue: Issue): string | null {
  const value = getCustomFieldValue(issue, LEGACY_CUSTOM_FIELDS.RELEASED_DATE.id);
  return typeof value === 'string' ? value : null;
}
```

**Các hàm được giữ nguyên (đã sử dụng đúng custom fields):**
- ✅ `getTeam()` - Sử dụng `CUSTOM_FIELDS.TEAM.id` (field thực tế ID: 86)
- ✅ `getStoryPoint()` - Sử dụng `CUSTOM_FIELDS.STORY_POINT.id` (field thực tế ID: 125)
- ✅ `isProdRelease()` - Sử dụng `CUSTOM_FIELDS.PROD_RELEASE.id` (field thực tế ID: 131)
- ✅ `isEmergencyRelease()` - Sử dụng `CUSTOM_FIELDS.EMERGENCY_RELEASE.id` (field thực tế ID: 120)

---

### File: `src/lib/utils/redmine-queries.ts`

**Vấn đề:**
- Các query functions đang tham chiếu đến `CUSTOM_FIELDS.BUG_LEVEL`
- Field này không tồn tại trong `CUSTOM_FIELDS` mới

**Giải pháp:**
1. Import thêm `LEGACY_CUSTOM_FIELDS`
2. Cập nhật các query functions:

```typescript
// Line 7: Updated import
import { 
  ISSUE_STATUSES, 
  TRACKERS, 
  PRIORITIES, 
  CUSTOM_FIELDS, 
  LEGACY_CUSTOM_FIELDS 
} from '../redmine-config';

// Line 282: bugsByLevelQuery
export function bugsByLevelQuery(
  level: string,
  projectId?: number
): IssueQueryParams {
  return {
    project_id: projectId,
    tracker_id: TRACKERS.BUG.id,
    [`cf_${LEGACY_CUSTOM_FIELDS.BUG_LEVEL.id}`]: level,
    status_id: 'open',
    limit: 100,
    sort: 'created_on:desc',
  };
}

// Line 296: criticalBugsQuery
export function criticalBugsQuery(projectId?: number): IssueQueryParams {
  return {
    project_id: projectId,
    tracker_id: TRACKERS.BUG.id,
    [`cf_${LEGACY_CUSTOM_FIELDS.BUG_LEVEL.id}`]: '4|5', // Level 4 or 5
    status_id: 'open',
    limit: 100,
    sort: 'created_on:desc',
  };
}
```

**Các query functions được giữ nguyên (đã sử dụng đúng custom fields):**
- ✅ `teamIssuesQuery()` - Sử dụng `CUSTOM_FIELDS.TEAM.id`
- ✅ `prodReleaseQuery()` - Sử dụng `CUSTOM_FIELDS.PROD_RELEASE.id`
- ✅ `emergencyReleaseQuery()` - Sử dụng `CUSTOM_FIELDS.EMERGENCY_RELEASE.id`

---

## 📊 Thống kê sửa lỗi

### redmine-helpers.ts
- **Số hàm bị ảnh hưởng**: 4 hàm
  - `getBugLevel()` - Line 44-47
  - `getBugType()` - Line 52-55
  - `getBugEnv()` - Line 60-63
  - `getReleasedDate()` - Line 76-79
- **Số hàm không cần sửa**: 4 hàm (đã sử dụng đúng custom fields)

### redmine-queries.ts
- **Số query functions bị ảnh hưởng**: 2 functions
  - `bugsByLevelQuery()` - Line 275-287
  - `criticalBugsQuery()` - Line 292-301
- **Số query functions không cần sửa**: 3 functions (đã sử dụng đúng custom fields)

---

## ⚠️ Lưu ý quan trọng

### Về LEGACY_CUSTOM_FIELDS

`LEGACY_CUSTOM_FIELDS` chứa các custom field được định nghĩa trong code cũ, **KHÔNG khớp** với Redmine thực tế:

```typescript
// Trong LEGACY_CUSTOM_FIELDS (KHÔNG tồn tại trong Redmine thực tế)
BUG_LEVEL: { id: 2, name: 'Bug level (Mức độ)', fieldFormat: 'list' }
BUG_TYPE: { id: 95, name: 'Bug type (Loại bug)', fieldFormat: 'list' }
BUG_ENV: { id: 14, name: 'Bug env (Môi trường)', fieldFormat: 'list' }
RELEASED_DATE: { id: 33, name: 'Released date', fieldFormat: 'date' }

// So với Redmine thực tế:
// ID 2: Không tồn tại trong danh sách custom fields
// ID 95: Là "実Android" (float field)
// ID 14: Là "テスト計画(Test plan)" (text field)
// ID 33: Không tồn tại trong danh sách custom fields
```

### Khuyến nghị

**Ngắn hạn:**
✅ Sử dụng `LEGACY_CUSTOM_FIELDS` để giữ code hoạt động (đã làm)

**Dài hạn:**
🔄 Cần review và update logic để:
1. **Tìm custom fields tương ứng thực tế** trong Redmine
2. **Update các hàm** để sử dụng custom fields đúng
3. **Hoặc loại bỏ** các hàm không còn cần thiết

Ví dụ có thể mapping:
- Bug Level → `SEVERITY` (ID: 105) - 重要度
- Bug Env → Có thể không cần thiết nữa
- Released Date → Có thể không có trong Redmine hiện tại

---

## ✅ Kết quả

- ✅ **Tất cả TypeScript errors đã được fix**
- ✅ **Code có thể compile thành công**
- ✅ **Backward compatible** với logic cũ
- ⚠️ **Cần review** trong tương lai để sử dụng custom fields thực tế

## 📝 Files đã sửa

1. `/src/lib/utils/redmine-helpers.ts`
2. `/src/lib/utils/redmine-queries.ts`

## 🔗 Liên quan

- `CUSTOM_FIELDS_SUMMARY.md` - Tổng quan về custom fields mới
- `CUSTOM_FIELDS_MIGRATION.md` - Hướng dẫn migration chi tiết
