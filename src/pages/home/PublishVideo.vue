<template>
<div>
  <crop :aspectRatio="3/2" :imgUrl="imgUrl" @getCropImg="publishModal.video.thumb = arguments[0]" :crop="crop">
  </crop>
  <div class="publish-video-box" v-loading="loading2" element-loading-text="加载中...">
    <div class="video-picker picker-dialog-content" v-if="publishVideoForm==false">
      <div>
        <i></i>
        <upload :onSuccess="onVideoUploadSuccess" :beforeUpload="onVideoBeforeUpload" :onProgress="onProgress" :filters="filters">
          <el-button type="primary" @click="">点击选择视频</el-button>
        </upload>
        <span>支持MP4格式的视频，大小不超过2G，较大的视频请压缩上传</span>
      </div>
    </div>
    <div v-loading="loading" element-loading-text="保存中...">
      <el-form :model="publishModal" :rules="rules" ref="publishModal" label-position="left" label-width="120px" class="publish-pics-form" v-if="publishVideoForm==true">
        <el-form-item class="upload-status" label="视频上传">
          <div id="video-uploaded" class="video-uploaded" v-if="uploadFile.percent == 100 || !uploadFlag">
            <div class="video-uploaded">
              <div class="video-feedback video-success">
                <span :class="[uploadFlag ? 'video-feedback-icon el-icon-check' : 'video-feedback-icon video-feedback-error el-icon-close']"></span>
                <div class="video-feedback-desc">{{uploadFlag ? '视频上传成功，处理完毕' : '视频上传失败'}}</div>
                <div class="sclearfix">
                  <div class="oneline video-name">{{videoName}}</div>
                  <a class="video-preview" href="javascript:;" target="_blank"></a>
                  <div class="video-feedback-retry">
                    <upload :onSuccess="onVideoUploadSuccess" :beforeUpload="onVideoBeforeUpload" :onProgress="onProgress" :filters="filters">
                      <span>重新上传</span>
                    </upload>
                    <span @click="reUploadDialogVisible = true">重新上传</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="uploadFile.percent != 100 && uploadFlag" class="video-progress-box">
            <div class="video-progress-text">
              <span class="video-n">{{uploadFile.name}}</span>
              <span class="video-h">
                {{(uploadFile.size * uploadFile.percent / (100 *1024 *1024)).toFixed(2)}}MB\
                {{(uploadFile.size/(1024* 1024)).toFixed(2)}}MB
              </span>
            </div>
            <div class="video-progress-bar">
              <el-progress :text-inside="true" :stroke-width="18" :percentage="uploadFile.percent"></el-progress><i @click="cancelUpload()"></i>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <div class="">
            <el-input class="title" :maxlength="30" v-model="publishModal.title"></el-input>
            <span class="title_tip">{{publishModal.title.length}}/30</span>
          </div>
          <span class="title-des">5-30个字</span>
        </el-form-item>
        <el-form-item label="视频简介(选填)">
          <el-input type="textarea" v-model="publishModal.video.remark" :autosize="{ minRows: 6, maxRows: 6}">
          </el-input>
        </el-form-item>
        <el-form-item label="视频封面">
          <div class="edit-input">
            <img v-if="publishModal.video.thumb" class="video-poster" :src="publishModal.video.thumb">
            <button type="button" class="new-btn modify-poster" @click="settingVideoCover=true">
            设置视频封面
          </button>
            <div class="edit-input-tips">
             请设置您的视频封面
            </div>
          </div>
        </el-form-item>
       <!--  <el-form-item label="同时发布到动态">
          <el-radio-group v-model="publishModal.is_timeline">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是
              <el-tooltip content="发布到客户端个人主页的动态列表" placement="top" effect="light">(?)</el-tooltip>
            </el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="分类" prop="category_id">
          <el-select v-model="publishModal.category_id">
            <el-option v-for="item in publish_category" :label="item.tag_name" :value="item.id + ''"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitVideo()">发表</el-button>
          <el-button @click="saveDraft()">存草稿</el-button>
          <!-- <el-button>客户端预览</el-button> -->
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="提示" v-model="reUploadDialogVisible" size="tiny" class="reupload-dialog">
      <span>是否确认重新上传视频</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reUploadDialogVisible = false">取 消</el-button>
        <upload :onSuccess="onVideoUploadSuccess" :beforeUpload="onVideoBeforeUpload"  :onProgress="onProgress" :filters="filters">
          <el-button type="primary" @click="reUploadDialogVisible = false">确 定</el-button>
        </upload>
      </span>
    </el-dialog>
    <el-dialog title="设置视频封面" v-model="settingVideoCover" class="video-cover-dialog">
      <div class="set-video-cover-content">请从本地选择一张图片作为您的视频封面
      </div>
      <div slot="footer" class="dialog-footer">
        <upload :onSuccess="onVideoCoverSuccess" :beforeUpload="onVideoCoverBeforeUpload">
          <el-button type="primary">从本地上传照片</el-button>
        </upload>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import API from '../../service';
import upload from '../../components/Upload';
import crop from '../../components/Crop';

export default {
  name: 'publishVideo',
  components: {
    upload,
    crop
  },
  props: {
    id: String
  },
  data() {
    return {
      up: '',
      uploadFlag: true,
      videoName: '',
      loading: false,
      loading2: false,
      imgUrl: '',
      crop: false,
      reUploadDialogVisible: false,
      publishVideoForm: false,
      dialogVideoVisible: false,
      uploadFile: {
        percent: 0,
        size: 0,
        name: ''
      },
      filters: {
        ext: 'mp4',
        max_file_size: '1000mb'
      },
      settingVideoCover: false,
      publish_category: [],
      publishModal: {
        type: 4,
        title: '',
        content: '',
        thumbs: [{
          src: ''
        }, {
          src: ''
        }, {
          src: ''
        }],
        images: [],
        category_id: '',
        action: 'add',
        id: '',
        multi_video: [],
        status: 1,
        video: {
          time: '',
          thumb: '',
          url: '',
          remark: '',
        },
        is_timeline: 0,
      },
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
  mounted() {
    this.init();
    if (this.id) {
      API.fetchArticleDetail(this.id).then(result => {
        this.publishModal = result.data;
        this.publishModal.action = 'update';
        this.publishModal.category_id = this.publishModal.category_id + '';
        this.$set(this.publishModal, 'is_timeline', 0);
        this.publishVideoForm = true;
        this.uploadFile.percent = 100;
      });
    }
  },
  methods: {
    cropImg() {
      this.crop = !this.crop;
      this.imgUrl = this.publishModal.video.thumb;
    },
    init: function init() {
      console.log('publish video page init');
      this.publish_category = API.getRemoteArticleCategory();
      // API.fetchArticleCategory().then(result => {
      //   console.log('获取文章分类成功');
      //   this.publish_category = result.data;
      // }, err => {
      //   console.error('获取文章分类成功失败:' + err.message);
      // });
    },
    showUplaodDialog() {
      this.dialogVideoVisible = true;
    },
    submitVideo: function submitVideo() {
      this.publishModal.status = 1;
      this.$refs.publishModal.validate(valid => {
        if (valid) {
          if (!this.publishModal.video.thumb) {
            this.$message.error('请先上传视频封面！');
            return false;
          }
          if (!this.publishModal.video.url) {
            this.$message.error('请先上传视频！');
            return false;
          }
          console.log(this.publishModal);
          this.loading = true;
          API.saveUpdateArticle(this.publishModal).then(result => {
            console.log('发表成功' + result);
            this.$message({
              message: '视频发表成功',
              type: 'success'
            });
            this.loading = false;
            this.$router.push('/home/manager');
          }, err => {
            this.loading = false;
            this.$message.error('发表失败' + err.message);
            console.error('发表失败:' + err.message);
          });
        } else {
          console.log('error submit!!');
          // this.loading = false;
          return false;
        }
        return false;
      });
    },
    saveDraft: function saveDraft() {
      this.publishModal.status = 8;
      this.$refs.publishModal.validate(valid => {
        if (valid) {
          if (!this.publishModal.video.thumb) {
            this.$message.error('请先上传视频封面！');
            return false;
          }
          if (!this.publishModal.video.url) {
            this.$message.error('请先上传视频！');
            return false;
          }
          console.log(this.publishModal);
          this.loading = true;
          API.saveUpdateArticle(this.publishModal).then(result => {
            console.log('保存草稿成功' + result);
            this.$message({
              message: '视频保存草稿成功',
              type: 'success'
            });
            this.loading = false;
            this.$router.push('/home/manager');
          }, err => {
            this.loading = false;
            this.$message.error('保存草稿失败' + err.message);
            console.error('保存草稿失败:' + err.message);
          });
        } else {
          console.log('error submit!!');
          // this.loading = false;
          return false;
        }
        return false;
      });
    },
    cancelUpload() {
      if (this.up) {
        this.up.stop();
      }
      this.$confirm('确认取消上传', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Object.assign(this.uploadFile, this.$options.data().uploadFile);
        this.publishModal.video.url = '';
        this.videoName = '';
        this.uploadFlag = false;
        this.up.destroy();
      }).catch(() => {
        this.up.start();
      });
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
    onVideoBeforeUpload(up, file) {
      this.publishModal.video.url = '';
      this.uploadFile = file;
      this.publishVideoForm = true;
      this.uploadFlag = true;
      this.up = up;
    },
    onVideoUploadSuccess(url, file) {
      this.videoName = file.files[0].name;
      this.publishModal.video.url = url;
      this.uploadFlag = true;
      console.log('onVideoUploadSuccess' + url);
    },
    onVideoCoverBeforeUpload() {
      this.settingVideoCover = false;
      this.loading2 = true;
    },
    onVideoCoverSuccess(url, file) {
      this.loading2 = false;
      console.log(file);
      this.publishModal.video.thumb = url;
      this.settingVideoCover = false;
      this.cropImg();
      console.log('upload video corver success');
    },
    onProgress(up, file) {
      console.log(file);
    }
  }
};
</script>
<style>
.publish-video-box .publish-pics-form {
  width: 660px;
}

.publish-video-box .video-picker {
  margin-top: 150px;
}

.publish-video-box .title .el-input__inner {
  padding-right: 55px;
}

.publish-video-box .title_tip {
  position: absolute;
  right: 20px;
  top: 9px;
  line-height: 20px;
  font-size: 14px;
  color: #999999;
  letter-spacing: 0;
}

.publish-video-box .title-des {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #999999;
  letter-spacing: 0;
}

.publish-video-box .edit-input {
  position: relative;
  width: 134px;
  height: 80px;
  display: inline-block;
  background-color: #E7E7E7;
  background-image: url(../../assets/images/video-cover.png);
  background-position: center;
  background-repeat: no-repeat;
}

.publish-video-box .video-poster {
  display: inline-block;
  width: 164px;
  height: 92px;
  padding-bottom: 26px;
  vertical-align: middle;
}

.publish-video-box .video-uploaded {
  padding: 0px 12px 11px;
}

.publish-video-box .edit-input .modify-poster {
  position: absolute;
  left: 0;
  bottom: 0;
  margin-left: 0;
  width: 134px;
  height: 17px;
  line-height: 17px;
  font-size: 12px;
  color: #fff;
  background-color: rgba(0, 0, 0, .6);
  -webkit-border-radius: 0;
  -moz-border-radius: 0;
  border-radius: 0;
}

.publish-video-box .edit-input-tips {
  display: inline-block;
  font-size: 14px;
  color: #999999;
  letter-spacing: 0;
  position: absolute;
  left: 178px;
  bottom: -9px;
  width: 400px;
}

.publish-video-box .input-tips {
  color: #999999;
  margin-left: 20px;
}

.publish-video-box .video-uploaded {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  height: 86px;
}

.publish-video-box .video-feedback {
  padding-left: 68px;
  position: relative;
}

.publish-video-box .video-feedback-icon {
  color: #fff;
  height: 40px;
  left: 0;
  margin-top: -24px;
  position: absolute;
  top: 50%;
  width: 40px;
  font-size: 24px;
  background: #449d44;
  border-radius: 100%;
  line-height: 40px;
  text-align: center;
}

.publish-video-box .video-feedback-icon.video-feedback-error {
  background: #c9302c;
}

.publish-video-box .video-feedback-desc .oneline {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.publish-video-box .video-name {
  color: #999;
  float: left;
  font-size: 14px;
  margin-right: 24px;
  max-width: 300px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.publish-video-box .video-feedback-retry {
  color: #4e7dd2;
  float: left;
  font-size: 14px;
  overflow: hidden;
  position: relative;
}

.publish-video-box .upload-status {}
</style>
