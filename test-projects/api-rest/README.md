# Express Users API

一个简单的 Express.js RESTful API，用于用户管理。

## 安装依赖

```bash
npm install
```

## 运行服务器

```bash
# 生产模式
npm start

# 开发模式（支持热重载）
npm run dev
```

服务器将在 `http://localhost:3000` 启动。

## API 端点

### 1. 获取所有用户
**GET** `/users`

**响应示例:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "张三",
      "email": "zhangsan@example.com",
      "age": 25
    }
  ],
  "total": 1
}
```

### 2. 获取单个用户
**GET** `/users/:id`

**响应示例:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "张三",
    "email": "zhangsan@example.com",
    "age": 25
  }
}
```

### 3. 创建新用户
**POST** `/users`

**请求体:**
```json
{
  "name": "张三",
  "email": "zhangsan@example.com",
  "age": 25
}
```

**响应示例:**
```json
{
  "success": true,
  "message": "用户创建成功",
  "data": {
    "id": 4,
    "name": "张三",
    "email": "zhangsan@example.com",
    "age": 25
  }
}
```

### 4. 更新用户
**PUT** `/users/:id`

**请求体:**
```json
{
  "name": "张三（更新）",
  "email": "zhangsan_new@example.com",
  "age": 26
}
```

**响应示例:**
```json
{
  "success": true,
  "message": "用户更新成功",
  "data": {
    "id": 1,
    "name": "张三（更新）",
    "email": "zhangsan_new@example.com",
    "age": 26
  }
}
```

### 5. 删除用户
**DELETE** `/users/:id`

**响应示例:**
```json
{
  "success": true,
  "message": "用户删除成功",
  "data": {
    "id": 1,
    "name": "张三",
    "email": "zhangsan@example.com",
    "age": 25
  }
}
```

## 测试 API

使用 curl 测试：

```bash
# 获取所有用户
curl http://localhost:3000/users

# 获取单个用户
curl http://localhost:3000/users/1

# 创建新用户
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"赵六","email":"zhaoliu@example.com","age":32}'

# 更新用户
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"张三（更新）","age":26}'

# 删除用户
curl -X DELETE http://localhost:3000/users/1
```

## 功能特性

- ✅ RESTful API 设计
- ✅ 完整的 CRUD 操作
- ✅ 输入验证
- ✅ 错误处理
- ✅ 邮箱格式验证
- ✅ 邮箱唯一性检查
- ✅ 统一的响应格式
- ✅ 请求日志记录

## 项目结构

```
.
├── server.js       # 主入口文件
├── users.js        # 用户路由文件
├── package.json    # 项目配置
└── README.md       # 项目文档
```
