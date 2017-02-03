import Cookie from 'vue-cookie';

/**
 * 时间格式转换 ms -> date
 * @return {string} yyyy-MM-dd hh:mm:ss格式时间
 */
exports.msToDate = (_ms, _format) => {
  let ms = _ms;
  let format = _format;
  if (ms.toString().length === 10) {
    ms *= 1000;
  }
  format = format || 'yyyy-MM-dd hh:mm:ss';
  const d = new Date(ms);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const seconds = d.getSeconds();

  const addPrefix = source => (source < 10 ? `0${source}` : source);

  format = format.replace('yyyy', year)
    .replace('MM', addPrefix(month))
    .replace('dd', addPrefix(day))
    .replace('hh', addPrefix(hour))
    .replace('mm', addPrefix(minute))
    .replace('ss', addPrefix(seconds));

  return format;
};

/**
 * 过去距离当前时间差
 * @param  {int} ms 毫秒数
 * @return {string}    时间差标示
 */
exports.dateFromNow = ms => {
  const time = parseFloat(ms) / 1000;
  console.log('time: ', time);
  let result = '';
  if (time) {
    if (time > 60 && time < 3600) {
      result = `${parseInt(time / 60.0, 10)}分钟前`;
    } else if (time >= 3600 && time < 24 * 3600) {
      result = `${parseInt(time / 3600.0, 10)}小时前`;
    } else if (time >= 24 * 3600 && time < 30 * 24 * 3600) {
      result = `${parseInt(time / 3600.0 / 24.0, 10)}天前`;
    } else if (time >= 30 * 24 * 3600 && time < 12 * 30 * 24 * 3600) {
      result = `${parseInt(time / 3600.0 / 24.0 / 30, 10)}月前`;
    } else if (time >= 12 * 30 * 24 * 3600) {
      result = `${parseInt(time / 3600.0 / 24.0 / 30.0 / 12.0, 10)}年前`;
    } else {
      result = `${parseInt(time / 1.0, 10)}秒前`;
    }
  }

  return result;
};

/**
 * object转成uri参数字符串
 * @param  {object} obj object格式数据 { x: xx, y: yy }
 * @return {string}     uri参数字串 x=xx&y=yy
 */
exports.obj2uri = obj => Object.keys(obj).map(k => `${k}=${obj[k]}`).join('&');

/**
 * 身份转换
 * @param  {int}    num   身份模式编号
 * @return {string}       身份字符串
 */
exports.num2mode = num => {
  let mode = '';
  switch (num) {
    case 0:
      mode = '经期';
      break;
    case 1:
      mode = '怀孕';
      break;
    case 2:
      mode = '备孕';
      break;
    case 3:
      mode = '辣妈';
      break;
    default:
      mode = '经期';
      break;
  }
  return mode;
};

/**
 * 读取cookie，判断是否登录
 * @return {boolean} 是否登录
 */
exports.isLogin = () => {
  const loginStatus = +Cookie.get('webLoginStatus');
  const expireTime = +Cookie.get('expireTime');
  const time = expireTime - Date.parse(new Date()) / 1000;
  console.log('loginStatus: ', !!loginStatus, ' expireTime: ', time);
  if (!!loginStatus && loginStatus === 1 && expireTime && time > 0) {
    return true;
  }
  return false;
};

// exports.getSSOAddr = getSSOAddr;
// exports.getMPAddr = getMPAddr;
