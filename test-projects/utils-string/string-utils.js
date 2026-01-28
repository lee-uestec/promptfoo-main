/**
 * 字符串工具函数集合
 * @module string-utils
 */

/**
 * 将字符串的首字母转换为大写
 * @param {string} str - 需要转换的字符串
 * @returns {string} 首字母大写的字符串
 * @example
 * capitalize('hello') // 'Hello'
 * capitalize('world') // 'World'
 * capitalize('') // ''
 */
function capitalize(str) {
  if (!str || typeof str !== 'string') {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 截断字符串并在末尾添加省略号
 * @param {string} str - 需要截断的字符串
 * @param {number} maxLength - 最大长度(包括省略号)
 * @param {string} [ellipsis='...'] - 省略号字符,默认为 '...'
 * @returns {string} 截断后的字符串
 * @example
 * truncate('Hello World', 8) // 'Hello...'
 * truncate('Hello', 10) // 'Hello'
 * truncate('Hello World', 8, '…') // 'Hello W…'
 */
function truncate(str, maxLength, ellipsis = '...') {
  if (!str || typeof str !== 'string') {
    return '';
  }

  if (str.length <= maxLength) {
    return str;
  }

  const truncateLength = maxLength - ellipsis.length;
  if (truncateLength < 0) {
    return ellipsis.slice(0, maxLength);
  }

  return str.slice(0, truncateLength) + ellipsis;
}

/**
 * 将字符串转换为 URL-safe 的 slug 格式
 * @param {string} str - 需要转换的字符串
 * @param {Object} [options] - 配置选项
 * @param {string} [options.separator='-'] - 分隔符,默认为 '-'
 * @param {boolean} [options.lowercase=true] - 是否转换为小写,默认为 true
 * @returns {string} URL-safe 格式的字符串
 * @example
 * slugify('Hello World') // 'hello-world'
 * slugify('Hello World!', { separator: '_' }) // 'hello_world'
 * slugify('Hello World', { lowercase: false }) // 'Hello-World'
 * slugify('北京 Beijing 123') // 'beijing-123'
 */
function slugify(str, options = {}) {
  if (!str || typeof str !== 'string') {
    return '';
  }

  const { separator = '-', lowercase = true } = options;

  let slug = str
    // 去除首尾空格
    .trim()
    // 移除特殊字符,只保留字母、数字、空格和连字符
    .replace(/[^\w\s-]/g, '')
    // 将多个空格或连字符替换为单个分隔符
    .replace(/[\s_-]+/g, separator)
    // 去除首尾的分隔符
    .replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '');

  // 转换为小写
  if (lowercase) {
    slug = slug.toLowerCase();
  }

  return slug;
}

// 导出函数
module.exports = {
  capitalize,
  truncate,
  slugify
};
