<template lang="html">
  <div class="container forgot-container">
    <div class="forgot-wrap">
      <div class="forgot-steps">
        <el-steps :space="152" :active="2" finish-status="finish" class="el-steps">
          <el-step title="身份验证"></el-step>
          <el-step title="邮件验证"></el-step>
          <el-step title="密码重置"></el-step>
        </el-steps>
      </div>
      <div class="forgot-mobile__body">
        <p class="forgot-paragra forgot-mt">验证邮件已经下发到您绑定的邮箱</p>
        <p class="forgot-paragra forgot-email"><a href="javascript:;" target="_blank" id="email">{{ $route.params.email }}</a></p>
        <p class="forgot-paragra">请及时登录邮箱进行验证</p>
      </div>
    </div>
  </div>
</template>

<script type="es6">
import EmailList from '../util/email';

export default {
  name: 'forgot',
  created() {
    const email = this.$route.params.email || '';
    if (!email) {
      this.$router.push({ name: 'forgot-step1' });
      return;
    }
  },
  mounted() {
    const email = this.$route.params.email || '';
    const $email = document.getElementById('email');
    let _mail = '';
    if (email) {
      _mail = email.split('@')[1]; //获取邮箱域
      for (const j in EmailList) {
        if (j == _mail) {
          $email.setAttribute('href', EmailList[_mail]); //替换登陆链接
        }
      }
    }
  }
};
</script>
<style>
.forgot-mt {
  margin-top: 40px;
}

.forgot-paragra {
  font-size: 16px;
  color: #323232;
  line-height: 32px;
}

.forgot-email {
  color: #ff74b9;
}
</style>
