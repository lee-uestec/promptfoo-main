# Express JWT 认证中间件使用指南

## 功能特点

✅ JWT Token 验证
✅ 基于权限的访问控制 (RBAC)
✅ 基于角色的访问控制
✅ 灵活的路径跳过配置 (支持正则表达式)
✅ 超级管理员支持
✅ 完善的错误处理
✅ TypeScript 友好的 JSDoc 注释

## 快速开始

### 1. 基本使用

```javascript
const express = require('express');
const { createAuthMiddleware, generateToken } = require('./middleware/auth');

const app = express();
app.use(express.json());

// 配置认证中间件
const authMiddleware = createAuthMiddleware({
  secret: process.env.JWT_SECRET || 'your-secret-key',
  expiresIn: '24h',
  skipPaths: ['/login', '/register', '/public']
});

// 登录接口 - 生成 token
app.post('/login', (req, res) => {
  // 验证用户凭证...

  const token = generateToken({
    userId: 1,
    username: 'admin',
    roles: ['admin'],
    permissions: ['read', 'write', 'delete']
  });

  res.json({ token });
});

// 应用认证中间件
app.use(authMiddleware);

// 受保护的路由
app.get('/profile', (req, res) => {
  res.json({ user: req.user });
});

app.listen(3000);
```

### 2. 权限检查

#### 需要所有权限 (AND 逻辑)

```javascript
const { requirePermissions } = require('./middleware/auth');

// 需要同时拥有 'read' 和 'write' 权限
app.post('/api/data',
  requirePermissions(['read', 'write']),
  (req, res) => {
    res.json({ message: '数据创建成功' });
  }
);
```

#### 需要任一权限 (OR 逻辑)

```javascript
const { requireAnyPermission } = require('./middleware/auth');

// 只需拥有 'admin' 或 'moderator' 权限之一
app.get('/api/dashboard',
  requireAnyPermission(['admin', 'moderator']),
  (req, res) => {
    res.json({ data: 'dashboard data' });
  }
);
```

### 3. 角色检查

```javascript
const { requireRoles } = require('./middleware/auth');

// 需要拥有 'admin' 或 'superadmin' 角色之一
app.delete('/api/users/:id',
  requireRoles(['admin', 'superadmin']),
  (req, res) => {
    res.json({ message: '用户删除成功' });
  }
);
```

### 4. 组合多个中间件

```javascript
const { requireRoles, requirePermissions } = require('./middleware/auth');

// 需要 admin 角色,并且拥有 'write' 和 'manage_users' 权限
app.post('/api/admin/users',
  requireRoles('admin'),
  requirePermissions(['write', 'manage_users']),
  (req, res) => {
    res.json({ message: '用户创建成功' });
  }
);
```

## 配置选项

### createAuthMiddleware(options)

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| secret | string | 环境变量 JWT_SECRET | JWT 密钥 |
| algorithm | string | 'HS256' | 加密算法 |
| expiresIn | string | '24h' | Token 过期时间 |
| headerKey | string | 'authorization' | 请求头的 key |
| tokenPrefix | string | 'Bearer ' | Token 前缀 |
| skipPaths | array | ['/login', '/register', '/health'] | 跳过认证的路径 |

### 跳过路径配置

支持三种方式:

```javascript
// 1. 精确匹配
skipPaths: ['/login', '/register']

// 2. 前缀匹配 (自动匹配子路径)
skipPaths: ['/api/public']  // 匹配 /api/public/*

// 3. 正则表达式
skipPaths: [
  /^\/api\/public/,      // 匹配 /api/public/*
  /^\/docs/,             // 匹配 /docs/*
  /\.(jpg|png|gif)$/     // 匹配图片文件
]
```

## 超级管理员

拥有 `superadmin` 角色的用户自动拥有所有权限:

```javascript
const token = generateToken({
  userId: 1,
  username: 'root',
  roles: ['superadmin'],
  permissions: []  // 即使为空也拥有所有权限
});
```

## Token 格式

### 请求头格式

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

或直接传递 token:

```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Payload 结构

```javascript
{
  userId: 1,
  username: 'admin',
  email: 'admin@example.com',
  roles: ['admin', 'user'],
  permissions: ['read', 'write', 'delete'],
  iat: 1234567890,  // 签发时间 (自动生成)
  exp: 1234654290   // 过期时间 (自动生成)
}
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

## 工具函数

### generateToken(payload, options)

生成 JWT token

```javascript
const token = generateToken(
  { userId: 1, username: 'admin' },
  { expiresIn: '1h' }
);
```

### hasPermission(user, permissions)

检查用户是否拥有权限 (AND 逻辑)

```javascript
if (hasPermission(req.user, ['read', 'write'])) {
  // 用户拥有所有权限
}
```

### hasAnyPermission(user, permissions)

检查用户是否拥有任一权限 (OR 逻辑)

```javascript
if (hasAnyPermission(req.user, ['admin', 'moderator'])) {
  // 用户拥有至少一个权限
}
```

### hasRole(user, roles)

检查用户是否拥有角色

```javascript
if (hasRole(req.user, 'admin')) {
  // 用户是管理员
}
```

## 安全最佳实践

### 1. 使用强密钥

⚠️ **生产环境必须配置强密钥**

```bash
# 生成安全的密钥 (至少 32 字符)
export JWT_SECRET="$(openssl rand -base64 32)"
```

### 2. 设置合理的过期时间

```javascript
// 敏感操作使用短过期时间
const authMiddleware = createAuthMiddleware({
  expiresIn: '1h'  // 1 小时
});

// 或根据不同操作设置不同过期时间
const sensitiveToken = generateToken(payload, { expiresIn: '15m' });
const normalToken = generateToken(payload, { expiresIn: '24h' });
```

### 3. HTTPS 传输

生产环境务必使用 HTTPS 传输 token

### 4. 日志审计

记录认证失败事件:

```javascript
app.use((err, req, res, next) => {
  if (err instanceof AuthError) {
    console.warn('认证失败:', {
      ip: req.ip,
      path: req.path,
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
  next(err);
});
```

### 5. 速率限制

使用 express-rate-limit 防止暴力破解:

```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 5, // 最多 5 次尝试
  message: '登录尝试次数过多,请稍后再试'
});

app.post('/login', loginLimiter, (req, res) => {
  // 登录逻辑
});
```

## 完整示例

查看 `examples/server.js` 获取完整的示例代码。

## 运行示例

```bash
# 安装依赖
npm install

# 运行示例服务器
npm test

# 或直接运行
node examples/server.js
```

## 测试 API

### 登录获取 token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 访问受保护的接口

```bash
TOKEN="your-token-here"

curl http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer $TOKEN"
```

## 常见问题

### Q: Token 如何撤销?

A: JWT token 一旦签发无法直接撤销。建议:
1. 使用较短的过期时间
2. 实现 Redis 黑名单机制
3. 在 payload 中加入版本号,密码修改后使旧版本失效

### Q: 如何刷新 token?

A: 实现 refresh token 机制:

```javascript
app.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;

  // 验证 refresh token
  const decoded = verifyToken(refreshToken, config);

  // 生成新的 access token
  const newToken = generateToken({
    userId: decoded.userId,
    // ...
  }, { expiresIn: '1h' });

  res.json({ token: newToken });
});
```

### Q: 如何支持多种认证方式?

A: 扩展中间件逻辑:

```javascript
function multiAuthMiddleware(req, res, next) {
  // 尝试 JWT 认证
  const token = extractToken(req, config);
  if (token) {
    try {
      req.user = verifyToken(token, config);
      return next();
    } catch (err) {
      // JWT 验证失败,尝试其他方式
    }
  }

  // 尝试 API Key 认证
  const apiKey = req.headers['x-api-key'];
  if (apiKey) {
    // 验证 API Key...
  }

  // 所有认证方式失败
  return res.status(401).json({ error: '未认证' });
}
```

## 更新日志

### v1.1.0 (当前版本)

✅ 新增 `requireAnyPermission` 中间件 (OR 逻辑权限检查)
✅ 新增 `hasAnyPermission` 工具函数
✅ 新增超级管理员 (superadmin) 支持
✅ 改进路径跳过逻辑,支持正则表达式
✅ 新增 token 类型检查,防止运行时错误
✅ 新增 payload 验证和大小警告
✅ 新增 req.user 覆盖警告
🐛 修复 skipPaths 路径匹配漏洞

### v1.0.0

✅ 初始版本
