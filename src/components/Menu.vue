<template lang="html">
  <div class="menu">
    <el-menu mode="vertical" :default-active="$route.name" router>
      <el-menu-item index="home" :route="{ name: 'home' }" class="menu-line"><i class="el-menu-icon el-icon-home"></i>主页</el-menu-item>
      <el-menu-item index="publish" :route="{ name: 'publish', params: { tabname: 2 }}" class="menu-line"><i class="el-menu-icon el-icon-add"></i>发表</el-menu-item>
      <el-menu-item-group class="menu-line">
        <template slot="title"><i class="el-menu-icon el-icon-article"></i>文章管理</template>
          <el-menu-item index="manager" :route="{ name: 'manager' }">手动更新</el-menu-item>
          <el-menu-item index="comments" :route="{ name: 'comments' }">评论管理</el-menu-item>
          <!-- <el-menu-item index="feeds" :route="{ name: 'feeds' }">内容源管理</el-menu-item> -->
      </el-menu-item-group>
      <el-menu-item-group class="menu-line">
        <template slot="title"><i class="el-menu-icon el-icon-data"></i>数据统计</template>
          <el-menu-item index="articles" :route="{ name: 'articles' }">文章分析</el-menu-item>
          <el-menu-item index="users" :route="{ name: 'users' }">用户分析</el-menu-item>
          <el-menu-item index="fans" :route="{ name: 'fans' }">粉丝分析</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group class="menu-line">
        <template slot="title"><i class="el-menu-icon el-icon-safe"></i>账号管理</template>
          <el-menu-item index="information" :route="{ name: 'information' }">账号信息</el-menu-item>
          <a href="javascript:;" id="menuPassword" class="sso-menu" target="_blank">密码修改</a>
          <el-menu-item index="logs" :route="{ name: 'logs' }">操作日志</el-menu-item>
      </el-menu-item-group>
    </el-menu>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex';

// import _ from '../util/tools';

export default {
  name: 'menu',
  data() {
    return {
      curPage: 'home'
    };
  },
  computed: mapGetters({
    user: 'getUserInfo'
  }),
  mounted() {
    console.log('menu mounted.');
  }
};
</script>

<style lang="scss">
.menu-line {
  border-bottom: 1px solid #e7e7e7;
}

.el-menu-icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 10px;
  vertical-align: -1px;
}

.el-icon-home {
  background: url('../assets/images/sidebar-homepage.png') no-repeat 0 0;
  background-size: 14px 14px;
}

.el-menu-item.is-active .el-icon-home {
  background: url('../assets/images/sidebar-homepage-hover.png') no-repeat 0 0;
  background-size: 14px 14px;
}

.el-icon-add {
  background: url('../assets/images/sidebar-add.png') no-repeat 0 0;
  background-size: 14px 14px;
}

.el-menu-item.is-active .el-icon-add {
  background: url('../assets/images/sidebar-add-hover.png') no-repeat 0 0;
  background-size: 14px 14px;
}

.el-icon-article {
  background: url('../assets/images/sidebar-article.png') no-repeat 0 0;
  background-size: 14px 14px;
}

.el-icon-data {
  background: url('../assets/images/article-data.png') no-repeat 0 0;
  background-size: 14px 14px;
}

.el-icon-account {
  background: url('../assets/images/sidebar-account.png') no-repeat 0 0;
  background-size: 14px 14px;
}

.el-icon-safe {
  background: url('../assets/images/account-safe.png') no-repeat 0 0;
  background-size: 14px 14px;
}

.sso-menu {
  display: block;
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding-left: 43px;
  font-size: 14px;
  color: #323232;
  cursor: pointer;
  position: relative;
  transition: border-color 0.3s, background-color 0.3s, color 0.3s;
  box-sizing: border-box;
  white-space: nowrap;
}

.sso-menu:hover {
  background-color: #ffe3f1;
}
</style>
