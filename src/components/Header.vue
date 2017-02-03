<template lang="html">
  <header class="header">
     <el-popover popper-class="header-notity-pop"
      ref="popover4"
      placement="bottom"
      width="120"
      trigger="hover">
      <ul class="header-notify-list">
        <li>
          <router-link to="/home/news?tab=1" class="link">
            通知
          </router-link>
        </li>
        <li>
          <router-link to="/home/comments" class="link">
            评论
          </router-link>
        </li>
        <li>
          <router-link to="/home/news?tab=2" class="link">
            关注
          </router-link>
        </li>
        <li>
          <router-link to="/home/news?tab=3" class="link">
            收藏
          </router-link>
        </li>
        <li>
          <router-link to="/home/news?tab=4" class="link">
            转发
          </router-link>
        </li>
      </ul>
    </el-popover>

    <div class="header-content clearfix">
      <div class="header-left">
        <router-link class="link" to="/login">
          <img src="../assets/images/logo.png" class="header-logo" alt="美柚">
        </router-link>
        <span class="header-slogan">美柚号·做更懂女人的自媒体</span>
        <a href="" target="_blank"><span class="header-account-status">审核中</span></a>
      </div>
      <div class="header-right">
        <div class="header-userhead">
          <img src="//sc.seeyouyima.com/forum/data/5823cd3f32c93_548_291.png?imageView2/2/w/750/h/500"/>
        </div>
        <div class="header-userinfo">
          <div class="header-usertype">个人</div>
          <div class="header-username">第四叶</div>
        </div>
        <div class="header-user-oper">
          <div class="header-usernotify"  v-popover:popover4>
            <div class="header-notify-num">1</div>
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
import {
  mapGetters
} from 'vuex';
import API from '../service';
// import _ from '../util/tools';

export default {
  name: 'header',
  data() {
    return {
      message: {}
    };
  },
  computed: mapGetters({
    user: 'getUserInfo'
  }),
  watch: {
    '$route'() {
      if (this.user.sign) {
        this.fetchMessage();
        this.fetchUserInfo();
      }
    },
    'user'() {
      if (this.user.sign) {
        this.fetchMessage();
        this.fetchUserInfo();
      }
    }
  },
  methods: {
    fetchMessage() {
      const self = this;
      API.fetchUnreadInfo().then(json => {
        console.log('unread json: ', JSON.stringify(json, null, 2));
        if (json && json.code === 0) {
          self.message = json.data;
        }
      });
    },
    fetchUserInfo() {
      const self = this;
      API.fetchUserInfo().then(json => {
        console.log('user json: ', JSON.stringify(json, null, 2));
        if (json && json.code === 0) {
          self.user = json.data;
        }
      });
    },
    logout() {
      // API.helloServiceExit().then(jsonp => {
      //   const arr = [];
      //   for (const index in jsonp) {
      //     console.log(index, jsonp[index]);
      //     arr.push(API.helloJsonp(jsonp[index]));
      //   }
      //   console.log('arr: ', arr);
      //   Promise.all(arr).then(result => {
      //     console.log('result: ', result);
      //     window.location.href = _.getLoginAddr();
      //   }, () => {
      //     window.location.href = _.getLoginAddr();
      //   });
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

.header-notify-num {
  width: 18px;
  height: 18px;
  border-radius: 100%;
  color: #fff;
  background: #FF4949;
  text-align: center;
  font-size: 12px;
  line-height: 18px;
  position: absolute;
  right: -9px;
  top: -9px;
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

.header-notity-pop.el-popover {
  padding: 0;
}

.header-notify-list {
  margin-top: 5px;
}

.header-notify-list li {
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
