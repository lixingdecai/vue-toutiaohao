<template>
<div class="publish-pics-box">
  <div class="image-picker picker-dialog-content" v-if="publishVideoForm==false">
    <div>
      <i></i>
      <upload :onSuccess="onSuccess" :beforeUpload="beforeUpload" :filters="imgFilters">
        <el-button type="primary">上传图集</el-button>
      </upload>
      <div class="publish-pics-attention">
        <ul>
          <li>图集功能使用需知：</li>
          <li>1、图集支持PNG、JPEG、JPG图片格式，大小不超过5M, 最长边不超过10000像素；</li>
          <li>2、禁止发布涉及政治敏感、黄色暴力、血腥恐怖等图集；</li>
          <li>3、禁止使用图集模式发表文字类、统计图类、gif图、画质粗糙的视频截图，该类文章将被退回且占用当天的一篇发文次数，建议使用文章模式发表；</li>
        </ul>
      </div>
    </div>
  </div>
  <div v-loading="loading" element-loading-text="保存中...">
    <div class="publish-pics-list-wrap" v-if="publishVideoForm==true">
      <div class="publish-pics-list">
        <draggable :list="publishModal.images" :options="{'handle':'.publish-pics-sort','connectWith': '.publish-pics-list'}">
          <div id="sortable" class="publish-pics-rows" v-for="(item, index) in publishModal.images">
            <div class="publish-pics-img" v-loading="item.loading">
              <div v-show="!item.src" class="publish-pics-uploading">{{item.message ? item.message : '上传中...'}}</div>
              <img v-show="item.src" :src="item.src" />
            </div>
            <div class="publish-pics-desc">
              <textarea maxlength="200" placeholder="图片说明（不超过200个字）" v-model="item.remark"></textarea>
            </div>
            <div class="publish-pics-opers">
              <el-tooltip content="重新上传" placement="top" effect="light">
                <upload :onSuccess="onSuccess" :beforeUpload="beforeReUpload" :fileId="item.id" :filters="imgFilters">
                  <div class="publish-pics-edit"></div>
                </upload>
              </el-tooltip>
              <el-tooltip content="删除" placement="top" effect="light">
                <div class="publish-pics-del" @click="delPic(index)"></div>
              </el-tooltip>
              <el-tooltip content="拖拽排序" placement="top" effect="light">
                <div class="publish-pics-sort" :key="index"></div>
              </el-tooltip>
            </div>
          </div>
        </draggable>
      </div>
      <div class="publish-pics-add-wrap">
        <div class="publish-pics-add">
          <upload :onSuccess="onSuccess" :beforeUpload="beforeUpload" :filters="imgFilters">
            <span>
              <i class="el-icon-plus"></i>
                添加图片
              </span>
          </upload>
        </div>
        <div class="publish-pics-nums">
          已添加{{publishModal.images.length}}张图片
        </div>
      </div>
    </div>
    <el-form :model="publishModal" :rules="rules" ref="publishModal" label-position="left" label-width="120px" class="publish-pics-form" v-if="publishVideoForm==true">
      <el-form-item label="标题" prop="title">
        <div class="">
          <el-input :maxlength="30" :minlength="5" class="title" v-model="publishModal.title"></el-input>
          <span class="title_tip">{{publishModal.title.length}}/30</span>
        </div>
        <span class="title-des">5-30个字</span>
      </el-form-item>
      <el-form-item label="封面" class="is-required">
        <el-radio-group v-model="coverStyle">
          <el-radio label="" :label="0">自动
          <el-tooltip content="系统默认选择正文第一张图片作为封面" placement="top" effect="light">(?)</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="分类" prop="category_id">
        <el-select v-model="publishModal.category_id">
          <el-option v-for="item in publish_category" :label="item.tag_name" :value="item.id + ''"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitPics()">发表</el-button>
        <el-button v-if="publishModal.status === 0 || publishModal.status === 8" @click="saveDraft()">存草稿</el-button>
        <!-- <el-button>客户端预览</el-button> -->
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>
<script>
// import $ from 'jquery';
import draggable from 'vuedraggable';
import API from '../../service';
import upload from '../../components/Upload';

export default {
  name: 'publishVideo',
  components: {
    draggable,
    upload,
  },
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      publishVideoForm: false,
      pics: [],
      coverStyle: 0,
      imgFilters: {
        ext: 'jpg,jpeg,png',
        max_file_size: '5mb'
      },
      publishModal: {
        type: 3,
        title: '',
        content: '',
        thumbs: [],
        images: [],
        category_id: '',
        action: 'add',
        id: '',
        video: {},
        status: 0,
        multi_video: [],
      },
      uploadImageList: [],
      rules: {
        title: [{
          required: true,
          message: '请填写标题',
          trigger: 'blur'
        }, {
          min: 5,
          max: 30,
          message: '标题为5-30个字',
          trigger: 'blur'
        }],
        category_id: [{
          required: true,
          message: '请填写分类',
          trigger: 'change'
        }]
      }
    };
  },
  created() {},
  mounted() {
    this.init();
    if (this.id) {
      API.fetchArticleDetail(this.id).then(result => {
        this.publishModal = result.data;
        const images = this.publishModal.images;
        for (let i = 0; i < images.length; i++) {
          images[i].id = 'static' + i;
        }
        this.publishModal.action = 'update';
        this.publishModal.category_id = this.publishModal.category_id + '';
        this.publishVideoForm = true;
      });
    }
  },
  methods: {
    init: function init() {
      console.log('publish video page init');
      this.publish_category = API.getRemoteArticleCategory(() => {
        this.publishModal.action = 'update';
      }, () => {
        this.publishModal.action = 'add';
      });
    },
    submitPics: function submitPics() {
      this.$refs.publishModal.validate(valid => {
        if (valid) {
          if (this.publishModal.images.length < 4) {
            this.$message.error('请上传至少四张图片！');
            return false;
          }
          this.publishModal.status = 12;
          this.loading = true;
          API.saveUpdateArticle(this.publishModal).then(result => {
            console.log('发表成功' + result);
            this.$message({
              message: '图集发表成功',
              type: 'success'
            });
            this.loading = false;
            this.$router.push('/home/manager');
          }, err => {
            this.loading = false;
            this.$message.error('发表失败:' + err.message);
          });
        } else {
          console.log('error submit!!');
          return false;
        }
        return true;
      });
    },
    saveDraft: function saveDraft() {
      this.$refs.publishModal.validate(valid => {
        if (valid) {
          // if (this.publishModal.images.length < 3) {
          //   return this.$message.error('请上传至少三张图片！');
          // }
          this.publishModal.status = 8;
          this.loading = true;
          API.saveUpdateArticle(this.publishModal).then(result => {
            console.log('保存草稿成功' + result);
            this.$message({
              message: '保存草稿成功',
              type: 'success'
            });
            this.loading = false;
            this.$router.push('/home/manager');
          }, err => {
            this.loading = false;
            this.$message.error('保存草稿失败:' + err.message);
          });
        } else {
          console.log('error submit!!');
          return false;
        }
        return false;
      });
    },
    // addPic() {
    //   const o = {};
    //   o.src = '//sc.seeyouyima.com/forum/data/5840d5e5b16ad_549_418.jpg?imageView2/2/w/750/h/500';
    //   o.remark = 'aaaaaaa' + Math.random();
    //   this.publishModal.images.push(o);
    // },
    delPic(index) {
      this.publishModal.images.splice(index, 1);
    },
    cancel() {
      this.$confirm('确认取消本次的发布，取消后编辑的内容将无法找回', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push('/home');
      }).catch(() => {});
    },
    onSuccess(url, up, file) {
      console.log('files :  ', url, up, file);
      if (this.publishModal.images.length) {
        for (const index in this.publishModal.images) {
          if (file.id === this.publishModal.images[index].id) {
            this.publishModal.images[index].src = url;
            this.publishModal.images[index].url = url;
            this.publishModal.images[index].loading = false;
          }
        }
      }
      // this.publishModal.video.url = url;
      console.log('onVideoUploadSuccess ', this.publishModal);
    },
    beforeReUpload(up, file) {
      console.log('beforeReUpload', this.publishModal, up, file);
      if (this.publishModal.images.length) {
        for (const index in this.publishModal.images) {
          console.log('----id---- ', this.publishModal.images[index].id, file.imageId);
          if (file.imageId === this.publishModal.images[index].id) {
            this.publishModal.images[index].loading = true;
            this.publishModal.images[index].src = '';
            this.publishModal.images[index].url = '';
            console.log('beforeReUpload2', this.publishModal);
          }
        }
      }
    },
    beforeUpload(up, file) {
      console.log('beforeUpload : ', file);
      this.publishVideoForm = true;
      if (file) {
        const ui = {};
        ui.id = file.id;
        ui.name = file.name;
        ui.src = '';
        ui.url = '';
        ui.remark = '';
        ui.loading = false;
        ui.message = '上传中...';
        this.publishModal.images.push(ui);
      }
    }
  }
};
</script>
<style>
.publish-pics-box .publish-pics-form {
  width: 660px;
}

.publish-pics-box .video-picker {
  margin-top: 150px;
}

.publish-pics-box .title .el-input__inner {
  padding-right: 55px;
}

.publish-pics-box .title_tip {
  position: absolute;
  right: 20px;
  top: 9px;
  line-height: 20px;
  font-size: 14px;
  color: #999999;
  letter-spacing: 0;
}

.publish-pics-box .title-des {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #999999;
  letter-spacing: 0;
}

.publish-pics-box .edit-input {
  position: relative;
  display: inline-block;
  background-color: #E7E7E7;
}

.publish-pics-box .video-poster {
  display: inline-block;
  width: 164px;
  height: 92px;
  padding-bottom: 26px;
  vertical-align: middle;
}

.publish-pics-box .image-picker {
  margin-top: 150px;
}

.publish-pics-box .edit-input .modify-poster {
  position: absolute;
  left: 0;
  bottom: 0;
  margin-left: 0;
  width: 164px;
  height: 26px;
  line-height: 26px;
  font-size: 13px;
  color: #fff;
  background-color: rgba(0, 0, 0, .6);
  -webkit-border-radius: 0;
  -moz-border-radius: 0;
  border-radius: 0;
}

.publish-pics-box .edit-input-tips {
  display: inline-block;
  font-size: 14px;
  color: #999999;
  letter-spacing: 0;
  position: absolute;
  left: 178px;
  bottom: -9px;
  width: 400px;
}

.publish-pics-box .input-tips {
  color: #999999;
  margin-left: 20px;
}

.publish-pics-box .video-uploaded {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  height: 116px;
  padding-top: 42px;
}

.publish-pics-box .video-feedback {
  margin-top: 11px;
  padding-left: 68px;
  position: relative;
}

.publish-pics-box .video-feedback-icon {
  background-image: url("../../assets/images/icon-upload-success.png");
  height: 40px;
  left: 0;
  margin-top: -24px;
  position: absolute;
  top: 50%;
  width: 40px;
}

.publish-pics-box .video-feedback-desc .oneline {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.publish-pics-uploading {
  color: #ff74b9;
  font-size: 12px;
}

.publish-pics-box .video-feedback-retry {
  color: #4e7dd2;
  float: left;
  font-size: 14px;
  overflow: hidden;
  position: relative;
}

.publish-pics-attention {
  color: #999;
  font-size: 12px;
  text-align: left;
  margin-left: 200px;
  margin-top: 80px;
}

.publish-pics-attention li {
  float:left;
  margin: 7px 0;
  width: 550px
}

.publish-pics-attention li:last-child {
 /* line-height: 40px;
  height: 40px;*/
}

.publish-pics-rows {
  height: 110px;
  overflow: hidden;
  margin-bottom: 15px;
  background-color: #fff;
}

.publish-pics-img {
  float: left;
  line-height: 110px;
  width: 110px;
  text-align: center;
}

.publish-pics-img img {
  width: 110px;
  height: 110px;
}

.publish-pics-desc {
  float: left;
  margin-left: 20px;
}

.publish-pics-opers {
  float: left;
  margin-left: 40px;
  margin-top: 46px;
}

.publish-pics-desc textarea {
  height: 110px;
  width: 600px;
  background: #FFFFFF;
  border: 1px solid #DDDDDD;
  border-radius: 4px;
  padding-top: 15px;
  padding-left: 15px;
}

.publish-pics-edit,
.publish-pics-del,
.publish-pics-sort {
  height: 18px;
  width: 18px;
  float: left;
  margin-left: 20px;
  cursor: pointer;
}

.publish-pics-edit {
  background: url('../../assets/images/publish-pics-edit.png') no-repeat 0 0;
  margin-top: 1px;
}

.publish-pics-del {
  background: url('../../assets/images/publish-pics-del.png') no-repeat 0 0;
}

.publish-pics-sort {
  background: url('../../assets/images/publish-pics-sort.png') no-repeat 0 0;
  margin-top: 4px;
}

.publish-pics-add-wrap {
  overflow: hidden;
  margin-top: 30px;
}

.publish-pics-add {
  margin-bottom: 60px;
  font-size: 16px;
  color: #65ABEC;
  cursor: pointer;
  float: left;
}

.publish-pics-nums {
  float: right;
  color: #999;
}
</style>
