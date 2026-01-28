const mongoose = require('mongoose');
const User = require('./User');

// 连接数据库示例
async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/your-database-name', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB 连接成功');
  } catch (error) {
    console.error('MongoDB 连接失败:', error);
    process.exit(1);
  }
}

// 创建用户示例
async function createUser() {
  try {
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123' // 会自动加密，需要包含大小写字母和数字
    });

    const savedUser = await user.save();
    console.log('用户创建成功:', savedUser);
    return savedUser;
  } catch (error) {
    console.error('用户创建失败:', error.message);
  }
}

// 验证密码示例
async function verifyPassword() {
  try {
    const user = await User.findOne({ username: 'testuser' });
    if (!user) {
      console.log('用户不存在');
      return;
    }

    const isMatch = await user.comparePassword('Password123');
    console.log('密码验证结果:', isMatch);
  } catch (error) {
    console.error('密码验证失败:', error.message);
  }
}

// 查询用户示例
async function findUser() {
  try {
    const user = await User.findOne({ email: 'test@example.com' });
    console.log('查询到的用户:', user); // 密码不会被返回
  } catch (error) {
    console.error('查询用户失败:', error.message);
  }
}

// 更新用户示例
async function updateUser() {
  try {
    const user = await User.findOneAndUpdate(
      { username: 'testuser' },
      { email: 'newemail@example.com' },
      { new: true, runValidators: true }
    );
    console.log('用户更新成功:', user);
  } catch (error) {
    console.error('用户更新失败:', error.message);
  }
}

// 更新密码示例（安全方式 - 使用 findOneAndUpdate，会自动加密）
async function updatePasswordSafely() {
  try {
    // 方式1：使用 findOneAndUpdate - 密码会被自动加密
    const user = await User.findOneAndUpdate(
      { username: 'testuser' },
      { password: 'NewPassword456' }, // 新密码会被自动加密
      { new: true, runValidators: true }
    );
    console.log('密码更新成功（方式1）:', user);
  } catch (error) {
    console.error('密码更新失败:', error.message);
  }
}

// 更新密码示例（推荐方式 - 使用 save 方法）
async function updatePasswordRecommended() {
  try {
    // 方式2：先查询再保存 - 更安全和清晰的方式
    const user = await User.findOne({ username: 'testuser' });
    if (!user) {
      console.log('用户不存在');
      return;
    }

    user.password = 'NewPassword789';
    await user.save(); // 密码会被自动加密
    console.log('密码更新成功（方式2 - 推荐）');
  } catch (error) {
    console.error('密码更新失败:', error.message);
  }
}

// 删除用户示例
async function deleteUser() {
  try {
    const result = await User.deleteOne({ username: 'testuser' });
    console.log('用户删除成功:', result);
  } catch (error) {
    console.error('用户删除失败:', error.message);
  }
}

// 主函数
async function main() {
  await connectDB();

  // 取消注释以运行不同的示例
  // await createUser();
  // await verifyPassword();
  // await findUser();
  // await updateUser();
  // await updatePasswordSafely();
  // await updatePasswordRecommended();
  // await deleteUser();

  // 关闭数据库连接
  await mongoose.connection.close();
  console.log('数据库连接已关闭');
}

// 运行示例
// main();

module.exports = {
  connectDB,
  createUser,
  verifyPassword,
  findUser,
  updateUser,
  updatePasswordSafely,
  updatePasswordRecommended,
  deleteUser
};
