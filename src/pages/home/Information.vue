<template>
  <div class="wrap">
    <div class="news-wrap">
      <div class="news-title">
        <span class="news-title__tips">账号信息</span>
      </div>
      <div class="info-content" v-loading="loadingFlag" element-loading-text="拼命加载中">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" label-position="right" class="info-form">
          <el-form-item label="美柚号名称" prop="name" class="info-parent">
            <div :class="['info-info', { 'hidden': nameEdit }]">{{ ruleForm.name }}</div>
            <el-input placeholder="请输入账号名称" v-model.trim="ruleForm.name" type="text" :maxlength="20" auto-complete="off" :class="['info-input', { 'hidden': !nameEdit }]"></el-input>
            <div :class="['tips', { 'hidden': !nameEdit }]">
              2-10个字或者4-20个字符，请勿使用包含特殊符号或含有明星营销推广意图的帐号名称
            </div>
            <span :class="['info-edit', { 'hidden': nameEdit }]" @click="toggleName(1)"></span>
          </el-form-item>
          <el-form-item label="美柚号介绍" prop="description">
            <div :class="['info-info', { 'hidden': infoEdit }]">{{ ruleForm.description }}</div>
            <el-input type="textarea" v-model.trim="ruleForm.description" :rows="4" :maxlength="40" :autosize="false" auto-complete="off" :class="['info-text', { 'hidden': !infoEdit }]"></el-input>
            <div :class="['tips', { 'hidden': !infoEdit }]">
              10-40个字，要求内容完整通顺，无特殊符号，请勿添加任何联系方式，如微博、手机号、QQ
            </div>
            <span :class="['info-edit', { 'hidden': infoEdit }]" @click="toggleName(2)"></span>
          </el-form-item>
          <el-form-item label="美柚号头像" prop="avatar">
            <div class="info-idcard clearfix">
              <div class="info-avatar">
                <div class="info-pic">
                  <i v-show="isAvatarFlag" class="el-icon-delete" @click="delAvatar">删除</i>
                  <img :src="ruleForm.avatar | https" @error="imageLoadOnError" alt="avatar" />
                </div>
              </div>
              <div class="info-msg">
                <div class="tips info-tips">要求清晰、健康、代表品牌形象请勿使用二维码，最大5M，200x200像素</div>
                <upload :onSuccess="onSuccess" :filters="filters">
                  <el-button type="primary" :disabled="status !== 1" class="info-upload">上 传</el-button>
                </upload>
                <crop :allowSelect="false" :setSelect="[0,0,200,200]" :imgUrl="imgUrl" :aspectRatio="1" @getCropImg="getCropImgUrl" :crop="crop"></crop>
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
            <span :class="['info-edit', { 'hidden': emailEdit }]" @click="toggleName(3)"></span>
          </el-form-item>
          <el-form-item>
            <el-button @click="gotoNext" :disabled="status !== 1 || (!nameEdit && !infoEdit && !isAvatarFlag && !emailEdit)" type="primary">提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>

import API from '../../service';
import upload from '../../components/Upload';
import _ from '../../util/tools';
import ERROR from '../../util/string';
import crop from '../../components/Crop';

export default {
  name: 'home-information',
  components: {
    upload,
    crop
  },
  data() {
    const checkName = (rule, value, callback) => {
      const len = value.trim().replace(/[^\x00-\xff]/g, 'aa').length;
      if (value === '') {
        callback(new Error('请填写账号名称'));
      } else if (!_.isMeiyouName(value)) {
        callback(new Error('请勿使用包含特殊符号的名称'));
      } else if (len < 4 || len > 20) {
        callback(new Error('账号名称为2-10个字或者4-20个字符'));
      } else {
        callback();
      }
    };
    const checkAvatar = (rule, value, callback) => {
      if (this.imgUrl === _.getAvatar()) {
        callback(new Error('请上传美柚号头像'));
      } else {
        callback();
      }
    };
    const checkEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(ERROR.EMAIL_EMPTY));
      } else if (!_.isEmail(value)) {
        callback(new Error(ERROR.EMAIL_FORMAT_ERROR));
      } else {
        callback();
      }
    };
    return {
      filters: {
        ext: 'jpg,gif,png,bmp',
        max_file_size: '2mb'
      },
      imgUrl: '',
      crop: false,
      loadingFlag: false,
      isAvatarFlag: false,
      status: 0,
      ruleForm: {},
      nameEdit: false,
      infoEdit: false,
      emailEdit: false,
      rules: {
        name: [
          { required: true, validator: checkName, trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请填写功能介绍', trigger: 'blur' },
          { min: 10, max: 40, message: '功能介绍为10-40个字', trigger: 'blur' }
        ],
        avatar: [
          { required: true, validator: checkAvatar, trigger: 'change' }
        ],
        email: [
          { required: true, validator: checkEmail, trigger: 'blur' }
        ]
      }
    };
  },
  mounted() {
    this.status = _.getUserStatus();
    this.fetchInfo();
  },
  methods: {
    cropImg(fileUrl) {
      this.crop = !this.crop;
      this.imgUrl = fileUrl;
    },
    getCropImgUrl(cropUrl) {
      this.ruleForm.avatar = cropUrl;
      this.isAvatarFlag = true;
    },
    imageLoadOnError() {
      this.ruleForm.avatar = _.getAvatar();
      this.isAvatarFlag = false;
    },
    delAvatar() {
      this.ruleForm.avatar = '';
      this.isAvatarFlag = false;
    },
    onSuccess(fileUrl) {
      this.cropImg(fileUrl);
    },
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
      const self = this;
      self.$refs.ruleForm.validate(valid => {
        if (!valid) {
          return;
        }
        API.setAccountInfo(self.ruleForm).then(json => {
          console.log('success json: ', JSON.stringify(json, null, 2));
          if (json && json.code === 0) {
            self.$message({
              message: '保存成功！',
              type: 'success',
              duration: 2000,
              onClose: () => {
                _.setUserName({ name: self.ruleForm.name });
                self.$store.commit('setUserInfo');
                self.fetchInfo();
              }
            });
          } else {
            self.$message({
              showClose: true,
              duration: 2000,
              message: json.message,
              type: 'error'
            });
          }
        });
      });
    },
    fetchInfo() {
      // 获取账号信息
      const self = this;
      self.loadingFlag = true;
      API.fetchAccountInfo(1).then(json => {
        self.loadingFlag = false;
        console.log('account json: ', JSON.stringify(json, null, 2));
        if (json && json.code === 0) {
          const data = json.data;
          self.ruleForm = data;
          self.isAvatarFlag = false;
          self.nameEdit = false;
          self.infoEdit = false;
          self.emailEdit = false;
        } else {
          self.$message({
            showClose: true,
            message: json.message,
            type: 'error'
          });
        }
      }).catch(error => {
        self.$message({
          showClose: true,
          message: `接口异常，${error.status}`,
          type: 'error'
        });
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

.info-form .el-form-item__label {
  padding: 5px 20px 5px 0 !important;
}

.info-avatar {
  float: left;
  width: 128px;
  height: 128px;
  font-size: 0;
}

.info-pic {
  position: relative;
  height: 128px;
  border: 1px dashed #ddd;
  background-color: #f7f7f7;
  border-radius: 4px;
}

.info-pic i {
  position: absolute;
  right: 3px;
  top: 3px;
  color: #ff74b9;
  font-size: 14px;
  cursor: pointer;
  display: none;
}

.info-pic:hover i {
  display: block;
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
  margin-top: 10px;
  padding: 8px 30px;
}

.info-info {
  color: #999;
  float: left;
  line-height: 24px;
}

.info-input {
  display: block;
  width: 500px;
}

.info-text {
  display: block;
  width: 500px;
}

.info-edit {
  display: block;
  float: right;
  margin-top: 9px;
  margin-right: -50px;
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
