import React from 'react';
import useLocalStorage from './useLocalStorage';

/**
 * 使用示例组件
 * 展示 useLocalStorage Hook 的各种用法
 */
const ExampleUsage = () => {
  // 示例 1: 存储简单的字符串
  const [name, setName] = useLocalStorage('user-name', '');

  // 示例 2: 存储对象
  const [user, setUser] = useLocalStorage('user-info', {
    name: '',
    email: '',
    age: 0
  });

  // 示例 3: 存储数组
  const [todos, setTodos] = useLocalStorage('todos', []);

  // 示例 4: 存储布尔值
  const [darkMode, setDarkMode] = useLocalStorage('dark-mode', false);

  // 示例 5: 存储数字
  const [counter, setCounter] = useLocalStorage('counter', 0);

  // 添加待办事项
  const addTodo = () => {
    const newTodo = {
      id: Date.now(),
      text: `任务 ${todos.length + 1}`,
      completed: false
    };
    setTodos([...todos, newTodo]);
  };

  // 删除待办事项
  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // 切换待办事项完成状态
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // 更新用户信息
  const updateUser = (field, value) => {
    setUser(prevUser => ({
      ...prevUser,
      [field]: value
    }));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>useLocalStorage Hook 示例</h1>

      {/* 示例 1: 简单字符串 */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>示例 1: 存储简单字符串</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="输入你的名字"
          style={{ padding: '8px', width: '300px', fontSize: '14px' }}
        />
        <p>存储的名字: <strong>{name || '(空)'}</strong></p>
      </section>

      {/* 示例 2: 对象 */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>示例 2: 存储对象</h2>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>姓名:</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => updateUser('name', e.target.value)}
            placeholder="姓名"
            style={{ padding: '8px', width: '300px', fontSize: '14px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>邮箱:</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => updateUser('email', e.target.value)}
            placeholder="邮箱"
            style={{ padding: '8px', width: '300px', fontSize: '14px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>年龄:</label>
          <input
            type="number"
            value={user.age}
            onChange={(e) => updateUser('age', parseInt(e.target.value) || 0)}
            placeholder="年龄"
            style={{ padding: '8px', width: '300px', fontSize: '14px' }}
          />
        </div>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '3px' }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </section>

      {/* 示例 3: 数组（待办事项） */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>示例 3: 存储数组（待办事项）</h2>
        <button
          onClick={addTodo}
          style={{ padding: '8px 16px', marginBottom: '10px', cursor: 'pointer' }}
        >
          添加待办事项
        </button>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map(todo => (
            <li
              key={todo.id}
              style={{
                padding: '10px',
                marginBottom: '5px',
                background: '#f9f9f9',
                borderRadius: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  style={{ marginRight: '10px' }}
                />
                <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                  {todo.text}
                </span>
              </label>
              <button
                onClick={() => removeTodo(todo.id)}
                style={{ padding: '4px 8px', cursor: 'pointer', background: '#ff4444', color: 'white', border: 'none', borderRadius: '3px' }}
              >
                删除
              </button>
            </li>
          ))}
        </ul>
        {todos.length === 0 && <p style={{ color: '#999' }}>暂无待办事项</p>}
      </section>

      {/* 示例 4: 布尔值（暗黑模式） */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>示例 4: 存储布尔值</h2>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            style={{ marginRight: '10px' }}
          />
          启用暗黑模式
        </label>
        <p>当前状态: <strong>{darkMode ? '已启用' : '已禁用'}</strong></p>
      </section>

      {/* 示例 5: 数字（计数器） */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>示例 5: 存储数字</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setCounter(c => c - 1)}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            -
          </button>
          <span style={{ fontSize: '24px', fontWeight: 'bold', minWidth: '50px', textAlign: 'center' }}>
            {counter}
          </span>
          <button
            onClick={() => setCounter(c => c + 1)}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            +
          </button>
          <button
            onClick={() => setCounter(0)}
            style={{ padding: '8px 16px', cursor: 'pointer', marginLeft: '10px' }}
          >
            重置
          </button>
        </div>
      </section>

      {/* 提示信息 */}
      <section style={{ padding: '15px', background: '#e3f2fd', borderRadius: '5px' }}>
        <h3>💡 功能说明</h3>
        <ul>
          <li>✅ 所有数据自动保存到 localStorage</li>
          <li>✅ 刷新页面后数据保持不变</li>
          <li>✅ 打开多个标签页，数据会自动同步</li>
          <li>✅ 支持存储字符串、对象、数组、布尔值、数字等类型</li>
          <li>✅ 自动处理 JSON 序列化和反序列化</li>
        </ul>
        <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#666' }}>
          试试在另一个标签页打开这个页面，你会看到数据实时同步！
        </p>
      </section>
    </div>
  );
};

export default ExampleUsage;
