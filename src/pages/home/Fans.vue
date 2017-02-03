<template>
  <div class="wrap">
    <div class="news-wrap">
      <div class="news-title">
        <span class="news-title__tips">粉丝分析</span>
      </div>
      <div class="fans-content">
        <div class="fans-date">
          <span class="logs-date__title">时间</span>
          <el-date-picker
            v-model="fansDate"
            type="daterange"
            placeholder="选择日期范围">
          </el-date-picker>
          <el-button type="default" icon="search" class="logs-date__btn"></el-button>
        </div>
        <div class="index-table fans-table" v-loading="loading" element-loading-text="拼命加载中">
          <div class="index-table__head">
            <span>粉丝列表</span>
          </div>
          <ul v-if="fansData && fansData.length != 0">
            <li v-for="item in fansData" class="index-table__item fans-table__item clearfix">
              <div class="fans-item__avatar">
                <img :src="item.avatar" alt="avatar">
              </div>
              <div class="fans-item__info">
                <div class="fans-item__top">
                  <span class="fans-item__name">{{ item.screen_name || '您还未设置昵称~'}}</span>
                  <span class="fans-item__type">{{ item.mode | num2mode}}</span>
                </div>
                <div class="fans-item__bottom"><span class="fans-item__date">{{ item.created_at | formatDate('yyyy-MM-dd') }}</span> 关注</div>
              </div>
              <div class="fans-item__region">
                {{ item.location }}
              </div>
              <div class="fans-item__right">
                <span v-if="item.relation === 0" @click="fixRelation(0)" class="fans-item__relation is-focus">已关注</span>
                <span v-else @click="fixRelation(1)" class="fans-item__relation">互相关注</span>
              </div>
              <div class="fans-item__right">
                <span v-if="item.isblack === 0" @click="fixRelation(0)" class="fans-item__relation is-black">加入黑名单</span>
                <span v-else @click="fixRelation(1)" class="fans-item__relation">解除黑名单</span>
              </div>
            </li>
          </ul>
          <div v-else class="fans-footer">
            没有更多数据
          </div>
        </div>
        <div class="index-pagination" v-if="pageInfo.total_number != 0">
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

export default {
  name: 'home-fans',
  data() {
    return {
      loading: false,
      fansDate: '',
      fansData: [],
      pageInfo: {
        page: 1,
        page_size: 20,
        total_number: 0
      }
    };
  },
  mounted() {
    this.fetchFans();
  },
  methods: {
    fetchFans() {
      const self = this;
      self.loading = true;
      API.fetchFriendshipList().then(json => {
        console.log('fans json: ', JSON.stringify(json, null, 2));
        if (json && json.code === 0) {
          const data = json.data;
          self.fansData = data.data;
          self.pageInfo = data.page_info;
          self.loading = false;
        } else {
          self.fansData = [];
          self.pageInfo = {};
          self.loading = false;
        }
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log(`当前页: ${val}`);
    },
    fixRelation(num) {
      API.setFriendshipInfo(num).then(json => {
        console.log('ship json: ', JSON.stringify(json, null, 2));
        if (json && json.code === 0) {
          self.loading = false;
        } else {
          self.loading = false;
        }
      });
    }
  }
};
</script>
<style lang="scss">
.fans-content {
  padding-top: 40px;
}

.index-table.fans-table {
  margin-top: 40px;
}

.index-table__item.fans-table__item {
  height: 72px;
}

.fans-item__avatar {
  float: left;
  height: 40px;
  width: 40px;
  margin-top: 16px;
  margin-left: 30px;
  border-radius: 100%;
  background-color: #e7e7e7;
  img {
    width: 40px;
    height: 40px;
    border-radius: 100%;
  }
}

.fans-item__info {
  float: left;
  margin-left: 20px;
  height: 100%;
  width: 300px;
}

.fans-item__top {
  margin-top: 14px;
}

.fans-item__name {
  margin-right: 10px;
}

.fans-item__bottom {
  font-size: 12px;
  margin-top: 5px;
}

.fans-item__region {
  float: left;
  height: 72px;
  width: 100px;
  line-height: 72px;
  margin-left: 50px;
  text-align: center;
}

.fans-item__right {
  float: right;
  height: 72px;
  width: 100px;
  line-height: 72px;
  text-align: center;
}

.fans-item__relation {
  cursor: pointer;
}

.fans-item__right.is-focus {
  color: #65abec;
}

.fans-item__right.is-black {
  color: #65abec;
}

.fans-footer {
  margin-top: 30px;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  color: #b5b5b5;
  text-align: center;
}
</style>
