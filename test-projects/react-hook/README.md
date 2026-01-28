# useLocalStorage - React 自定义 Hook

一个功能完整的 React Hook，用于在 localStorage 中存储和同步数据。

## ✨ 特性

- 🔄 **自动序列化/反序列化**: 自动处理 JSON 数据
- 🌐 **多标签页同步**: 监听 storage 事件，实时同步数据
- 💾 **持久化存储**: 数据保存在 localStorage，刷新后依然存在
- 🛡️ **类型安全**: 支持所有 JSON 可序列化的类型
- ⚡ **React 风格 API**: 使用方式类似 `useState`
- 🔧 **SSR 友好**: 服务端渲染环境下安全运行

## 📦 安装

将 `useLocalStorage.js` 复制到你的项目中，例如 `src/hooks/useLocalStorage.js`。

## 🚀 基础使用

```jsx
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  const [name, setName] = useLocalStorage('username', 'Guest');

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

## 📖 API

### `useLocalStorage(key, initialValue)`

#### 参数

- **`key`** (string): localStorage 的键名
- **`initialValue`** (any): 初始值，当 localStorage 中不存在该键时使用

#### 返回值

返回一个数组 `[storedValue, setValue]`：

- **`storedValue`**: 当前存储的值
- **`setValue`**: 更新值的函数（用法类似 `useState` 的 setter）

## 💡 使用示例

### 1. 存储简单字符串

```jsx
const [username, setUsername] = useLocalStorage('username', '');
```

### 2. 存储对象

```jsx
const [user, setUser] = useLocalStorage('user', {
  name: '',
  email: '',
  age: 0
});

// 更新对象
setUser({ name: 'Alice', email: 'alice@example.com', age: 25 });

// 部分更新（使用函数形式）
setUser(prevUser => ({ ...prevUser, age: 26 }));
```

### 3. 存储数组

```jsx
const [todos, setTodos] = useLocalStorage('todos', []);

// 添加项目
setTodos([...todos, { id: 1, text: '学习 React', completed: false }]);

// 使用函数形式
setTodos(prevTodos => [...prevTodos, newTodo]);
```

### 4. 存储布尔值

```jsx
const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);

// 切换
setDarkMode(!darkMode);
```

### 5. 存储数字

```jsx
const [counter, setCounter] = useLocalStorage('counter', 0);

// 递增
setCounter(counter + 1);

// 使用函数形式
setCounter(c => c + 1);
```

## 🎯 高级用法

### 函数式更新

与 `useState` 类似，支持函数式更新：

```jsx
const [count, setCount] = useLocalStorage('count', 0);

// 推荐：使用函数形式，基于当前值更新
setCount(prevCount => prevCount + 1);
```

### 多标签页同步

Hook 会自动监听 storage 事件，当其他标签页修改相同的 localStorage 键时，当前标签页会自动更新：

```jsx
// 标签页 A
const [data, setData] = useLocalStorage('shared-data', { count: 0 });
setData({ count: 10 }); // 修改数据

// 标签页 B（自动同步）
const [data, setData] = useLocalStorage('shared-data', { count: 0 });
// data 会自动更新为 { count: 10 }
```

### 复杂状态管理

```jsx
const [appState, setAppState] = useLocalStorage('app-state', {
  user: null,
  settings: {
    theme: 'light',
    language: 'zh-CN'
  },
  cache: {}
});

// 更新嵌套属性
setAppState(prev => ({
  ...prev,
  settings: {
    ...prev.settings,
    theme: 'dark'
  }
}));
```

## ⚠️ 注意事项

1. **存储限制**: localStorage 通常有 5-10MB 的存储限制
2. **序列化限制**: 只能存储 JSON 可序列化的数据（不支持函数、Symbol 等）
3. **同步限制**: 只有不同标签页之间才会触发 storage 事件
4. **隐私模式**: 在某些浏览器的隐私模式下，localStorage 可能不可用

## 🔧 错误处理

Hook 内置了错误处理机制：

- 读取失败时会返回 `initialValue`
- 写入失败时会在控制台输出警告
- SSR 环境下安全运行，不会抛出错误

## 🌐 浏览器兼容性

支持所有现代浏览器：

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera

## 📝 完整示例

查看 `ExampleUsage.jsx` 文件，包含了所有使用场景的完整示例。

## 🛠️ 技术细节

### 事件监听

1. **storage 事件**: 监听其他标签页的 localStorage 变化
2. **自定义事件**: 通过 `local-storage` 事件同步当前标签页内的多个 Hook 实例

### 性能优化

- 使用 `useCallback` 优化函数引用
- 避免不必要的重新渲染
- 事件监听器在组件卸载时自动清理

## 📄 License

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
