# Redmine API Field Analysis & Summary

## API Endpoints Tested

Đã kiểm tra thành công 3 tickets từ Redmine API:
- Task: https://redmine.famishare.jp/issues/202198.json
- Bug: https://redmine.famishare.jp/issues/205772.json
- Dev: https://redmine.famishare.jp/issues/181930.json

API Key đã sử dụng: `93ab302da634135f392e959c4789811857b3e832`

## Required Fields (Bắt buộc)

Các field này **BẮT BUỘC** phải có trong mọi Issue object:

### 1. Basic Information
- `id`: number - ID của issue
- `subject`: string - Tiêu đề
- `description`: string - Mô tả chi tiết

### 2. Tracker
```typescript
tracker: {
    id: number;
    name: string; // 'Task', 'Bug', 'Dev', etc.
}
```

### 3. Status
```typescript
status: {
    id: number;
    name: string; // 'New', 'In Progress', 'Closed', 'Released', etc.
    is_closed?: boolean;
}
```

### 4. Priority
```typescript
priority: {
    id: number;
    name: string; // 'Normal', 'High', 'Low', 'Urgent'
}
```

### 5. Project
```typescript
project: {
    id: number;
    name: string;
}
```

### 6. Progress & Privacy
- `done_ratio`: number (0-100) - Tỉ lệ hoàn thành
- `is_private`: boolean - Issue có private không

### 7. Timestamps
- `created_on`: string (ISO 8601 format)
- `updated_on`: string (ISO 8601 format)

## Optional Fields (Tùy chọn)

### Author
```typescript
author?: {
    id: number;
    name: string;
}
```

### Assigned To
```typescript
assigned_to?: {
    id: number;
    name: string;
}
```

### Fixed Version
```typescript
fixed_version?: {
    id: number;
    name: string;
}
```

### Parent Issue
```typescript
parent?: {
    id: number;
}
// Hoặc
parent_id?: number;
```

### Dates
- `start_date?: string | null` - Ngày bắt đầu (YYYY-MM-DD hoặc null)
- `due_date?: string | null` - Ngày deadline (YYYY-MM-DD hoặc null)
- `closed_on?: string | null` - Ngày đóng issue

### Time Tracking
- `estimated_hours?: number | null` - Số giờ ước tính
- `total_estimated_hours?: number | null` - Tổng số giờ ước tính (bao gồm子tickets)
- `spent_hours?: number` - Số giờ đã spend
- `total_spent_hours?: number` - Tổng số giờ đã spend (bao gồm子tickets)

### Custom Fields
```typescript
custom_fields?: Array<{
    id: number;
    name: string;
    value: string | string[] | null;
    multiple?: boolean;
}>
```

## Real Data Examples

### Task #202198 - Closed Task
```json
{
  "id": 202198,
  "tracker": { "id": 7, "name": "Task" },
  "status": { "id": 5, "name": "Closed", "is_closed": true },
  "priority": { "id": 2, "name": "Normal" },
  "done_ratio": 100,
  "total_estimated_hours": 184.0,
  "total_spent_hours": 180.25,
  "fixed_version": { "id": 220, "name": "250822" }
}
```

### Bug #205772 - Closed Bug
```json
{
  "id": 205772,
  "tracker": { "id": 1, "name": "Bug" },
  "status": { "id": 5, "name": "Closed", "is_closed": true },
  "priority": { "id": 2, "name": "Normal" },
  "parent": { "id": 202198 },
  "estimated_hours": 8.0,
   "spent_hours": 8.0,
  "start_date": "2025-07-23",
  "due_date": "2025-07-23"
}
```

### Dev #181930 - Released Dev Ticket
```json
{
  "id": 181930,
  "tracker": { "id": 12, "name": "Dev" },
  "status": { "id": 12, "name": "Released", "is_closed": true },
  "priority": { "id": 3, "name": "High" },
  "done_ratio": 100,
  "total_estimated_hours": 1942.0,
  "total_spent_hours": 1993.75
}
```

## Common Tracker Types
- `id: 1` - Bug
- `id: 7` - Task  
- `id: 12` - Dev

## Common Status Types
- `id: 1` - New
- `id: 2` - In Progress
- `id: 3` - Resolved
- `id: 4` - Feedback
- `id: 5` - Closed (is_closed: true)
- `id: 12` - Released (is_closed: true)

## Common Priority Types
- `id: 1` - Low
- `id: 2` - Normal
- `id: 3` - High
- `id: 4` - Urgent

## Update Checklist

### ✅ Đã hoàn thành:
1. ✅ Đã call API và lấy được data thực từ 3 tickets
2. ✅ Đã phân tích và document các field
3. ✅ Đã update TypeScript type definitions (`src/types/redmine.ts`)
4. ✅ Đã tạo file real data examples (`src/data/realRedmineData.ts`)
5. ✅ Đã tạo template mới với helper function (`src/data/mockDataNew.ts`)

### 🔨 Cần làm tiếp:
1. ❌ Cập nhật tất cả mock data trong `src/data/mockData.ts` với các field bắt buộc
2. ❌ Test lại application để đảm bảo không có lỗi TypeScript
3. ❌ Update các components sử dụng Issue type nếu cần
4. ❌ Tạo API service helpers để call Redmine API

## Recommended Next Steps

1. **Backup current mockData.ts** trước khi thay thế
2. **Copy structure từ mockDataNew.ts** để tạo full mock data
3. **Update tất cả MOCK_ISSUES array** với đủ các field bắt buộc
4. **Test cẩn thận** trên từng component sử dụng Issue data
5. **Create API service** để integrate với real Redmine API

## Notes

- Tất cả timestamps nên dùng ISO 8601 format: `2025-07-22T09:15:24Z`
- Date fields (start_date, due_date) dùng format: `YYYY-MM-DD`
- `done_ratio` là số nguyên từ 0-100, không phải percentage string
- `is_private` luôn là boolean, không được null
- `tracker` luôn bắt buộc có, giúp phân biệt loại ticket
