<template>
  <div class="wrap">
    <div class="news-wrap manager-wrap" v-loading="loading" element-loading-text="拼命加载中">
      <div class="manager-status">
        <div class="el-breadcrumb">
          <span class="el-breadcrumb__item" :class="status === 0 ? 'active':''" @click="handleStatus(0)">
            <span class="el-breadcrumb__item__inner">全部</span>
            <span class="el-breadcrumb__separator">/</span>
          </span>
          <span class="el-breadcrumb__item" :class="status === 1 ? 'active':''" @click="handleStatus(1)">
            <span class="el-breadcrumb__item__inner">已发表</span>
            <span class="el-breadcrumb__separator">/</span>
          </span>
          <span class="el-breadcrumb__item" :class="status === 10 ? 'active':''" @click="handleStatus(10)">
            <span class="el-breadcrumb__item__inner">未通过审核</span>
            <span class="el-breadcrumb__separator">/</span>
          </span>
          <span class="el-breadcrumb__item" :class="status === 8 ? 'active':''" @click="handleStatus(8)">
            <span class="el-breadcrumb__item__inner">草稿</span>
            <span class="el-breadcrumb__separator">/</span>
          </span>
          <span class="el-breadcrumb__item" :class="status === 7 ? 'active':''" @click="handleStatus(7)">
            <span class="el-breadcrumb__item__inner">下架</span>
            <span class="el-breadcrumb__separator">/</span>
          </span>
          <span class="el-breadcrumb__item" :class="status === 4 ? 'active':''" @click="handleStatus(4)">
            <span class="el-breadcrumb__item__inner">审核中</span>
            <span class="el-breadcrumb__separator">/</span>
          </span>
        </div>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="first">
          <div v-if="articleList && articleList.length != 0">
            <managerList @renderPageList="pageList" :articleList="articleList"></managerList>
          </div>
          <div v-else class="manager-footer">
            没有更多数据
          </div>
        </el-tab-pane>
        <el-tab-pane label="图文" name="second">
          <div v-if="articleList && articleList.length != 0">
            <managerList @renderPageList="pageList" :articleList="articleList"></managerList>
          </div>
          <div v-else class="manager-footer">
            没有更多数据
          </div>
        </el-tab-pane>
        <el-tab-pane label="视频" name="third">
          <div v-if="articleList && articleList.length != 0">
            <managerList @renderPageList="pageList" :articleList="articleList"></managerList>
          </div>
          <div v-else class="manager-footer">
            没有更多数据
          </div>
        </el-tab-pane>
        <el-tab-pane label="图集" name="fourth">
          <div v-if="articleList && articleList.length != 0">
            <managerList @renderPageList="pageList" :articleList="articleList"></managerList>
          </div>
          <div v-else class="manager-footer">
            没有更多数据
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="manager-pagination" v-if="pageInfo && pageInfo.total_number && pageInfo.total_number > 0">
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
</template>

<script>

import API from '../../service';
import managerList from './ManagerList';

export default {
  name: 'home-manager',
  components: {
    managerList
  },
  data() {
    return {
      loading: false,
      activeName: 'first',
      currentPage: 1,
      articleList: [],
      pageInfo: {},
      type: 0,
      status: 0
    };
  },
  mounted() {
    // 获取文章列表
    this.pageList(this.type, this.status, this.currentPage);
  },
  methods: {
    handleClick(tab) {
      if (tab.name === 'first') {
        if (this.type === 0) {
          return;
        }
        this.type = 0;
      } else if (tab.name === 'second') {
        if (this.type === 2) {
          return;
        }
        this.type = 2;
      } else if (tab.name === 'third') {
        if (this.type === 4) {
          return;
        }
        this.type = 4;
      } else if (tab.name === 'fourth') {
        if (this.type === 3) {
          return;
        }
        this.type = 3;
      } else {
        this.type = 0;
      }
      this.pageList(this.type, this.status, 1);
    },
    handleStatus(status) {
      this.status = status;
      this.pageList(this.type, this.status, this.currentPage);
    },
    pageList(type, status, page) {
      this.loading = true;
      API.fetchArticleList(type, status, page).then(json => {
        console.log('ArticleList json: ', JSON.stringify(json, null, 2));
        if (json.code === 0) {
          const data = json.data;
          this.articleList = data.data;
          this.pageInfo = data.page_info || {};
        } else {
          this.$message.error(json.message);
        }
        this.loading = false;
      }).catch(error => {
        this.$message.error('接口异常，' + error.status);
        this.loading = false;
      });
    },
    handleCurrentChange(val) {
      this.pageList(this.type, this.status, val);
    }
  }
};
</script>

<style type="text/css">

.manager-wrap {
  position: relative;
}

.manager-wrap .el-tabs__item {
  height: 60px;
  line-height: 60px;
}

.manager-wrap .el-icon-edit {
  margin-right: 5px;
}

.manager-wrap .el-tabs__item {
  height: 60px;
  line-height: 60px;
}

.manager-status {
  position: absolute;
  right: 40px;
  top: 23.5px;
  z-index: 1;
}
.manager-wrap .el-tabs__item {
  font-size: 16px;
}

.manager-wrap .active .el-breadcrumb__item__inner {
  color: #ff74b9;
}

.manager-wrap .el-breadcrumb__item:last-child .el-breadcrumb__item__inner {
  color: #475669;
  cursor: pointer;
}

.manager-wrap .el-breadcrumb__item.active:last-child .el-breadcrumb__item__inner {
  color: #ff74b9;
}

.manager-wrap .el-breadcrumb__item:last-child .el-breadcrumb__item__inner:hover {
  color: #ff74b9;
}

.manager-pagination {
  margin-top: 30px;
  text-align: right;
}

.manager-footer {
  margin-top: 30px;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  color: #b5b5b5;
  text-align: center;
}
</style>
