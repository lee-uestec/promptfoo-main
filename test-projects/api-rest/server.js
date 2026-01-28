const express = require('express');
const usersRouter = require('./users');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 挂载用户路由
app.use('/users', usersRouter);

// 根路由
app.get('/', (req, res) => {
  res.json({
    message: '欢迎使用 Express Users API',
    endpoints: {
      'GET /users': '获取所有用户',
      'GET /users/:id': '获取单个用户',
      'POST /users': '创建新用户',
      'PUT /users/:id': '更新用户',
      'DELETE /users/:id': '删除用户'
    }
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '请求的资源不存在'
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);

  const isDevelopment = process.env.NODE_ENV !== 'production';

  res.status(err.status || 500).json({
    success: false,
    message: isDevelopment ? err.message : '服务器内部错误',
    ...(isDevelopment && { error: err.message })
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`API 文档: http://localhost:${PORT}/`);
});
