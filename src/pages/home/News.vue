<template>
  <div class="wrap">
    <div class="news-wrap">
      <div class="news-title">
        <span class="news-title__tips">消息中心</span>
        <div class="news-breadcrumb">
          <router-link to="/home/news?tab=1" class="link">
            <span :class="['news-breadcrumb__item', { 'is-active': tab === 1 }]">通知</span>
          </router-link>
          <span class="news-breadcrumb__line">/</span>
          <router-link to="/home/news?tab=2" class="link">
            <span :class="['news-breadcrumb__item', { 'is-active': tab === 2 }]">关注</span>
          </router-link>
          <span class="news-breadcrumb__line">/</span>
          <router-link to="/home/news?tab=3" class="link">
            <span :class="['news-breadcrumb__item', { 'is-active': tab === 3 }]">收藏</span>
          </router-link>
          <span class="news-breadcrumb__line">/</span>
          <router-link to="/home/news?tab=4" class="link">
            <span :class="['news-breadcrumb__item', { 'is-active': tab === 4 }]">转发</span>
          </router-link>
        </div>
      </div>
      <div v-loading="loading" element-loading-text="拼命加载中">
        <ul v-if="tab === 1 && items && items.length" class="news-body news-notice">
          <li v-for="item in items" class="news-body__item clearfix">
            <div class="news-item__left">
              <img src="../../assets/images/icon-announce.png" alt="">
            </div>
            <div class="news-item__title">
              <router-link v-if="item.redirect_type === 1" :to="{ name: 'operation' }" tag="span" class="news-item__new line-1">{{ item.content.trim() }}</router-link>
              <router-link v-else-if="item.redirect_type === 2" :to="{ name: 'account' }" tag="span" class="news-item__new line-1">{{ item.content.trim() }}</router-link>
              <router-link v-else-if="item.redirect_type === 3" :to="{ name: 'manager' }" tag="span" class="news-item__new line-1">{{ item.content.trim() }}</router-link>
              <router-link v-else-if="item.redirect_type === 4" :to="{ name: 'comments' }" tag="span" class="news-item__new line-1">{{ item.content.trim() }}</router-link>
              <span v-else class="news-item__new line-1">{{ item.content.trim() }}</span>
            </div>
            <div class="news-item__right">{{ item.actionTime | formatDate('yyyy-MM-dd hh:mm') }}</div>
          </li>
        </ul>
        <ul v-else-if="tab !== 1 && items && items.length" class="news-body news-follow">
          <li v-for="item in items" class="news-body__item news-follow__item">
            <div class="news-item__left">
              <img :src="item.avatar | https" @error="imageLoadOnError($event)" alt="avatar">
            </div>
            <div class="news-item__title">
              <span class="news-item__fans">{{ item.userName || '小柚子' }}</span>&nbsp;<span v-if="tab === 2">关注</span><span v-else-if="tab === 3">收藏</span><span v-else-if="tab === 4">转发</span>了你的文章&nbsp;<router-link class="news-item__article line-1" :to="{ name: 'manager' }" tag="span">{{ item.content }}</router-link>
            </div>
            <div class="news-item__right">{{ item.actionTime | formatDate('yyyy-MM-dd hh:mm') }}</div>
          </li>
        </ul>
        <div v-else class="news-footer">
          暂时没有数据~
        </div>
        <div v-if="pageInfo && pageInfo.total_number && pageInfo.total_number > 0" class="news-pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="pageInfo.page"
            :page-size="pageInfo.page_size"
            layout="prev, pager, next, jumper"
            :total="pageInfo.total_number">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from '../../service';
import _ from '../../util/tools';

export default {
  name: 'home-news',
  data() {
    return {
      loading: false,
      tab: 1,
      items: [],
      pageInfo: {
        page: 1,
        page_size: 20,
        total_number: 0
      }
    };
  },
  mounted() {
    this.fetchInit();
  },
  watch: {
    '$route'() {
      this.fetchInit();
    }
  },
  methods: {
    imageLoadOnError(event) {
      event.currentTarget.setAttribute('src', _.getAvatar());
    },
    fetchInit() {
      const type = parseInt(this.$route.query.tab, 10);
      this.tab = type;
      this.fetchNewsList(1, type);
    },
    fetchNewsList(page, type) {
      const self = this;
      self.loading = true;
      API.fetchNotifyList(page, type).then(json => {
        console.log('news json: ', JSON.stringify(json, null, 2));
        if (json && json.code === 0) {
          const data = json.data;
          self.pageInfo = data.page_info;
          self.items = data.data;
          self.loading = false;
        } else {
          self.$message({
            showClose: true,
            duration: 2000,
            message: json.message,
            type: 'error'
          });
        }
      });
    },
    handleCurrentChange(val) {
      const self = this;
      self.pageInfo.page = val;
      this.fetchNewsList(val, self.tab);
    }
  }
};
</script>

<style lang="scss">
.news-wrap {
  padding: 0 40px 30px;
}

.news-title {
  height: 60px;
  line-height: 60px;
  padding-left: 16px;
  border-bottom: 1px solid #e7e7e7;
}

.news-title__tips {
  color: #ff74b9;
  font-size: 16px;
}

.news-breadcrumb {
  display: block;
  float: right;
  width: 256px;
}

.news-breadcrumb__item {
  display: inline-block;
  font-size: 14px;
  color: #323232;
  cursor: pointer;
}

.news-breadcrumb__item.is-active {
  color: #ff74b9;
}

.news-breadcrumb__line {
  display: inline-block;
  margin-left: 16px;
  margin-right: 16px;
  color: #e7e7e7;
}

.news-body {
  li {
    height: 72px;
    border-bottom: 1px solid #e7e7e7;
    .news-item__left {
      display: block;
      float: left;
      width: 40px;
      height: 40px;
      font-size: 0;
      margin-top: 16px;
      margin-right: 20px;
      border-radius: 100%;
      background-color: #e7e7e7;
      img {
        width: 40px;
        height: 40px;
        border-radius: 100%;
      }
    }
    .news-item__title {
      display: block;
      float: left;
      line-height: 72px;
      width: 650px;
      .news-item__fans {
        color: #65abec;
      }
      .news-item__article {
        color: #65abec;
        cursor: pointer;
      }
      .news-item__article:hover {
        text-decoration: underline;
      }
    }
    .news-item__new {
      display: inline-block;
      width: 650px;
      line-height: 22px;
      height: 22px;
      cursor: pointer;
      vertical-align: middle;
      &:hover {
        text-decoration: underline;
      }
    }
    .news-item__right {
      display: block;
      float: right;
      color: #999;
      height: 72px;
      line-height: 72px;
    }
  }
}

.news-pagination {
  text-align: right;
  padding-top: 50px;
}

.news-footer {
  margin-top: 30px;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  color: #b5b5b5;
  text-align: center;
}
</style>
