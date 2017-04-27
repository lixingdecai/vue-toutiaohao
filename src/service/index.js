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
const fetchOperationlogList = () => {
  const d = new $.Deferred();
  let data = '{"code":0,"data":{"page_info":{"page":1,"total_number":31,"total_page":2,"page_size":20},"data":{"user_id":132888843,"list":[{"uid":132888843,"action":2,"ip":"61.131.73.36","operation_time":"2017-04-16 09:28:03","title":"编辑图文(【视频】白百合出轨，他出来道歉了)"}]}},"message":""}';
  data = JSON.parse(data);
  d.resolve(data);
  return d.promise();
};

/**
 * 获取消息列表
 * @param {int}    page  页数
 * @param {string} type  消息类型 0:全部 1:系统通知 2:关注 3:收藏 4:转发
 * @return {promise}     返回json信息
 */
const fetchNotifyList = () => {
  const d = new $.Deferred();
  let data = '{"code":0,"data":{"page_info":{"page":1,"total_number":6,"total_page":1,"page_size":20},"data":[{"content":"您的视频《视频测试11》因被举报已被管理员下线，请修改后重新上传！","notifyType":1,"redirect_type":0,"target_id":1563935,"actionTime":1492766279,"news_type":0},{"content":"您的图文《阿斯顿发斯蒂芬》因被举报(其他)已被下线，如有问题可联系美柚客服处理","notifyType":1,"redirect_type":3,"target_id":1563482,"actionTime":1487244183,"news_type":2},{"content":"亲爱的李姓的菜作者，恭喜您通过李姓的菜账号审核，成为李姓的菜的作者，您每天可以发布5篇文章/视频/图集，现在就开始创作吧。","notifyType":1,"redirect_type":0,"target_id":0,"actionTime":1487126633,"news_type":0},{"content":"亲爱的李姓的菜作者，恭喜您通过李姓的菜账号审核，成为李姓的菜的作者，您每天可以发布5篇文章/视频/图集，现在就开始创作吧。","notifyType":1,"redirect_type":0,"target_id":0,"actionTime":1486691467,"news_type":0},{"content":"亲爱的李姓的菜作者，恭喜您通过李姓的菜账号审核，成为李姓的菜的作者，您每天可以发布5篇文章/视频/图集，现在就开始创作吧。","notifyType":1,"redirect_type":0,"target_id":0,"actionTime":1486451940,"news_type":0},{"content":"亲爱的李姓的菜作者，恭喜您通过李姓的菜账号审核，成为李姓的菜的作者，您每天可以发布5篇文章/视频/图集，现在就开始创作吧。","notifyType":1,"redirect_type":0,"target_id":0,"actionTime":1486363021,"news_type":0}]},"message":""}';
  data = JSON.parse(data);
  d.resolve(data);
  return d.promise();
};

/**
 * 获取主页统计数据
 * @return {promise}   返回json信息
 */
const fetchHomeAnalysis = () => {
  const d = new $.Deferred();
  let data = '{"code":0,"data":{"total_fans_count":0,"total_view_count":3534,"total_visitor_count":0,"total_news_count":83},"message":""}';
  data = JSON.parse(data);
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
  let result = '';
  if (data.action === 'article') result = '{"code":0,"data":{"total_view_count":244,"total_share_count":1,"total_collect_count":0,"total_comment_count":0,"total_visitor_count":0,"total_fans_count":0,"total_show_count":109,"total_news_count":0,"yesterday_visitor_count":0,"yesterday_fans_count":0,"list":{"stats_date":["2017-04-19","2017-04-20","2017-04-21","2017-04-22","2017-04-23","2017-04-24","2017-04-25"],"view_count":[27,60,48,39,23,19,28],"share_count":[0,0,0,1,0,0,0],"collect_count":[0,0,0,0,0,0,0],"comment_count":[0,0,0,0,0,0,0],"show_count":[108,1,0,0,0,0,0],"news_count":[0,0,0,0,0,0,0]}},"message":""}';
  else if (data.action === 'user') result = '{"code":0,"data":{"total_view_count":0,"total_share_count":0,"total_collect_count":0,"total_comment_count":0,"total_visitor_count":3232,"total_fans_count":4132,"total_show_count":0,"total_news_count":0,"yesterday_visitor_count":12,"yesterday_fans_count":90,"list":{"stats_date":["2017-04-19","2017-04-20","2017-04-21","2017-04-22","2017-04-23","2017-04-24","2017-04-25"],"visitor_count":[20,49,37,22,12,11,12],"fans_count":[68,72,63,84,54,64,90]}},"message":""}';
  result = JSON.parse(result);
  d.resolve(result.data);
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
const fetchAnnouceDetail = () => {
  const d = new $.Deferred();
  let data = '{"code":0,"data":{"id":1,"title":"李姓的菜上线","updated_at":"2017-02-07 15:32:37","content":"李姓的菜上线李姓的菜上线李姓的菜上线李姓的菜上线李姓的菜上线李姓的菜上线李姓的菜上线"},"message":""}';
  data = JSON.parse(data);
  d.reject(data);
  return d.promise();
};

/**
 * 获取评论列表
 * @param {int} page  页数
 * @return {promise}   返回json信息
 */
const fetchCommentList = () => {
  const d = new $.Deferred();
  let data = '{"code":0,"data":{"page_info":{"page":1,"total_number":5,"total_page":1,"page_size":20},"data":[{"id":100117,"news_id":1574770,"content":"共和国","user_id":107993425,"user_screen_name":"原始昵称过后","news_user_id":105038491,"created_at":1490950806,"review_num":0,"praise_num":0,"avatar":"","title":"良心更新！各代iPhone升级iOS10.3速度体验获好评","is_fans":0,"is_praise":0,"type":4},{"id":68655,"news_id":1563933,"content":"啊","user_id":105028513,"user_screen_name":"my-shenfh","news_user_id":105038491,"created_at":1489981739,"review_num":0,"praise_num":0,"avatar":"https://sc.seeyouyima.com/avatar_105028513","title":"视频测试1视频测试1视频测试1视频测试1视频测试1视频测试1视频测试1视频测试1视频测试1视频测试1视频测试1","is_fans":0,"is_praise":0,"type":4},{"id":68632,"news_id":1563935,"content":"啊","user_id":98786262,"user_screen_name":"新伟1022","news_user_id":105038491,"created_at":1489752238,"review_num":"1","praise_num":0,"avatar":"https://sc.seeyouyima.com/avatar_98786262","title":"视频测试11","is_fans":0,"is_praise":0,"type":4},{"id":68630,"news_id":1563935,"content":"A","user_id":105028513,"user_screen_name":"my-shenfh","news_user_id":105038491,"created_at":1489752097,"review_num":"1","praise_num":0,"avatar":"https://sc.seeyouyima.com/avatar_105028513","title":"视频测试11","is_fans":0,"is_praise":0,"type":4},{"id":68620,"news_id":1563933,"content":"1","user_id":98786262,"user_screen_name":"新伟1022","news_user_id":105038491,"created_at":1489745273,"review_num":0,"praise_num":0,"avatar":"https://sc.seeyouyima.com/avatar_98786262","title":"视频测试1视频测试1视频测试1视频测试1视频测试1视频测试1视频测试1视频测试1视频测试1视频测试1视频测试1","is_fans":0,"is_praise":0,"type":4}]},"message":""}';
  data = JSON.parse(data);
  d.reject(data);
  return d.promise();
};

/**
 * 评论点赞和取消点赞接口
 * @param {int} action  4点赞,5取消点赞
 * @param {int} id  评论id
 * @return {promise}   返回json信息
 */
const setCommentUpAndCancel = () => {
  const d = new $.Deferred();
  let data = '{"code":220,"data":{},"message":"当然赞接失败了，自己去写接口"}';
  data = JSON.parse(data);
  d.reject(data);
  return d.promise();
};

/**
 * 评论举报接口
 * @param {int} id  评论id
 * @param {int} reasonId  举报理由id
 * @return {promise}   返回json信息
 */
const setCommentReport = () => {
  const d = new $.Deferred();
  let data = '{"code":220,"data":{},"message":"当然举报失败了，自己去写接口"}';
  data = JSON.parse(data);
  d.reject(data);
  return d.promise();
};

/**
 * 评论回复接口
 * @param {int} id  评论id
 * @param {int} content  评论内容
 * @return {promise}   返回json信息
 */
const setCommentReplay = () => {
  const d = new $.Deferred();
  let data = '{"code":220,"data":{},"message":"当然评论失败了,自己去写接口"}';
  data = JSON.parse(data);
  d.reject(data);
  return d.promise();
};

/**
 * 获取粉丝列表
 * @param  {int} page  页数
 * @param  {String} startDate  起始时间
 * @param  {String} endDate  截止时间
 * @return {promise}   返回json信息
 */
const fetchFriendshipList = () => {
  const d = new $.Deferred();
  let data = '{"code":0,"data":{"page_info":{"page":1,"total_number":2,"total_page":1,"page_size":20},"data":[{"id":107992262,"avatar":"https://sc.seeyouyima.com/avatar_107992262","screen_name":"小熊啊l lo lo","location":"厦门","mode":3,"isvip":0,"type":2,"status_code":0,"created_at":1487249214,"relation":2}]},"message":""}';
  data = JSON.parse(data);
  d.reject(data);
  return d.promise();
};

/**
 * 操作粉丝信息
 * @param  {String} action  add_follows(添加关注),cancel_follows(取消关注),add_blacklist(加入黑名单),cancel_blacklist(取消分享)
 * @param  {int} fuid  粉丝id
 * @param  {String} screenName  粉丝昵称
 * @return {promise}   返回json信息
 */
const setFriendshipInfo = () => {
  const d = new $.Deferred();
  let data = '{"code":220,"data":{},"message":"当然操作失败了,自己去写接口"}';
  data = JSON.parse(data);
  d.reject(data);
  return d.promise();
};

/**
 * 获取文章分类列表
 * @return {promise}   返回json信息
 */
const fetchArticleCategory = () => {
  const d = new $.Deferred();
  let data = '{"code":0,"data":[{"id":1,"tag_name":"娱乐八卦","alias":"娱乐","survival_days":3,"create_user_id":0,"status":1,"is_delete":0,"create_time":"2016-12-15 17:44:13","update_time":"2017-01-04 16:51:14"},{"id":2,"tag_name":"搞笑段子","alias":"搞笑","survival_days":7,"create_user_id":0,"status":1,"is_delete":0,"create_time":"2016-12-15 17:44:13","update_time":"2017-01-04 16:51:13"},{"id":3,"tag_name":"健康养生","alias":"健康,养生","survival_days":7,"create_user_id":0,"status":1,"is_delete":0,"create_time":"2016-12-15 17:44:13","update_time":"2017-01-04 16:51:13"},{"id":4,"tag_name":"家居生活","alias":"家居,生活","survival_days":7,"create_user_id":0,"status":1,"is_delete":0,"create_time":"2016-12-15 17:44:13","update_time":"2017-01-04 16:51:13"},{"id":5,"tag_name":"旅游摄影","alias":"旅游,旅行","survival_days":7,"create_user_id":0,"status":1,"is_delete":0,"create_time":"2016-12-15 17:44:13","update_time":"2017-01-04 16:51:13"},{"id":6,"tag_name":"轻体塑身","alias":"美体塑形","survival_days":7,"create_user_id":0,"status":1,"is_delete":0,"create_time":"2016-12-15 17:44:13","update_time":"2017-01-04 16:51:13"},{"id":7,"tag_name":"美食指南","alias":"美食","survival_days":7,"create_user_id":0,"status":1,"is_delete":0,"create_time":"2016-12-15 17:44:13","update_time":"2017-01-04 16:51:13"},{"id":8,"tag_name":"彩妆护肤","alias":"彩妆","survival_days":7,"create_user_id":0,"status":1,"is_delete":0,"create_time":"2016-12-15 17:44:13","update_time":"2017-01-04 16:51:13"},{"id":9,"tag_name":"两性情感","alias":"情感,两性","survival_days":7,"create_user_id":0,"status":1,"is_delete":0,"create_time":"2016-12-15 17:44:13","update_time":"2017-01-04 16:51:13"},{"id":10,"tag_name":"星座占卜","alias":"星座","survival_days":7,"create_user_id":0,"status":1,"is_delete":0,"create_time":"2016-12-15 17:44:13","update_time":"2017-01-04 16:51:13"},{"id":11,"tag_name":"人文历史","alias":"美文,文化,历史,文学,小说,人文","survival_days":7,"create_user_id":0,"status":1,"is_delete":0,"create_time":"2016-12-15 17:44:13","update_time":"2017-01-04 16:51:13"},{"id":12,"tag_name":"女性身份","alias":"育儿","survival_days":7,"create_user_id":0,"status":1,"is_delete":0,"create_time":"2016-12-15 17:44:13","update_time":"2017-01-04 16:51:13"},{"id":13,"tag_name":"动漫天地","alias":"动漫","survival_days":7,"create_user_id":0,"status":1,"is_delete":0,"create_time":"2016-12-15 17:44:13","update_time":"2017-01-04 16:51:13"},{"id":14,"tag_name":"游戏世界","alias":"游戏","survival_days":7,"create_user_id":0,"status":1,"is_delete":0,"create_time":"2016-12-15 17:44:13","update_time":"2017-01-04 16:51:13"},{"id":15,"tag_name":"时尚穿搭","alias":"时尚","survival_days":7,"create_user_id":0,"status":1,"is_delete":0,"create_time":"2016-12-15 17:44:13","update_time":"2017-01-04 16:51:13"},{"id":16,"tag_name":"教育资讯","alias":"教育","survival_days":7,"create_user_id":0,"status":1,"is_delete":0,"create_time":"2016-12-15 17:44:13","update_time":"2017-01-04 16:51:13"},{"id":17,"tag_name":"奇闻轶事","alias":"故事","survival_days":7,"create_user_id":0,"status":1,"is_delete":0,"create_time":"2016-12-15 17:44:13","update_time":"2017-01-04 16:51:13"},{"id":18,"tag_name":"数码科技","alias":"科技,数码","survival_days":7,"create_user_id":0,"status":1,"is_delete":0,"create_time":"2016-12-15 17:44:13","update_time":"2017-01-04 16:51:13"},{"id":19,"tag_name":"投资理财","alias":"财经","survival_days":7,"create_user_id":0,"status":1,"is_delete":0,"create_time":"2016-12-15 17:44:13","update_time":"2017-01-04 16:51:13"},{"id":20,"tag_name":"学习工作","alias":"","survival_days":7,"create_user_id":0,"status":1,"is_delete":0,"create_time":"2016-12-15 17:44:13","update_time":"2017-01-04 16:51:13"},{"id":21,"tag_name":"汽车频道","alias":"汽车","survival_days":7,"create_user_id":0,"status":1,"is_delete":0,"create_time":"2016-12-15 17:44:13","update_time":"2017-01-04 16:51:13"},{"id":22,"tag_name":"房产楼市","alias":"房产","survival_days":7,"create_user_id":0,"status":1,"is_delete":0,"create_time":"2016-12-15 17:44:13","update_time":"2017-01-04 16:51:13"},{"id":23,"tag_name":"新闻时事","alias":"社会,国际,头条新闻,国内,军事","survival_days":7,"create_user_id":0,"status":1,"is_delete":0,"create_time":"2016-12-15 17:44:13","update_time":"2017-01-04 16:51:13"},{"id":24,"tag_name":"体育休闲","alias":"体育,滑雪","survival_days":7,"create_user_id":0,"status":1,"is_delete":0,"create_time":"2016-12-15 17:44:13","update_time":"2017-01-04 16:51:13"},{"id":25,"tag_name":"科普频道","alias":"天文,地理,自然","survival_days":7,"create_user_id":0,"status":1,"is_delete":0,"create_time":"2016-12-15 17:44:13","update_time":"2017-01-04 16:51:13"}],"message":""}';
  data = JSON.parse(data);
  d.resolve(data);
  return d.promise();
};

/**
 * 获取文章列表
 * @param  {int} type      0全部,2图文,3视频,4图集
 * @param  {int} status    0全部,1已发表,2未通过,3草稿,已撤回
 * @param  {int} page      当前页数
 * @return {promise}       返回json信息
 */
const fetchArticleList = () => {
  const d = new $.Deferred();
  let data = '{"code":0,"data":{"page_info":{"page":1,"total_number":177,"total_page":9,"page_size":20},"data":[{"id":1585864,"title":"asdasdfasd","created_at":1493108517,"published_date":"2017-04-25 16:21:57","view_times":0,"review_count":0,"category_id":7,"flat_images":"http://mycdn.seeyouyima.com/news/img/5c31ccd4d7de69981d89f16e2079b5f5_470_313.jpg","status":4,"video_flat_thumb":"","share_count":0,"collect_count":0,"type":2,"reason_id":0,"audited_at":"","show_times":0,"thumb":"http://mycdn.seeyouyima.com/news/img/5c31ccd4d7de69981d89f16e2079b5f5_470_313.jpg","video_thumb":"","is_top":0,"category_name":"美食指南","reason_name":""}]},"message":""}';
  data = JSON.parse(data);
  d.resolve(data);
  return d.promise();
};

/**
 * 获取文章详细页
 * @param  {int} id     文章id
 * @return {promise}       返回json信息
 */
const fetchArticleDetail = () => {
  const d = new $.Deferred();
  let data = '{"code":0,"data":{"images":[{"src":"https://sc.seeyouyima.com/mp_1754632952.jpg","remark":""},{"src":"https://sc.seeyouyima.com/mp_3086041156.jpg","remark":""},{"src":"https://sc.seeyouyima.com/mp_1760473578.jpg","remark":""}],"content":"<div><p>工业时代的发展，带来了灰蒙蒙的雾霾天，</p><p>如今“晒蓝天”已经成了一种我们的心情常态，</p><p>偶尔的晴空万里也能成为我们朋友圈里的热点，</p><p>不过我们现在不用愁看不到蓝天了，</p><p>意大利的著名物理学家兼光学教授Paolo di Trapani ，</p><p>开发出了一种日光模拟设备&nbsp;――&nbsp;CoeLux系统，</p><p>CoeLux能模拟出太阳光，还有十分逼真的蓝天，</p><p>让你无论在何时何地，都能感受到阳光的温暖。</p><p>...</p><p>-CoeLux-&nbsp;</p><p><br/></p><p>我们先来看看CoeLux所展现的效果~</p><p>▼</p><p><img data-src="https://sc.seeyouyima.com/mp_1754632952.jpg" class="mu-ue-image" src="https://sc.seeyouyima.com/mp_1754632952.jpg"/></p><p><br/></p><p>嗯？这不就是一扇天窗嘛，有什么稀奇的？</p><p>不过，如果你真觉得这是一扇天窗的话你就被骗了~</p><p>其实CoeLux是一款平面照明装置，</p><p>一盏可以让阳光住进你的房间的灯~</p><p><br/></p><p><img data-src="https://sc.seeyouyima.com/mp_3086041156.jpg" class="mu-ue-image" src="https://sc.seeyouyima.com/mp_3086041156.jpg"/><img data-src="https://sc.seeyouyima.com/mp_1760473578.jpg" class="mu-ue-image" src="https://sc.seeyouyima.com/mp_1760473578.jpg"/></p><p><br/></p><p>没错，这家伙真的就是个灯而已，</p><p>但若是往里面看，</p><p>你会感觉到正在看几十公里外蓝天，</p><p>而且还能看到一个栩栩如生的太阳。</p><p><br/></p></div>","multi_video":[],"title":"asdasdfasd","category_id":7,"type":2,"id":1585864,"thumbs":[{"src":"https://mycdn.seeyouyima.com/news/img/5c31ccd4d7de69981d89f16e2079b5f5_470_313.jpg"}],"status":4,"created_at":"2017-04-25 16:21:57"},"message":""}';
  data = JSON.parse(data);
  d.resolve(data);
  return d.promise();
};

/**
 * 添加更新文章
 * @param  {int} _type     2图文,3图集,4视频
 * @param  {object} obj    数据
 * @return {promise}       返回json信息
 */
const saveUpdateArticle = () => {
  // console.log(data);
  const d = new $.Deferred();
  let data = '{"code":0,"data":{},"message":"当然赞接失败了，自己去写接口"}';
  data = JSON.parse(data);
  d.resolve(data);
  return d.promise();
};

/**
 * 文章操作
 * @param  {string} action 操作类型 - delete:删除,news_up:上架,news_down:下架,set_top:置顶,unset_top:取消置顶
 * @param  {int}    id     文章编号
 * @return {promise}       返回json信息
 */
const handleArticle = () => {
  const d = new $.Deferred();
  let data = '{"code":220,"data":{},"message":"当然操作失败了,自己去写接口"}';
  data = JSON.parse(data);
  d.reject(data);
  return d.promise();
};

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
 * @param  {int}    step              步骤 - 2填写李姓的菜信息
 * @param  {string} name              李姓的菜名称
 * @param  {string} avatar            头像地址
 * @param  {string} description       李姓的菜内容描述
 * @param  {int}    city_id           城市id
 * @param  {int}    province_id       省份id
 * @param  {int}    category_id       领域id
 * @return {promise}                  返回json信息
 */
const settingUser = () => {
  const d = new $.Deferred();
  let data = '{"code":220,"data":{},"message":"当然操作失败了,自己去写接口"}';
  data = JSON.parse(data);
  d.reject(data);
  return d.promise();
};

/**
 * 获取账号信息
 * @param  {int} step    步骤 - 1填写个人基本资料身份证,2填写李姓的菜信息
 * @return {promise}     返回json信息
 */
const fetchAccountInfo = () => {
  const d = new $.Deferred();
  let data = '{"code":0,"data":{},"message":"当然赞接失败了，自己去写接口"}';
  data = JSON.parse(data);
  d.resolve(data);
  return d.promise();
};

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
const exitLogin = () => {
  const d = new $.Deferred();
  let data = '{"code":220,"data":{},"message":"退出"}';
  data = JSON.parse(data);
  d.reject(data);
  return d.promise();
};

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
const fetchUnreadInfo = () => {
  const d = new $.Deferred();
  let data = '{"code":220,"data":{},"message":"当然操作失败了,自己去写接口"}';
  data = JSON.parse(data);
  d.reject(data);
  return d.promise();
};

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
const submitValidateNo = () => {
  const d = new $.Deferred();
  let data = '{"code":220,"data":{},"message":"当然操作失败了,自己去写接口"}';
  data = JSON.parse(data);
  d.reject(data);
  return d.promise();
};

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
};
