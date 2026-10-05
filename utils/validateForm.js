import ToastManager from '@/utils/toastManager';

/**
 * 表单验证函数
 * 遍历元数据中的字段，检查对应的值是否为空（跳过指定字段）
 * 
 * @param {Array} metaData - 字段元数据数组，包含 name 和 label 属性
 * @param {Object} values - 表单值对象，键为字段名
 * @param {Array} skipFields - 需要跳过的字段名数组，这些字段不进行非空验证
 * @returns {boolean} - 验证通过返回 true，否则返回 false
 * 
 * @example
 * // 基本使用
 * validateForm(metaData, formValues);
 * 
 * @example
 * // 跳过特定字段
 * validateForm(metaData, formValues, ['role', 'optionalField']);
 */
export const validateForm = (metaData = [], values = {}, skipFields = []) => {
    // 使用 find 方法查找第一个无效字段
    // 无效字段条件：不在跳过列表中 且 对应的值为空
    const invalidField = metaData.find(field =>
        !skipFields.includes(field.type) && !values[field.name]
    );

    // 如果找到无效字段，显示错误信息并返回验证失败
    if (invalidField) {
        // 生成错误消息：字段标签首字母大写 + 固定提示文本
        const message = `${capitalizeFirst(invalidField.label)} cannot be empty`;
        ToastManager.error(message);
        return false;
    }

    // 所有必填字段都有值，返回验证成功
    return true;
};

/**
 * 批量表单验证函数
 * 检查所有字段是否为空，并汇总所有空字段显示在一个错误消息中
 * 
 * @param {Array} metaData - 字段元数据数组，包含 name 和 label 属性
 * @param {Object} values - 表单值对象，键为字段名
 * @returns {boolean} - 验证通过返回 true，否则返回 false
 * 
 * @example
 * // 基本使用
 * validateFormAll(metaData, formValues);
 * 
 * @example
 * // 空数组或无效数据直接返回 true
 * validateFormAll([], {});
 * validateFormAll(null, {});
 */
export const validateFormAll = (metaData = [], values = {}) => {
    // 参数校验：如果 metaData 不是数组或为空数组，直接返回验证通过
    if (!Array.isArray(metaData) || metaData.length === 0) {
        return true;
    }

    // 过滤出所有无效字段（字段存在 name 属性且对应的值为空）
    const invalidField = metaData.filter(field =>
        field?.name && !values[field.name]
    );

    // 如果存在无效字段，汇总显示错误信息
    if (invalidField.length > 0) {
        // 提取所有无效字段的标签，用 "or" 连接
        const labels = invalidField.map(field => field.label || 'Field').join(' or ');
        // 生成错误消息：字段标签首字母大写 + 固定提示文本
        const message = `${capitalizeFirst(labels)} cannot be empty`;
        ToastManager.error(message);
        return false;
    }

    // 所有字段都有值，返回验证成功
    return true;
};

/**
 * 字符串首字母大写工具函数
 * 将字符串的第一个字母转换为大写，其余字母保持原样
 * 
 * @param {string} str - 需要处理的字符串
 * @returns {string} - 首字母大写的字符串，原始输入为空时返回空字符串
 * 
 * @example
 * capitalizeFirst('hello world');    // 'Hello world'
 * capitalizeFirst('HELLO WORLD');    // 'HELLO WORLD' (仅首字母变化)
 * capitalizeFirst('123abc');         // '123abc' (数字开头不变)
 * capitalizeFirst('');               // ''
 * capitalizeFirst(null);             // ''
 */
const capitalizeFirst = (str) => {
    // 健壮的空值检查：检查 null、undefined、空字符串等
     if (!str) return '';

    // 优化处理逻辑：
    // - 只转换第一个字符，保持其他字符原样
    // - 使用 charAt 和 slice 提高性能
    return str.toLowerCase().replace(/^\w/, c => c.toUpperCase());
};

/**
 * 格式化价格显示
 * 将数字格式化为带千分位分隔符的字符串，保留1位小数
 * 
 * @param {number|string} price - 需要格式化的价格，可以是数字或字符串
 * @returns {string} 格式化后的价格字符串
 * 
 * @example
 * // 返回 "1,234.5"
 * formatPrice(1234.5);
 * 
 * @example
 * // 返回 "1,000.0" 
 * formatPrice(1000);
 * 
 * @example
 * // 返回 "0.0"
 * formatPrice('invalid');
 * 
 * @description
 * - 支持数字和字符串输入
 * - 自动处理无效输入，返回 "0.0"
 * - 使用千分位分隔符格式化大数字
 * - 固定保留1位小数
 */
export const formatPrice = (price) => {
    const number = parseFloat(price);
    if (isNaN(number)) return '0.0';

    // 添加千分位分隔符
    return `${number.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};