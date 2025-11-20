# So sánh Cấu trúc Issue: Cũ vs Mới

## 📊 Tóm tắt thay đổi

| Field | Trước đây | Bây giờ | Ghi chú |
|-------|-----------|---------|---------|
| `tracker` | ❌ Không có | ✅ Bắt buộc | Phân biệt Task/Bug/Dev |
| `done_ratio` | ❌ Không có | ✅ Bắt buộc | Progress 0-100 |
| `is_private` | ❌ Không có | ✅ Bắt buốc | Boolean true/false |
| `status.is_closed` | ❌ Không có | ✅ Optional | Biết status có closed không |
| `parent` | ❌ Chỉ có `parent_id` | ✅ Cả 2 | Object `{id}` hoặc `parent_id` |
| `closed_on` | ❌ Không có | ✅ Optional | Timestamp khi đóng issue |
| `estimated_hours` | ❌ Không có | ✅ Optional | Giờ ước tính |
| `spent_hours` | ❌ Không có | ✅ Optional | Giờ đã spend |
| `custom_fields` | ❌ Không có | ✅ Optional | Custom fields từ Redmine |

## 📝 Ví dụ Code

### ❌ CŨ - Thiếu nhiều field
```typescript
{
    id: 100,
    subject: 'User Authentication Feature',
    description: 'Complete user authentication system',
    status: { id: 2, name: 'In Progress' },  // ❌ Thiếu is_closed
    priority: { id: 3, name: 'Urgent' },
    project: { id: 1, name: 'Dr.Joy Auto' },
    // ❌ THIẾU tracker
    // ❌ THIẾU done_ratio
    // ❌ THIẾU is_private
    created_on: '2023-11-01',
    updated_on: '2023-11-05'
}
```

### ✅ MỚI - Đầy đủ theo API Redmine
```typescript
{
    id: 100,
    subject: 'User Authentication Feature',
    description: 'Complete user authentication system',
    tracker: { id: 7, name: 'Task' },  // ✅ MỚI
    status: { id: 2, name: 'In Progress', is_closed: false }, // ✅ Có is_closed
    priority: { id: 3, name: 'Urgent' },
    project: { id: 1, name: 'Dr.Joy Auto' },
    done_ratio: 60,  // ✅ MỚI
    is_private: false,  // ✅ MỚI
    estimated_hours: 40,  // ✅ MỚI (optional)
    spent_hours: 24,  // ✅ MỚI (optional)
    created_on: '2023-11-01T08:00:00Z',
    updated_on: '2023-11-05T10:30:00Z',
    closed_on: null  // ✅ MỚI (optional)
}
```

## 🔑 Các Field Bắt Buộc

### Nhóm 1: Basic Info
```typescript
{
    id: number,
    subject: string,
    description: string,
}
```

### Nhóm 2: Classification (MỚI!)
```typescript
{
    tracker: { id: number, name: string },  // 🆕 BẮT BUỘC
    status: { id: number, name: string, is_closed?: boolean },
    priority: { id: number, name: string },
    project: { id: number, name: string },
}
```

### Nhóm 3: Metadata (MỚI!)
```typescript
{
    done_ratio: number,  // 🆕 BẮT BUỘC (0-100)
    is_private: boolean,  // 🆕 BẮT BUỘC
    created_on: string,
    updated_on: string,
}
```

## 📋 Danh sách Tracker Types

```typescript
export const TRACKERS = {
    BUG: { id: 1, name: 'Bug' },
    TASK: { id: 7, name: 'Task' },
    DEV: { id: 12, name: 'Dev' },
}
```

### Cách dùng:
```typescript
// Bug ticket
tracker: { id: 1, name: 'Bug' }

// Task ticket  
tracker: { id: 7, name: 'Task' }

// Dev ticket
tracker: { id: 12, name: 'Dev' }
```

## 🎯 Done Ratio Mapping

| Status | Suggested done_ratio |
|--------|---------------------|
| New | 0 |
| In Progress | 30-70 |
| Resolved | 90 |
| Closed | 100 |
| Released | 100 |

## 🔄 Migration Guide

### Để update existing code:

#### 1. Thêm Tracker
```typescript
// Before
const issue: Issue = { id: 1, subject: '...', ... }

// After
const issue: Issue = { 
    id: 1, 
    subject: '...', 
    tracker: { id: 7, name: 'Task' },  // 🆕 Thêm này
    ...
}
```

#### 2. Thêm Progress & Privacy
```typescript
// Before
created_on: '2023-11-01',
updated_on: '2023-11-05'

// After
done_ratio: 50,  // 🆕 Thêm
is_private: false,  // 🆕 Thêm
created_on: '2023-11-01',
updated_on: '2023-11-05'
```

#### 3. Update Status (Optional nhưng nên có)
```typescript
// Before
status: { id: 5, name: 'Closed' }

// After
status: { id: 5, name: 'Closed', is_closed: true }  // 🆕 Thêm is_closed
```

## ✅ Quick Checklist khi tạo Issue mới

- [ ] Đã có `tracker` với id và name?
- [ ] Đã có `done_ratio` (0-100)?
- [ ] Đã có `is_private` (true/false)?
- [ ] `status` có `is_closed` nếu cần?
- [ ] Timestamps đúng format ISO 8601?
- [ ] Các optional fields (nếu cần): estimated_hours, spent_hours, parent, fixed_version

## 📱 Files cần update

1. ✅ `src/types/redmine.ts` - Đã update
2. ⏳ `src/data/mockData.ts` - Cần update tất cả issues
3. ⏳ `src/components/**/*.tsx` - Kiểm tra components sử dụng Issue type
4. ⏳ `src/lib/api/redmine.ts` - Thêm API helpers nếu cần

## 🚀 Next Steps

1. **Review** file `REDMINE_API_ANALYSIS.md` để hiểu đầy đủ cấu trúc
2. **Backup** mockData.ts hiện tại
3. **Update** từng issue với template từ `mockDataNew.ts`
4. **Test** trên browser để đảm bảo không có lỗi TypeScript
5. **Commit** changes khi đã ổn định
