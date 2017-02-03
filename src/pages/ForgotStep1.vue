<template lang="html">
  <div class="container forgot-container">
    <div class="forgot-wrap">
      <div class="forgot-steps">
        <el-steps :space="152" :active="1" finish-status="finish" class="el-steps">
          <el-step title="身份验证"></el-step>
          <el-step title="邮件验证"></el-step>
          <el-step v-if="ruleForm.action === 'password'" title="密码重置"></el-step>
          <el-step v-else title="手机重置"></el-step>
        </el-steps>
      </div>
      <div class="forgot-mobile__body">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="120px" class="forgot-form">
          <el-form-item label="运营者姓名" class="forgot-name" prop="name">
            <el-input placeholder="请输入运营者姓名" type="text" v-model.trim="ruleForm.name" :maxlength=15 auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="运营者身份证号" prop="number">
            <el-input placeholder="请输入运营者身份证号" type="text" v-model.trim="ruleForm.number" :maxlength=18 auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" class="forgot-next" @click.prevent="handleValidateIdNum">继 续</el-button>
      </div>
    </div>
  </div>
</template>

<script type="es6">
import API from '../service';
import ERROR from '../util/string';

export default {
  name: 'forgot',
  data() {
    const checkName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(ERROR.NAME_EMPTY));
      } else if (value.trim().length < 2 || value.trim().length > 15 || !(/^[\u4E00-\u9FA5]{2,15}$/.test(value.trim()))) {
        callback(new Error(ERROR.NAME_LENGTH_INVALID));
      } else {
        callback();
      }
    };
    const checkNumber = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(ERROR.IDCARD_EMPTY));
      // 15位到18位的身份证号码正则
      } else if (!(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|[Xx])$/.test(value.trim()))) {
        callback(new Error(ERROR.IDCARD_FORMAT_ERROR));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        action: 'password',
        name: '',
        number: ''
      },
      rules: {
        name: [
          { validator: checkName, trigger: 'blur' }
        ],
        number: [
          { validator: checkNumber, trigger: 'blur' }
        ]
      }
    };
  },
  mounted() {
    const self = this;
    const action = self.$route.query.action;
    console.log(action !== 'password');
    if (!action || action === '' || (action !== 'password' && action !== 'mobile')) {
      self.$message({
        showClose: true,
        message: 'action参数错误，请重新申请~',
        type: 'error'
      });
    } else {
      self.ruleForm.action = action.trim();
    }
  },
  methods: {
    handleValidateIdNum() {
      const self = this;
      self.$refs.ruleForm.validate(valid => {
        if (!valid) {
          return;
        }

        API.submitValidateNo(self.ruleForm).then(json => {
          console.log('validate json: ', JSON.stringify(json, null, 2));
          if (json && json.code === 0) {
            const email = json.data.email;
            self.$router.push({ name: 'forgot-step2', params: { email: email } });
          } else {
            self.$message({
              showClose: true,
              message: json.message,
              type: 'error'
            });
            return;
          }
        }, err => {
          self.$message({
            showClose: true,
            message: '系统错误, 请刷新页面重试!',
            type: 'error'
          });
          console.error(err);
          return;
        });
      });
    }
  }
};
</script>

<style lang="scss">
.forgot-wrap {
  position: relative;
  text-align: left;
  padding: 20px 40px;
}

.forgot-steps {
  width: 650px;
  padding: 20px 0 0;
  margin: 0 auto;
  text-align: center;
  .el-steps {
    margin-left: 120px;
  }
}

.forgot-mobile__body {
  width: 480px;
  margin: 0 auto;
  text-align: center;
}

.forgot-form {
  text-align: left;
}

.forgot-name {
  margin-top: 40px;
}

.forgot-next {
  margin-top: 20px;
}
</style>
