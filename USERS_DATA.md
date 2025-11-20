# Redmine Users Data - Hướng Dẫn Sử Dụng

## 📚 Tổng Quan

File `src/lib/redmine-users.ts` chứa danh sách đầy đủ **162 users** từ Redmine API, được format sẵn để sử dụng cho các component select user.

### Thống Kê
- **Tổng số users**: 162
- **Active users** (đã login): 156
- **Admin users**: 9
- **Last updated**: 2025-11-20

## 🚀 Cách Sử Dụng

### 1. Import Constants và Functions

```typescript
import {
  REDMINE_USERS,
  RedmineUser,
  getUserById,
  getUserByLogin,
  getActiveUsers,
  getUserOptions,
  getActiveUserOptions
} from '@/lib/redmine-users';
```

### 2. Sử Dụng Trong Select Component

#### React Select / Ant Design Select

```typescript
import { Select } from 'antd';
import { getUserOptions, getActiveUserOptions } from '@/lib/redmine-users';

// Component với tất cả users
function UserSelect() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  
  return (
    <Select
      placeholder="Chọn user"
      options={getUserOptions()}
      value={selectedUserId}
      onChange={setSelectedUserId}
      showSearch
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      style={{ width: 300 }}
    />
  );
}

// Component với chỉ active users
function ActiveUserSelect() {
  return (
    <Select
      placeholder="Chọn assignee"
      options={getActiveUserOptions()}
      showSearch
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
    />
  );
}
```

#### Native HTML Select

```typescript
import { REDMINE_USERS } from '@/lib/redmine-users';

function NativeUserSelect() {
  return (
    <select>
      <option value="">-- Chọn user --</option>
      {REDMINE_USERS.map(user => (
        <option key={user.id} value={user.id}>
          {user.label}
        </option>
      ))}
    </select>
  );
}
```

### 3. Query User Information

```typescript
import { getUserById, getUserByLogin } from '@/lib/redmine-users';

// Get user by ID
const user = getUserById(406);
console.log(user?.label); // "カット cat.nguyen (cat.nguyen@drjoy.vn)"
console.log(user?.mail); // "cat.nguyen@drjoy.vn"
console.log(user?.admin); // true

// Get user by login
const user2 = getUserByLogin('cat.nguyen@drjoy.vn');
console.log(user2?.firstname); // "カット"
```

### 4. Filter Users

```typescript
import { REDMINE_USERS, getActiveUsers } from '@/lib/redmine-users';

// Get only active users
const activeUsers = getActiveUsers();
console.log(activeUsers.length); // 156

// Filter by team/note
const javaDevs = REDMINE_USERS.filter(user => 
  user.note.toLowerCase().includes('java')
);

// Filter by admin
const admins = REDMINE_USERS.filter(user => user.admin);
console.log(admins.length); // 9

// Filter testers
const testers = REDMINE_USERS.filter(user =>
  user.note.toLowerCase().includes('tester')
);
```

### 5. Display User Info in Table

```typescript
import { Table } from 'antd';
import { REDMINE_USERS } from '@/lib/redmine-users';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'label',
    key: 'label',
  },
  {
    title: 'Email',
    dataIndex: 'mail',
    key: 'mail',
  },
  {
    title: 'Role',
    dataIndex: 'note',
    key: 'note',
  },
  {
    title: 'Is Admin',
    dataIndex: 'admin',
    key: 'admin',
    render: (isAdmin) => isAdmin ? '✅' : '❌',
  },
];

function UserTable() {
  return <Table columns={columns} dataSource={REDMINE_USERS} rowKey="id" />;
}
```

## 📊 Data Structure

### RedmineUser Interface

```typescript
interface RedmineUser {
  id: number;              // User ID
  value: number;           // Same as id (for select compatibility)
  label: string;           // Full display name: "firstname lastname (login)"
  login: string;           // User login name
  firstname: string;       // First name
  lastname: string;        // Last name
  mail: string;            // Email address
  admin: boolean;          // Is admin user
  note: string;            // Custom field note (role/team info)
  lastLoginOn: string | null; // Last login timestamp (ISO 8601)
}
```

### Example User Object

```typescript
{
  "id": 406,
  "value": 406,
  "label": "カット cat.nguyen (cat.nguyen@drjoy.vn)",
  "login": "cat.nguyen@drjoy.vn",
  "firstname": "カット",
  "lastname": "cat.nguyen",
  "mail": "cat.nguyen@drjoy.vn",
  "admin": true,
  "note": "",
  "lastLoginOn": "2025-11-20T03:34:09Z"
}
```

## 🔄 Cập Nhật Dữ Liệu

Để cập nhật lại danh sách users từ Redmine API, chạy lại các lệnh sau:

```bash
# Lấy users từ API (batch 1)
curl -s -H "Content-Type: application/json" \
  "https://redmine.famishare.jp/users.json?key=93ab302da634135f392e959c4789811857b3e832&limit=100" \
  -o users_raw.json

# Lấy users từ API (batch 2)
curl -s -H "Content-Type: application/json" \
  "https://redmine.famishare.jp/users.json?key=93ab302da634135f392e959c4789811857b3e832&limit=100&offset=100" \
  -o users_raw_2.json

# Generate TypeScript file
node scripts/generate-users.js
```

Hoặc tạo một npm script trong `package.json`:

```json
{
  "scripts": {
    "update:users": "node scripts/generate-users.js"
  }
}
```

## 💡 Tips

1. **Sử dụng `getActiveUserOptions()`** cho select assignee vì nó chỉ lấy users đã từng login
2. **Filter theo `note` field** để lọc theo team/role (Java, Tester, CS, etc.)
3. **Sử dụng `showSearch` và `filterOption`** trong Ant Design Select để có tính năng search
4. **Cache user data** nếu cần sử dụng nhiều lần trong component tree

## 🔗 Related Files

- `src/lib/redmine-users.ts` - Main users data file
- `src/lib/redmine-config.ts` - Redmine configuration
- `REDMINE_INTEGRATION.md` - Redmine API integration guide
