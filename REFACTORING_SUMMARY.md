# Refactoring Summary: KanbanIssueDetailModal → IssueDetailModal

## Overview
Đã refactor `KanbanIssueDetailModal` thành component common `IssueDetailModal` và cập nhật mock data để phản ánh cấu trúc dữ liệu Redmine thực tế.

## Changes Made

### 1. Created Common Component
**File**: `/src/components/common/modals/IssueDetailModal.tsx`

- Tạo component common `IssueDetailModal` có thể tái sử dụng trong toàn bộ ứng dụng
- Enhanced features:
  - Hiển thị tracker type (Dev, Task, Bug)
  - Hiển thị đầy đủ custom fields từ Redmine
  - Layout được tổ chức tốt hơn với 2 cột: Basic Details và Dates & Planning
  - Hiển thị parent issue nếu có
  - Hiển thị timestamps (created, updated, closed)
  - Support cho multiple values trong custom fields

### 2. Updated Mock Data
**File**: `/src/data/mockData.ts`

#### Updated Constants:
- **MOCK_STATUSES**: Thêm status "Released" (id: 12)
- **MOCK_PRIORITIES**: Sắp xếp lại theo thứ tự: Low, Normal, High, Urgent
- **MOCK_VERSIONS**: Thêm version "250822" (id: 220) từ Redmine thực tế
- **MOCK_TEAMS**: Cập nhật tên team theo Redmine:
  - DEV05：チュンハイ
  - DEV06：Backend Team
  - DEV07：QA Team
- **MOCK_USERS**: Cập nhật danh sách users từ Redmine:
  - 片桐 katagiri (id: 257)
  - pgtest@drjoy.vn Tool (id: 411)
  - tam.truong Te (id: 520)
  - dao.tran Ja (id: 537)
  - hang.pham Com (id: 607)

#### Added Real Redmine Issues:
Thêm 3 issues thực tế từ các file JSON được cung cấp:

1. **Issue #181930** (Dev):
   - JP_AT0104_福島県立医科大学病院_手当申請機能の開発
   - Tracker: Dev
   - Status: Released
   - Priority: High
   - Bao gồm đầy đủ custom fields như: 機能区分, 分類, 担当チーム, etc.

2. **Issue #202198** (Task):
   - [BugFruit]JP_AT0104 - Bệnh viện Fukushima
   - Tracker: Task
   - Status: Closed
   - Parent: #202193

3. **Issue #205772** (Bug):
   - [BugFruit] AT0104, AT0105 Lỗi sort sai danh sách category
   - Tracker: Bug
   - Status: Closed
   - Parent: #202198
   - Bao gồm bug-specific fields: Steps to repro, Expected result, Cause classification, etc.

### 3. Updated Component References

#### KanbanBoard.tsx
- Import: `KanbanIssueDetailModal` → `IssueDetailModal`
- Usage: Updated component reference

#### ScheduleGantt.tsx
- Import: `KanbanIssueDetailModal` → `IssueDetailModal`
- Usage: Updated component reference

### 4. Created Export Index
**File**: `/src/components/common/modals/index.ts`
- Export `IssueDetailModal` để dễ dàng import

## Benefits

1. **Reusability**: Component có thể được sử dụng ở bất kỳ đâu trong ứng dụng
2. **Consistency**: Cùng một modal được sử dụng cho Kanban và Schedule
3. **Real Data Structure**: Mock data phản ánh đúng cấu trúc Redmine thực tế
4. **Better Organization**: Code được tổ chức tốt hơn với common components
5. **Enhanced Features**: Hiển thị nhiều thông tin hơn (custom fields, tracker, parent issue, etc.)

## Files Modified

- ✅ Created: `/src/components/common/modals/IssueDetailModal.tsx`
- ✅ Created: `/src/components/common/modals/index.ts`
- ✅ Updated: `/src/data/mockData.ts`
- ✅ Updated: `/src/components/features/kanban/KanbanBoard.tsx`
- ✅ Updated: `/src/components/features/schedule/ScheduleGantt.tsx`

## Old Component Status

**File**: `/src/components/features/kanban/KanbanIssueDetailModal.tsx`
- ⚠️ This file can now be deleted as it's been replaced by the common component
- No longer referenced anywhere in the codebase

## Testing Recommendations

1. Test opening issue details from Kanban board
2. Test opening issue details from Schedule Gantt
3. Verify custom fields are displayed correctly
4. Test edit mode functionality
5. Verify all new mock issues appear correctly in the UI
6. Test filtering with new user IDs and team names
