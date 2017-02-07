<template lang="html">
  <header class="header">
    <div class="header-content clearfix">
      <!-- <div class="header-left">
        <router-link class="link" to="/login">
          <img src="http://oi2p38ffx.bkt.clouddn.com/avatar_blog1.png" class="header-logo" alt="李姓的菜">
        </router-link>
        <span class="header-slogan">李姓的菜</span>
        <span v-if="headType === 'loginStatus' && +user.status > 1" class="header-account-status">{{ +user.status | status2str }}</span>
      </div>
      <div v-if="headType === 'nologin'" class="header-right header-unlogin">
        <a href="javascript:;" target="_blank" id="J_register"><el-button type="text">立即注册</el-button></a>
        <span class="header-line">|</span>
        <a href="javascript:;" target="_blank" id="J_login"><el-button type="text">登录</el-button></a>
      </div> -->
      <div class="header-right">
        <div class="header-userhead">
          <img src="http://oi2p38ffx.bkt.clouddn.com/avatar_blog1.png" @error="imageLoadOnError" id="avatar" alt="头像" />
        </div>
        <div class="header-userinfo">
          <div class="header-usertype">个人</div>
          <div class="header-username">李姓的菜</div>
        </div>
        <div class="header-user-oper">
          <el-popover popper-class="header-notity-pop"
            ref="popover4"
            placement="bottom"
            width="120"
            trigger="hover">
            <ul class="header-notify-list">
              <li @click="closeNotify('system')">
                <router-link to="/home/news?tab=1" class="link">
                  通知<div v-if="+msg.system" class="header-notify header-notify-nums">{{ +msg.system > 99 ? '99+' : msg.system }}</div>
                </router-link>
              </li>
              <li @click="closeNotify('comment')">
                <router-link to="/home/comments" class="link">
                  评论<div v-if="+msg.comment" class="header-notify header-notify-nums">{{ +msg.comment > 99 ? '99+' : msg.comment }}</div>
                </router-link>
              </li>
              <li @click="closeNotify('follow')">
                <router-link to="/home/news?tab=2" class="link">
                  关注<div v-if="+msg.follow" class="header-notify header-notify-nums">{{ +msg.follow > 99 ? '99+' : msg.follow }}</div>
                </router-link>
              </li>
              <li @click="closeNotify('favour')">
                <router-link to="/home/news?tab=3" class="link">
                  收藏<div v-if="+msg.favour" class="header-notify header-notify-nums">{{ +msg.favour > 99 ? '99+' : msg.favour }}</div>
                </router-link>
              </li>
              <li @click="closeNotify('repeat')">
                <router-link to="/home/news?tab=4" class="link">
                  转发<div v-if="+msg.repeat" class="header-notify header-notify-nums">{{ +msg.repeat > 99 ? '99+' : msg.repeat }}</div>
                </router-link>
              </li>
            </ul>
          </el-popover>
          <div class="header-usernotify" v-popover:popover4>
            <div v-if="total" class="header-notify header-notify-num">{{ total }}</div>
          </div>
          <div class="header-split-border">
          </div>
          <div class="header-userlgout" @click="logout">
            <el-button type="text">退出</el-button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
// import {
//   mapGetters
// } from 'vuex';

// import API from '../service';
import _ from '../util/tools';

export default {
  name: 'header',
  data() {
    return {
      msg: {}
    };
  },
  computed: Object.assign({},
    // mapGetters({
    //   headType: 'getHeadType',
    //   user: 'getUserInfo'
    // }),
    {
      total() {
        const msg = this.msg;
        return parseInt(msg.system, 10)
          + parseInt(msg.comment, 10)
          + parseInt(msg.follow, 10)
          + parseInt(msg.repeat, 10)
          + parseInt(msg.favour, 10);
      }
    }
  ),
  watch: {
    // '$route'() {
    //   console.log('路由变化，获取消息信息');
    //   if (this.user.isLogin) {
    //     this.fetchMessage();
    //   }
    // }
  },
  mounted() {
    this.fetchMessage();
  },
  methods: {
    imageLoadOnError() {
      this.user.avatar = _.getAvatar();
    },
    fetchMessage() {
      // const self = this;
      // API.fetchUserInfo().then(json => {
      //   console.log('unread json: ', JSON.stringify(json, null, 2));
      //   if (json && json.code === 0) {
      //     self.msg = json.data.message;
      //     _.setUserInfo(json.data.user);
      //     self.$store.commit('setUserInfo');
      //   }
      // });
    },
    logout() {
      // API.ssoExit(this);
    },
    closeNotify(type) {
      // const self = this;
      console.log('type: ', type);
      // API.resetUnreadInfo(type).then(json => {
      //   console.log('unread info json: ', JSON.stringify(json, null, 2));
      //   if (json && json.code === 0) {
      //     self.msg[type] = 0;
      //   } else {
      //     self.$message({
      //       showClose: true,
      //       duration: 2000,
      //       message: json.message,
      //       type: 'error'
      //     });
      //     console.error(json.message);
      //   }
      // });
    }
  }
};
</script>

<style lang="scss">
@import "../assets/stylesheets/config";

$header-width: 1200px;
$header-height: 67px;

.header {
  min-width: $header-width;
  background: linear-gradient(to right, $color-primary 13%, #fff 77%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=$color-primary, endColorstr='#fff', GradientType=0);
}

:root .header {
  filter: none;
}

.header-content {
  width: $header-width;
  height: $header-height;
  margin: 0 auto;
}

.header-left {
  display: block;
  float: left;
  .link {
    float: left;
    display: block;
    height: 100%;
    width: auto;
    margin-top: 10px;
  }
}

.header-logo {
  display: block;
  width: 46px;
  height: 46px;
  text-indent: -999em;
}

.header-slogan {
  display: block;
  line-height: $header-height;
  float: left;
  margin-left: 12px;
  color: #fff;
  font-size: 20px;
}

.header-account-status {
  line-height: $header-height;
  font-size: 14px;
  color: #FF74B9;
  background: #fff;
  border-radius: 20px;
  text-align: center;
  padding: 3px 10px;
  margin-left: 10px;
}

.header-right {
  float: right;
  font-size: 14px;
  color: #b5b5b5;
  .link {
    color: $color-blue;
    font-size: 14px;
  }
}

.header-unlogin {
  line-height: $header-height;
}

.header-userhead {
  float: left;
}

.header-userhead img {
  width: 46px;
  height: 46px;
  border-radius: 100%;
  margin-top: 10.5px;
}

.header-userinfo {
  float: left;
  margin-top: 13.5px;
  margin-left: 10px;
}

.header-usertype {
  font-size: 12px;
  color: #FF74B9;
  background: #FFE3F1;
  border: 0 solid #FFA7D3;
  border-radius: 20px;
  text-align: center;
  width: 60px;
}

.header-username {
  font-size: 14px;
  color: #323232;
  margin-top: 5px;
}

.header-user-oper {
  float: left;
  margin-top: 13px;
}

.header-usernotify {
  float: left;
  background: url('../assets/images/nav-news.png') no-repeat 0 0;
  width: 24px;
  height: 20px;
  margin-top: 23.5px;
  cursor: pointer;
  margin-left: 30px;
  position: relative;
}

.header-notify {
  position: absolute;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  border-radius: 10px;
  color: #fff;
  background: #FF4949;
  text-align: center;
  font-size: 12px;
}

.header-notify-num {
  left: 15px;
  top: -9px;
}

.header-notify-nums {
  right: 14px;
  top: 9px;
}

.header-split-border {
  margin-top: 23.5px;
  height: 20px;
  border-left: 1px solid #E7E7E7;
  margin-left: 20px;
  float: left;
}

.header-usernotify:hover {
  background: url('../assets/images/nav-news-hover.png') no-repeat 0 0;
}

.header-userlgout {
  float: left;
  line-height: $header-height;
  margin-left: 20px;
}

.header-notity-pop {
  z-index: 11111 !important;
}

.header-notity-pop.el-popover {
  padding: 0;
}

.header-notify-list {
  margin-top: 5px;
}

.header-notify-list li {
  position: relative;
  height: 36px;
  line-height: 36px;
  cursor: pointer;
  padding-left: 15px;
  font-size: 14px;
}

.header-notify-list li a {
  color: #323232;
  display: block;
}

.header-notify-list li a:focus {
  color: #ff74b9;
}

.header-notify-list li:hover {
  background: #f5f5f5;
}

</style>
