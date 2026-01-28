/**
 * API 测试脚本
 * 用于验证认证中间件的功能
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function test(name, fn) {
  try {
    log(`\n📝 测试: ${name}`, 'cyan');
    await fn();
    log(`✅ 通过`, 'green');
  } catch (error) {
    log(`❌ 失败: ${error.message}`, 'red');
    if (error.response) {
      log(`   响应: ${JSON.stringify(error.response.body, null, 2)}`, 'yellow');
    }
  }
}

async function runTests() {
  log('\n🚀 开始运行 API 测试\n', 'cyan');

  let adminToken = '';
  let userToken = '';

  // 测试 1: 健康检查
  await test('健康检查 - 无需认证', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      method: 'GET'
    });

    if (res.statusCode !== 200) {
      throw new Error(`状态码错误: ${res.statusCode}`);
    }
    log(`   响应: ${JSON.stringify(res.body)}`, 'yellow');
  });

  // 测试 2: 公开接口
  await test('公开接口 - 无需认证', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/public',
      method: 'GET'
    });

    if (res.statusCode !== 200) {
      throw new Error(`状态码错误: ${res.statusCode}`);
    }
    log(`   响应: ${JSON.stringify(res.body)}`, 'yellow');
  });

  // 测试 3: 管理员登录
  await test('管理员登录', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, { username: 'admin', password: 'admin123' });

    if (res.statusCode !== 200) {
      throw new Error(`状态码错误: ${res.statusCode}`);
    }

    if (!res.body.data || !res.body.data.token) {
      throw new Error('未返回 token');
    }

    adminToken = res.body.data.token;
    log(`   Token: ${adminToken.substring(0, 50)}...`, 'yellow');
  });

  // 测试 4: 普通用户登录
  await test('普通用户登录', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, { username: 'user', password: 'user123' });

    if (res.statusCode !== 200) {
      throw new Error(`状态码错误: ${res.statusCode}`);
    }

    userToken = res.body.data.token;
    log(`   Token: ${userToken.substring(0, 50)}...`, 'yellow');
  });

  // 测试 5: 错误的登录凭据
  await test('错误的登录凭据', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, { username: 'wrong', password: 'wrong' });

    if (res.statusCode !== 401) {
      throw new Error(`期望状态码 401, 得到: ${res.statusCode}`);
    }
    log(`   响应: ${JSON.stringify(res.body)}`, 'yellow');
  });

  // 测试 6: 无 token 访问受保护接口
  await test('无 token 访问受保护接口', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/user/profile',
      method: 'GET'
    });

    if (res.statusCode !== 401) {
      throw new Error(`期望状态码 401, 得到: ${res.statusCode}`);
    }
    log(`   响应: ${JSON.stringify(res.body)}`, 'yellow');
  });

  // 测试 7: 使用 token 获取用户信息
  await test('使用 token 获取用户信息', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/user/profile',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    if (res.statusCode !== 200) {
      throw new Error(`状态码错误: ${res.statusCode}`);
    }
    log(`   用户: ${res.body.data.user.username}`, 'yellow');
  });

  // 测试 8: 读取数据 (需要 read 权限)
  await test('读取数据 - 管理员 (有 read 权限)', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/data',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    if (res.statusCode !== 200) {
      throw new Error(`状态码错误: ${res.statusCode}`);
    }
    log(`   数据数量: ${res.body.data.items.length}`, 'yellow');
  });

  // 测试 9: 读取数据 (普通用户也有 read 权限)
  await test('读取数据 - 普通用户 (有 read 权限)', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/data',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });

    if (res.statusCode !== 200) {
      throw new Error(`状态码错误: ${res.statusCode}`);
    }
    log(`   数据数量: ${res.body.data.items.length}`, 'yellow');
  });

  // 测试 10: 创建数据 (需要 write 权限)
  await test('创建数据 - 管理员 (有 write 权限)', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/data',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }, { name: 'Test Item' });

    if (res.statusCode !== 200) {
      throw new Error(`状态码错误: ${res.statusCode}`);
    }
    log(`   创建成功: ${JSON.stringify(res.body.data)}`, 'yellow');
  });

  // 测试 11: 创建数据 (普通用户无 write 权限)
  await test('创建数据 - 普通用户 (无 write 权限)', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/data',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      }
    }, { name: 'Test Item' });

    if (res.statusCode !== 403) {
      throw new Error(`期望状态码 403, 得到: ${res.statusCode}`);
    }
    log(`   响应: ${JSON.stringify(res.body)}`, 'yellow');
  });

  // 测试 12: 删除数据 (需要 delete 权限)
  await test('删除数据 - 管理员 (有 delete 权限)', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/data/1',
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    if (res.statusCode !== 200) {
      throw new Error(`状态码错误: ${res.statusCode}`);
    }
    log(`   响应: ${res.body.message}`, 'yellow');
  });

  // 测试 13: 删除数据 (普通用户无 delete 权限)
  await test('删除数据 - 普通用户 (无 delete 权限)', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/data/1',
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });

    if (res.statusCode !== 403) {
      throw new Error(`期望状态码 403, 得到: ${res.statusCode}`);
    }
    log(`   响应: ${JSON.stringify(res.body)}`, 'yellow');
  });

  // 测试 14: 访问管理员接口 (需要 admin 角色)
  await test('访问管理员接口 - 管理员 (有 admin 角色)', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/users',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    if (res.statusCode !== 200) {
      throw new Error(`状态码错误: ${res.statusCode}`);
    }
    log(`   用户数量: ${res.body.data.users.length}`, 'yellow');
  });

  // 测试 15: 访问管理员接口 (普通用户无 admin 角色)
  await test('访问管理员接口 - 普通用户 (无 admin 角色)', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/users',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });

    if (res.statusCode !== 403) {
      throw new Error(`期望状态码 403, 得到: ${res.statusCode}`);
    }
    log(`   响应: ${JSON.stringify(res.body)}`, 'yellow');
  });

  // 测试 16: 无效的 token
  await test('使用无效的 token', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/user/profile',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    });

    if (res.statusCode !== 401) {
      throw new Error(`期望状态码 401, 得到: ${res.statusCode}`);
    }
    log(`   响应: ${JSON.stringify(res.body)}`, 'yellow');
  });

  log('\n✅ 所有测试完成!\n', 'green');
}

// 等待服务器启动
setTimeout(() => {
  runTests().catch(err => {
    log(`\n❌ 测试失败: ${err.message}`, 'red');
    process.exit(1);
  });
}, 2000);
