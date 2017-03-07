<template>
  <div class="wrap">
    <div class="news-wrap">
      <div class="news-title">
        <span class="news-title__tips">粉丝分析</span>
      </div>
      <div class="fans-content">
        <div class="fans-date">
          <el-date-picker
            @change="handleChange"
            v-model="fansDate"
            type="daterange"
            :picker-options="forbiddenFuture"
            placeholder="选择日期范围"
            class="users-picker">
          </el-date-picker>
          <el-button @click="fetchFans(1)" type="default" icon="search" class="logs-date__btn"></el-button>
        </div>
        <div class="fans-table" v-loading="loading" element-loading-text="拼命加载中">
          <div class="index-table__head fans-table__head">
            <span>粉丝列表</span>
          </div>
          <ul v-if="fansData && fansData.length != 0" class="fans-table__body">
            <li v-for="(item, index) in fansData" class="index-table__item fans-table__item clearfix">
              <div class="fans-item__avatar">
                <img :src="item.avatar | https" @error="imageLoadOnError($event)" alt="avatar">
              </div>
              <div class="fans-item__info">
                <div class="fans-item__top">
                  <span class="fans-item__name">{{ item.screen_name || item.id || ''}}</span>
                  <span class="fans-item__type">{{ item.mode | num2mode}}</span>
                </div>
                <div class="fans-item__bottom"><span class="fans-item__date">{{ item.created_at | formatDate('yyyy-MM-dd') }}</span> 关注</div>
              </div>
              <div class="fans-item__region">
                {{ item.location }}
              </div>
              <div class="fans-item__right">
                <el-button v-if="item.relation === 4" type="text" @click="fixRelation(index, 'cancel_follows', item.id, item.screen_name)" class="fans-item__relation is-focus">已关注</el-button>
                <el-button v-else-if="item.relation === 2" type="plain" @click="fixRelation(index, 'add_follows', item.id, item.screen_name)" class="fans-item__relation is-nofocus"><i class="iconfont icon-add-icon"></i>&nbsp;关注</el-button>
              </div>
              <div class="fans-item__right">
                <el-button type="text" @click="handlerUnfrened(index, item.id, item.screen_name)" class="fans-item__relation is-black">加入黑名单</el-button>
              </div>
            </li>
          </ul>
          <div v-else class="fans-footer">
            暂时没有数据哦~
          </div>
        </div>
        <div class="index-pagination" v-if="pageInfo && pageInfo.total_number && pageInfo.total_number > 0">
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
import Filter from '../../filters';

export default {
  name: 'home-fans',
  data() {
    return {
      loading: false,
      loadingSubmit: false,
      fansDate: [],
      fansData: [],
      forbiddenFuture: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      pageInfo: {
        page: 1,
        page_size: 20,
        total_number: 0
      }
    };
  },
  mounted() {
    this.fetchFans(1);
  },
  methods: {
    imageLoadOnError(event) {
      event.currentTarget.setAttribute('src', _.getAvatar());
    },
    handleChange(val) {
      if (!val) {
        this.fansDate = [];
        return;
      }
      console.log(val);
      this.fansDate = val.trim().split(' - ');
    },
    fetchFans(page) {
      const self = this;
      const date = self.fansDate;
      let start = '';
      let end = '';
      console.log('date: ', date);
      if (!date.length || date.length < 2) {
        start = '';
        end = '';
      } else {
        start = Filter.formatDate(date[0], 'yyyy-MM-dd');
        end = Filter.formatDate(date[1], 'yyyy-MM-dd');
      }
      console.log('start: ', start, ' end: ', end);
      self.loading = true;
      API.fetchFriendshipList(page, start, end).then(json => {
        console.log('fans json: ', JSON.stringify(json, null, 2));
        self.loading = false;
        if (json && json.code === 0) {
          const data = json.data;
          self.fansData = data.data;
          self.pageInfo = data.page_info;
        } else {
          self.$message({
            showClose: true,
            message: json.message,
            type: 'error'
          });
        }
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log(`当前页: ${val}`);
      _.toTop();
      this.fetchFans(val);
    },
    handlerUnfrened(index, id, name) {
      const self = this;
      self.$confirm('加入黑名单后自动解除关注关系，您的粉丝将无法给您发送消息、文章评论回复、收到您的文章推送以及正常访问您的个人主页！', '提示', {
        confirmButtonText: '确 认',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        self.fixRelation(index, 'add_blacklist', id, name);
      }).catch(() => {
        console.log('用户取消加入黑名单操作');
      });
    },
    fixRelation(index, action, id, name) {
      const self = this;
      self.loadingSubmit = true;
      API.setFriendshipInfo(action, id, name).then(json => {
        console.log('ship json: ', JSON.stringify(json, null, 2));
        self.loadingSubmit = false;
        if (json && json.code === 0) {
          if (action === 'add_follows') {
            self.fansData[index].relation = 4;
          } else if (action === 'cancel_follows') {
            self.fansData[index].relation = 2;
          } else if (action === 'add_blacklist') {
            self.fansData.splice(index, 1);
          }
        } else {
          self.$message({
            showClose: true,
            duration: 2000,
            message: json.message,
            type: 'error'
          });
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

.fans-table {
  margin-top: 40px;
}

.index-table__item.fans-table__item {
  height: 72px;
}

.fans-table__head,
.fans-table__body,
.fans-footer {
  border-left: 1px solid #e7e7e7;
  border-right: 1px solid #e7e7e7;
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
  display: inline-block;
  width: 200px;
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

.fans-item__relation.is-nofocus {
  color: #ff74b9;
  border-color: #ff74b9;
  &:hover {
    color: #fff;
    background-color: #ff74b9;
  }
  &:active {
    color: darken(#fff, 10%);
    background-color: darken(#ff74b9, 10%);
  }
}

.fans-item__relation.is-focus,
.fans-item__relation.is-black {
  color: #999;
  &:hover {
    color: darken(#999, 20%);
  }
  &:active {
    color: darken(#999, 40%);
  }
}

.fans-footer {
  height: 60px;
  line-height: 60px;
  font-size: 14px;
  color: #b5b5b5;
  text-align: center;
  border-bottom: 1px solid #e9e9e9;
}
</style>
