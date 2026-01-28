/**
 * 认证配置文件
 */
module.exports = {
  // JWT 密钥 (生产环境中应使用环境变量)
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',

  // 加密算法
  algorithm: 'HS256',

  // Token 过期时间
  expiresIn: '24h',

  // 请求头的 key
  headerKey: 'authorization',

  // Token 前缀
  tokenPrefix: 'Bearer ',

  // 跳过认证的路径
  skipPaths: [
    '/api/auth/login',
    '/api/auth/register',
    '/api/health',
    '/api/public'
  ]
};
