<template>
  <div class="manager-article-list">
    <div class="manager-article-row" v-for="item in articleList">
      <div v-if="item.status != 8">
        <div class="manager-article-left-content">
          <h1 class="line-1">{{ item.title ? item.title : '无标题' }}</h1>
          <div class="manager-article-oper">
            <span v-if="item.show_times > 0" class="manager-recommend">已推荐</span>
            <span v-if="item.is_top === 1" class="manager-recommend">置顶</span>
            <span class="manager-type">{{ item.category_name }}</span>
            <span class="manager-date">{{ item.updated_at ? item.updated_at :item.created_at | formatDate }}</span>
            <span class="manager-yfb" v-if="item.status === 1">已发表</span>
            <span class="manager-yfb" v-if="item.status === 10">未通过审核</span>
            <span class="manager-yfb" v-if="item.status === 7">下架</span>
            <span class="manager-yfb" v-if="item.status === 4">审核中</span>
            <span v-if="item.status === 1 || item.status === 10" class="manager-a" @click="confirmEdit(item.type,item.id)"><i class="el-icon-edit"></i>修改</span>
            <span v-if="item.status === 1 && item.is_top === 0" class="manager-a" @click="confirmZD('set_top',item.id,'置顶成功！')">置顶</span>
            <span v-if="item.status === 1 && item.is_top === 1" class="manager-a" @click="handleArticle('unset_top',item.id,'取消置顶成功！')">取消置顶</span>
            <span v-if="item.status === 1" href="#" class="manager-a" @click="handleArticle('news_down',item.id,'下架成功！')">下架</span>
            <span href="#" v-if="item.status === 7" class="manager-a" @click="handleArticle('news_up',item.id,'上架成功！')">上架</span>
            <span href="#" v-if="item.status === 4 || item.status === 7 || item.status === 10" class="manager-a" @click="confirmDel('delete',item.id,'删除成功！')">删除</span>
          </div>
          <div class="manager-article-info">
            <div class="manager-info-col">
              <span class="manager-label">推荐：</span>
              <span class="manager-num">{{ item.show_times }}</span>
              <div class="manager-split"></div>
            </div>

            <div class="manager-info-col">
              <span class="manager-label">阅读：</span>
              <span class="manager-num">{{ item.view_times }}</span>
              <div class="manager-split"></div>
            </div>

            <div class="manager-info-col">
              <span class="manager-label">评论：</span>
              <span class="manager-num">{{ item.review_count }}</span>
              <div class="manager-split"></div>
            </div>

            <div class="manager-info-col">
              <span class="manager-label">分享：</span>
              <span class="manager-num">{{ item.share_count }}</span>
              <div class="manager-split"></div>
            </div>

            <div class="manager-info-col">
              <span class="manager-label">收藏：</span>
              <span class="manager-num">{{ item.collect_count }}</span>
            </div>
          </div>
        </div>
        <div class="manager-article-right">
          <img v-if="item.type == 4 && item.video_thumb" :src="item.video_thumb | https"/>
          <img v-if="item.type != 4 && item.thumb" :src="item.thumb | https"/>
        </div>
      </div>
      <div v-if="item.status === 8">
        <div class="manager-article-left-content">
          <h1 class="line-1">{{ item.title ? item.title : '无标题' }}</h1>
          <div class="manager-article-oper">
            <span class="manager-type manager-nomargin">{{ item.category_name }}</span>
            <span class="manager-date">{{ item.updated_at ? item.updated_at :item.created_at | formatDate }}</span>
            <span class="manager-label">草稿</span>
          </div>
          <div class="manager-article-oper manager-top">
             <span class="manager-a manager-nomargin" @click="confirmEdit(item.type,item.id)"><i class="el-icon-edit"></i>修改</span>
             <span class="manager-a" @click="handleArticle('delete',item.id,'删除成功！')">删除</span>
          </div>
        </div>
        <div class="manager-article-right">
          <img v-if="item.type == 4 && item.video_thumb" :src="item.video_thumb | https" />
          <img v-if="item.type != 4 && item.thumb" :src="item.thumb | https" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import API from '../../service';

export default {
  name: 'manager-list',
  props: {
    articleList: [Array],
  },
  methods: {
    confirmEdit(type, id) {
      this.$confirm('频繁修改会影响读者阅读效率和推荐效果，建议编辑完善后再发表。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push('publish/' + type + '?id=' + id);
      }).catch(() => {
      });
    },
    confirmZD(action, id, message) {
      this.$confirm('同时只支持一篇文章置顶，确定后该文章将取代之前置顶的文章。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleArticle(action, id, message);
      }).catch(() => {
      });
    },
    confirmDel(action, id, message) {
      this.$confirm('删除的内容不可恢复，请谨慎删除。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleArticle(action, id, message);
      }).catch(() => {
      });
    },
    handleArticle(action, id, message) {
      API.handleArticle(action, id).then(json => {
        console.log('Article json: ', JSON.stringify(null, null, 2));
        if (json.code === 0) {
          this.$message({
            message: message,
            type: 'success'
          });
          this.$emit('renderPageList');
        } else {
          this.$message.error(json.message);
        }
      }).catch(error => {
        this.$message.error('接口异常，' + error.status);
      });
    }
  },
  data() {
    return {
      type: 0
    };
  }
};
</script>

<style type="text/css">

.manager-wrap .el-tabs__header {
  border-bottom: 1px solid #e7e7e7;
}

.manager-wrap .el-tabs__item {
  color: #323232;
}

.manager-wrap .el-breadcrumb__separator {
  color: #e7e7e7;
}
 .manager-wrap .el-breadcrumb__item__inner {
  color: #323232;
}


.manager-wrap .el-breadcrumb__item:last-child .el-breadcrumb__item__inner {
  color: #323232;
}

.manager-article-row {
  border-bottom: 1px solid #e7e7e7;
  height: 142px;
  overflow: hidden;
}

.manager-article-row h1 {
  font-size: 20px;
  color: #323232;
  width: 650px;
}

.manager-recommend {
  background: #FFE3F1;
  border: 1px solid #FFE3F1;
  border-radius: 20px;
  font-size: 12px;
  color: #FF74B9;
  padding: 0 8px 0 8px;
}

.manager-type ,.manager-date ,.manager-yfb{
  font-size: 14px;
  color: #999999;
  margin-left: 15px;
}

.manager-a {
  font-size: 14px;
  color: #65ABEC;
  margin-left: 15px;
  cursor: pointer;
}

.manager-article-info {
  margin-top: 14px;
  overflow: hidden;
}

.manager-info-col {
  overflow: hidden;
  float: left;
  font-size: 14px;
  color: #999;
  padding-left: 15px;
}

.manager-article-oper .manager-label {
  font-size: 14px;
  color: #999;
  margin-left: 15px;
}

.manager-article-oper span:first-child {
  margin-left: 0;
}

.manager-info-col:first-child {
  padding-left: 0;
}

.manager-info-col:last-child {
  border-right: 0px;
}

.manager-article-left-content {
  float: left;
}

.manager-article-right {
  float: right;
  margin-top: 31px;
  margin-bottom: 31px;
  margin-right: 40px;
  background: #f7f7f7;
  width: 134px;
  height: 80px;
}

.manager-article-right img {
  width: 134px;
  height: 80px;
}

.manager-split {
  border-right: 1px solid #ddd;
  height: 15px;
  line-height: 22px;
  float: right;
  margin-top: 3.5px;
  margin-left: 15px;
}

.manager-top {
  margin-top: 14px;
}

.manager-nomargin {
  margin-left: 0;
}
</style>
