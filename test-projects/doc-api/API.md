# 用户 API 文档

## 概述

本文档描述了用户管理相关的 RESTful API 端点，包括用户的创建、查询、更新和删除操作。

基础 URL: `https://api.example.com/v1`

## 认证

所有 API 请求都需要在请求头中包含认证令牌：

```
Authorization: Bearer {access_token}
```

## 响应格式

所有 API 响应都采用统一的 JSON 格式：

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

- `code`: 状态码，0 表示成功，非 0 表示失败
- `message`: 响应消息描述
- `data`: 响应数据

---

## API 端点

### 1. 创建用户

创建一个新的用户账号。

**端点**: `POST /users`

**请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| username | string | 是 | 用户名，3-20个字符，仅支持字母、数字和下划线 |
| email | string | 是 | 邮箱地址，需符合邮箱格式 |
| password | string | 是 | 密码，至少8个字符，需包含字母和数字 |
| phone | string | 否 | 手机号码 |
| realName | string | 否 | 真实姓名 |

**请求示例**:

```bash
curl -X POST https://api.example.com/v1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_access_token" \
  -d '{
    "username": "john_doe",
    "email": "john.doe@example.com",
    "password": "SecurePass123",
    "phone": "13800138000",
    "realName": "John Doe"
  }'
```

**响应示例**:

```json
{
  "code": 0,
  "message": "用户创建成功",
  "data": {
    "id": "1001",
    "username": "john_doe",
    "email": "john.doe@example.com",
    "phone": "13800138000",
    "realName": "John Doe",
    "status": "active",
    "createdAt": "2024-01-28T10:30:00Z"
  }
}
```

**JavaScript 示例**:

```javascript
const response = await fetch('https://api.example.com/v1/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_access_token'
  },
  body: JSON.stringify({
    username: 'john_doe',
    email: 'john.doe@example.com',
    password: 'SecurePass123',
    phone: '13800138000',
    realName: 'John Doe'
  })
});

const result = await response.json();
console.log(result);
```

**Python 示例**:

```python
import requests

url = 'https://api.example.com/v1/users'
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_access_token'
}
data = {
    'username': 'john_doe',
    'email': 'john.doe@example.com',
    'password': 'SecurePass123',
    'phone': '13800138000',
    'realName': 'John Doe'
}

response = requests.post(url, json=data, headers=headers)
print(response.json())
```

---

### 2. 获取用户列表

获取所有用户的列表，支持分页和筛选。

**端点**: `GET /users`

**请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| page | integer | 否 | 页码，默认为 1 |
| pageSize | integer | 否 | 每页数量，默认为 20，最大 100 |
| keyword | string | 否 | 搜索关键词，匹配用户名或邮箱 |
| status | string | 否 | 用户状态筛选：active, inactive, banned |
| sortBy | string | 否 | 排序字段：createdAt, username，默认 createdAt |
| order | string | 否 | 排序方向：asc, desc，默认 desc |

**请求示例**:

```bash
curl -X GET "https://api.example.com/v1/users?page=1&pageSize=20&keyword=john&status=active" \
  -H "Authorization: Bearer your_access_token"
```

**响应示例**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 150,
    "page": 1,
    "pageSize": 20,
    "totalPages": 8,
    "users": [
      {
        "id": "1001",
        "username": "john_doe",
        "email": "john.doe@example.com",
        "phone": "13800138000",
        "realName": "John Doe",
        "status": "active",
        "createdAt": "2024-01-28T10:30:00Z",
        "lastLoginAt": "2024-01-28T14:20:00Z"
      },
      {
        "id": "1002",
        "username": "jane_smith",
        "email": "jane.smith@example.com",
        "phone": "13900139000",
        "realName": "Jane Smith",
        "status": "active",
        "createdAt": "2024-01-27T09:15:00Z",
        "lastLoginAt": "2024-01-28T13:45:00Z"
      }
    ]
  }
}
```

**JavaScript 示例**:

```javascript
const params = new URLSearchParams({
  page: '1',
  pageSize: '20',
  keyword: 'john',
  status: 'active'
});

const response = await fetch(`https://api.example.com/v1/users?${params}`, {
  headers: {
    'Authorization': 'Bearer your_access_token'
  }
});

const result = await response.json();
console.log(result);
```

---

### 3. 获取用户详情

根据用户 ID 获取特定用户的详细信息。

**端点**: `GET /users/{userId}`

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| userId | string | 是 | 用户 ID |

**请求示例**:

```bash
curl -X GET https://api.example.com/v1/users/1001 \
  -H "Authorization: Bearer your_access_token"
```

**响应示例**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "1001",
    "username": "john_doe",
    "email": "john.doe@example.com",
    "phone": "13800138000",
    "realName": "John Doe",
    "status": "active",
    "avatar": "https://cdn.example.com/avatars/1001.jpg",
    "bio": "Software Engineer",
    "createdAt": "2024-01-28T10:30:00Z",
    "updatedAt": "2024-01-28T12:00:00Z",
    "lastLoginAt": "2024-01-28T14:20:00Z",
    "loginCount": 45
  }
}
```

**JavaScript 示例**:

```javascript
const userId = '1001';
const response = await fetch(`https://api.example.com/v1/users/${userId}`, {
  headers: {
    'Authorization': 'Bearer your_access_token'
  }
});

const result = await response.json();
console.log(result);
```

**Python 示例**:

```python
import requests

user_id = '1001'
url = f'https://api.example.com/v1/users/{user_id}'
headers = {
    'Authorization': 'Bearer your_access_token'
}

response = requests.get(url, headers=headers)
print(response.json())
```

---

### 4. 更新用户信息

更新指定用户的信息。

**端点**: `PUT /users/{userId}`

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| userId | string | 是 | 用户 ID |

**请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| email | string | 否 | 邮箱地址 |
| phone | string | 否 | 手机号码 |
| realName | string | 否 | 真实姓名 |
| bio | string | 否 | 个人简介 |
| avatar | string | 否 | 头像 URL |

**请求示例**:

```bash
curl -X PUT https://api.example.com/v1/users/1001 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_access_token" \
  -d '{
    "phone": "13900139999",
    "bio": "Senior Software Engineer"
  }'
```

**响应示例**:

```json
{
  "code": 0,
  "message": "用户信息更新成功",
  "data": {
    "id": "1001",
    "username": "john_doe",
    "email": "john.doe@example.com",
    "phone": "13900139999",
    "realName": "John Doe",
    "bio": "Senior Software Engineer",
    "status": "active",
    "updatedAt": "2024-01-28T15:30:00Z"
  }
}
```

**JavaScript 示例**:

```javascript
const userId = '1001';
const response = await fetch(`https://api.example.com/v1/users/${userId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_access_token'
  },
  body: JSON.stringify({
    phone: '13900139999',
    bio: 'Senior Software Engineer'
  })
});

const result = await response.json();
console.log(result);
```

---

### 5. 删除用户

删除指定的用户账号。

**端点**: `DELETE /users/{userId}`

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| userId | string | 是 | 用户 ID |

**请求示例**:

```bash
curl -X DELETE https://api.example.com/v1/users/1001 \
  -H "Authorization: Bearer your_access_token"
```

**响应示例**:

```json
{
  "code": 0,
  "message": "用户删除成功",
  "data": {
    "id": "1001",
    "deletedAt": "2024-01-28T16:00:00Z"
  }
}
```

**JavaScript 示例**:

```javascript
const userId = '1001';
const response = await fetch(`https://api.example.com/v1/users/${userId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer your_access_token'
  }
});

const result = await response.json();
console.log(result);
```

**Python 示例**:

```python
import requests

user_id = '1001'
url = f'https://api.example.com/v1/users/{user_id}'
headers = {
    'Authorization': 'Bearer your_access_token'
}

response = requests.delete(url, headers=headers)
print(response.json())
```

---

### 6. 修改用户密码

允许用户修改自己的密码。

**端点**: `POST /users/{userId}/password`

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| userId | string | 是 | 用户 ID |

**请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| oldPassword | string | 是 | 原密码 |
| newPassword | string | 是 | 新密码，至少8个字符，需包含字母和数字 |

**请求示例**:

```bash
curl -X POST https://api.example.com/v1/users/1001/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_access_token" \
  -d '{
    "oldPassword": "OldPass123",
    "newPassword": "NewSecurePass456"
  }'
```

**响应示例**:

```json
{
  "code": 0,
  "message": "密码修改成功",
  "data": {
    "userId": "1001",
    "updatedAt": "2024-01-28T16:30:00Z"
  }
}
```

**JavaScript 示例**:

```javascript
const userId = '1001';
const response = await fetch(`https://api.example.com/v1/users/${userId}/password`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_access_token'
  },
  body: JSON.stringify({
    oldPassword: 'OldPass123',
    newPassword: 'NewSecurePass456'
  })
});

const result = await response.json();
console.log(result);
```

---

### 7. 批量操作用户

批量修改用户状态（激活、禁用、封禁）。

**端点**: `POST /users/batch`

**请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| userIds | array | 是 | 用户 ID 数组 |
| action | string | 是 | 操作类型：activate, deactivate, ban |

**请求示例**:

```bash
curl -X POST https://api.example.com/v1/users/batch \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_access_token" \
  -d '{
    "userIds": ["1001", "1002", "1003"],
    "action": "activate"
  }'
```

**响应示例**:

```json
{
  "code": 0,
  "message": "批量操作成功",
  "data": {
    "successCount": 3,
    "failedCount": 0,
    "results": [
      {
        "userId": "1001",
        "success": true,
        "status": "active"
      },
      {
        "userId": "1002",
        "success": true,
        "status": "active"
      },
      {
        "userId": "1003",
        "success": true,
        "status": "active"
      }
    ]
  }
}
```

---

## 错误码

| 错误码 | 描述 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权，token 无效或过期 |
| 403 | 没有权限 |
| 404 | 资源不存在 |
| 409 | 资源冲突（如用户名或邮箱已存在） |
| 422 | 请求参数验证失败 |
| 500 | 服务器内部错误 |
| 503 | 服务暂时不可用 |

**错误响应示例**:

```json
{
  "code": 409,
  "message": "用户名已存在",
  "data": {
    "field": "username",
    "value": "john_doe"
  }
}
```

---

## 限流规则

- 每个 IP 地址每分钟最多 60 次请求
- 每个用户账号每分钟最多 100 次请求
- 超过限制将返回 429 状态码

**限流响应示例**:

```json
{
  "code": 429,
  "message": "请求过于频繁，请稍后再试",
  "data": {
    "retryAfter": 30
  }
}
```

---

## 更新日志

### v1.0.0 (2024-01-28)
- 初始版本发布
- 实现基础的用户 CRUD 操作
- 添加用户列表查询和筛选功能
- 支持批量操作用户

---

## 联系支持

如有问题或建议，请联系：

- 技术支持邮箱: support@example.com
- 开发者文档: https://docs.example.com
- API 状态页面: https://status.example.com
