/**
 * 异步错误处理示例
 * 演示了常见的 Promise 错误处理问题及其解决方案
 */

// ============================================
// 第一部分：错误示例 - 未处理的 Promise 拒绝
// ============================================

/**
 * ❌ 错误示例 1：未捕获的 Promise 拒绝
 * 这会导致 UnhandledPromiseRejectionWarning
 */
function badAsyncHandler1() {
  fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => console.log(data));
  // 问题：没有 .catch() 处理错误
}

/**
 * ❌ 错误示例 2：async/await 未使用 try-catch
 */
async function badAsyncHandler2() {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  console.log(data);
  // 问题：如果 fetch 失败，错误会向上抛出但未被捕获
}

/**
 * ❌ 错误示例 3：部分错误处理
 */
function badAsyncHandler3() {
  fetch('https://api.example.com/data')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // 这里可能抛出错误但未被捕获
      const result = data.items.map(item => item.value);
      console.log(result);
    });
  // 问题：只处理了网络错误，数据处理错误未被捕获
}

// ============================================
// 第二部分：正确的错误处理方案
// ============================================

/**
 * ✅ 正确示例 1：使用 .catch() 处理 Promise 错误
 */
function goodAsyncHandler1() {
  fetch('https://api.example.com/data')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Data received:', data);
      return data;
    })
    .catch(error => {
      console.error('Error fetching data:', error.message);
      // 可以返回默认值或重新抛出
      return null;
    })
    .finally(() => {
      console.log('Request completed');
    });
}

/**
 * ✅ 正确示例 2：使用 async/await 配合 try-catch
 */
async function goodAsyncHandler2() {
  try {
    const response = await fetch('https://api.example.com/data');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Data received:', data);
    return data;

  } catch (error) {
    console.error('Error in async operation:', error.message);

    // 根据错误类型进行不同处理
    if (error.name === 'TypeError') {
      console.error('Network error or invalid response');
    } else if (error.name === 'SyntaxError') {
      console.error('Invalid JSON response');
    }

    return null;
  } finally {
    console.log('Async operation completed');
  }
}

/**
 * ✅ 正确示例 3：多个异步操作的错误处理
 */
async function goodAsyncHandler3() {
  try {
    // 并行执行多个异步操作
    const [users, posts, comments] = await Promise.all([
      fetch('https://api.example.com/users').then(r => r.json()),
      fetch('https://api.example.com/posts').then(r => r.json()),
      fetch('https://api.example.com/comments').then(r => r.json())
    ]);

    return { users, posts, comments };

  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error; // 重新抛出，让调用者处理
  }
}

/**
 * ✅ 正确示例 4：使用 Promise.allSettled 处理部分失败
 */
async function goodAsyncHandler4() {
  const urls = [
    'https://api.example.com/users',
    'https://api.example.com/posts',
    'https://api.example.com/comments'
  ];

  // Promise.allSettled 会自动捕获错误，不需要额外的 .catch()
  const results = await Promise.allSettled(
    urls.map(url => fetch(url).then(r => r.json()))
  );

  // 分别处理成功和失败的结果
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`Request ${index + 1} succeeded:`, result.value);
    } else {
      console.error(`Request ${index + 1} failed:`, result.reason);
    }
  });

  return results;
}

/**
 * ✅ 正确示例 5：自定义错误处理包装器
 */
function asyncErrorHandler(asyncFn) {
  return async function(...args) {
    try {
      return await asyncFn(...args);
    } catch (error) {
      console.error('Async error caught:', error);

      // 可以在这里添加统一的错误处理逻辑
      // 例如：错误上报、用户提示等

      throw error; // 重新抛出或返回默认值
    }
  };
}

// 使用错误处理包装器
const safeAsyncOperation = asyncErrorHandler(async (userId) => {
  const response = await fetch(`https://api.example.com/users/${userId}`);
  return await response.json();
});

/**
 * ✅ 正确示例 6：带重试机制的错误处理
 */
async function goodAsyncHandler5(url, maxRetries = 3) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      lastError = error;

      // 判断错误类型，只对网络错误和 5xx 服务器错误重试
      // 4xx 客户端错误（如 400, 404）不应该重试
      const shouldRetry =
        error.name === 'TypeError' || // 网络错误
        (error.message.includes('HTTP 5')); // 5xx 服务器错误

      // 如果不值得重试，或者已经是最后一次尝试，直接抛出错误
      if (!shouldRetry) {
        throw error;
      }

      console.warn(`Attempt ${i + 1} failed:`, error.message);

      // 如果不是最后一次尝试，等待一段时间后重试（指数退避）
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  // 所有重试都失败后，抛出最后一个错误
  throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`);
}

/**
 * ✅ 正确示例 7：超时处理
 */
async function goodAsyncHandler6(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`Request timeout after ${timeoutMs}ms`);
      throw new Error('Request timeout');
    }

    console.error('Fetch error:', error.message);
    throw error;

  } finally {
    // 确保定时器一定会被清理，避免内存泄漏
    clearTimeout(timeoutId);
  }
}

// ============================================
// 第三部分：实际应用示例
// ============================================

/**
 * 实际应用：数据获取服务
 */
class DataService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  /**
   * 通用请求方法，包含完整的错误处理
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      // 处理 HTTP 错误
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      // 检查响应类型，安全解析 JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      return { success: true, data };

    } catch (error) {
      // 详细的错误分类和处理
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout',
          code: 'TIMEOUT'
        };
      }

      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Network error',
          code: 'NETWORK_ERROR'
        };
      }

      if (error.name === 'SyntaxError') {
        return {
          success: false,
          error: 'Invalid JSON response',
          code: 'PARSE_ERROR'
        };
      }

      return {
        success: false,
        error: error.message,
        code: 'REQUEST_FAILED'
      };

    } finally {
      // 确保定时器一定会被清理
      clearTimeout(timeoutId);
    }
  }

  /**
   * GET 请求
   */
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  /**
   * POST 请求
   */
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}

// ============================================
// 使用示例
// ============================================

/**
 * 示例：使用 DataService
 */
async function exampleUsage() {
  const api = new DataService('https://api.example.com');

  // 示例 1：简单的 GET 请求
  const result1 = await api.get('/users/1');
  if (result1.success) {
    console.log('User data:', result1.data);
  } else {
    console.error('Error:', result1.error, result1.code);
  }

  // 示例 2：POST 请求
  const result2 = await api.post('/users', {
    name: 'John Doe',
    email: 'john@example.com'
  });

  if (result2.success) {
    console.log('User created:', result2.data);
  } else {
    console.error('Failed to create user:', result2.error);
  }
}

// ============================================
// 导出
// ============================================

module.exports = {
  // 注意：错误示例函数（badAsyncHandler1-3）不导出，仅供学习参考
  // 避免被意外调用产生副作用

  // 正确示例
  goodAsyncHandler1,
  goodAsyncHandler2,
  goodAsyncHandler3,
  goodAsyncHandler4,
  goodAsyncHandler5,
  goodAsyncHandler6,
  asyncErrorHandler,

  // 实际应用
  DataService,
  exampleUsage
};

// ============================================
// 最佳实践总结
// ============================================

/**
 * Promise 错误处理最佳实践：
 *
 * 1. 始终添加 .catch() 处理 Promise 链
 * 2. 使用 async/await 时必须配合 try-catch
 * 3. 在 .finally() 中执行清理操作
 * 4. 根据错误类型进行不同处理
 * 5. 对于多个并发请求，考虑使用 Promise.allSettled
 * 6. 实现重试机制处理临时性错误
 * 7. 添加超时控制避免长时间挂起
 * 8. 创建统一的错误处理层
 * 9. 记录错误日志便于调试
 * 10. 向用户提供友好的错误提示
 */
