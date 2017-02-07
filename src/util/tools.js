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
    mpApi = 'http://pc-mp.meiyou.com:8888';
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
 * 根据不同的环境返回login地址
 * @return {string} login地址
 */
exports.getLoginAddr = () => `${getSSOAddr()}login?callback_url=${getMPAddr()}?client_id=K17npO82`;

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
exports.isMobile = value => /^1(3|4|5|7|8)\d{9}$/.test(value.trim());

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
const getAvatar = () => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIoAAACNCAMAAABfXBLuAAABiVBMVEUAAAD19fXc3Nz19fX29vbw8PD29vb39/f19fX29vb19fX29vb19fX39/f19fX29vb29vb29vb09PT29vbu7u7x8fH19fX29vb19fX29vb6+vr29vb29vb19fX29vbc3Nz09PTd3d319fX09PT19fX19fXr6+v6+vr19fX19fX29vb19fX19fXc3Nz39/f29vbd3d3d3d339/fr6+v////29vb29vbe3t7b29v29vb09PT5+fnc3Nz19fX19fX19fXz8/P19fX09PTe3t729vbh4eHq6urd3d339/fd3d319fXf39/19fXd3d3c3Nz29vb29vbc3Nzo6Ojd3d3z8/P4+Pje3t7d3d3w8PDc3Nz19fXd3d319fXc3NzJycnIyMje3t7Hx8f39/f4+Pjz8/PLy8vx8fHv7+/s7OzZ2dnh4eHT09PGxsbFxcXQ0NDNzc3k5OTW1tbo6OjPz8/b29vr6+vg4ODY2NjDw8P6+vru7u7q6urn5+fj4+Pm5ubS0tLV1dXCwsLBwcE8pcb2AAAAXHRSTlMA/gL88wb2Eiwi5efqJ8v4uGfudQwJ782dMBbd2Wo+/fHu1r5NNBEE8dGJcFnz4KGNVh0bA/rq47qsqFH2spiFgn9fTDgr29O7p5FqQ/z43sKwqXZVREE32NW/u32UptkAAAvUSURBVHja3Jjfb5pQFMe5k6lV+9Otv9c0bbe1XbMl+5Wsy35mD8uyhz3s8Vx6l8AFIUFAgUSr9k8faDcBAVFuu2Sf+KQmfPK9h3MOcP8Ldx9tP18sP9zbe1hefL796C73D7hzf3vrbX1zZWOneswXAYr8fnV3aWWz/nZr+/4dLgn2GuUH754WIIHC0zeri3dvQefx1oMlmA76sbr1mLtB7ix+2FnnlyEDy/zazofyTWXz4vNhpYggM6hYOfz8nGPPwseDGszM692PC4xPpvSkWoC5QLV66Q47kYX365CD9fcLjGRKz9YKCHKACmvPSiwa6mptJJJPpraauxV/OTwGJhwfPswXyZONV8CIVxtPcgRTWlkGhiyvlOa9cfZ4BExBxb25bqV7n/zWytrl0705uusGn+OSVuNKMx0ZQRT+ZGFmk6ViDhPF1SWpqWGLQpTi0sKMJicFmB/REUa4lgxRCgczuSxWRciB3BKu0TCdFH29mN1k6zXkgVrCX5ptmKSWududVUTIg6IKARcVQRRUOctm8r1aAHYqgi7DBIXq90x18jSnCSiOEEQV43bxcoZmv+uZsExF0GQU47JTmjoAv0JuOoYQokthCEKiSCkVxaHa1ynD8fEp5IfaYRVsg49sOa6mt/RBo9fx5U7Tn04e8MAAWQ+pmH0A2nP1piQJPpKkmxYA/yDNZK8CLKAkpKL3qGW2JCGApCkIKim30bbX7lmAuqHrNhuqKQlhJBVB4WQ7cUE554ENVAtdVteFKFJbBODfJK0vR0VgBLKaQjoSEf0xfZSwK60jYAUiU1yaNvL/tn8v9nhOEbCDYi3VBKOR8re4IyofA0tky0w2abkyjDgux7TZbzArCCExCEIhF6clJRWKOx7X3+5O1uxMO8rQQe4oPrbdtZUhMvWF4BpkuV5TizVRxtJrRxM1uzJDGKIs2/2e6hAchhCnZ3Q7Mv2Tj9zHghC10cOj+jBaufX9rCJUsXyJZIjjXNqjaYz8IW3gQaBeNacjQhC+Hja5X0GQAdrpexoET4WQnqHIAJ5Fi9LOJTG1wUAzsfcljVwJVcKxnPEZPGTFMhwcJF2mr3TMpuCKIFLl0vDwwhIRRCmGtsuXJ1NDET2RHsEz0TOumv6wSQcdvAy+uihOrZCuiueg7WpdEaZQ/BJotO8KkIrcJXhOHNWiU3IprIxbbindRDYIzgMxFJTuMt5zf6YejeUQnA+iGnKqzNnf80lpb17tOzg3fjBpx/T1zwm9WEuMRLYNzAa1KyfX7/qLa5W3ySZq7Nmwr5if1zP5PMmki9lyCUm8Gc3n8m5CJH2C2UJ6nYRgdkdry+oyxCB2DYKZoyo0vsutcj7nsSaWXybs6VkyxHE+LJWDOJOOg28GYiGI4cAvlnIlxkQZR8LeRYRJKmW/VPgYE5wG+1yuH6A3UfrwYw+5pBAFPfNUliACndyPmOfSgShL3tZUjfopcSas76OJXKovuVItYtIh+OYhXQRhaiWuvB4pFIJvA2JHXPbL3BEPQUQV3w5EhhD8EVcvhjLp49tCpeHWX+dOgyrUcvCtYdOQyim3GRiGyJ79eNqNa9ozxxJ6Flje5ILLvpzdhGDSbrjmlabrrSG6PtBM0234P2Wkp4TWfm4joGZk1CC47b+BlYSLX2EEqdkamI02ITOXi7jB7Yrj3kayaBDsDjwLX+PiQgjjq114PrrZwFl0jEBx7HBrYy8nSx7u1dDjwv/EcDFEkFqDq8Z0GRLY6va5wl8TO0ONmlpTCuYRb/Mnmt/dXEmP0zAUbmAQBxYJJJAQYumBuaCRhgMaQNzYhBAgQOxOHNtJ2uxJ07TpMp3CL8dJE7I6MVAQ8B1H0fTrW7734vq9cbdZlNws360icMSsbrpS8qVbkTwAKXjI5Ga5/j1WtLDLmLofSBaSOgERzALHNacdCeVpeaxkGRQaHclrqvFndCN2Tu4qydHbuQyVLIOornAoviz7sWt4mEBLnEyjQhCrZqvUePNMVzK1XU3aLKKbNFglHsBI17TDKH+Y8nf8Fi7ySEvVNq1BWqt7fEeFkIsIspwhAUPVKnBBUrAed2kurUFpZZ7LbfEaSJxMIIKHhBDFjIrP0+Dx2f9/skorc9qvHLYw8VWEJC5AWzIIFjBZWbBMUTJbXKSl/UrSxWkyO078OCe4YEWORzAAAAPHghV7HTHjRV6kXVzc2wojJpOxyeccCmTrI0xAjJlX5Y8gO6sNJeltk45fm7CYTI9UTibQssYawCABBj6yK0SlwJfZkks7/vg9SGC31qbLywShYIQxSEEMya66SHWY/RylcjZ5O9RY/pG54wTalhPOMMhAlLWEqmSlI5mRz8rm7fDcjnbIco8EeZm4U20GCpiNRAvWSoIvNmMg7FxJThKaRUWWddfiFLbIWQgEFIHx3Ilqz0mM6rhQkpOEEx9CRvIEiI+JZY8HAIMyCBhJFqxKoKsz6jM9X6F4vWS0SSrki1fJH9aYAIyVaa2loFLXyGUyuNeL8aw5ldcOJxN1OidEEEAVJHQRqtrFNRs9MNycxT06aCw8XIICkbWeCDPQBJwKXSWlp03R8nhzQnniaRMVR0I8LQEUFUJAMzCR6QPVLArEBrxOf1e91ago3UZBke2EhGDAAgFiENXCZd1gllvZGX9frMGB3VqCHH2AQRuwtlLtqouCevPSz874j91pipTOIFGn3oB0UMGaXE1pKNVr0edjvR7LQ2a7eyBl4opDQLAAWkGIplfSCEKH5R+K3WtVTXERbBc1aC7JDINuEMG0bViyp1rVlmu7+W+Hr0pcZHGNWoMkcqdLQIlwYQZ0tVylkSnKJSavCtc13t8vS75rtRjEUsWhgjHgBVG8o1JOW+64ROX+++LdlScls0xVxDKIrTrp6SI/sDD07ULwIqn0NnLtY+kOy637xfRpDlqIEFRN2RsAgn+QCxj6EkJ54JpFyb1/q3wn4eBaQd4aRAXGSYNcfakxiHQk0sKB+fEDDAoyd+3gQq+EN/2ciunWqCAaIq4pz/GsRIQfM010bSujohb6ub031fsrucyNAxVWOqPIVn1jrjBEno8LDkUYoVTlCn3LndrNqwf9722kCouiatOeVDfinIl5YD41wYSQ2p/AwpQ24Vuoz/0H9btO+xmVtQo3gprQcE3RG2oA4LTADeZat20IGA60er7jgeGoseAV3hb3Gy6YPupnoZIePCZHaqY+WWgg90xoGCuNgC4sJsZSw/XonSevvShv/vceNd2L208rpoNsRCPMDcxxfDOH5DwwWTpWJOkdAoeBp8ZCKJC637DirVVkZV3LeL/x6uKFfsJl7ATOWpe9cK7gWTlh8JBKOERfZExaq85CiiCVZZk0BhEYiYGa1qH+hV4jHryImcij+YCSIKThq+sRjCVXDQXcQmUx/bIpe0PS3GiSwWKSfO0XD1g3S5/uUSqGkLCoA2dHODCSB7OWdklW0UaLJgCz8kswKJe9p8zBmN0nz8XxIcCYUUqW6cFgpIeEbZSBDtGmYOkCs6UC3lh8/qTlqvi7A1H3BGa1N9JiH5lLzKYS+hBuiripARaEpS4evOu14NmevgSYQUUQ057ZdjzA5DJbmWhDxQ4G7FQb6XvP2m+s7+sjAJhUvmYNhyG0UDmyUioukwqmVPY75mlP3GFTAdu0yuJO55Db7uPbTDWfbC9Wjj/e5Zn5EMCvZdBY6sogOvPxqMeBt6ePs3ox1+bQFcFwrY2uGAAzmJx6+4vzQbnaAgJaPKR/ZaltPh/EiUunGR+yqUFfZYBbu+pQ+gKRbRksvvxTUzRemu2CydK1OSozXrkWrcwM0ymnzmxlwi40ZE/D3f2KcdjQr3BM2PHPHWKgaZU2hPGYwnAinTvc0jQmf29beyybxvyXZ1R/y+TuztVj//o8czLlffYvmfKmuLG92feH/89GgL9pT8Jme8R58JPItkf8DTs1jp+6efLY/7lp5Gf3r3xi7F/581tpzjA884d39Vxh7erZ9gajuy/ZG4xe8mww2v5ep7OXT13f2aG1f+fiH9jrxL/t6uSJ3n+Cb9Ny4uhyAc6lAAAAAElFTkSuQmCC';

exports.getIdCardPic = () => 'data:image/png;base64,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';

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

exports.removeUserInfo = () => {
  Cookie.delete('meiyou_mp_avatar', { domain: '.meiyou.com' });
  Cookie.delete('meiyou_mp_name', { domain: '.meiyou.com' });
  Cookie.delete('meiyou_mp_type', { domain: '.meiyou.com' });
  Cookie.delete('meiyou_mp_verified', { domain: '.meiyou.com' });
  Cookie.delete('meiyou_mp_status', { domain: '.meiyou.com' });
  Cookie.delete('meiyou_mp_phone', { domain: '.meiyou.com' });
};

exports.getUserAvatar = () => Cookie.get('meiyou_mp_avatar') || getAvatar();

exports.getUserName = () => Cookie.get('meiyou_mp_name') || '';

exports.getUserVerified = () => Cookie.get('meiyou_mp_verified') || '';

exports.getUserType = () => +Cookie.get('meiyou_mp_type') || 1;

exports.getUserStatus = () => +Cookie.get('meiyou_mp_status') || 0;

exports.getUserPhone = () => Cookie.get('meiyou_mp_phone') || '';

exports.getAvatar = getAvatar;
exports.getSSOAddr = getSSOAddr;
exports.getMPAddr = getMPAddr;
