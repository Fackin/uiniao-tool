/**
 * 将日期转换为周几的中文名称
 *
 * @param dateString 日期字符串或Date对象
 * @returns 返回周几的中文名称
 * @throws 如果输入的日期格式无效，抛出Error对象
 */
export const dateToWeek = (dateString: Date | String) => {
    // 支持多种日期格式
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

    let date;
    if (dateString instanceof Date) {
        date = dateString;
    } else if (typeof dateString === 'string') {
        // 处理格式如 "2024-03-20" 或 "2024/03/20"
        date = new Date(dateString.replace(/-/g, '/'));
    } else {
        throw new Error('无效的日期格式');
    }

    if (isNaN(date.getTime())) {
        throw new Error('无效的日期');
    }

    return weekdays[date.getDay()];
}