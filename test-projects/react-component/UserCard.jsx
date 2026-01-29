import React from 'react';
import './UserCard.css';

/**
 * UserCard 用户卡片组件
 * @param {Object} props - 组件属性
 * @param {Object} props.user - 用户对象
 * @param {string} props.user.name - 用户名称
 * @param {string} props.user.email - 用户邮箱
 * @param {string} props.user.avatar - 用户头像 URL
 * @param {Function} props.onClick - 点击卡片的回调函数
 */
const UserCard = ({ user, onClick }) => {
  const { name, email, avatar } = user || {};

  const handleClick = () => {
    if (onClick) {
      onClick(user);
    }
  };

  const handleKeyDown = (e) => {
    // 支持键盘访问性
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className="user-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`用户卡片: ${name}`}
    >
      <div className="user-card__avatar-container">
        {avatar ? (
          <img
            src={avatar}
            alt={`${name}的头像`}
            className="user-card__avatar"
          />
        ) : (
          <div className="user-card__avatar-placeholder">
            {name ? name.charAt(0).toUpperCase() : '?'}
          </div>
        )}
      </div>

      <div className="user-card__content">
        <h3 className="user-card__name">{name || '未知用户'}</h3>
        <p className="user-card__email">{email || '暂无邮箱'}</p>
      </div>
    </div>
  );
};

export default UserCard;
