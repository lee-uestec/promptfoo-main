import { useState, useEffect, useCallback } from 'react';

/**
 * 自定义 React Hook - useLocalStorage
 *
 * 功能：
 * - 在 localStorage 中存储和读取数据
 * - 自动序列化/反序列化 JSON
 * - 监听 storage 事件以同步多个标签页
 *
 * @param {string} key - localStorage 的键名
 * @param {*} initialValue - 初始值（当 localStorage 中不存在该键时使用）
 * @returns {[*, function]} - 返回 [storedValue, setValue] 数组
 */
const useLocalStorage = (key, initialValue) => {
  // 状态初始化函数
  const readValue = useCallback(() => {
    // 服务端渲染时返回初始值
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // 从 localStorage 读取数据
      const item = window.localStorage.getItem(key);

      // 如果存在数据，解析 JSON；否则返回初始值
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  // 使用 useState 管理状态
  const [storedValue, setStoredValue] = useState(readValue);

  // 更新 localStorage 和状态的函数
  const setValue = useCallback((value) => {
    // 服务端渲染时不执行
    if (typeof window === 'undefined') {
      console.warn(
        `Tried setting localStorage key "${key}" even though environment is not a client`
      );
      return;
    }

    try {
      // 允许 value 是一个函数（类似 useState 的用法）
      const newValue = value instanceof Function ? value(storedValue) : value;

      // 保存到 localStorage
      window.localStorage.setItem(key, JSON.stringify(newValue));

      // 更新状态
      setStoredValue(newValue);

      // 触发自定义事件，通知其他使用相同 key 的 Hook 实例
      window.dispatchEvent(new Event('local-storage'));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // 监听 storage 事件和自定义事件
  useEffect(() => {
    // 初始化时设置值
    setStoredValue(readValue());

    // storage 事件处理函数（跨标签页同步）
    const handleStorageChange = (e) => {
      if (e.key === key || e.key === null) {
        setStoredValue(readValue());
      }
    };

    // 自定义事件处理函数（同一标签页内同步）
    const handleLocalStorageChange = () => {
      setStoredValue(readValue());
    };

    // 监听原生 storage 事件（其他标签页的变化）
    window.addEventListener('storage', handleStorageChange);

    // 监听自定义事件（当前标签页的变化）
    window.addEventListener('local-storage', handleLocalStorageChange);

    // 清理函数
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleLocalStorageChange);
    };
  }, [key, readValue]);

  return [storedValue, setValue];
};

export default useLocalStorage;
