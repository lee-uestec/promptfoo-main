const express = require('express');
const {
  createAuthMiddleware,
  requirePermissions,
  requireRoles,
  generateToken,
  errorHandler
} = require('../middleware/auth');
const authConfig = require('../config/auth.config');

const app = express();
const PORT = process.env.PORT || 3000;

// 解析 JSON 请求体
app.use(express.json());

// ===== 公开路由（无需认证） =====

/**
 * 健康检查
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

/**
 * 登录接口 - 生成 JWT token
 */
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  // 这里应该验证用户名和密码（示例简化处理）
  if (username === 'admin' && password === 'admin123') {
    // 生成 token
    const token = generateToken({
      userId: 1,
      username: 'admin',
      email: 'admin@example.com',
      roles: ['admin', 'user'],
      permissions: ['read', 'write', 'delete', 'manage_users']
    }, authConfig);

    return res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: {
          userId: 1,
          username: 'admin',
          email: 'admin@example.com',
          roles: ['admin', 'user']
        }
      }
    });
  }

  if (username === 'user' && password === 'user123') {
    const token = generateToken({
      userId: 2,
      username: 'user',
      email: 'user@example.com',
      roles: ['user'],
      permissions: ['read']
    }, authConfig);

    return res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: {
          userId: 2,
          username: 'user',
          email: 'user@example.com',
          roles: ['user']
        }
      }
    });
  }

  return res.status(401).json({
    success: false,
    error: '用户名或密码错误'
  });
});

/**
 * 公开 API
 */
app.get('/api/public', (req, res) => {
  res.json({
    success: true,
    message: '这是公开接口，无需认证',
    data: {
      timestamp: new Date().toISOString()
    }
  });
});

// ===== 应用认证中间件 =====
app.use(createAuthMiddleware(authConfig));

// ===== 受保护的路由（需要认证） =====

/**
 * 获取当前用户信息
 */
app.get('/api/user/profile', (req, res) => {
  res.json({
    success: true,
    message: '获取用户信息成功',
    data: {
      user: req.user
    }
  });
});

/**
 * 需要读权限的接口
 */
app.get('/api/data', requirePermissions('read'), (req, res) => {
  res.json({
    success: true,
    message: '读取数据成功',
    data: {
      items: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' }
      ]
    }
  });
});

/**
 * 需要写权限的接口
 */
app.post('/api/data', requirePermissions('write'), (req, res) => {
  res.json({
    success: true,
    message: '创建数据成功',
    data: {
      id: 4,
      name: req.body.name || 'New Item'
    }
  });
});

/**
 * 需要删除权限的接口
 */
app.delete('/api/data/:id', requirePermissions('delete'), (req, res) => {
  res.json({
    success: true,
    message: `删除数据 ${req.params.id} 成功`
  });
});

/**
 * 需要管理员角色的接口
 */
app.get('/api/admin/users', requireRoles('admin'), (req, res) => {
  res.json({
    success: true,
    message: '获取用户列表成功',
    data: {
      users: [
        { id: 1, username: 'admin', role: 'admin' },
        { id: 2, username: 'user', role: 'user' }
      ]
    }
  });
});

/**
 * 需要多个权限的接口
 */
app.post('/api/admin/users',
  requireRoles('admin'),
  requirePermissions(['write', 'manage_users']),
  (req, res) => {
    res.json({
      success: true,
      message: '创建用户成功',
      data: {
        id: 3,
        username: req.body.username || 'new_user'
      }
    });
  }
);

/**
 * 需要多个角色之一的接口
 */
app.get('/api/dashboard', requireRoles(['admin', 'manager']), (req, res) => {
  res.json({
    success: true,
    message: '获取仪表盘数据成功',
    data: {
      stats: {
        users: 100,
        posts: 500,
        comments: 1000
      }
    }
  });
});

// ===== 404 处理 =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '接口不存在',
    code: 404
  });
});

// ===== 错误处理中间件 =====
app.use(errorHandler);

// ===== 启动服务器 =====
app.listen(PORT, () => {
  console.log(`\n🚀 服务器运行在 http://localhost:${PORT}`);
  console.log('\n📝 测试账号:');
  console.log('   管理员: admin / admin123');
  console.log('   普通用户: user / user123');
  console.log('\n📌 API 端点:');
  console.log('   POST   /api/auth/login      - 登录');
  console.log('   GET    /api/health          - 健康检查');
  console.log('   GET    /api/public          - 公开接口');
  console.log('   GET    /api/user/profile    - 用户信息 (需要认证)');
  console.log('   GET    /api/data            - 读取数据 (需要 read 权限)');
  console.log('   POST   /api/data            - 创建数据 (需要 write 权限)');
  console.log('   DELETE /api/data/:id        - 删除数据 (需要 delete 权限)');
  console.log('   GET    /api/admin/users     - 用户列表 (需要 admin 角色)');
  console.log('   POST   /api/admin/users     - 创建用户 (需要 admin 角色 + 多个权限)');
  console.log('   GET    /api/dashboard       - 仪表盘 (需要 admin 或 manager 角色)\n');
});

module.exports = app;
