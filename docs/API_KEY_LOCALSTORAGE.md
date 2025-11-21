# ✅ COMPLETE - API Key from localStorage

## 🎯 Thay đổi

API key giờ được lấy từ **localStorage** (user settings) thay vì environment variables.

## 📝 Chi tiết Implementation

### 1. **RedmineApiService** (`/src/lib/api/redmine.service.ts`)

#### Trước:
```typescript
class RedmineApiService {
  private apiKey: string;
  
  constructor() {
    this.apiKey = REDMINE_CONFIG.apiKey; // ❌ From env
  }
  
  private getHeaders(): HeadersInit {
    return {
      'X-Redmine-API-Key': this.apiKey,
      'Content-Type': 'application/json',
    };
  }
}
```

#### Sau ✅:
```typescript
class RedmineApiService {
  // No longer store apiKey as instance variable
  
  constructor() {
    this.baseUrl = REDMINE_CONFIG.baseUrl;
    // API key is fetched dynamically
  }
  
  private getApiKey(): string {
    if (typeof window === 'undefined') {
      // Server-side: fallback to env
      return REDMINE_CONFIG.apiKey;
    }
    // Client-side: from localStorage
    return localStorage.getItem('redmine_api_key') || '';
  }
  
  private getHeaders(): HeadersInit {
    return {
      'X-Redmine-API-Key': this.getApiKey(), // ✅ Dynamic
      'Content-Type': 'application/json',
    };
  }
}
```

### 2. **Utility Functions** (`/src/lib/redmine-api-key.ts` - NEW)

```typescript
// Get API key
export function getRedmineApiKey(): string | null

// Set API key
export function setRedmineApiKey(apiKey: string): void

// Check if configured
export function hasRedmineApiKey(): boolean

// Validate format (40 hex chars)
export function isValidRedmineApiKey(apiKey: string): boolean
```

### 3. **Settings Page** (`/src/app/(dashboard)/settings/page.tsx`)

Cải thiện với:
- ✅ Validation API key format (40 hex characters)
- ✅ Error messages cho invalid input
- ✅ Clear error on input change
- ✅ Better user instructions
- ✅ Sử dụng utility functions

## 🔑 LocalStorage Key

```typescript
const STORAGE_KEY = 'redmine_api_key';
```

## 🧪 Cách Test

### Test 1: Save API Key
1. Vào `/settings`
2. Nhập valid API key (40 hex chars)
3. Click "Save Settings"
4. ✅ Should show "Saved successfully!"
5. Refresh page → API key should still be there

### Test 2: Validation
1. Vào `/settings`
2. Nhập invalid key (< 40 chars hoặc không phải hex)
3. Click "Save"
4. ❌ Should show error: "Invalid API key format"

### Test 3: API Calls Use localStorage Key
1. Set API key in `/settings`
2. Open issue detail modal → Edit → Save
3. Check Network tab → Request headers
4. ✅ Should see: `X-Redmine-API-Key: <your-key-from-localStorage>`

### Test 4: Server-Side Fallback
```typescript
// On server (SSR), should fallback to env
if (typeof window === 'undefined') {
  // Uses REDMINE_CONFIG.apiKey
}
```

## 🎯 Benefits

1. **🔐 User-specific**: Mỗi user config API key riêng
2. **🔄 Dynamic**: Không cần rebuild khi đổi key
3. **🛡️ Secure**: Key stored locally, không expose qua env
4. **✅ Validation**: Đảm bảo format đúng trước khi save
5. **📱 Persistent**: Key được lưu giữa các sessions

## 📁 Files Changed

1. ✏️ `/src/lib/api/redmine.service.ts` - Dynamic API key lookup
2. ✨ `/src/lib/redmine-api-key.ts` - NEW: Utility functions
3. 🎨 `/src/app/(dashboard)/settings/page.tsx` - Improved validation
4. 📚 `/docs/ISSUE_UPDATE_API.md` - Updated documentation

## 🔍 Verification

Check console log khi call API:
```
[Issue Update] Sending X changed field(s): {...}
```

Check Network → Headers:
```
X-Redmine-API-Key: <value-from-localStorage>
```

Check localStorage:
```javascript
localStorage.getItem('redmine_api_key')
// Should return your 40-char API key
```

## ⚠️ Migration Note

Nếu trước đây đã config API key trong `.env`:
1. User cần vào Settings page
2. Nhập API key của họ
3. Click Save
4. From now on, localStorage key will be used

## 📖 Documentation

- User guide: App Settings → Redmine API Key
- Dev guide: `/docs/ISSUE_UPDATE_API.md`
- API reference: `/src/lib/redmine-api-key.ts`

---
✅ Status: COMPLETE  
📅 Updated: 2025-11-21  
🔐 Storage: localStorage (`redmine_api_key`)
