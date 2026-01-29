import React from 'react';
import UserCard from './UserCard';

/**
 * UserCard 组件使用示例
 */
const Example = () => {
  // 示例用户数据
  const users = [
    {
      name: '张三',
      email: 'zhangsan@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      name: '李四',
      email: 'lisi@example.com',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      name: '王五',
      email: 'wangwu@example.com',
      avatar: '' // 没有头像的情况
    }
  ];

  // 点击卡片的处理函数
  const handleCardClick = (user) => {
    console.log('点击了用户卡片:', user);
    alert(`你点击了 ${user.name} 的卡片`);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        UserCard 组件示例
      </h1>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '20px'
      }}>
        {users.map((user, index) => (
          <UserCard
            key={index}
            user={user}
            onClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Example;
