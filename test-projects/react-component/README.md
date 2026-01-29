# UserCard 组件

一个美观的 React 用户卡片组件,支持显示用户头像、名字和邮箱,并提供点击交互功能。

## 功能特性

- ✨ 美观的渐变背景和悬停效果
- 🖼️ 支持用户头像显示
- 🎨 无头像时自动显示首字母占位符
- 📱 响应式设计,适配移动端
- ♿ 支持键盘访问性 (可使用 Tab 和 Enter 键操作)
- 🎯 点击卡片触发回调函数

## Props 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| user | Object | 是 | 用户对象 |
| user.name | string | 是 | 用户名称 |
| user.email | string | 是 | 用户邮箱 |
| user.avatar | string | 否 | 用户头像 URL |
| onClick | Function | 否 | 点击卡片的回调函数 |

## 使用示例

```jsx
import React from 'react';
import UserCard from './UserCard';

function App() {
  const user = {
    name: '张三',
    email: 'zhangsan@example.com',
    avatar: 'https://example.com/avatar.jpg'
  };

  const handleClick = (user) => {
    console.log('点击了用户:', user);
  };

  return (
    <UserCard
      user={user}
      onClick={handleClick}
    />
  );
}
```

## 样式说明

组件使用了以下视觉效果:
- 渐变紫色背景 (#667eea → #764ba2)
- 圆角卡片设计 (16px 圆角)
- 悬停时上移动画效果
- 阴影和光泽效果
- 圆形头像边框

## 文件结构

```
├── UserCard.jsx      # 组件主文件
├── UserCard.css      # 组件样式文件
├── Example.jsx       # 使用示例
└── README.md         # 文档说明
```

## 浏览器兼容性

支持所有现代浏览器 (Chrome, Firefox, Safari, Edge)

## 许可证

MIT
