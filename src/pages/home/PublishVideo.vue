<template>
<div class="publish-video-box">

  <div class="video-picker picker-dialog-content" v-if="publishVideoForm==false">
    <div>
      <i></i>
      <el-button type="primary" @click="publishVideoForm=true">点击选择视频</el-button>
      <span>支持MP4格式的视频，大小不超过2G，较大的视频请压缩上传</span>
    </div>
  </div>
  <el-form ref="form" :model="form" label-position="left" label-width="120px" class="publish-pics-form" v-if="publishVideoForm==true">
    <el-form-item class="upload-status" label="视频上传">
      <div>
        <div class="video-uploaded">
          <div class="video-feedback video-success">
            <div class="video-feedback-icon"></div>
            <div class="video-feedback-desc">视频上传成功，处理完毕</div>
            <div class="sclearfix">
              <div class="oneline video-name">57bbe475a13bc.mp4</div>
              <a class="video-preview" href="javascript:;" target="_blank"></a>
              <div class="video-feedback-retry"><span>重新上传</span><input name="video_file" id="retry_video_file" type="file"></div>
            </div>
          </div>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="标题">
      <div class="">
        <el-input class="title"></el-input>
        <span class="title_tip">0/30</span>
      </div>
      <span class="title-des">5-30个字</span>
    </el-form-item>
    <el-form-item label="视频简介(选填)">
      <el-input type="textarea" v-model="publishModal.multi_video.remark" :autosize="{ minRows: 6, maxRows: 6}"></el-input>
    </el-form-item>
    <el-form-item label="视频封面">
      <div class="edit-input">
        <!-- <img class="video-poster" src=""> -->
        <button type="button" class="new-btn modify-poster">设置视频封面</button>
        <div class="edit-input-tips">
          默认展示为视频第7帧，也可从本地上传照片作为视频封面
        </div>
      </div>
    </el-form-item>
    <el-form-item label="分类">
      <el-select v-model="publishModal.category_id">
        <el-option v-for="item in publish_category" :label="item.tag_name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitVideo()">发表</el-button>
      <el-button @click="saveDraft()">存草稿</el-button>
      <el-button>客户端预览</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</div>
</template>
<script>
import API from '../../service';

export default {
  name: 'publishVideo',
  data() {
    return {
      publishVideoForm: false,
      publish_category: [],
      publishModal: {
        type: 4,
        title: '啊啊啊',
        content: '',
        thumbs: [],
        images: [],
        category_id: '',
        action: 'add',
        id: '',
        video: {
          time: '',
          thumb: '',
          url: '',
          remark: ''
        },
        status: 1,
        multi_video: [],
      },
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
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
    submitVideo: function submitVideo() {
      this.publishModal.status = 1;
      API.saveUpdateArticle(this.publishModal).then(result => {
        console.log('发表成功' + result);
        this.$message({
          message: '视频发表成功',
          type: 'success'
        });
      }, err => {
        this.$message.error('发表失败' + err.message);
        console.error('发表失败:' + err.message);
      });
    },
    saveDraft: function saveDraft() {
      this.publishModal.status = 8;
      API.saveUpdateArticle(this.publishModal).then(() => {
        this.$message({
          message: '保存草稿成功',
          type: 'success'
        });
        console.log('保存草稿成功');
      }, err => {
        this.$message.error('保存草稿失败：' + err.message);
        console.error('保存草稿失败:' + err.message);
      });
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
  background-image: url("../../assets/images/icon-upload-success.png");
  height: 40px;
  left: 0;
  margin-top: -24px;
  position: absolute;
  top: 50%;
  width: 40px;
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
