# User Mongoose Schema

一个功能完整的 Mongoose 用户模型，包含密码加密和验证功能。

## 功能特性

- ✅ **username**：必需且唯一的用户名
- ✅ **email**：必需且唯一的邮箱，带格式验证
- ✅ **password**：必需的密码，自动使用 bcrypt 加密存储
- ✅ **timestamps**：自动管理 createdAt 和 updatedAt 时间戳
- ✅ **密码验证方法**：内置密码比对功能
- ✅ **安全的JSON输出**：toJSON() 方法自动移除密码字段

## 安装依赖

```bash
npm install
```

## Schema 字段说明

### username
- 类型：String
- 必需：是
- 唯一：是
- 长度：3-30个字符
- 自动去除首尾空格

### email
- 类型：String
- 必需：是
- 唯一：是
- 自动转为小写
- 格式验证：使用正则表达式验证邮箱格式

### password
- 类型：String
- 必需：是
- 最小长度：6个字符
- 加密方式：bcrypt (salt rounds: 10)
- 自动加密：保存前自动加密

### timestamps
- createdAt：文档创建时间（自动生成）
- updatedAt：文档最后更新时间（自动更新）

## 使用方法

### 1. 导入模型

```javascript
const User = require('./User');
```

### 2. 创建新用户

```javascript
const user = new User({
  username: 'johndoe',
  email: 'john@example.com',
  password: 'mypassword123'
});

await user.save();
// 密码会自动加密存储
```

### 3. 验证密码

```javascript
const user = await User.findOne({ email: 'john@example.com' });
const isMatch = await user.comparePassword('mypassword123');
console.log(isMatch); // true 或 false
```

### 4. 查询用户

```javascript
const user = await User.findOne({ username: 'johndoe' });
console.log(user);
// 返回的JSON自动排除password字段
```

### 5. 更新用户

```javascript
const user = await User.findOneAndUpdate(
  { username: 'johndoe' },
  { email: 'newemail@example.com' },
  { new: true, runValidators: true }
);
```

## 中间件说明

### pre('save') 中间件
在保存用户文档之前，自动检测密码字段是否被修改，如果修改则自动加密。

```javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

## 实例方法

### comparePassword(candidatePassword)
验证提供的密码是否与数据库中的加密密码匹配。

```javascript
const isValid = await user.comparePassword('password123');
```

### toJSON()
返回用户对象的JSON表示，自动移除密码字段以确保安全性。

```javascript
const userJSON = user.toJSON();
// userJSON 不包含 password 字段
```

## 错误处理

模型包含了详细的验证错误消息：

- 用户名长度不符合要求
- 邮箱格式不正确
- 必填字段缺失
- 唯一性冲突（用户名或邮箱已存在）

## 示例代码

查看 `example.js` 文件获取完整的使用示例。

## 注意事项

1. 确保 MongoDB 已安装并运行
2. 修改 `example.js` 中的数据库连接字符串
3. 密码加密是不可逆的，只能通过 `comparePassword` 方法验证
4. 建议在生产环境中使用环境变量存储数据库连接信息
