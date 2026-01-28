const jwt = require('jsonwebtoken');

/**
 * 认证错误类
 */
class AuthError extends Error {
  constructor(message, statusCode = 401) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

/**
 * JWT 认证中间件配置
 */
const defaultConfig = {
  secret: (() => {
    const secret = process.env.JWT_SECRET;

    // 在生产环境中,必须设置 JWT_SECRET
    if (process.env.NODE_ENV === 'production') {
      if (!secret || secret === 'your-secret-key' || secret === 'your-secret-key-change-in-production') {
        throw new Error(
          '严重错误: 生产环境必须配置安全的 JWT_SECRET 环境变量。' +
          '请设置至少32个字符的强密钥。'
        );
      }
      if (secret.length < 32) {
        throw new Error('严重错误: JWT_SECRET 长度必须至少32个字符。');
      }
    }

    // 开发环境警告
    if (!secret || secret === 'your-secret-key' || secret === 'your-secret-key-change-in-production') {
      console.warn('\n⚠️  警告: 使用默认 JWT_SECRET,仅用于开发测试!');
      console.warn('   生产环境必须设置强密钥: export JWT_SECRET="your-strong-secret-key"\n');
      return secret || 'your-secret-key-development-only';
    }

    if (secret.length < 32) {
      console.warn('⚠️  警告: JWT_SECRET 长度较短,建议至少32个字符\n');
    }

    return secret;
  })(),
  algorithm: 'HS256',
  expiresIn: '24h',
  headerKey: 'authorization',
  tokenPrefix: 'Bearer ',
  skipPaths: ['/login', '/register', '/health'] // 跳过认证的路径
};

/**
 * 从请求头中提取 token
 * @param {Object} req - Express 请求对象
 * @param {Object} config - 配置对象
 * @returns {string|null} token
 */
function extractToken(req, config) {
  const authHeader = req.headers[config.headerKey.toLowerCase()];

  if (!authHeader) {
    return null;
  }

  // 支持 "Bearer token" 格式
  if (authHeader.startsWith(config.tokenPrefix)) {
    return authHeader.slice(config.tokenPrefix.length);
  }

  // 直接返回 token
  return authHeader;
}

/**
 * 验证 JWT token
 * @param {string} token - JWT token
 * @param {Object} config - 配置对象
 * @returns {Object} 解码后的用户信息
 */
function verifyToken(token, config) {
  try {
    const decoded = jwt.verify(token, config.secret, {
      algorithms: [config.algorithm]
    });
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AuthError('Token 已过期', 401);
    } else if (error.name === 'JsonWebTokenError') {
      throw new AuthError('无效的 Token', 401);
    } else {
      throw new AuthError('Token 验证失败', 401);
    }
  }
}

/**
 * 检查用户是否有所需的权限
 * @param {Object} user - 用户对象
 * @param {Array|string} requiredPermissions - 所需权限（数组或单个字符串）
 * @returns {boolean} 是否有权限
 */
function hasPermission(user, requiredPermissions) {
  if (!requiredPermissions) {
    return true;
  }

  if (!user || !user.permissions || !Array.isArray(user.permissions)) {
    return false;
  }

  // 超级管理员拥有所有权限
  if (user.roles && user.roles.includes('superadmin')) {
    return true;
  }

  const permissions = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions];

  // 检查用户是否拥有所有必需的权限(AND 逻辑)
  return permissions.every(permission =>
    user.permissions.includes(permission)
  );
}

/**
 * 检查用户是否有所需的权限(任一权限)
 * @param {Object} user - 用户对象
 * @param {Array|string} requiredPermissions - 所需权限（数组或单个字符串）
 * @returns {boolean} 是否有权限
 */
function hasAnyPermission(user, requiredPermissions) {
  if (!requiredPermissions) {
    return true;
  }

  if (!user || !user.permissions || !Array.isArray(user.permissions)) {
    return false;
  }

  // 超级管理员拥有所有权限
  if (user.roles && user.roles.includes('superadmin')) {
    return true;
  }

  const permissions = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions];

  // 检查用户是否拥有任一必需的权限(OR 逻辑)
  return permissions.some(permission =>
    user.permissions.includes(permission)
  );
}

/**
 * 检查用户是否有所需的角色
 * @param {Object} user - 用户对象
 * @param {Array|string} requiredRoles - 所需角色（数组或单个字符串）
 * @returns {boolean} 是否有角色
 */
function hasRole(user, requiredRoles) {
  if (!requiredRoles) {
    return true;
  }

  if (!user || !user.roles || !Array.isArray(user.roles)) {
    return false;
  }

  const roles = Array.isArray(requiredRoles)
    ? requiredRoles
    : [requiredRoles];

  // 检查用户是否拥有任意一个必需的角色
  return roles.some(role => user.roles.includes(role));
}

/**
 * 检查路径是否需要跳过认证
 * @param {string} path - 请求路径
 * @param {Array} skipPaths - 跳过路径列表
 * @returns {boolean} 是否需要跳过
 */
function shouldSkipAuth(path, skipPaths) {
  return skipPaths.some(skipPath => {
    if (typeof skipPath === 'string') {
      // 精确匹配或前缀匹配
      return path === skipPath || path.startsWith(skipPath + '/');
    }
    // 支持正则表达式
    if (skipPath instanceof RegExp) {
      return skipPath.test(path);
    }
    return false;
  });
}

/**
 * 创建认证中间件
 * @param {Object} options - 配置选项
 * @returns {Function} Express 中间件函数
 */
function createAuthMiddleware(options = {}) {
  const config = { ...defaultConfig, ...options };

  return function authMiddleware(req, res, next) {
    // 检查是否需要跳过认证(使用更安全的路径匹配)
    if (shouldSkipAuth(req.path, config.skipPaths)) {
      return next();
    }

    try {
      // 提取 token
      const token = extractToken(req, config);

      // 添加类型检查,防止 trim() 抛出异常
      if (!token || typeof token !== 'string' || token.trim() === '') {
        throw new AuthError('未提供认证 Token', 401);
      }

      // 验证 token
      const decoded = verifyToken(token, config);

      // 将用户信息附加到请求对象(检查是否已存在)
      if (req.user) {
        console.warn('⚠️  警告: req.user 已存在,可能被覆盖');
      }
      req.user = decoded;

      next();
    } catch (error) {
      // 处理认证错误
      if (error instanceof AuthError) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
          code: error.statusCode
        });
      }

      // 处理其他未知错误
      return res.status(500).json({
        success: false,
        error: '服务器内部错误',
        code: 500
      });
    }
  };
}

/**
 * 创建权限检查中间件(需要所有权限)
 * @param {Array|string} requiredPermissions - 所需权限
 * @returns {Function} Express 中间件函数
 */
function requirePermissions(requiredPermissions) {
  return function permissionMiddleware(req, res, next) {
    try {
      if (!req.user) {
        throw new AuthError('未认证的用户', 401);
      }

      if (!hasPermission(req.user, requiredPermissions)) {
        throw new AuthError('权限不足', 403);
      }

      next();
    } catch (error) {
      if (error instanceof AuthError) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
          code: error.statusCode
        });
      }

      return res.status(500).json({
        success: false,
        error: '服务器内部错误',
        code: 500
      });
    }
  };
}

/**
 * 创建权限检查中间件(需要任一权限)
 * @param {Array|string} requiredPermissions - 所需权限
 * @returns {Function} Express 中间件函数
 */
function requireAnyPermission(requiredPermissions) {
  return function anyPermissionMiddleware(req, res, next) {
    try {
      if (!req.user) {
        throw new AuthError('未认证的用户', 401);
      }

      if (!hasAnyPermission(req.user, requiredPermissions)) {
        throw new AuthError('权限不足', 403);
      }

      next();
    } catch (error) {
      if (error instanceof AuthError) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
          code: error.statusCode
        });
      }

      return res.status(500).json({
        success: false,
        error: '服务器内部错误',
        code: 500
      });
    }
  };
}

/**
 * 创建角色检查中间件
 * @param {Array|string} requiredRoles - 所需角色
 * @returns {Function} Express 中间件函数
 */
function requireRoles(requiredRoles) {
  return function roleMiddleware(req, res, next) {
    try {
      if (!req.user) {
        throw new AuthError('未认证的用户', 401);
      }

      if (!hasRole(req.user, requiredRoles)) {
        throw new AuthError('角色权限不足', 403);
      }

      next();
    } catch (error) {
      if (error instanceof AuthError) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
          code: error.statusCode
        });
      }

      return res.status(500).json({
        success: false,
        error: '服务器内部错误',
        code: 500
      });
    }
  };
}

/**
 * 生成 JWT token 工具函数
 * @param {Object} payload - token 载荷
 * @param {Object} options - 配置选项
 * @returns {string} JWT token
 */
function generateToken(payload, options = {}) {
  // 验证 payload
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new TypeError('payload 必须是一个对象');
  }

  // 检查 payload 大小(避免生成过大的 token)
  const payloadSize = JSON.stringify(payload).length;
  if (payloadSize > 4096) {
    console.warn(`⚠️  警告: JWT payload 过大 (${payloadSize} 字节),可能影响性能`);
  }

  const config = { ...defaultConfig, ...options };

  return jwt.sign(payload, config.secret, {
    algorithm: config.algorithm,
    expiresIn: config.expiresIn
  });
}

/**
 * 错误处理中间件
 */
function errorHandler(err, req, res, next) {
  if (err instanceof AuthError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.statusCode
    });
  }

  // 处理其他错误
  console.error('Unhandled error:', err);
  return res.status(500).json({
    success: false,
    error: '服务器内部错误',
    code: 500
  });
}

module.exports = {
  // 主要中间件
  createAuthMiddleware,
  requirePermissions,
  requireAnyPermission,
  requireRoles,

  // 工具函数
  generateToken,
  extractToken,
  verifyToken,
  hasPermission,
  hasAnyPermission,
  hasRole,
  shouldSkipAuth,

  // 错误处理
  AuthError,
  errorHandler,

  // 默认配置
  defaultConfig
};
