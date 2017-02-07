<template>
<div class="wrap">
  <div class="index-wrap" v-loading="loading" element-loading-text="拼命加载中">
    <router-link class="index-publish" :to="{ name: 'manager' }" tag="div">
      <div class="index-publish__wrap clearfix">
        <div class="index-publish__add">
        </div>
        <div class="index-publish__text">
          发表
        </div>
      </div>
    </router-link>
    <ul class="index-data clearfix">
      <li class="index-item clearfix">
        <div class="index-item__block index-item__block1">
          <div class="index-block__top">{{ counts.total_news_count || 0 }}</div>
          <div class="index-block__bottom">文章量</div>
        </div>
        <div class="index-item__block">
          <div class="index-block__top">{{ counts.total_fans_count || 0 }}</div>
          <div class="index-block__bottom">粉丝</div>
        </div>
      </li>
      <li class="index-item index-item__middle clearfix">
        <div class="index-item__block index-item__block1">
          <div class="index-block__top">{{ counts.total_visitor_count || 0 }}</div>
          <div class="index-block__bottom">累计用户数</div>
        </div>
        <div class="index-item__block">
          <div class="index-block__top">{{ counts.total_view_count || 0 }}</div>
          <div class="index-block__bottom">累计阅读量</div>
        </div>
      </li>
      <!--         <li class="index-item clearfix">
          <div class="index-item__block index-item__block1">
            <div class="index-block__top">102020</div>
            <div class="index-block__bottom">拓展位</div>
          </div>
          <div class="index-item__block">
            <div class="index-block__top">1010</div>
            <div class="index-block__bottom">拓展位</div>
          </div>
        </li> -->
    </ul>
    <div class="index-table">
      <div class="index-table__head">
        <span>系统公告</span>
      </div>
      <ul v-if="items && items.length">
        <li v-for="item in items" class="index-table__item clearfix">
          <router-link :to="`/home/notice/${item.id}`" tag="span" class="index-table__left">{{ item.title }}</router-link>
          <span class="index-table__right">{{ item.updated_at | formatDate('yyyy-MM-dd') }}</span>
        </li>
      </ul>
    </div>
    <div v-if="pageInfo && pageInfo.total_number && pageInfo.total_number > 0" class="index-pagination">
      <el-pagination @current-change="handleCurrentChange" :current-page="pageInfo.page" :page-size="pageInfo.page_size" layout="prev, pager, next, jumper" :total="pageInfo.total_number">
      </el-pagination>
    </div>
  </div>
</div>
</template>

<script>
import API from '../../service';

export default {
  name: 'home',
  data() {
    return {
      loading: false,
      counts: {},
      pageInfo: {
        page: 1,
        page_size: 20,
        total_number: 0
      },
      items: []
    };
  },
  mounted() {
    this.fetchHomeAnalysis();
    this.fetchAnnouceList(1);
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log(`当前页: ${val}`);
    },
    fetchHomeAnalysis() {
      const self = this;
      self.loading = true;
      API.fetchHomeAnalysis().then(json => {
        console.log('home json: ', JSON.stringify(json, null, 2));
        if (json && json.code === 0) {
          self.counts = json.data;
        }
      });
    },
    fetchAnnouceList() {
      const self = this;
      // const data = this.data;
      // self.pageInfo = data.page_info;
      // self.items = data.data;
      self.loading = false;
      API.fetchAnnouceList().then(json => {
        console.log('annouce json: ', JSON.stringify(json, null, 2));
        if (json && json.code === 0) {
          const data = json.data;
          self.pageInfo = data.page_info;
          self.items = data.data;
          self.loading = false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.index-wrap {
    padding: 20px 16px 30px;
}

.index-publish {
    height: 130px;
    border: 1px dashed #ffa7d3;
    cursor: pointer;
}

.index-publish__wrap {
    height: 26px;
    width: 86px;
    margin: 52px auto;
}

.index-publish__add {
    display: block;
    float: left;
    width: 26px;
    height: 26px;
    font-size: 0;
    margin-right: 12px;
    background: url('../../assets/images/home-add.png') no-repeat 0 0;
    background-size: 26px 26px;
}
.index-publish:hover .index-publish__add {
    background: url('../../assets/images/home-add-hover.png') no-repeat 0 0;
    background-size: 26px 26px;
}

.index-publish__text {
    display: block;
    float: left;
    font-size: 24px;
    height: 26px;
    line-height: 26px;
    color: #ff74b9;
}
.index-publish:hover .index-publish__text {
    color: #ea4d9a;
}

.index-data {
    margin-top: 16px;
    height: 130px;
    background: #fff;
}

.index-item {
    width: 475px;
    height: 100%;
    float: left;
    background-color: #ffa7d3;
}

.index-item__middle {
    margin-left: 8px;
}

.index-item__block {
    width: 50%;
    height: 80px;
    float: left;
    margin-top: 25px;
    text-align: center;
    color: #fff;
}

.index-item__block1 {
    border-right: 1px solid #ff74b9;
}

.index-block__top {
    height: 50px;
    line-height: 50px;
    font-size: 36px;
    margin-bottom: 5px;
}

.index-block__bottom {
    height: 25px;
    line-height: 25px;
    font-size: 18px;
}

.index-table {
    margin-top: 16px;
    font-size: 14px;
    border-left: 1px solid #e7e7e7;
    border-right: 1px solid #e7e7e7;
}

.index-table__head {
    height: 44px;
    background-color: #f7f7f7;
    border-top: 1px solid #e7e7e7;
    border-bottom: 1px solid #e7e7e7;
    span {
        display: inline-block;
        padding: 11px 18px;
        color: #999;
    }
}

.index-table__item {
    border-bottom: 1px solid #e7e7e7;
}

.index-table__left {
    display: inline-block;
    color: #323232;
    float: left;
    padding: 11px 18px;
}
.index-table__left:hover {
    cursor: pointer;
    text-decoration: underline;
}

.index-table__right {
    display: inline-block;
    color: #999;
    float: right;
    padding: 11px 18px;
}

.index-pagination {
    margin-top: 30px;
    text-align: right;
}
</style>
