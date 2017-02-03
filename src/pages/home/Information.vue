<template>
  <div class="wrap">
    <div class="news-wrap">
      <div class="news-title">
        <span class="news-title__tips">账号信息</span>
      </div>
      <div class="info-content">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" label-position="left" class="info-form">
          <el-form-item label="美柚号名称" prop="name" class="info-parent">
            <div :class="['info-info', { 'hidden': nameEdit }]">{{ruleForm.name}}</div>
            <el-input placeholder="请输入姓名" v-model.trim="ruleForm.name" type="text" auto-complete="off" :class="['info-input', { 'hidden': !nameEdit }]"></el-input>
            <span class="info-edit" @click="toggleName(1)"></span>
          </el-form-item>
          <el-form-item label="美柚号介绍" prop="description">
            <div :class="['info-info', { 'hidden': infoEdit }]">{{ruleForm.description}}</div>
            <el-input type="textarea" v-model.trim="ruleForm.description" :rows="4" :autosize="false" auto-complete="off" :class="['info-text', { 'hidden': !infoEdit }]"></el-input>
            <span class="info-edit" @click="toggleName(2)"></span>
          </el-form-item>
          <el-form-item label="美柚号头像" prop="avatar">
            <div class="info-idcard clearfix">
              <div class="info-avatar">
                <div class="info-pic"></div>
              </div>
              <div class="info-msg">
                <div class="tips info-tips">要求清晰、健康、代表品牌形象请勿使用二维码，最大5M，200x200像素</div>
                <el-button type="primary" class="info-upload">上 传</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="作者二维码" prop="qrcode">
            <div class="info-idcard clearfix">
              <div class="info-avatar">
                <div class="info-pic"></div>
              </div>
              <div class="info-msg">
                <div class="tips info-tips">点击图片即下载，尺寸 290x290 px</div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="美柚号ID" prop="id">
            <div class="info-info">{{ruleForm.userID}}</div>
          </el-form-item>
          <el-form-item label="联系人" prop="contact">
            <div class="info-info">{{ruleForm.realname}}（{{ruleForm.idcard}}）</div>
          </el-form-item>
          <el-form-item label="联系电话" prop="mobile">
            <div class="info-info">{{ruleForm.phone}}</div>
          </el-form-item>
          <el-form-item label="领域" prop="domain">
            <div class="info-info">{{ruleForm.category_name}}</div>
          </el-form-item>
          <el-form-item label="所在地" prop="address">
            <div class="info-info">{{ruleForm.zone}}</div>
          </el-form-item>
          <el-form-item label="联系邮箱" prop="email">
            <div :class="['info-info', { 'hidden': emailEdit }]">{{ruleForm.email}}</div>
            <el-input placeholder="请输入联系邮箱" v-model.trim="ruleForm.email" type="text" auto-complete="off" :class="['info-input', { 'hidden': !emailEdit }]"></el-input>
            <span class="info-edit" @click="toggleName(3)"></span>
          </el-form-item>
          <el-form-item>
            <el-button @click="gotoNext" type="primary">提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>

import API from '../../service';

export default {
  name: 'home-information',
  data() {
    return {
      ruleForm: {
      },
      nameEdit: false,
      infoEdit: false,
      emailEdit: false,
      rules: {
        name: [
          { required: true, message: '请输入运营者姓名', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入功能介绍', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入联系邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入有效的联系邮箱', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    // 获取账号信息
    API.fetchAccountInfo(1).then(json => {
      if (json.code === 0) {
        const data = json.data;
        if (data && data.length !== 0) {
          this.ruleForm = data;
          // TODO 待上传组件完善
          this.$set(this.ruleForm, 'avatar', 'https://fasfsdaf');
        }
      } else {
        this.$message.error(json.message);
      }
    }).catch(error => {
      this.$message.error('接口异常，' + error.status);
    });
  },
  methods: {
    toggleName(_num) {
      const num = parseInt(_num, 10);
      if (num === 1) {
        this.nameEdit = !this.nameEdit;
      } else if (num === 2) {
        this.infoEdit = !this.infoEdit;
      } else if (num === 3) {
        this.emailEdit = !this.emailEdit;
      }
    },
    gotoNext() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          API.setAccountInfo(this.ruleForm).then(json => {
            if (json.code > 0) {
              this.$message.error(json.message);
            } else {
              this.$message({
                message: '保存成功！',
                type: 'success'
              });
            }
          });
        } else {
          console.log('error submit!!');
          return false;
        }
        return false;
      });
    }
  }
};
</script>
<style>
.info-content {
  padding-top: 30px;
}

.info-form {
  width: 700px;
}

.info-idcard {

}

.info-avatar {
  float: left;
  width: 128px;
  height: 128px;
  font-size: 0;
}

.info-pic {
  width: 128px;
  height: 128px;
  border: 1px dashed #ddd;
  background-color: #f7f7f7;
  border-radius: 4px;
}

.info-msg {
  float: left;
  width: 342px;
  height: 128px;
  margin-left: 30px;
}

.info-tips {
  font-size: 14px;
  line-height: 20px;
  color: #999;
}

.info-upload {
  margin-top: 55px;
  padding: 8px 30px;
}

.info-info {
  color: #999;
  float: left;
}

.info-input {
  display: block;
  float: left;
  width: 500px;
}

.info-text {
  display: block;
  float: left;
  width: 500px;
}

.info-edit {
  display: block;
  float: right;
  margin-top: 9px;
  width: 17px;
  height: 17px;
  background: url("../../assets/images/article-editer.png") no-repeat 0 0;
  background-size: 17px 17px;
  cursor: pointer;
}

.info-edit:hover {
  background: url("../../assets/images/article-editer-hover.png") no-repeat 0 0;
  background-size: 17px 17px;
}
</style>
