import $ from 'jquery';
// import _ from '../util/tools';

const mpHost = process.env.DEBUG_MODE ? '' : '/';

const API_URL = {
  category: `${mpHost}category`,
  news: `${mpHost}news`,
  newstemp: `${mpHost}newstemp`,
  newsdetail: `${mpHost}newsdetail`,
  newsAction: `${mpHost}newsaction`,
  userApply: `${mpHost}userapply`,
  setting: `${mpHost}setting`,
  forgot: `${mpHost}forgetpassword`,
  exit: `${mpHost}exit`,
  userInfo: `${mpHost}user`,
  unread: `${mpHost}unread`,
  comment: `${mpHost}comment`,
  friendship: `${mpHost}friendship`,
  announce: `${mpHost}announce`,
  analysis: `${mpHost}analysis`,
  notify: `${mpHost}notify`,
  operationlog: `${mpHost}operationlog`
};

$.ajaxSetup({
  dataType: 'json',
  cache: false
});

/**
 * 获取操作日志列表
 * @param {int} page  页数
 * @return {promise}   返回json信息
 */
const fetchOperationlogList = (page = 1) => new Promise((resolve, reject) => {
  $.ajax({
    url: API_URL.operationlog,
    type: 'GET',
    data: {
      page: parseInt(page, 10)
    }
  }).done(res => {
    resolve(res);
  }).fail(err => {
    reject(err);
  });
});

/**
 * 获取消息列表
 * @param {int}    page  页数
 * @param {string} type  消息类型 0:全部 1:系统通知 2:关注 3:收藏 4:转发
 * @return {promise}     返回json信息
 */
const fetchNotifyList = (page = 1, type = 0) => new Promise((resolve, reject) => {
  $.ajax({
    url: API_URL.notify,
    type: 'GET',
    data: {
      page: page,
      type: type
    }
  }).done(res => {
    resolve(res);
  }).fail(err => {
    reject(err);
  });
});

/**
 * 获取主页统计数据
 * @return {promise}   返回json信息
 */
const fetchHomeAnalysis = () => {
  const d = new $.Deferred();
  const data = '{"code":0,"data":{"total_fans_count":0,"total_view_count":3534,"total_visitor_count":0,"total_news_count":83},"message":""}';
  d.resolve(data);
  return d.promise();
};

/**
 * 获取文章、用户、粉丝分析数据
 * @param {String} action  article：文章分析，user：用户分析，粉丝分析待确认
 * @param {String} startDate  起始时间
 * @param {String} endDate  截止时间
 * @return {promise}   返回json信息
 */
const fetchAnalysisByAction = data => {
  const d = new $.Deferred();
  $.ajax({
    url: API_URL.analysis,
    type: 'GET',
    data
  }).done(res => {
    if (res.code === 0) {
      return d.resolve(res.data);
    }
    return d.reject(res);
  }).fail(err => {
    d.reject(err);
  });
  return d.promise();
};

/**
 * 获取公告列表
 * @param {int} page  页数
 * @return {promise}   返回json信息
 */
const fetchAnnouceList = () => {
  const d = new $.Deferred();
  const data = {
    page_info: {
      page: 1,
      total_number: 2,
      total_page: 1,
      page_size: 20
    },
    data: [{
      id: 1,
      title: '\u7f8e\u67da\u53f7\u4e0a\u7ebf',
      updated_at: 1485243773
    }, {
      id: 4,
      title: '\u516c\u544a\u6d4b\u8bd5\uff5e\uff5e\uff5e\uff5e\uff5e\uff5e\uff5e',
      updated_at: 1485243852
    }]
  };
  d.resolve(data);
  return d.promise();
};

/**
 * 获取公告详情
 * @param {int} id  公告id
 * @return {promise}   返回json信息
 */
const fetchAnnouceDetail = (id = 1) => new Promise((resolve, reject) => {
  $.ajax({
    url: API_URL.announce,
    type: 'GET',
    data: {
      id: parseInt(id, 10),
      action: 'detail'
    }
  }).done(res => {
    resolve(res);
  }).fail(err => {
    reject(err);
  });
});

/**
 * 获取评论列表
 * @param {int} page  页数
 * @return {promise}   返回json信息
 */
const fetchCommentList = (page = 1) => new Promise((resolve, reject) => {
  $.ajax({
    url: API_URL.comment,
    type: 'GET',
    data: {
      page: page
    }
  }).done(res => {
    resolve(res);
  }).fail(err => {
    reject(err);
  });
});

/**
 * 评论点赞和取消点赞接口
 * @param {int} action  4点赞,5取消点赞
 * @param {int} id  评论id
 * @return {promise}   返回json信息
 */
const setCommentUpAndCancel = (id, action) => new Promise((resolve, reject) => {
  $.ajax({
    url: API_URL.comment,
    type: 'POST',
    data: {
      id: id,
      action: action
    }
  }).done(res => {
    resolve(res);
  }).fail(err => {
    reject(err);
  });
});

/**
 * 评论举报接口
 * @param {int} id  评论id
 * @param {int} reasonId  举报理由id
 * @return {promise}   返回json信息
 */
const setCommentReport = (id, reasonId) => new Promise((resolve, reject) => {
  $.ajax({
    url: API_URL.comment,
    type: 'POST',
    data: {
      action: 2,
      id: id,
      reason_id: reasonId
    }
  }).done(res => {
    resolve(res);
  }).fail(err => {
    reject(err);
  });
});

/**
 * 评论回复接口
 * @param {int} id  评论id
 * @param {int} content  评论内容
 * @return {promise}   返回json信息
 */
const setCommentReplay = (id, content) => new Promise((resolve, reject) => {
  $.ajax({
    url: API_URL.comment,
    type: 'POST',
    data: {
      action: 3,
      id: id,
      content: content
    }
  }).done(res => {
    resolve(res);
  }).fail(err => {
    reject(err);
  });
});

/**
 * 获取粉丝列表
 * @param  {int} page  页数
 * @param  {String} startDate  起始时间
 * @param  {String} endDate  截止时间
 * @return {promise}   返回json信息
 */
const fetchFriendshipList = (page = 1, startDate, endDate) => new Promise((resolve, reject) => {
  $.ajax({
    url: API_URL.friendship,
    type: 'GET',
    data: {
      page: page,
      start_date: startDate,
      end_date: endDate
    }
  }).done(res => {
    resolve(res);
  }).fail(err => {
    reject(err);
  });
});

/**
 * 操作粉丝信息
 * @param  {String} action  add_follows(添加关注),cancel_follows(取消关注),add_blacklist(加入黑名单),cancel_blacklist(取消分享)
 * @param  {int} fuid  粉丝id
 * @param  {String} screenName  粉丝昵称
 * @return {promise}   返回json信息
 */
const setFriendshipInfo = (action, fuid, screenName) => new Promise((resolve, reject) => {
  $.ajax({
    url: API_URL.friendship,
    type: 'POST',
    data: {
      action: action,
      fuid: fuid,
      screen_name: screenName
    }
  }).done(res => {
    resolve(res);
  }).fail(err => {
    reject(err);
  });
});

/**
 * 获取文章分类列表
 * @return {promise}   返回json信息
 */
const fetchArticleCategory = () => {
  const d = new $.Deferred();
  $.ajax({
    url: API_URL.category,
    type: 'GET'
  }).done(res => {
    if (res.code === 0) {
      return d.resolve(res.data);
    }
    return d.reject(res);
  }).fail(err => {
    console.log('异常 ' + err);
    return d.reject(err);
  });
  return d.promise();
};

/**
 * 获取文章列表
 * @param  {int} type      0全部,2图文,3视频,4图集
 * @param  {int} status    0全部,1已发表,2未通过,3草稿,已撤回
 * @param  {int} page      当前页数
 * @return {promise}       返回json信息
 */
const fetchArticleList = (type = 0, status = 0, page = 1) => new Promise((resolve, reject) => {
  $.ajax({
    url: API_URL.news,
    type: 'GET',
    data: {
      type: type,
      status: status,
      page: page
    }
  }).done(res => {
    resolve(res);
  }).fail(err => {
    reject(err);
  });
});

/**
 * 获取文章详细页
 * @param  {int} id     文章id
 * @return {promise}       返回json信息
 */
const fetchArticleDetail = id => {
  const d = new $.Deferred();
  $.ajax({
    url: `${API_URL.newsdetail}?id=${id}`,
    type: 'GET'
  }).done(res => {
    if (res.code === 0) {
      return d.resolve(res);
    }
    return d.reject(res);
  }).fail(err => d.reject(err));
  return d.promise();
};

/**
 * 添加更新文章
 * @param  {int} _type     2图文,3图集,4视频
 * @param  {object} obj    数据
 * @return {promise}       返回json信息
 */
const saveUpdateArticle = data => {
  // console.log(data);
  const d = new $.Deferred();
  $.ajax({
    url: API_URL.news,
    type: 'POST',
    data: data
  }).done(res => {
    if (res.code === 0) {
      return d.resolve(res);
    }
    return d.reject(res);
  }).fail(err => d.reject(err));
  return d.promise();
};

/**
 * 文章操作
 * @param  {string} action 操作类型 - delete:删除,news_up:上架,news_down:下架,set_top:置顶,unset_top:取消置顶
 * @param  {int}    id     文章编号
 * @return {promise}       返回json信息
 */
const handleArticle = (action, id) => new Promise((resolve, reject) => {
  $.ajax({
    url: API_URL.newsAction,
    type: 'POST',
    data: {
      action: action,
      id: id
    }
  }).done(res => {
    resolve(res);
  }).fail(err => {
    reject(err);
  });
});

/**
 * 账号设置
 * @param  {int}    step              步骤 - 1填写个人基本资料身份证
 * @param  {string} realname          姓名
 * @param  {string} idcard            身份证
 * @param  {string} idcard_image      身份证图片
 * @param  {string} email             邮箱
 * @param  {int}    aux_material      辅助材料
 * @param  {int}    credential_image  专业资质 数组形式
 * @return {promise}                  返回json信息
 *
 * @param  {int}    step              步骤 - 2填写美柚号信息
 * @param  {string} name              美柚号名称
 * @param  {string} avatar            头像地址
 * @param  {string} description       美柚号内容描述
 * @param  {int}    city_id           城市id
 * @param  {int}    province_id       省份id
 * @param  {int}    category_id       领域id
 * @return {promise}                  返回json信息
 */
const settingUser = obj => new Promise((resolve, reject) => {
  $.ajax({
    url: API_URL.userApply,
    type: 'POST',
    data: obj
  }).done(res => {
    resolve(res);
  }).fail(err => {
    reject(err);
  });
});

/**
  obj参数属性：
  type 是 int 2图文混排, 3纯图片, 4纯视频
  title 是 string  文章标题
  content 是 string  文章内容(type=2)
  thumbs  是 array 缩略图 (数组 array)（type=2,3）thumbs[0][src]:缩略图图片地址
  images  是 array 文章中所有图片(数组 array)（type=2,3）images[0][src]:图片地址,images[0][remark]:图片备注
  video 是 array 图片(数组 array)（type=4）格式 （video[time]:视频时长,video[thumb]:缩略图,video[url]:视频地址）
  category_id 是 int 分类id
  multi_video 否 array 图文文章中上传的视频(数组) 格式（multi_video[0][time]:视频时长,multi_video[0][thumb]:缩略图,multi_video[0][url]:视频地址）
 * @return {promise}  返回json信息
 */
const articleAutoSave = obj => new Promise((resolve, reject) => {
  $.ajax({
    url: API_URL.newstemp,
    type: 'POST',
    data: obj
  }).done(res => {
    resolve(res);
  }).fail(err => {
    reject(err);
  });
});

/**
 * 获取自动保存文章数据
 * @param {int} type  2图文混排, 3纯图片, 4纯视频
 * @return {promise}   返回json信息
 */
const featchAutoSaveByType = type => new Promise((resolve, reject) => {
  $.ajax({
    url: API_URL.newstemp,
    type: 'GET',
    data: {
      type: type
    }
  }).done(res => {
    resolve(res);
  }).fail(err => {
    reject(err);
  });
});

/**
 * 获取账号信息
 * @param  {int} step    步骤 - 1填写个人基本资料身份证,2填写美柚号信息
 * @return {promise}     返回json信息
 */
const fetchAccountInfo = step => new Promise((resolve, reject) => {
  $.ajax({
    url: `${API_URL.setting}?step=${step}`,
    type: 'GET'
  }).done(res => {
    resolve(res);
  }).fail(err => {
    reject(err);
  });
});

/**
 * 设置账号信息
 * @return {promise}     返回json信息
 */
const setAccountInfo = obj => new Promise((resolve, reject) => {
  $.ajax({
    url: API_URL.setting,
    type: 'POST',
    data: obj
  }).done(res => {
    resolve(res);
  }).fail(err => {
    reject(err);
  });
});

/**
 * 获取入驻申请信息
 * @param  {int} step    1代表第一步提交信息,2下发领域
 * @return {promise}     返回json信息
 */
const fetchApplyInfo = step => new Promise((resolve, reject) => {
  $.ajax({
    url: `${API_URL.userApply}?step=${step}`,
    type: 'GET'
  }).done(res => {
    resolve(res);
  }).fail(err => {
    reject(err);
  });
});

/**
 * 退出登录
 * @param  {null}     无
 * @return {promise}  返回json信息
 */
const exitLogin = () => new Promise((resolve, reject) => {
  $.ajax({
    url: API_URL.exit,
    type: 'GET'
  }).done(res => {
    resolve(res);
  }).fail(err => {
    reject(err);
  });
});

/**
 * 返回jsonp请求
 * @param  {string}    url  url地址
 * @return {promise}        返回promise
 */
const helloJsonp = url => $.ajax({
  url: url,
  dataType: 'jsonp',
  jsonp: 'callback',
  async: false,
  type: 'GET'
});

// /**
//  * 同步退出
//  * @return {promise} 返回的json信息
//  */
// const helloService = () => new Promise((resolve, reject) => {
//   $.ajax({
//     url: API_URL.helloService,
//     dataType: 'jsonp',
//     jsonp: 'callback',
//     async: false,
//     type: 'GET'
//   }).done(res => {
//     resolve(res);
//   }).fail(err => {
//     reject(err);
//   });
// });

// /**
//  * 同步退出
//  * @return {promise} 返回的json信息
//  */
// const helloServiceExit = () => new Promise((resolve, reject) => {
//   $.ajax({
//     url: `${API_URL.helloService}?type=exit`,
//     dataType: 'jsonp',
//     jsonp: 'callback',
//     async: false,
//     type: 'GET'
//   }).done(res => {
//     resolve(res);
//   }).fail(err => {
//     reject(err);
//   });
// });

/**
 * 获取用户信息
 * @return {promise}   返回json信息
 */
const fetchUserInfo = () => new Promise((resolve, reject) => {
  $.ajax({
    url: API_URL.userInfo,
    type: 'GET'
  }).done(res => {
    resolve(res);
  }).fail(err => {
    reject(err);
  });
});

/**
 * 获取未读通知信息
 * @return {promise}   返回json信息
 */
const fetchUnreadInfo = () => new Promise((resolve, reject) => {
  $.ajax({
    url: API_URL.unread,
    type: 'GET'
  }).done(res => {
    resolve(res);
  }).fail(err => {
    reject(err);
  });
});

/**
 * 重置未读通知
 * @param  {string}  type  system:系统, comment:评论 follow:关注 repeat:转发 favour:收藏
 * @return {promise}       返回json信息
 */
const resetUnreadInfo = type => new Promise((resolve, reject) => {
  $.ajax({
    url: API_URL.unread,
    type: 'POST',
    data: {
      type: type
    }
  }).done(res => {
    resolve(res);
  }).fail(err => {
    reject(err);
  });
});

/**
 * 身份信息验证
 * @param  {string} acton  验证类型 mobile: 手机更换绑定 password: 忘记密码
 * @param  {object} obj    身份信息
 * @return {promise}       返回json信息
 */
const submitValidateNo = obj => new Promise((resolve, reject) => {
  $.ajax({
    url: API_URL.forgot,
    type: 'POST',
    data: {
      action: obj.action,
      realname: obj.name,
      idcard: obj.number.toUpperCase()
    }
  }).done(res => {
    resolve(res);
  }).fail(err => {
    reject(err);
  });
});

const getRemoteArticleCategory = () => {
  const articlesType = localStorage.getItem('articles_type');
  if (articlesType) {
    const aString = JSON.parse(articlesType);
    return aString;
  }
  return fetchArticleCategory().then(result => result);
};

/**
 * 初始化方法
 */
const init = () => {
  fetchArticleCategory().then(result => {
    const articlesType = JSON.stringify(result);
    localStorage.setItem('articles_type', articlesType);
    console.log('初始化文章类型成功：');
  }, err => {
    console.log('初始化文章类型失败：' + err.message);
  });
};

module.exports = {
  init,
  // 获取本地文章分类列表
  getRemoteArticleCategory,
  // 获取文章分类列表
  fetchArticleCategory,
  // 获取文章列表
  fetchArticleList,
  // 获取文章详情
  fetchArticleDetail,
  // 保存或更新文章
  saveUpdateArticle,
  // 文章操作，包含:删除,上架,下架,置顶,取消置顶
  handleArticle,
  // 自动保存文章
  articleAutoSave,
  // 设置入驻和账号信息
  settingUser,
  // 获取账号信息
  fetchAccountInfo,
  // 获取入驻信息
  fetchApplyInfo,
  // 身份信息验证
  submitValidateNo,
  // 退出登录
  exitLogin,
  // 返回jsonp
  helloJsonp,
  // 同步退出
  // helloService,
  // 同步退出
  // helloServiceExit,
  // 获取用户信息
  fetchUserInfo,
  // 设置用户信息
  setAccountInfo,
  // 获取未读通知信息
  fetchUnreadInfo,
  // 重置未读通知
  resetUnreadInfo,
  // 获取评论列表
  fetchCommentList,
  // 评论点赞和取消点赞
  setCommentUpAndCancel,
  // 举报评论
  setCommentReport,
  // 回复评论
  setCommentReplay,
  // 获取粉丝列表
  fetchFriendshipList,
  // 设置粉丝信息，包含:添加关注，取消关注,加入黑名单，取消分享
  setFriendshipInfo,
  // 获取公告列表
  fetchAnnouceList,
  // 获取公告详情页
  fetchAnnouceDetail,
  // 通过action获取文章分析、用户分析、粉丝分析
  fetchAnalysisByAction,
  // 获取主页统计数据
  fetchHomeAnalysis,
  // 获取消息列表
  fetchNotifyList,
  // 获取操作日志列表
  fetchOperationlogList,
  // 获取自动保存文章数据
  featchAutoSaveByType
};
