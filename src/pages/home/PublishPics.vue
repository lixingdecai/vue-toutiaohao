<template>
<div class="publish-pics-box">
  <div class="image-picker picker-dialog-content" v-if="publishVideoForm==false">
    <div>
      <i></i>
      <el-button type="primary" @click="publishVideoForm=true">上传图集</el-button>
      <div class="publish-pics-attention">
        <ul>
          <li>图集功能使用需知：</li>
          <li>1、图集支持绝大部分图片格式，大小不超过5M,最长边不超过1000像素；</li>
          <li>1、禁止发布涉及政治敏感，黄色暴力，血腥恐怖等图集；</li>
        </ul>
      </div>
    </div>
  </div>
  <div class="publish-pics-list-wrap" v-if="publishVideoForm==true">
    <div class="publish-pics-list">
      <draggable :list="publishModal.images" :options="{'handle':'.publish-pics-sort','connectWith': '.publish-pics-list'}">
        <div id="sortable" class="publish-pics-rows" v-for="(item, index) in publishModal.images">
          <div class="publish-pics-img" @click="delPic(index)">
            <img :src="item.src" />
          </div>
          <div class="publish-pics-desc">
            <textarea class="textaaa" placeholder="图片说明（不超过200个字）" v-model="item.remark"></textarea>
          </div>
          <div class="publish-pics-opers">
            <div class="publish-pics-edit"></div>
            <div class="publish-pics-del" @click="delPic(index)"></div>
            <div class="publish-pics-sort" :key="index"></div>
          </div>
        </div>
      </draggable>
    </div>
    <div class="publish-pics-add-wrap">
      <div class="publish-pics-add" @click="addPic()">
        <span>
            <i class="el-icon-plus"></i>
              添加图片
            </span>
      </div>
      <div class="publish-pics-nums">
        已添加{{pics.length}}张图片
      </div>
    </div>
  </div>
  <el-form ref="form" :model="form" label-position="left" label-width="120px" class="publish-pics-form" v-if="publishVideoForm==true">
    <el-form-item label="标题">
      <div class="">
        <el-input class="title" v-model="publishModal.title"></el-input>
        <span class="title_tip">0/30</span>
      </div>
      <span class="title-des">5-30个字</span>
    </el-form-item>
    <el-form-item label="分类">
      <el-select v-model="publishModal.category_id">
        <el-option v-for="item in publish_category" :label="item.tag_name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitPics()">发表</el-button>
      <el-button @click="submitPics()">存草稿</el-button>
      <el-button>客户端预览</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</div>
</template>
<script>
// import $ from 'jquery';
import draggable from 'vuedraggable';
// import 'sortablejs';
import API from '../../service';

export default {
  name: 'publishVideo',
  components: {
    draggable,
  },
  data() {
    return {
      publishVideoForm: false,
      pics: [],
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
    this.$nextTick(() => {
      // $('.textaaa').on('click', function n() {
      //   console.log(this);
      // });
      // $('.column').sortable({
      //   connectWith: '.column',
      //   handle: '.portlet-header',
      //   cancel: '.portlet-toggle',
      //   placeholder: 'portlet-placeholder ui-corner-all'
      // });
    });
    //
    this.init();
  },
  methods: {
    init: function init() {
      console.log('publish video page init');
      this.publish_category = API.getRemoteArticleCategory();
    },
    submitPics: function submitPics() {
      this.publishModal.status = 1;
      API.saveUpdateArticle(this.publishModal).then(result => {
        console.log('发表成功' + result);
        this.$message({
          message: '视频发表成功',
          type: 'success'
        });
      }, err => {
        this.$message.error('发表失败:' + err.message);
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
    },
    addPic() {
      const o = {};
      o.src = '//sc.seeyouyima.com/forum/data/5840d5e5b16ad_549_418.jpg?imageView2/2/w/750/h/500';
      o.remark = 'aaaaaaa' + Math.random();
      this.publishModal.images.push(o);
    },
    delPic(index) {
      this.publishModal.images.splice(index, 1);
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
  line-height: 30px;
  height: 30px;
}

.publish-pics-attention li:last-child {
  line-height: 40px;
  height: 40px;
}

.publish-pics-rows {
  height: 110px;
  overflow: hidden;
  margin-bottom: 15px;
}

.publish-pics-img {
  float: left;
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
