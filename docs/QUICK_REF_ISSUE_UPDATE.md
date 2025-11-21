# Quick Reference: Issue Update Logic

## 🔍 Verify Changed Fields Only

Khi bạn edit và save issue, check browser console:

```
[Issue Update] Sending 3 changed field(s): {
  subject: "New title",
  status_id: 2,
  priority_id: 3
}
```

✅ Chỉ 3 fields → Correct!  
❌ 15+ fields → Something wrong!

## 🔑 API Key

**Nguồn**: localStorage (user settings), không phải env variables

```javascript
// Check your API key
localStorage.getItem('redmine_api_key')
```

**Setup**:
1. Go to `/settings`
2. Enter your Redmine API key (40 hex chars)
3. Click "Save Settings"
4. All API calls now use this key

**Header tự động**:
```
X-Redmine-API-Key: <your-key-from-localStorage>
```

**Validation**: API key must be 40 hexadecimal characters

## 📝 Field Comparison Logic

| Scenario | Sent to Backend? | Value Sent |
|----------|-----------------|------------|
| Field thay đổi | ✅ Yes | New value |
| Field không đổi | ❌ No | - |
| Field set to empty | ✅ Yes | `""` (empty string) |
| Field is `undefined` | ❌ No | - |
| Unassign user | ✅ Yes | `undefined` (special case) |

## 🧪 Quick Test

1. Mở issue detail modal
2. Edit chỉ **subject**
3. Save
4. Check console → Should see: `Sending 1 changed field(s)`
5. Open Network tab → Verify request payload chỉ có `subject`

## 📂 Key Files

- Logic: `src/lib/issue-utils.ts` → `createPartialUpdateRequest()`
- API: `src/lib/api/redmine.service.ts` → `updateIssue()`
- UI: `src/components/common/modals/BaseIssueDetailModal.tsx`
- Docs: `docs/ISSUE_UPDATE_API.md`

## 🐛 Troubleshooting

### Too many fields sent?
→ Check `createPartialUpdateRequest()` logic in `issue-utils.ts`

### API key missing?
→ Check `getHeaders()` in `redmine.service.ts`  
→ Verify `REDMINE_CONFIG.apiKey` is set

### No console logs?
→ Open DevTools console  
→ Filter by `[Issue Update]`

## ✨ Example Scenarios

**Scenario 1: Change title only**
```typescript
Request: { "issue": { "subject": "New title" } }
```

**Scenario 2: Change status + priority**
```typescript
Request: { 
  "issue": { 
    "status_id": 2, 
    "priority_id": 3 
  } 
}
```

**Scenario 3: No changes**
```typescript
Request: { "issue": {} }
```

---
✅ Updated: 2025-11-21  
📧 Questions? Check `docs/ISSUE_UPDATE_API.md`
