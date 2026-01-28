# 🚀 快速开始指南

## 📁 项目结构

```
react-hook/
├── useLocalStorage.js    # 核心 Hook 实现
├── ExampleUsage.jsx      # React 组件使用示例
├── demo.html            # 独立 HTML 演示页面（可直接在浏览器打开）
├── package.json         # 项目配置
├── README.md           # 详细文档
└── QUICK_START.md      # 本文件
```

## 🎯 三种使用方式

### 方式 1: 直接浏览器测试（最快）

1. 双击打开 `demo.html` 文件
2. 或在浏览器中打开：`file:///path/to/demo.html`
3. 立即看到效果！

**测试多标签页同步：**
- 复制浏览器地址栏的 URL
- 在新标签页打开
- 在任一标签页修改数据，观察另一个标签页的实时同步

### 方式 2: 在现有 React 项目中使用

1. **复制文件**
   ```bash
   cp useLocalStorage.js /path/to/your/project/src/hooks/
   ```

2. **在组件中使用**
   ```jsx
   import useLocalStorage from './hooks/useLocalStorage';

   function MyComponent() {
     const [value, setValue] = useLocalStorage('my-key', 'default-value');

     return (
       <input
         value={value}
         onChange={(e) => setValue(e.target.value)}
       />
     );
   }
   ```

### 方式 3: 使用完整示例组件

1. **复制示例文件**
   ```bash
   cp ExampleUsage.jsx /path/to/your/project/src/components/
   cp useLocalStorage.js /path/to/your/project/src/hooks/
   ```

2. **在 App.js 中引入**
   ```jsx
   import ExampleUsage from './components/ExampleUsage';

   function App() {
     return <ExampleUsage />;
   }
   ```

## 💡 最简示例

### 存储用户名
```jsx
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  const [name, setName] = useLocalStorage('username', '');

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="输入你的名字"
      />
      <p>你好, {name}!</p>
    </div>
  );
}
```

### 存储主题设置
```jsx
function App() {
  const [darkMode, setDarkMode] = useLocalStorage('theme-dark', false);

  return (
    <div style={{
      background: darkMode ? '#1a1a1a' : '#ffffff',
      color: darkMode ? '#ffffff' : '#000000'
    }}>
      <button onClick={() => setDarkMode(!darkMode)}>
        切换 {darkMode ? '浅色' : '深色'} 模式
      </button>
    </div>
  );
}
```

### 存储表单数据
```jsx
function App() {
  const [formData, setFormData] = useLocalStorage('form', {
    email: '',
    password: ''
  });

  return (
    <form>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
    </form>
  );
}
```

## 🔍 核心特性验证

### 1. 数据持久化
- 刷新页面，数据依然存在 ✅

### 2. 多标签页同步
- 打开两个标签页
- 在一个标签页修改数据
- 另一个标签页自动更新 ✅

### 3. 支持所有 JSON 类型
- ✅ 字符串：`'hello'`
- ✅ 数字：`42`
- ✅ 布尔值：`true` / `false`
- ✅ 对象：`{ name: 'Alice', age: 25 }`
- ✅ 数组：`[1, 2, 3]`
- ✅ null：`null`

### 4. 函数式更新
```jsx
const [count, setCount] = useLocalStorage('count', 0);

// ✅ 基于当前值更新
setCount(prevCount => prevCount + 1);
```

## 🛠️ 在实际项目中的应用场景

### 用户设置
```jsx
const [settings, setSettings] = useLocalStorage('user-settings', {
  language: 'zh-CN',
  theme: 'light',
  notifications: true
});
```

### 购物车
```jsx
const [cart, setCart] = useLocalStorage('shopping-cart', []);

const addToCart = (item) => {
  setCart(prev => [...prev, item]);
};
```

### 用户认证状态
```jsx
const [authToken, setAuthToken] = useLocalStorage('auth-token', null);
```

### 表单草稿自动保存
```jsx
const [draft, setDraft] = useLocalStorage('article-draft', {
  title: '',
  content: ''
});

// 每次输入时自动保存
<textarea
  value={draft.content}
  onChange={(e) => setDraft({ ...draft, content: e.target.value })}
/>
```

## 📊 浏览器开发者工具验证

1. 打开浏览器开发者工具（F12）
2. 切换到 "Application" / "存储" 标签
3. 左侧选择 "Local Storage"
4. 查看存储的键值对
5. 修改数据后，实时观察 localStorage 的变化

## ⚠️ 常见问题

### Q: 为什么其他标签页没有同步？
A: 确保：
- 使用相同的域名和端口
- 使用相同的 localStorage key
- 没有在隐私/无痕模式下

### Q: 可以存储多大的数据？
A: localStorage 通常限制为 5-10MB，建议：
- 只存储必要的数据
- 大文件使用其他方案（IndexedDB）

### Q: 如何清除存储的数据？
A: 三种方式：
```jsx
// 方式 1: 设置为初始值
setValue(initialValue);

// 方式 2: 直接操作 localStorage
localStorage.removeItem('your-key');

// 方式 3: 清除所有
localStorage.clear();
```

## 🎓 下一步

- 阅读 [README.md](./README.md) 了解更多细节
- 查看 [ExampleUsage.jsx](./ExampleUsage.jsx) 学习完整示例
- 打开 [demo.html](./demo.html) 进行交互式测试

## 📞 需要帮助？

如有问题或建议，欢迎：
- 提交 Issue
- 发起 Pull Request
- 联系项目维护者

---

🎉 **祝你使用愉快！**
