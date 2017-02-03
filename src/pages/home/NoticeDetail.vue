<template>
  <div class="wrap">
    <div class="notice-wrap">
      <div class="news-title">
        <span class="news-title__tips">公告详情</span>
      </div>
    </div>
    <div class="notice-body" v-loading="loading" element-loading-text="拼命加载中">
      <h2 class="notice-title">{{ noticeDetail.title }}</h2>
      <div v-html="noticeDetail.content" class="notice-content"></div>
      <div class="notice-footer">
        <p>{{ noticeDetail.updated_at | formatDate('yyyy-MM-dd') }}</p>
        <p>美柚号</p>
      </div>
    </div>
    <div class="notice-back">
      <el-button type="default" @click="goBack">返 回</el-button>
    </div>
  </div>
</template>

<script>
import API from '../../service';

export default {
  name: 'notice-detail',
  data() {
    return {
      loading: false,
      noticeDetail: {}
    };
  },
  mounted() {
    const self = this;
    const id = parseInt(self.$route.params.id, 10);
    self.fetchDetail(id);
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    fetchDetail(id) {
      const self = this;
      if (!id) {
        self.$message({
          showClose: true,
          message: '抱歉，该公告不存在~',
          type: 'error'
        });
        self.goBack();
      }
      self.loading = true;
      API.fetchAnnouceDetail(id).then(json => {
        console.log('newsDetail json: ', json);
        if (json && json.code === 0) {
          self.noticeDetail = json.data;
          // self.noticeDetail.content = '<p>尊敬的美柚号用户：</p><p>您好，因网络原因影响到美柚号平台中的文章发表功能。为避免数据出现异常，请尽量在今日19:00之后再登录后台进行管理。后台系统将于2016年7月8日进行系统更新维护，具体更新内容如下：</p><p>一、首页界面优化，部分控件更改；</p><p>二、支持视频后台编辑功能，提高上传视频质量；</p><p>三、修复XXXbug。</p><p>对此给您带来的不便，请您谅解，同时也请您继续支持我们的美柚号平台，谢谢！近期一些不法分子利用非法改号软件，模拟公司财务电话来电号码，对公司客户进行诈骗！公司财务电话不会主动联系客户，若有异常情况，请第一时间与公司核实情况！汇款之前请与公司财务或打办公室电话核对汇款账号！公司所有办公、财务电话号码、网址等都不会变更，请所有用户注意！公司所有决定都在本公告页面公布，请随时注意查看。给您带来任何不便，敬请谅解。</p>';
          self.loading = false;
        } else {
          self.loading = false;
          self.goBack();
        }
      });
    }
  }
};
</script>

<style lang="scss">
.notice-wrap {
  padding: 0 40px;
}

.notice-body {
  margin: 30px 40px 0;
  padding-bottom: 100px;
  border-bottom: 1px solid #ddd;
  p {
    line-height: 28px;
  }
}

.notice-title {
  font-size: 20px;
  text-align: center;
  margin-bottom: 20px;
}

.notice-footer {
  text-align: right;
  padding: 40px 0;
  p {
    line-height: 26px;
  }
}

.notice-back {
  text-align: center;
  padding: 30px 0;
}
</style>
