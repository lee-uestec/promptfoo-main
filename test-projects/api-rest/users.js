const express = require('express');
const router = express.Router();

// 模拟用户数据存储
let users = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', age: 25 },
  { id: 2, name: '李四', email: 'lisi@example.com', age: 30 },
  { id: 3, name: '王五', email: 'wangwu@example.com', age: 28 }
];

// 用于生成新用户ID
let nextId = 4;

/**
 * GET /users - 获取所有用户
 * 返回用户列表
 */
router.get('/', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: users,
      total: users.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取用户列表失败',
      error: error.message
    });
  }
});

/**
 * GET /users/:id - 获取单个用户
 * @param {number} id - 用户ID
 */
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: '无效的用户ID'
      });
    }

    const user = users.find(u => u.id === id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `未找到ID为 ${id} 的用户`
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取用户失败',
      error: error.message
    });
  }
});

/**
 * POST /users - 创建新用户
 * @body {string} name - 用户名称（必填）
 * @body {string} email - 用户邮箱（必填）
 * @body {number} age - 用户年龄（可选）
 */
router.post('/', (req, res) => {
  try {
    const { name, email, age } = req.body;

    // 验证必填字段
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: '用户名称不能为空'
      });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: '用户名称长度不能超过100个字符'
      });
    }

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: '邮箱不能为空'
      });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '邮箱格式不正确'
      });
    }

    // 验证年龄
    if (age !== undefined && age !== null) {
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
        return res.status(400).json({
          success: false,
          message: '年龄必须是0-150之间的数字'
        });
      }
    }

    // 检查邮箱是否已存在
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: '该邮箱已被注册'
      });
    }

    // 创建新用户
    const newUser = {
      id: nextId++,
      name: name.trim(),
      email: email.trim(),
      age: age ? parseInt(age) : null
    };

    users.push(newUser);

    res.status(201).json({
      success: true,
      message: '用户创建成功',
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建用户失败',
      error: error.message
    });
  }
});

/**
 * PUT /users/:id - 更新用户信息
 * @param {number} id - 用户ID
 * @body {string} name - 用户名称（可选）
 * @body {string} email - 用户邮箱（可选）
 * @body {number} age - 用户年龄（可选）
 */
router.put('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: '无效的用户ID'
      });
    }

    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `未找到ID为 ${id} 的用户`
      });
    }

    const { name, email, age } = req.body;

    // 检查是否至少有一个字段需要更新
    if (name === undefined && email === undefined && age === undefined) {
      return res.status(400).json({
        success: false,
        message: '请至少提供一个要更新的字段'
      });
    }

    // 验证用户名
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: '用户名称不能为空'
        });
      }
      if (name.trim().length > 100) {
        return res.status(400).json({
          success: false,
          message: '用户名称长度不能超过100个字符'
        });
      }
    }

    // 验证邮箱格式（如果提供了邮箱）
    if (email !== undefined) {
      if (typeof email !== 'string' || email.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: '邮箱不能为空'
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: '邮箱格式不正确'
        });
      }

      // 检查邮箱是否已被其他用户使用
      const existingUser = users.find(u => u.email === email && u.id !== id);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: '该邮箱已被其他用户使用'
        });
      }
    }

    // 验证年龄
    if (age !== undefined && age !== null) {
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
        return res.status(400).json({
          success: false,
          message: '年龄必须是0-150之间的数字'
        });
      }
    }

    // 更新用户信息
    if (name !== undefined) users[userIndex].name = name.trim();
    if (email !== undefined) users[userIndex].email = email.trim();
    if (age !== undefined) users[userIndex].age = age ? parseInt(age) : null;

    res.status(200).json({
      success: true,
      message: '用户更新成功',
      data: users[userIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新用户失败',
      error: error.message
    });
  }
});

/**
 * DELETE /users/:id - 删除用户
 * @param {number} id - 用户ID
 */
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: '无效的用户ID'
      });
    }

    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `未找到ID为 ${id} 的用户`
      });
    }

    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);

    res.status(200).json({
      success: true,
      message: '用户删除成功',
      data: deletedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除用户失败',
      error: error.message
    });
  }
});

module.exports = router;
