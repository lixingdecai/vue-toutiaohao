import Cookie from 'vue-cookie';

/**
 * 时间格式转换 ms -> date
 * @return {string} yyyy-MM-dd hh:mm:ss格式时间
 */
const msToDate = (_ms, _format) => {
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
 * 时间格式转换 ms -> date
 * @return {string} yyyy-MM-dd hh:mm:ss格式时间
 */
exports.nowToDate = _format => {
  let format = _format;
  format = format || 'yyyy-MM-dd hh:mm:ss';
  return msToDate(new Date().getTime(), format);
};

/**
 * 过去距离当前时间差
 * @param  {int} ms 毫秒数
 * @return {string}    时间差标示
 */
exports.dateFromNow = ms => {
  const time = parseFloat(ms) / 1000;
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
 * JS生成随机的由字母数字组合的字符串
 * @param  {boolean} flag 是否范围浮动
 * @param  {number}  min  最小值
 * @param  {number}  max  最大值
 * @return {string}       生成的随机字串
 */
exports.randomName = (flag, min, max) => {
  const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  let str = '';
  let range = min;
  let pos = 0;
  if (flag) {
    range = Math.round(Math.random() * (max - min)) + min;
  }
  for (let i = 0; i < range; i++) {
    pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
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
 * 返回顶部
 * @return {}
 */
exports.toTop = () => {
  window.scrollTo(0, 0);
};

/**
 * 审核状态转换
 * @param  {int}  num   审核状态参数
 * @return {string}     审核状态
 */
exports.status2str = num => {
  let status = '';
  switch (parseInt(num, 10)) {
    case 1:
      status = '审核通过';
      break;
    case 2:
      status = '未通过审核';
      break;
    case 3:
    case 4:
    case 5:
      status = '账号审核中';
      break;
    default:
      status = '';
      break;
  }
  return status;
};

exports.rssNum2Status = num => {
  let status = '';
  switch (parseInt(num, 10)) {
    case 0:
      status = '待审核';
      break;
    case 1:
      status = '审核通过';
      break;
    case 2:
      status = '未通过审核';
      break;
    case 3:
      status = '删除';
      break;
    case 4:
      status = '已停用';
      break;
    default:
      status = '';
      break;
  }
  return status;
};

exports.noEnterReturn = val => val.trim().replace(/[\r\n]/g, '');

exports.text2html = val => val.trim().replace(/\r\n/g, '<br />').replace(/\n/g, '<br />').replace(/\r/g, '<br />');

/**
 * 非法状态拦截
 * @param  {int}      status   状态值
 * @param  {function} msg      Message函数
 * @param  {this}     self     this or next
 * @param  {string}   type     'index' or 'publish'
 * @return {null}              弹框提示
 */
exports.statusWarning = (status, msg, self, type) => {
  if (status === 3 || status === 4 || status === 5) {
    msg({
      showClose: true,
      message: '您的账号正在审核中，目前还不能发表文章哦，体验下其他功能吧！',
      type: 'info'
    });
    return;
  }
  if (status === 2) {
    msg({
      showClose: true,
      message: '您的账号未通过审核，赶紧去修改您的账号信息吧~',
      type: 'info'
    });
    return;
  }
  if (status === 6) {
    msg({
      showClose: true,
      message: '您的账号已被停用，无法进行发文及回复操作！',
      type: 'info'
    });
    return;
  }
  if (status === 1 && type === 'index') {
    self.$router.push({ path: '/home/publish/2' });
  }
  if (status === 1 && type === 'publish') {
    self();
  }
};

/**
 * 根据不同的环境返回sso地址
 * @return {string} sso地址
 */
const getSSOAddr = () => {
  const host = window.location.host;
  let ssoApi = 'https://test-sso.meiyou.com/sso/';
  if (host.indexOf('test-') > -1 || host.indexOf('pc-') > -1 || host.indexOf('localhost') > -1 || host.indexOf('127.0.0.1') > -1) {
    ssoApi = 'https://test-sso.meiyou.com/sso/';
  } else if (host.indexOf('yf-') > -1) {
    ssoApi = 'https://yf-sso.meiyou.com/sso/';
  } else {
    ssoApi = 'https://sso.meiyou.com/sso/';
  }
  return ssoApi;
};

/**
 * 根据不同的环境返回mp地址
 * @return {string} mp地址
 */
const getMPAddr = () => {
  const host = window.location.host;
  let mpApi = 'https://test-mp.meiyou.com';
  if (host.indexOf('pc-') > -1 || host.indexOf('localhost') > -1 || host.indexOf('127.0.0.1') > -1) {
    mpApi = 'http://pc-mp.meiyou.com:8888/';
  } else if (host.indexOf('test-') > -1) {
    mpApi = 'https://test-mp.meiyou.com';
  } else if (host.indexOf('yf-') > -1) {
    mpApi = 'https://yf-mp.meiyou.com';
  } else {
    mpApi = 'https://mp.meiyou.com';
  }
  return mpApi;
};

/**
 * 根据不同的环境返回news地址
 * @return {string} news地址
 */
exports.getNewsAddr = () => {
  const host = window.location.host;
  let newsApi = 'https://test-news-node.seeyouyima.com';
  if (host.indexOf('test-') > -1 || host.indexOf('pc-') > -1 || host.indexOf('localhost') > -1 || host.indexOf('127.0.0.1') > -1) {
    newsApi = 'https://test-news-node.seeyouyima.com';
  } else if (host.indexOf('yf-') > -1) {
    newsApi = 'https://yf-news-node.seeyouyima.com';
  } else {
    newsApi = 'https://news-node.seeyouyima.com';
  }
  return newsApi;
};

/**
 * 根据不同的环境返回login地址
 * @return {string} login地址
 */
exports.getLoginAddr = () => `${getSSOAddr()}login?callback_url=${getMPAddr()}?client_id=K17npO82`;

/**
 * 根据不同的环境返回回调为当前地址的登录地址
 * @return {string} 登录地址
 */
exports.getCallbackAddr = () => `${getSSOAddr()}login?callback_url=${window.location.href}?client_id=K17npO82`;

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

/**
 * 判断是否为IE9浏览器
 * @return {boolean}  true or false
 */
exports.isIE9 = () => {
  if (navigator.userAgent.toLowerCase().indexOf('msie 9.0') > 0) {
    return true;
  }
  return false;
};

/**
 * 判断是否符合标签规则
 * @param  {string}  value 标签
 * @return {boolean}       true or false
 */
exports.isTag = value => /[A-Za-z0-9\u4e00-\u9fa5]/g.test(value);

/**
 * 判断是否符合微信号规则
 * @param  {string}  value 微信号
 * @return {boolean}       true or false
 */
exports.isWechat = value => /^[a-zA-Z\d_]{5,}$/.test(value);

/**
 * 判断是否符合URL规则
 * @param  {string}  value URL链接
 * @return {boolean}       true or false
 */
exports.isURL = value => /^(https?:\/\/(?:www\.|(?!www))[^\s.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})?$/ig.test(value);

/**
 * 判断是否符合密码规则
 * @param  {string} value 密码
 * @return {boolean}      true or false
 */
exports.isPass = value => /^(?![A-Za-z]+$)(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,16}$/.test(value);

/**
 * 判断是否符合手机规则
 * @param  {string} value 手机
 * @return {boolean}      true or false
 */
const isMobile = exports.isMobile = value => /^1(3|4|5|7|8)\d{9}$/.test(value.trim());

/**
 * 判断是否符合邮箱规则
 * @param  {string} value 邮箱
 * @return {boolean}      true or false
 */
exports.isEmail = value => /^[_.0-9a-z-]+@([0-9a-z][0-9a-z-]+\.){1,4}[a-z]{2,3}$/.test(value.trim());

/**
 * 判断是否是数字
 * @param  {string} value 输入值
 * @return {boolean}      true or false
 */
exports.isNum = value => /^[0-9]*$/.test(value.trim());

/**
 * 判断是否是整形数据
 * @param  {string} value 输入值
 * @return {boolean}      true or false
 */
exports.isInteger = value => Number.isInteger(parseInt(value.trim(), 10));

/**
 * 判断是否是身份证号 15位到18位的身份证号码正则
 * @param  {string} value 身份证号
 * @return {boolean}      true or false
 */
exports.isIdCard = value => /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|[Xx])$/.test(value.trim());

/**
 * 判断是否是中文名字 至少2个中文字符
 * @param  {string} value 名字
 * @return {boolean}      true or false
 */
exports.isChineseName = value => /^[\u4E00-\u9FA5]{2,15}$/.test(value.trim());

/**
 * 判断
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
exports.isMeiyouName = value => /^[\u4e00-\u9fa5a-zA-Z\d_]*$/gi.test(value.trim());

/**
 * 返回默认头像
 * @return {string} 头像base64格式
 */
const getAvatar = () => 'data:image/png;base64,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';

exports.getArticleDefaultCover = () => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIUAAABPBAMAAAA3hxvdAAAAFVBMVEXn5+f////r6+v5+fnz8/P8/Pzv7+9PYdFaAAABHklEQVRYw+3WsU7DMBSF4avUdOY0SWeLJnsqXiBWW2bcAjOF938HEhMhl2S5OR2qyt8D/Lo+SyJJkiT3Ktt5xE6fonbAP6U6ssBIIUpbFF9PsW+gFRWD3MqlGitRqdGMRva5qDj0Z1Qv8TFnWN0cRXgQPuKZlYP4dTgGsPFGjWiE/dBpuEaGziPXWKKz4u/AK7nHFkBLNmogF7Ihu1PLNWKH95ZtbIDSco3MAzhyjQXQH0I1HHoN08gQFEzjAb+qeY1qb8NTgrdZjbr/IiwxKOc0TJihxh99Y3iEZxoGA6Lh+IYB33B8w4BvOL6Rg2/gNhoeU1rlbxDfOGOKpX7pglxUMkw4io7jnhIYjKxFazNaw4pa9XxhbyVJkuTafgAEekHgtBLMHgAAAABJRU5ErkJggg==';

exports.getVIPIdCardPic = () => 'data:image/png;base64,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';

/**
 * 兼容https/http
 * @param  {string} value 地址
 * @return {string}       替换后的地址
 */
exports.https = value => {
  if (value) {
    return value.replace(/^http(s)?:/gi, '');
  }
  return '';
};

const setUserPhone = exports.setUserPhone = user => {
  if (user && Object.prototype.hasOwnProperty.call(user, 'phone')) {
    Cookie.set('meiyou_mp_phone', user.phone, { expires: 7, domain: '.meiyou.com' });
  }
};

const setUserStatus = exports.setUserStatus = user => {
  if (user && Object.prototype.hasOwnProperty.call(user, 'status')) {
    Cookie.set('meiyou_mp_status', user.status, { expires: 7, domain: '.meiyou.com' });
  } else {
    Cookie.set('meiyou_mp_status', user, { expires: 7, domain: '.meiyou.com' });
  }
};

const setUserType = exports.setUserType = user => {
  if (user && Object.prototype.hasOwnProperty.call(user, 'type')) {
    Cookie.set('meiyou_mp_type', user.type, { expires: 7, domain: '.meiyou.com' });
  }
};

const setUserVerified = exports.setUserVerified = user => {
  if (user && Object.prototype.hasOwnProperty.call(user, 'phone_verified')) {
    Cookie.set('meiyou_mp_verified', user.phone_verified, { expires: 7, domain: '.meiyou.com' });
  }
};

const setUserName = exports.setUserName = user => {
  if (user && Object.prototype.hasOwnProperty.call(user, 'name')) {
    Cookie.set('meiyou_mp_name', user.name, { expires: 7, domain: '.meiyou.com' });
  }
};

const setUserAvatar = exports.setUserAvatar = user => {
  if (user && Object.prototype.hasOwnProperty.call(user, 'avatar')) {
    Cookie.set('meiyou_mp_avatar', user.avatar, { expires: 7, domain: '.meiyou.com' });
  }
};

exports.setUserInfo = user => {
  setUserPhone(user);
  setUserStatus(user);
  setUserType(user);
  setUserVerified(user);
  setUserName(user);
  setUserAvatar(user);
};

const hidMobile = value => {
  if (value) {
    return value.trim().replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
  }
  return '';
};

exports.getUserAvatar = () => {
  const mpAvatar = Cookie.get('meiyou_mp_avatar');
  if (mpAvatar) {
    return mpAvatar + '?time=' + Date.now();
  }
  return getAvatar();
};

exports.getUserName = () => {
  const mpName = Cookie.get('meiyou_mp_name');
  const mpPhone = Cookie.get('meiyou_mp_phone');
  if (mpName) {
    return mpName;
  } else if (mpPhone && isMobile(mpPhone)) {
    return hidMobile(mpPhone);
  }
  return '';
};

exports.getUserVerified = () => +Cookie.get('meiyou_mp_verified') || 0;

exports.getUserType = () => +Cookie.get('meiyou_mp_type') || 1;

exports.getUserStatus = () => +Cookie.get('meiyou_mp_status') || 0;

exports.getUserPhone = () => Cookie.get('meiyou_mp_phone') || '';

exports.getAvatar = getAvatar;
exports.getSSOAddr = getSSOAddr;
exports.getMPAddr = getMPAddr;
exports.setUserStatus = setUserStatus;
exports.msToDate = msToDate;
