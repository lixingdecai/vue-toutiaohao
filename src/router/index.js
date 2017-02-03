import Vue from 'vue';
import VueRouter from 'vue-router';

// import _ from '../util/tools';
import App from '../App';
import NotFound from '../pages/NotFound';
import ForgotStep1 from '../pages/ForgotStep1';
import ForgotStep2 from '../pages/ForgotStep2';
import Agreement from '../pages/Agreement';
import Specs from '../pages/Specs';
import Account from '../pages/Account';
import Home from '../pages/Home';
import Articles from '../pages/home/Articles';
import Comments from '../pages/home/Comments';
import Fans from '../pages/home/Fans';
import Feeds from '../pages/home/Feeds';
import Index from '../pages/home/Index';
import Information from '../pages/home/Information';
import Logs from '../pages/home/Logs';
import Manager from '../pages/home/Manager';
import News from '../pages/home/News';
import NoticeDetail from '../pages/home/NoticeDetail';
import Publish from '../pages/home/Publish';
import Users from '../pages/home/Users';
import MyUEditor from '../test/myUEditor';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: '/', // 如果整个单页应用服务在 /app/ 下，然后 base 就应该设为 "/app/"
  routes: [{
    path: '/',
    name: 'index',
    component: App,
    redirect: 'home',
    meta: {
      title: '李姓的菜的vue工程- 遇见更美的你',
      auth: true
    }
  }, {
    path: '/404',
    name: 'notFound',
    component: NotFound,
    meta: {
      title: '李姓的菜的vue工程- 404找不到页面',
      auth: false
    }
  }, {
    path: '/forgot-step1',
    name: 'forgot-step1',
    component: ForgotStep1,
    meta: {
      title: '李姓的菜的vue工程- 忘记密码',
      auth: false
    }
  }, {
    path: '/forgot-step2',
    name: 'forgot-step2',
    component: ForgotStep2,
    meta: {
      title: '李姓的菜的vue工程- 忘记密码',
      auth: false
    }
  }, {
    path: '/agreement',
    name: 'agreement',
    component: Agreement,
    meta: {
      title: '李姓的菜的vue工程- 用户协议',
      auth: false
    }
  }, {
    path: '/specs',
    name: 'specs',
    component: Specs,
    meta: {
      title: '李姓的菜的vue工程- 发文规范',
      auth: false
    }
  }, {
    path: '/account',
    name: 'account',
    component: Account,
    meta: {
      title: '李姓的菜的vue工程- 填写账号信息',
      auth: true
    }
  }, {
    path: '/myUEditor',
    name: 'myUEditor',
    component: MyUEditor,
    meta: {
      title: '李姓的菜的vue工程- UEditor',
      auth: false
    }
  }, {
    path: '/home',
    component: Home,
    meta: {
      title: '李姓的菜的vue工程- 后台管理',
      auth: true
    },
    children: [
      {
        path: '',
        name: 'home',
        component: Index,
        meta: {
          title: '李姓的菜的vue工程- 后台管理',
          auth: true
        }
      }, {
        path: 'articles',
        name: 'articles',
        component: Articles,
        meta: {
          title: '李姓的菜的vue工程- 文章分析',
          auth: true
        }
      }, {
        path: 'comments',
        name: 'comments',
        component: Comments,
        meta: {
          title: '李姓的菜的vue工程- 评论管理',
          auth: true
        }
      }, {
        path: 'fans',
        name: 'fans',
        component: Fans,
        meta: {
          title: '李姓的菜的vue工程- 粉丝分析',
          auth: true
        }
      }, {
        path: 'feeds',
        name: 'feeds',
        component: Feeds,
        meta: {
          title: '李姓的菜的vue工程- 内容源管理',
          auth: true
        }
      }, {
        path: 'information',
        name: 'information',
        component: Information,
        meta: {
          title: '李姓的菜的vue工程- 基本信息',
          auth: true
        }
      }, {
        path: 'logs',
        name: 'logs',
        component: Logs,
        meta: {
          title: '李姓的菜的vue工程',
          auth: true
        }
      }, {
        path: 'manager',
        name: 'manager',
        component: Manager,
        meta: {
          title: '李姓的菜的vue工程- 文章管理',
          auth: true
        }
      }, {
        path: 'news',
        name: 'news',
        component: News,
        meta: {
          title: '李姓的菜的vue工程- 消息中心',
          auth: true
        },
      }, {
        path: 'notice/:id',
        name: 'noticeDetail',
        component: NoticeDetail,
        meta: {
          title: '李姓的菜的vue工程- 公共详情',
          auth: true
        }
      }, {
        path: 'publish/:tabname',
        name: 'publish',
        component: Publish,
        meta: {
          title: '李姓的菜的vue工程- 文章发表',
          auth: true
        }
      }, {
        path: 'users',
        name: 'users',
        component: Users,
        meta: {
          title: '李姓的菜的vue工程- 用户分析',
          auth: true
        }
      }
    ]
  }, {
    path: '*',
    name: 'error',
    redirect: '/404'
  }],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    const position = {};
    if (to.hash) {
      position.selector = to.hash;
    }
    if (to.matched.some(m => m.meta.scrollToTop)) {
      position.x = 0;
      position.y = 0;
    }
    return position;
  }
});

export default router;
