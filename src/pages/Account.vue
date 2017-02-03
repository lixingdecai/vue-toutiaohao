<template lang="html">
  <div class="container">
    <mp-steps :active="3"></mp-steps>
    <div class="center-wrap">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" label-position="right" class="center-form">
        <el-form-item label="帐号名称" prop="name">
          <el-input placeholder="请输入姓名" type="text" v-model.trim="ruleForm.name" auto-complete="off"></el-input>
          <div class="tips">
            3-8 个字，请勿使用包含特殊符号或含有明星营销推广意图的帐号名称
          </div>
        </el-form-item>
        <el-form-item label="功能介绍" prop="description">
          <el-input type="textarea" :rows="4" :autosize="false" v-model.trim="ruleForm.description" auto-complete="off"></el-input>
          <div class="tips">
            10-40个字，要求内容完整通顺，无特殊符号，请勿添加任何联系方式，如微博、手机号、QQ
          </div>
        </el-form-item>
        <el-form-item label="美柚号头像" prop="photo">
          <div class="operation-idcard clearfix">
            <div class="account-avatar">
              <div class="account-pic">
                <img :src="ruleForm.avatar"/>
              </div>
            </div>
            <div class="account-msg">
              <div class="tips operation-tips">支持绝大多数的图片格式，不超过2M。要求清晰、代表美柚号形象，勿使用二维码。</div>
              <upload uploadId='aaa' :onSuccess="onSuccess" :onProgress="onProgress" :beforeUpload="beforeUpload">
                <el-button size="small" type="primary" class="account-upload">上 传</el-button>
              </upload>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="所在地" class="is-required">
          <area-choose
            @setProvince="ruleForm.province_id = arguments[0]"
            @setCity="ruleForm.city_id = arguments[0]"
            :province="ruleForm.province_id"
            :city="ruleForm.city_id">
          </area-choose>
        </el-form-item>
        <el-form-item label="所属领域" prop="category_id">
          <el-select v-model="ruleForm.category_id" placeholder="请选择" class="account-domain">
            <el-option
              label="全部领域"
              value="-1">
            </el-option>
            <el-option
              v-for="item in domains"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
    </div>
    <div class="center-bottom">
      <el-button type="default" @click="gotoBack">上一步</el-button>
      <el-button type="primary" @click="gotoNext">完 成</el-button>
    </div>

  </div>
        
</template>

<script>
// import API from '../service';
import mpSteps from '../components/Steps';
import API from '../service';
import areaChoose from '../components/AreaChoose';
import upload from '../components/Upload';

export default {
  name: 'register',
  components: {
    areaChoose,
    upload,
    mpSteps
  },
  created() {
    // 获取账号信息
    API.fetchAccountInfo(1).then(json => {
      if (json.code === 0) {
        const data = json.data;
        if (data && data.length !== 0) {
          this.ruleForm = data;
          this.$set(this.ruleForm, 'step', 2);
          // TODO 待上传组件完善
          this.$set(this.ruleForm, 'avatar', 'https://fasfsdaf');
          // 获取用户以及分类信息
          API.fetchApplyInfo(2).then(cjson => {
            if (cjson.code === 0) {
              const cdata = cjson.data;
              this.domains = cdata.category;
              const user = cdata.user;
              if (user) {
                this.$set(this.ruleForm, 'name', user.user_name);
              }
            } else {
              this.$message.error(cjson.message);
            }
          }).catch(error => {
            this.$message.error('接口异常，' + error.status);
          });
        }
      } else {
        this.$message.error(json.message);
      }
    }).catch(error => {
      this.$message.error('接口异常，' + error.status);
    });
  },
  data() {
    return {
      domains: [],
      ruleForm: {
        name: '',
        avatar: '',
        description: '',
        city_id: '',
        province_id: '',
        category_id: '',
        step: 2
      },
      rules: {
        name: [
          { required: true, message: '请输入运营者姓名', trigger: 'blur' }
        ],
        avatar: [
          { required: true, message: '请上传美柚号头像', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入功能介绍', trigger: 'blur' }
        ],
        province_id: [
          { required: true, message: '请选择所在省份', trigger: 'change' }
        ]
      }
    };
  },
  methods: {
    gotoBack() {
      this.$router.push('operation');
    },
    beforeUpload(up, file) {
      console.info(up);
      console.info(file);
    },
    onProgress(up, file) {
      console.info(up);
      console.info(file.percent);
    },
    onSuccess(fielUrl) {
      this.ruleForm.avatar = fielUrl;
      console.info(fielUrl);
    },
    gotoNext() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (!this.ruleForm.province_id || !this.ruleForm.city_id) {
            this.$message.error('请选择所在地！');
          } else {
            API.settingUser(this.ruleForm).then(json => {
              if (json.code > 0) {
                this.$message.error(json.message);
              } else {
                // 跳转到下一步
                this.$router.push('home');
              }
            });
          }
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

<style lang="scss">
.account-avatar {
  float: left;
  width: 90px;
  height: 90px;
  font-size: 0;
}

.account-pic {
  width: 90px;
  height: 90px;
  border: 1px dashed #ddd;
  background-color: #f7f7f7;
  border-radius: 4px;
}

.account-msg {
  float: left;
  width: 240px;
  height: 90px;
  margin-left: 20px;
}

.account-upload {
  margin-top: 26px;
}

.account-domain {
  width: 100%;
}
</style>
