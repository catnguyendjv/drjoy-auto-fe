# ✅ Settings Page - localStorage Configuration

## 🎯 Cập nhật Settings Page

Settings page đã được nâng cấp để quản lý cấu hình Redmine hoàn chỉnh trong **localStorage**.

## ✨ Tính năng mới

### 1. **Redmine Base URL Setting**
```javascript
localStorage.setItem('redmine_base_url', 'http://localhost:5000/redmine');
```
- User có thể config base URL của Redmine proxy
- Default: `NEXT_PUBLIC_REDMINE_BASE_URL` từ env
- Tự động validate URL format

### 2. **API Key với Show/Hide**
```javascript
localStorage.setItem('redmine_api_key', '<40-char-hex-key>');
```
- Show/Hide password toggle (Eye icon)
- Validation: phải là 40 hexadecimal characters
- Clear error messages

### 3. **Test Connection Button**
- Test connection với Redmine server
- Gọi API `/project/users?limit=1` để verify
- Show success/error toast messages
- Loading state khi đang test

### 4. **Clear Settings Button**
- Clear tất cả settings (API key + Base URL)
- Confirmation dialog trước khi xóa
- Reset về default values

### 5. **Hướng dẫn chi tiết**
- Info box với step-by-step instructions
- Giải thích cách lấy API key từ Redmine
- Visual feedback với icons và colors

## 📱 UI Components

```tsx
Settings Page gồm:
├── Base URL input
├── API Key input (with show/hide toggle)
├── Validation errors (if any)
├── Action buttons:
│   ├── Save Settings (blue)
│   ├── Test Connection (green)
│   └── Clear Settings (red)
└── Info box (how to get API key)
```

## 🔧 Technical Details

### LocalStorage Keys

| Key | Type | Description |
|-----|------|-------------|
| `redmine_base_url` | string | Redmine proxy base URL |
| `redmine_api_key` | string | User's API key (40 hex chars) |

### Validation Rules

**Base URL:**
- ✅ Cannot be empty
- ✅ Must be valid URL format
- ✅ Saved to localStorage on success

**API Key:**
- ✅ Cannot be empty
- ✅ Must be exactly 40 hexadecimal characters
- ✅ Pattern: `/^[a-f0-9]{40}$/i`

### Test Connection Logic

```typescript
const handleTestConnection = async () => {
  const response = await fetch(`${baseUrl}/project/users?limit=1`, {
    headers: {
      'X-Redmine-API-Key': apiKey,
      'Content-Type': 'application/json',
    },
  });
  
  if (response.ok) {
    toast.success("Connection successful!");
  } else {
    toast.error(`Failed: ${response.status}`);
  }
};
```

## 🔄 RedmineApiService Integration

Service đã được cập nhật để lấy cả base URL và API key từ localStorage:

```typescript
class RedmineApiService {
  private getBaseUrl(): string {
    if (typeof window === 'undefined') {
      return REDMINE_CONFIG.baseUrl; // Server fallback
    }
    return localStorage.getItem('redmine_base_url') || REDMINE_CONFIG.baseUrl;
  }

  private getApiKey(): string {
    if (typeof window === 'undefined') {
      return REDMINE_CONFIG.apiKey; // Server fallback
    }
    return localStorage.getItem('redmine_api_key') || '';
  }
}
```

## 🧪 Testing Guide

### Test 1: Save Settings
```bash
1. Go to /settings
2. Enter Base URL: http://localhost:5000/redmine
3. Enter API Key: <your-40-char-key>
4. Click "Save Settings"
5. ✅ Should see "Settings saved successfully!" toast
```

### Test 2: Show/Hide API Key
```bash
1. Enter API key
2. Click eye icon
3. ✅ Should toggle between password/text
```

### Test 3: Test Connection
```bash
1. Save valid settings
2. Click "Test Connection"
3. ✅ Should show "Connection successful!" if valid
4. ❌ Should show error if invalid
```

### Test 4: Validation
```bash
1. Enter invalid API key (not 40 chars)
2. Click "Save Settings"
3. ❌ Should show "Invalid API key format" error
```

### Test 5: Clear Settings
```bash
1. Click "Clear Settings"
2. Confirm dialog
3. ✅ Should clear both fields
4. ✅ Should reset to defaults
```

### Test 6: Persistence
```bash
1. Save settings
2. Refresh page
3. ✅ Settings should persist
4. ✅ Should auto-load saved values
```

## 📦 Dependencies

```json
{
  "lucide-react": "Eye, EyeOff, TestTube2, Trash2 icons",
  "sonner": "Toast notifications"
}
```

## 📁 Files Modified

1. ✏️ `/src/app/(dashboard)/settings/page.tsx` - Complete UI overhaul
2. 🔧 `/src/lib/api/redmine.service.ts` - Dynamic base URL support
3. 📚 `/src/lib/redmine-api-key.ts` - Utility functions

## 🎨 UI/UX Improvements

- **Icons**: Eye/EyeOff for password toggle, TestTube2 for test, Trash2 for clear
- **Colors**: 
  - Blue for primary action (Save)
  - Green for test connection
  - Red for destructive action (Clear)
- **Feedback**:
  - Toast notifications for all actions
  - Inline validation errors
  - Loading states
  - Success indicators

## ⚙️ Environment Variables (Fallback)

```env
NEXT_PUBLIC_REDMINE_BASE_URL=http://localhost:5000/redmine
NEXT_PUBLIC_REDMINE_API_KEY=<fallback-key> # Server-side only
```

## 🔐 Security Notes

- **Client-side**: Settings stored in localStorage (browser-only)
- **Server-side**: Falls back to env variables for SSR
- **No exposure**: API key never sent to client unless user enters it
- **User-specific**: Each browser has its own settings

## 📊 Before vs After

| Feature | Before | After |
|---------|--------|-------|
| Base URL | ❌ Hardcoded in env | ✅ User configurable |
| API Key | ❌ From env only | ✅ User settings in localStorage |
| Show/Hide | ❌ Always hidden | ✅ Toggle button |
| Test Connection | ❌ No test | ✅ One-click test |
| Clear Settings | ❌ Manual | ✅ One-click clear |
| Instructions | ❌ None | ✅ Step-by-step guide |
| Validation | ✅ Basic | ✅ Enhanced with format check |

---
✅ Status: COMPLETE  
📅 Updated: 2025-11-21  
💾 Storage: localStorage (`redmine_base_url`, `redmine_api_key`)
