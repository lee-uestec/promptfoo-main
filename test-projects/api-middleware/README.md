# Express 认证中间件 (auth.js)

一个功能完整的 Express 认证中间件，提供 JWT token 验证、用户权限检查和认证错误处理。

## 功能特性

- ✅ **JWT Token 验证** - 自动验证请求中的 JWT token
- ✅ **权限检查** - 基于权限的访问控制 (Permission-based Access Control)
- ✅ **角色检查** - 基于角色的访问控制 (Role-based Access Control)
- ✅ **错误处理** - 统一的认证错误处理机制
- ✅ **灵活配置** - 可自定义配置选项
- ✅ **路径跳过** - 支持跳过某些路径的认证
- ✅ **Token 生成** - 内置 JWT token 生成工具

## 安装

```bash
npm install
```

## 快速开始

### 1. 基本使用

```javascript
const express = require('express');
const { createAuthMiddleware } = require('./middleware/auth');

const app = express();

// 应用认证中间件
app.use(createAuthMiddleware({
  secret: 'your-secret-key',
  skipPaths: ['/login', '/register']
}));

// 受保护的路由
app.get('/api/user/profile', (req, res) => {
  // req.user 包含解码后的用户信息
  res.json({ user: req.user });
});
```

### 2. 权限检查

```javascript
const { requirePermissions } = require('./middleware/auth');

// 需要特定权限
app.get('/api/data', requirePermissions('read'), (req, res) => {
  res.json({ data: 'some data' });
});

// 需要多个权限
app.post('/api/data', requirePermissions(['write', 'create']), (req, res) => {
  res.json({ message: 'created' });
});
```

### 3. 角色检查

```javascript
const { requireRoles } = require('./middleware/auth');

// 需要管理员角色
app.get('/api/admin/users', requireRoles('admin'), (req, res) => {
  res.json({ users: [] });
});

// 需要多个角色之一
app.get('/api/dashboard', requireRoles(['admin', 'manager']), (req, res) => {
  res.json({ stats: {} });
});
```

### 4. 生成 Token

```javascript
const { generateToken } = require('./middleware/auth');

app.post('/login', (req, res) => {
  // 验证用户名和密码...

  const token = generateToken({
    userId: user.id,
    username: user.username,
    roles: ['user'],
    permissions: ['read', 'write']
  });

  res.json({ token });
});
```

## 配置选项

```javascript
const config = {
  // JWT 密钥
  secret: 'your-secret-key',

  // 加密算法
  algorithm: 'HS256',

  // Token 过期时间
  expiresIn: '24h',

  // 请求头的 key
  headerKey: 'authorization',

  // Token 前缀
  tokenPrefix: 'Bearer ',

  // 跳过认证的路径
  skipPaths: ['/login', '/register', '/health']
};
```

## API 文档

### 中间件函数

#### `createAuthMiddleware(options)`

创建认证中间件。

**参数:**
- `options` (Object) - 配置选项

**返回:**
- Express 中间件函数

**示例:**
```javascript
app.use(createAuthMiddleware({
  secret: 'my-secret',
  skipPaths: ['/public']
}));
```

#### `requirePermissions(permissions)`

创建权限检查中间件。

**参数:**
- `permissions` (String|Array) - 所需权限

**返回:**
- Express 中间件函数

**示例:**
```javascript
app.get('/api/data', requirePermissions('read'), handler);
app.post('/api/data', requirePermissions(['write', 'create']), handler);
```

#### `requireRoles(roles)`

创建角色检查中间件。

**参数:**
- `roles` (String|Array) - 所需角色

**返回:**
- Express 中间件函数

**示例:**
```javascript
app.get('/admin', requireRoles('admin'), handler);
app.get('/dashboard', requireRoles(['admin', 'manager']), handler);
```

### 工具函数

#### `generateToken(payload, options)`

生成 JWT token。

**参数:**
- `payload` (Object) - Token 载荷
- `options` (Object) - 配置选项（可选）

**返回:**
- JWT token 字符串

**示例:**
```javascript
const token = generateToken({
  userId: 1,
  username: 'admin',
  roles: ['admin'],
  permissions: ['read', 'write']
});
```

#### `verifyToken(token, config)`

验证 JWT token。

**参数:**
- `token` (String) - JWT token
- `config` (Object) - 配置对象

**返回:**
- 解码后的用户信息

**示例:**
```javascript
const decoded = verifyToken(token, { secret: 'my-secret' });
```

#### `hasPermission(user, permissions)`

检查用户是否有所需权限。

**参数:**
- `user` (Object) - 用户对象
- `permissions` (String|Array) - 所需权限

**返回:**
- Boolean

#### `hasRole(user, roles)`

检查用户是否有所需角色。

**参数:**
- `user` (Object) - 用户对象
- `roles` (String|Array) - 所需角色

**返回:**
- Boolean

## 运行示例

启动示例服务器:

```bash
npm test
# 或
node examples/server.js
```

服务器将在 http://localhost:3000 启动。

### 测试账号

- **管理员**: `admin` / `admin123`
  - 角色: admin, user
  - 权限: read, write, delete, manage_users

- **普通用户**: `user` / `user123`
  - 角色: user
  - 权限: read

### API 测试示例

#### 1. 登录获取 token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

响应:
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": 1,
      "username": "admin",
      "email": "admin@example.com",
      "roles": ["admin", "user"]
    }
  }
}
```

#### 2. 访问受保护的接口

```bash
# 使用 token 访问
TOKEN="your-token-here"

curl http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer $TOKEN"
```

#### 3. 访问需要权限的接口

```bash
# 读取数据 (需要 read 权限)
curl http://localhost:3000/api/data \
  -H "Authorization: Bearer $TOKEN"

# 创建数据 (需要 write 权限)
curl -X POST http://localhost:3000/api/data \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Item"}'

# 删除数据 (需要 delete 权限)
curl -X DELETE http://localhost:3000/api/data/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### 4. 访问需要角色的接口

```bash
# 管理员接口 (需要 admin 角色)
curl http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer $TOKEN"
```

## 错误响应

### 401 未认证

```json
{
  "success": false,
  "error": "未提供认证 Token",
  "code": 401
}
```

### 401 Token 过期

```json
{
  "success": false,
  "error": "Token 已过期",
  "code": 401
}
```

### 403 权限不足

```json
{
  "success": false,
  "error": "权限不足",
  "code": 403
}
```

### 403 角色权限不足

```json
{
  "success": false,
  "error": "角色权限不足",
  "code": 403
}
```

## 环境变量

创建 `.env` 文件 (参考 `.env.example`):

```env
JWT_SECRET=your-secret-key-change-in-production
PORT=3000
NODE_ENV=development
```

## 目录结构

```
.
├── middleware/
│   └── auth.js           # 认证中间件核心文件
├── config/
│   └── auth.config.js    # 认证配置文件
├── examples/
│   └── server.js         # 示例服务器
├── package.json
├── .env.example          # 环境变量示例
└── README.md
```

## 安全建议

1. **使用环境变量**: 生产环境中务必使用环境变量设置 `JWT_SECRET`
2. **使用 HTTPS**: 生产环境中使用 HTTPS 传输 token
3. **设置合理的过期时间**: 根据安全需求设置合适的 token 过期时间
4. **实现 Token 刷新**: 考虑实现 refresh token 机制
5. **日志记录**: 记录认证失败的尝试
6. **速率限制**: 对登录接口实施速率限制

## License

MIT
