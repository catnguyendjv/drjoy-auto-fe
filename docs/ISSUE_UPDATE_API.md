# Issue Update API Integration

## Tổng Quan

Logic call API update cho issue detail modal đã được implement theo schema backend `UpdateIssueRequestSchema`.

## Các File Đã Cập Nhật

### 1. `/src/lib/api/redmine.service.ts`

#### Thêm Interface `UpdateIssueRequest`
```typescript
export interface UpdateIssueRequest {
  project_id?: number;
  tracker_id?: number;
  status_id?: number;
  priority_id?: number;
  subject?: string;
  description?: string;
  assigned_to_id?: number;
  parent_issue_id?: number;
  start_date?: string;
  due_date?: string;
  estimated_hours?: number;
  done_ratio?: number;
  is_private?: boolean;
  custom_fields?: Array<{
    id: number;
    value: string | number | boolean | string[];
  }>;
  notes?: string;
}
```

#### Cập nhật method `updateIssue`
```typescript
async updateIssue(id: number, updateData: UpdateIssueRequest): Promise<{ issue: RedmineIssue }> {
  return this.put<{ issue: RedmineIssue }>(`/issues/${id}`, { issue: updateData });
}
```

### 2. `/src/lib/issue-utils.ts` (File Mới)

Tạo utility functions để convert giữa frontend `Issue` type và backend `UpdateIssueRequest`:

#### `issueToUpdateRequest(issue, includeCustomFields?)`
Convert toàn bộ Issue object sang UpdateIssueRequest format.

#### `createPartialUpdateRequest(originalIssue, updatedIssue, includeCustomFields?)`
So sánh original issue và updated issue, chỉ gửi các field đã thay đổi (optimal cho performance).

#### `convertCustomFields(customFields)`
Convert custom fields từ frontend format sang backend format.

### 3. `/src/components/common/modals/BaseIssueDetailModal.tsx`

#### Cập nhật `handleSave` function
- Thay đổi từ `setTimeout` simulate sang async API call thực sự
- Sử dụng `createPartialUpdateRequest` để chỉ gửi changed fields
- Xử lý error properly với toast notifications
- Log errors ra console để debug

```typescript
const handleSave = async () => {
  // Validation
  if (!editedIssue.subject.trim()) {
    toast.error('Subject cannot be empty');
    return;
  }

  setIsSaving(true);

  try {
    // Convert to update request format (only changed fields)
    const updateRequest = createPartialUpdateRequest(issue, editedIssue);
    
    // Call API to update issue
    const response = await redmineApi.updateIssue(editedIssue.id, updateRequest);
    
    // Update the issue with response from server
    if (onSave && response.issue) {
      onSave(response.issue as any);
    }
    
    setIsSaving(false);
    setIsEditMode(false);
    toast.success('Issue updated successfully');
  } catch (error) {
    setIsSaving(false);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update issue';
    toast.error(errorMessage);
    console.error('Error updating issue:', error);
  }
};
```

## Cách Sử Dụng

### Trong Component

```typescript
import { BugDetailModal } from '@/components/common/modals';

function MyComponent() {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const handleSave = (updatedIssue: Issue) => {
    // Update local state or refetch data
    console.log('Issue updated:', updatedIssue);
    // Có thể refetch danh sách issues hoặc update local cache
  };

  return (
    <>
      {selectedIssue && (
        <BugDetailModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
```

### API Request Format

Khi user edit và save issue, **chỉ những field thực sự thay đổi** mới được gửi lên backend:

**Ví dụ 1**: User chỉ thay đổi subject và status
```json
{
  "issue": {
    "subject": "Updated subject",
    "status_id": 2
  }
}
```

**Ví dụ 2**: User thay đổi nhiều fields
```json
{
  "issue": {
    "subject": "Updated subject",
    "status_id": 2,
    "priority_id": 3,
    "assigned_to_id": 5,
    "due_date": "2025-12-31",
    "custom_fields": [
      {
        "id": 1,
        "value": "Team A"
      }
    ]
  }
}
```

**Ví dụ 3**: User không thay đổi gì
```json
{
  "issue": {}
}
```
*Backend sẽ nhận empty object, không có fields nào được update*

### Optimizations

#### 1. **Chỉ gửi Changed Fields**
Function `createPartialUpdateRequest()` so sánh original issue với edited issue và **chỉ thêm vào request những field thực sự thay đổi**:

- ✅ Field thay đổi → Gửi lên
- ❌ Field không đổi → **KHÔNG** gửi lên
- ✅ Field cleared (set to empty) → Gửi empty string
- ❌ Field undefined → **KHÔNG** gửi lên

#### 2. **API Key Authentication**
Mọi request đều tự động include API key trong headers:

```typescript
headers: {
  'X-Redmine-API-Key': '<user-api-key-from-localStorage>',
  'Content-Type': 'application/json'
}
```

**Nguồn API Key**: API key được lấy từ **localStorage** (user settings), không phải từ environment variables.

- 🔑 **Storage Key**: `localStorage.getItem('redmine_api_key')`
- ⚙️ **User Settings**: Users có thể config API key tại `/settings` page
- 🔄 **Dynamic**: API key được lấy mỗi lần gọi API (không cache trong service)
- 🖥️ **Server-side fallback**: Nếu chạy server-side (SSR), fallback to env config

**Cách user setting API key**:
1. Vào Settings page (`/settings`)
2. Nhập Redmine API key
3. Click "Save Settings"
4. API key được lưu vào `localStorage`
5. Mọi API calls tự động sử dụng key này

## Lưu Ý

1. **Chỉ gửi changed fields**: Function `createPartialUpdateRequest` so sánh original và updated issue để chỉ gửi những field đã thay đổi, giúp optimize network traffic.

2. **Custom Fields**: Custom fields được tự động convert từ frontend format sang backend format phù hợp với schema.

3. **Error Handling**: Tất cả errors đều được catch và hiển thị user-friendly toast messages. Chi tiết error được log ra console.

4. **Type Safety**: Sử dụng TypeScript interfaces để đảm bảo type safety trong suốt quá trình convert và gọi API.

5. **Backend Response**: Backend trả về updated issue trong response, được pass lại cho `onSave` callback để component cha có thể update state.

## Testing

Để test:
1. Mở issue detail modal
2. Click nút Edit
3. Thay đổi các field (subject, status, priority, assignee, dates, custom fields)
4. Click Save Changes
5. Kiểm tra:
   - Loading state hiển thị đúng
   - Success toast xuất hiện
   - Modal thoát edit mode
   - Data được persist on server
   - Errors được handle gracefully

## API Endpoint

**Endpoint**: `PUT /redmine/issues/:id`

**Headers**:
- `X-Redmine-API-Key`: API key từ config
- `Content-Type`: `application/json`

**Request Body**: Theo `UpdateIssueRequestSchema` (như documented ở trên)

**Response**: 
```json
{
  "issue": {
    // Full RedmineIssue object with updated data
  }
}
```
