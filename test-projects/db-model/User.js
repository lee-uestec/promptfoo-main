const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// bcrypt 加密强度配置（可通过环境变量调整）
const SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS || 10;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, '用户名是必需的'],
      unique: true,
      trim: true,
      minlength: [3, '用户名至少需要3个字符'],
      maxlength: [30, '用户名不能超过30个字符']
    },
    email: {
      type: String,
      required: [true, '邮箱是必需的'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v) {
          // 更严格的邮箱格式验证正则表达式
          return /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/.test(v);
        },
        message: props => `${props.value} 不是有效的邮箱格式`
      }
    },
    password: {
      type: String,
      required: [true, '密码是必需的'],
      minlength: [8, '密码至少需要8个字符'],
      validate: {
        validator: function(v) {
          // 密码强度验证：至少8个字符，包含大小写字母、数字
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v);
        },
        message: '密码必须至少8个字符，并包含大小写字母和数字'
      }
    }
  },
  {
    // 自动添加 createdAt 和 updatedAt 时间戳
    timestamps: true
  }
);

// 密码加密辅助函数
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(Number(SALT_ROUNDS));
  return await bcrypt.hash(password, salt);
}

// 保存前加密密码的中间件
userSchema.pre('save', async function(next) {
  // 仅在密码被修改时才进行加密
  if (!this.isModified('password')) {
    return next();
  }

  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (error) {
    next(error);
  }
});

// 修复安全漏洞：findOneAndUpdate 时也要加密密码
userSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();

  // 处理不同的更新操作符
  const passwordUpdate = update.password || update.$set?.password;

  if (passwordUpdate) {
    try {
      const hashedPassword = await hashPassword(passwordUpdate);

      // 根据更新方式设置加密后的密码
      if (update.$set) {
        update.$set.password = hashedPassword;
      } else {
        update.password = hashedPassword;
      }

      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// 修复安全漏洞：updateOne 时也要加密密码
userSchema.pre('updateOne', async function(next) {
  const update = this.getUpdate();

  // 处理不同的更新操作符
  const passwordUpdate = update.password || update.$set?.password;

  if (passwordUpdate) {
    try {
      const hashedPassword = await hashPassword(passwordUpdate);

      // 根据更新方式设置加密后的密码
      if (update.$set) {
        update.$set.password = hashedPassword;
      } else {
        update.password = hashedPassword;
      }

      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// 实例方法：验证密码
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(`密码验证失败: ${error.message}`);
  }
};

// 实例方法：返回用户的JSON格式（不包含密码）
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
