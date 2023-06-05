const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
//调用系统时间函数
/**
 * 工具类 util.js
 */
class Util {
  static formatTime(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
 
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
 
 
    return [year, month, day].map(this.formatNumber).join('/') + ' ' + [hour, minute, second].map(this.formatNumber).join(':');
  };
  static formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
  };
};
 
module.exports = Util;
module.exports = {
  formatTime
}
