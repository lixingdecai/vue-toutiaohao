<template>
<div class="wrap publish-box">
  <div class="publish-box-wrap" v-loading="fullscreenLoading" element-loading-text="拼命加载中">
    <a class="tab-link" href="/specs" target="_blank">发文规范</a>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="发表文章" name="2">
        <el-alert class="restore-alert" v-if="restoreAlert" title="已载入上次的草稿" type="warning" close-text="撤销" @close="unRestore">
        </el-alert>
        <br>
        <el-form label-position="left" label-width="140px" :rules="rules" ref="publishModal" :model="publishModal">
          <div class="public-aticle-box">
            <div>
              <input class="title-input" placeholder="标题(5-30字)" v-model="publishModal.title">
              <span class="title_tip"><span v-bind:class="[publishModal.title.length > 30 ? 'title-tip-err' : '']">{{publishModal.title.length}}</span>/30</span>
            </div>
            <div class="publish-toolbar" id="publishToolbar">
              <el-tooltip content="H1标题" placement="top" effect="light" v-bind:class="[toolStates.Paragraph == 1 ? 'tool-bar-selected' : '', toolStates.Paragraph == -1 ? 'tool-bar-disabled' : '' ]">
                <div v-if="toolStates.Paragraph === 1" class="public-icon toolbar-h icon-toolbar-h" v-on:click="ueDisParagraph()">
                </div>
                <div v-else class="public-icon toolbar-h icon-toolbar-h" v-on:click="ueParagraph()">
                </div>
              </el-tooltip>
              <el-tooltip content="加粗" placement="top" effect="light" v-bind:class="[toolStates.bold == 1 ? 'tool-bar-selected' : '', toolStates.bold == -1 ? 'tool-bar-disabled' : '' ]">
                <div class="public-icon toolbar-b icon-toolbar-b" v-on:click="execCommand('bold')">
                </div>
              </el-tooltip>
              <el-tooltip content="无序列表" placement="top" effect="light" v-bind:class="[toolStates.insertunorderedlist == 1 ? 'tool-bar-selected' : '', toolStates.insertunorderedlist == -1 ? 'tool-bar-disabled' : '' ]">
                <div class="public-icon toolbar-order icon-toolbar-order" v-on:click="insertunorderedlist()">
                </div>
              </el-tooltip>
              <el-tooltip content="有序列表" placement="top" effect="light" v-bind:class="[toolStates.insertorderedlist == 1 ? 'tool-bar-selected' : '', toolStates.insertorderedlist == -1 ? 'tool-bar-disabled' : '' ]">
                <div class="public-icon toolbar-unorder icon-toolbar-unorder" v-on:click="insertorderedlist()">
                </div>
              </el-tooltip>
              <div class="public-separator"></div>
              <el-tooltip content="插入图片" placement="top" effect="light" v-bind:class="[toolStates.insertImage == 1 ? 'tool-bar-selected' : '', toolStates.insertImage == -1 ? 'tool-bar-disabled' : '' ]">
                <div class="public-icon toolbar-pic icon-toolbar-pic" @click="ueInsertImage()">
                </div>
              </el-tooltip>
              <el-tooltip content="插入视频" placement="top" effect="light" v-bind:class="[toolStates.insertvideo == 1 ? 'tool-bar-selected' : '', toolStates.insertvideo == -1 ? 'tool-bar-disabled' : '' ]">
                <div class="public-icon toolbar-video icon-toolbar-video" @click="ueUploadVideo()">
                </div>
              </el-tooltip>
              <el-tooltip content="撤销" placement="top" effect="light" v-bind:class="[toolStates.undo == 1 ? 'tool-bar-selected' : '', toolStates.undo == -1 ? 'tool-bar-disabled' : '' ]">
                <div class="public-icon toolbar-undo icon-toolbar-back" @click="execCommand('undo')">
                </div>
              </el-tooltip>
              <el-tooltip content="重做" placement="top" effect="light" v-bind:class="[toolStates.redo == 1 ? 'tool-bar-selected' : '', toolStates.redo == -1 ? 'tool-bar-disabled' : '' ]">
                <div class="public-icon toolbar-redo icon-toolbar-back" @click="execCommand('redo')">
                </div>
              </el-tooltip>
              <div class="is-saved">
                <span v-if="isAutoSaved">
                  已保存
                </span>
                <span v-else>
                  保存中…
                </span>
              </div>
            </div>
            <div ref="editor">
            </div>
          </div>
          <el-form-item class="video-upload-box" v-if="uploadFile.name">
            <div id="video-uploaded" class="video-uploaded" v-if="uploadFile.percent == 100">
              <div class="video-modify-poster" @click="settingVideoCover=true">设置视频封面</div>
              <div class="video-feedback">
                <div id="video-feedback-status" class="video-feedback-status">
                  <a class="video-success" :href="publishModal.multi_video[0].url " target="_blank" :style="'background-image:url(' + publishModal.multi_video[0].thumb + ')'">
                    <i></i>
                    <!-- <img src="http://p.pstatp.com/large/9820/3808334921" width="100%" height="100%"> -->
                  </a>
                </div>
                <div class="video-feedback-middle">
                  <div class="video-feedback-mtop">
                    <div id="video-feedback-name" class="video-name oneline">{{uploadFile.name}}</div>
                    <i>视频</i>
                  </div>
                  <div class="video-feedback-mbottom">
                    <div class="video-delete" id="video-delete" @click="clearUploadVedio()">删除</div>
                    <div class="video-feedback-retry">
                      <span @click="reUploadDialogVisible = true">重新上传</span>
                    </div>
                  </div>
                </div>
                <el-button type="primary" class="new-btn cancel video-feedback-btn" id="video-feedback-btn" @click="usInsertMVideo()">添加到正文</el-button>
              </div>
            </div>
            <div v-if="uploadFile.percent != 100" class="video-progress-box">
              <div class="video-progress-text">
                <span class="video-n">{{uploadFile.name}}</span>
                <span class="video-h">{{(uploadFile.size * uploadFile.percent / (100 *1024 *1024)).toFixed(2)}}MB/{{(uploadFile.size/(1024* 1024)).toFixed(2)}}MB</span>
              </div>
              <div class="video-progress-bar">
                <el-progress :text-inside="true" :stroke-width="18" :percentage="uploadFile.percent">
                </el-progress>
                <i @click="cancelUpload()"></i>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="封面" v-if="!uploadFile.name">
            <el-radio-group v-model="coverStyle">
              <el-radio label="" :label="0">自动
                <el-tooltip content="系统默认选择正文第一张图片作为封面" placement="top" effect="light">(?)</el-radio>
              <el-radio label="" :label="1">单图模式</el-radio>
              <el-radio label="" :label="3">三图模式(仅在wifi环境下显示)</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="front-cover-box simple-modal" v-show="coverStyle==1 && !uploadFile.name">
            <div class="front-cover-main">
              <i class="front-cover-cur"></i>
              <div class="front-cover-upload">
                <div class="front-cover-wrap">
                  <div class="front-cover-img front-cover-single" :style="{backgroundImage: 'url(' + publishModal.thumbs[0].src + ')'}" @click="showChooseImageCoverDialog(0)">
                    <div class="cover-img-modify" v-if="publishModal.thumbs[0].src"><i class="el-icon-edit"></i><span>修改</span></div>
                  </div>
                </div>
              </div>
              <!-- <div class="front-cover-right">
                <button class="new-btn front-cover-preview cancel" id="front-cover-preview">客户端预览</button>
              </div> -->
              <div class="front-cover-tip">所使用的封面图片均需来自于正文，如文章中含视频请使用自动模式。</div>
            </div>
          </el-form-item>
          <el-form-item class="front-cover-box three-modal" v-show="coverStyle==3 && !uploadFile.name">
            <div class="front-cover-main">
              <i class="front-cover-cur"></i>
              <div class="front-cover-upload">
                <div class="front-cover-wrap">
                  <div class="front-cover-img front-cover-single" :style="{backgroundImage: 'url(' + publishModal.thumbs[0].src + ')'}" @click="showChooseImageCoverDialog(0)">
                    <div class="cover-img-modify" v-if="publishModal.thumbs[0].src && publishModal.thumbs[0].src!='undefined'"><i class="el-icon-edit"></i><span>修改</span></div>
                  </div>
                </div>
                <div class="front-cover-wrap">
                  <div class="front-cover-img front-cover-single" :style="{backgroundImage: 'url(' + publishModal.thumbs[1].src + ')'}" @click="showChooseImageCoverDialog(1)">
                    <div class="cover-img-modify" v-if="publishModal.thumbs[1].src && publishModal.thumbs[1].src!='undefined'"><i class="el-icon-edit"></i><span>修改</span></div>
                  </div>
                </div>
                <div class="front-cover-wrap">
                  <div class="front-cover-img front-cover-single" :style="{backgroundImage: 'url(' + publishModal.thumbs[2].src + ')'}" @click="showChooseImageCoverDialog(2)">
                    <div class="cover-img-modify" v-if="publishModal.thumbs[2].src && publishModal.thumbs[2].src!='undefined'"><i class="el-icon-edit"></i><span>修改</span></div>
                  </div>
                </div>
              </div>
              <!-- <div class="front-cover-right">
                <button class="new-btn front-cover-preview cancel" id="front-cover-preview">客户端预览</button>
              </div> -->
              <div class="front-cover-tip">所使用的封面图片均需来自于正文，如文章中含视频请使用自动模式。</div>
            </div>
          </el-form-item>
          <!-- <el-form-item label="同时发布到动态">
            <el-radio-group v-model="publishModal.is_timeline">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是
                <el-tooltip content="发布到客户端个人主页的动态列表" placement="top" effect="light">(?)</el-tooltip>
              </el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="分类">
            <el-select v-model="publishModal.category_id">
              <el-option v-for="item in publish_category" :label="item.tag_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="publishArt()">发表</el-button>
            <el-button v-if="publishModal.status === 0 || publishModal.status === 8" @click="saveDraft()">存草稿</el-button>
            <el-button @click="preViewClick()">客户端预览</el-button>
            <el-button @click="cancel()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="发表视频" name="4">
        <publishVideo v-if="$route.params.tabname ==4 && $route.query.id" :id="$route.query.id" :publishVideoModal="publishVideoModal"></publishVideo>
        <publishVideo v-else></publishVideo>
      </el-tab-pane>
      <el-tab-pane label="发表图集" name="3">
        <publishPics v-if="$route.params.tabname ==3 && $route.query.id" :id="$route.query.id" :publishPicModal="publishPicModal"></publishPics>
        <publishPics v-else></publishPics>
      </el-tab-pane>
    </el-tabs>
  </div>
  <el-dialog title="上传图片" v-model="dialogImageVisible" class="image-picker-dialog">
    <div class="picker-dialog-content">
      <div class="image-picker" v-if="firstImageUpload">
        <div>
          <i></i>
          <upload :onSuccess="onSuccess" :onProgress="onProgress">
            <el-button type="primary">点击选择图片</el-button>
          </upload>
          <span>支持绝大多数图片格式，单张图片最大支持5MB</span>
        </div>
      </div>
      <div class="public-article-pic-content" v-if="!firstImageUpload">
        <div class="public-article-img" v-for="image in uploadImageList">
          <img :src="image.url" alt="上传图片" />
          <div class="pic-choose">
            <i class="el-icon-check" style="color:#fff;"></i>
          </div>
        </div>
        <upload :onSuccess="onSuccess" :onProgress="onProgress">
          <div class="image-add">
          </div>
        </upload>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="usInsertMImage()">确 定</el-button>
      <el-button @click="dialogImageVisible = false">取 消</el-button>
    </div>
  </el-dialog>
  <el-dialog title="本地视频" v-model="dialogVideoVisible" class="image-picker-dialog">
    <!-- <div class="video-picker picker-dialog-content">
      <div>
        <i></i>
        <el-button type="primary" @click="dialogVideoVisible = false">点击选择视频</el-button>
        <span>支持MP4格式的视频，大小不超过2G，较大的视频请压缩上传</span>
      </div>
    </div> -->
    <div class="picker-dialog-content">
      <div class="video-picker">
        <div>
          <i></i>
          <upload :onSuccess="onVideoUploadSuccess" :beforeUpload="onVideoBeforeUpload" :onProgress="onVideoProgress" :filters="videoFilters" :onError="onError">
            <el-button type="primary">点击选择视频</el-button>
          </upload>
          <span>支持MP4格式的视频，大小不超过1000MB，较大的视频请压缩上传</span>
        </div>
      </div>
    </div>
    <!-- <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogImageVisible = false">确 定</el-button>
      <el-button @click="dialogImageVisible = false">取 消</el-button>
    </div> -->
  </el-dialog>
  <el-dialog title="设置视频封面" v-model="settingVideoCover" class="video-cover-dialog">
    <div class="set-video-cover-content">请从本地选择一张图片作为您的视频封面
    </div>
    <div slot="footer" class="dialog-footer">
      <upload :onSuccess="onVideoCoverSuccess">
        <el-button @click="settingVideoCover=false" type="primary">从本地上传照片</el-button>
      </upload>
      <!-- <el-button>选择视频中的图片</el-button> -->
    </div>
  </el-dialog>
  <el-dialog v-model="publishPreviewDialog" class="iphone-frame-dialog">
    <div class="iphone-frame">
      <publishPreview v-bind:innerHTML='innerHTML' v-bind:title="publishModal.title"></publishPreview>
    </div>
  </el-dialog>
  <el-dialog title="提示" v-model="reUploadDialogVisible" size="tiny" class="reupload-dialog">
    <span>是否确认重新上传视频</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="reUploadDialogVisible = false">取 消</el-button>
      <upload :onSuccess="onVideoUploadSuccess" :beforeUpload="onVideoBeforeUpload" :onProgress="onVideoProgress" :filters="videoFilters" :onError="onError">
        <el-button type="primary" @click="reUploadDialogVisible = false">确 定</el-button>
      </upload>
    </span>
  </el-dialog>
  <el-dialog title="选择图片" class="image-picker-dialog" v-model="dialogArticleVisible">
    <div class="picker-dialog-content">
      <div class="public-article-pic-content">
        <div class="public-article-img" v-bind:class="[chooseImageCoverIndex == index ? 'selected' : '']" v-for="(image, index) in publishModal.images" @click="selectedImage(index)" v-bind:index="chooseImageCoverIndex == index">
          <img :src="image.url" alt="上传图片" />
          <div class="cover-pic-choose">
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogArticleVisible = false">取 消</el-button>
    <el-button type="primary" @click="chooseImageCover()">确 定</el-button>
  </span>
  </el-dialog>
  <crop :imgUrl="imgUrl" :aspectRatio="3/2" @getCropImg="getCropImgUrl" :crop="crop"></crop>
  <crop :imgUrl="imgUrl" :aspectRatio="3/2" @getCropImg="getVideoCoverCropImg" :crop="videoCoverCrop"></crop>
</div>
</template>

<script>
/* eslint-disable */

import '../../../static/UEditor/ueditor.config';
import '../../../static/UEditor/ueditor.all';
import '../../../static/UEditor/lang/zh-cn/zh-cn';
import publishVideo from './PublishVideo.vue';
import publishPics from './PublishPics.vue';
import publishPreview from './PublishPreview';
import API from '../../service';
import upload from '../../components/Upload';
import $ from 'jquery';
import crop from '../../components/Crop';
import Config from '../../../config';
import Tool from '../../util/tools';
import { Message } from 'element-ui';


export default {
  name: 'home-publish',
  components: {
    publishVideo,
    publishPics,
    publishPreview,
    upload,
    crop
  },
  data() {
    return {
      imgUrl: '',
      crop: false,
      videoCoverCrop: false,
      // pubulishCoverSettingShow: true, // 封面栏显示 隐藏
      storageKey: 'publishModal',
      suffix: '?imageView2/2/w/750',
      id: Math.random(10) + 'ueditorId',
      coverStyle: 0, // 封面
      aspectRatio: 3 / 2,
      reUploadDialogVisible: false, // 重新上传
      restoreAlert: false,
      haveUploadVideo: false,
      fullscreenLoading: false,
      firstImageUpload: true,
      contentChangeSave: true,
      // firstVideoUpload: true, // 第一次上传视频
      uploadImageList: [],
      uploadVideo: '',
      chooseImageCoverIndex: -1,
      coverImageIndex: '',
      isAutoSaved: true,
      publishVideoModal: {},
      publishPicModal: {},
      // coverImage: [{},{},{}],
      uploadVideoCorverStyle: {},
      videoFilters: {
        ext: 'mp4',
        max_file_size: '1000mb'
      },
      // 上传的视频文件
      uploadFile: {
        percent: 0,
        size: 0,
        name: ''
      },
      content: '',
      innerHTML: '',
      activeTab: '', // 选择选项卡的name
      publish_category: [],
      rules: {
        title: [{
          required: true,
          message: '请输入活动名称',
          trigger: 'blur'
        }, {
          min: 5,
          max: 30,
          message: '长度在 5 到 30 个字符',
          trigger: 'blur'
        }],
        category_id: [{
          required: true,
          message: '请选择活动区域',
          trigger: 'change'
        }],
      },
      publishModal: {
        type: 2,
        title: '',
        content: '',
        thumbs: [{
          src: '',
          url: '',
        }, {
          src: '',
          url: '',
        }, {
          src: '',
          url: '',
        }],
        images: [],
        category_id: '',
        action: 'add',
        id: '',
        multi_video: [{
          name: '',
          time: '',
          thumb: '',
          src: '',
          url: '',
          remark: '',
        }],
        status: 0,
        video: [],
        is_timeline: 0,
      },
      toolStates: {
        bold: 0,
        italic: 0,
        Paragraph: 0,
        underline: 0,
        insertImage: 0,
        insertvideo: 0,
        insertunorderedlist: 0,
        insertorderedlist: 0,
        undo: 0,
        redo: 0,
        removeFormate: 0
      },
      config: {
        toolbars: [
          []
        ],
        initialFrameWidth: null,
        initialFrameHeight: 600,
      },
      dialogImageVisible: false,
      dialogVideoVisible: false,
      dialogArticleVisible: false,
      settingVideoCover: false,
      publishPreviewDialog: false,
    };
  },
  props: {
    value: {
      type: String,
      default: null,
    }
  },
  watch: {
    value: function value(val, oldVal) {
      this.editor = UE.getEditor(this.id, this.config);
      if (val !== null) {
        this.editor.setContent(val);
      }
    },
    coverStyle: function coverStyle(val) {
      // if (val === 3) {
      // this.aspectRatio = 3 / 2;
      //} else {
      //  this.aspectRatio = 3 / 2;
      //};
    }
  },
  // beforeRouteEnter(to, from, next) {
  //   const status = Tool.getUserStatus();
  //   console.log('status: ', status);
  //   Tool.statusWarning(status, Message, next, 'publish');
  // },
  mounted() {
    this.$nextTick(function f1() {
      // 保证 this.$el 已经插入文档
      this.$refs.editor.id = this.id;
      const str = Tool.getUserPhone();
      this.storageKey = 'publishModal_' + str.substr(str.length - 5);
      console.log('storageKey :', this.storageKey);
      this.editor = UE.getEditor(this.id, this.config);

      this.editor.ready(function f2() {
        // this.editor.setContent('this.value');
        this.init();
        this.editor.addListener('contentChange', function () {
          console.log('contentChange');
          const wordCount = this.editor.getContentLength(true);
          // if (this.editor.getContent()) {
          //   this.publishModal.content = '<div>' + this.editor.getContent() + '</div>';
          // } else {
          //   this.publishModal.content = '';
          // }
          this.publishModal.content = this.editor.getContent();

          const plainTxt = this.editor.getPlainTxt();
          this.$emit('input', {
            wordCount: wordCount,
            content: this.publishModal.content,
            plainTxt: plainTxt
          });
          this.autoSaveContent();
          this.contentListen();
        }.bind(this));

        this.editor.addListener('selectionchange', function () {
          // console.log(this.toolStates.keys());
          const stateList = Object.keys(this.toolStates);
          var i = -1;
          while (i++ < stateList.length - 1) {
            this.toolStates[stateList[i]] = this.editor.queryCommandState(stateList[i]);
            if (stateList[i] === 'Paragraph') {
              if (this.editor.queryCommandValue(stateList[i]) === 'h1')
                this.toolStates[stateList[i]] = 1;
              else this.toolStates[stateList[i]] = 0;
            }
          }
          console.log(this.toolStates);
        }.bind(this));

        this.$emit('ready', this.editor);
      }.bind(this));

      // this.$refs.upload1.id = this.id + 'upload';
    });

  },
  created() {
    if (window.addEventListener) {
      window.addEventListener('scroll', self.toolbarScroll, false);
    } else if (window.attachEvent) {
      window.attachEvent('onscroll', self.toolbarScroll);
    } else {
      window['onscroll'] = self.toolbarScroll;
    }
  },
  computed: {
    editorContent: {
      get: function () {
        return this.editor.getContent();
      },
      set: function (content) {
        this.editor.setContent(content);
      }
    }
  },
  destroyed() {
    clearInterval(this.autoSaveInterval);
    console.log('publish destroyed!');
  },
  methods: {
    cropImg(imgUrl) {
      if (imgUrl.indexOf(this.suffix) > 0) {
        imgUrl = imgUrl.substring(0, imgUrl.indexOf(this.suffix));
      }
      this.crop = !this.crop;
      this.imgUrl = imgUrl;
    },
    getCropImgUrl(cropUrl) {
      this.publishModal.thumbs[this.coverImageIndex].src = cropUrl;
      this.publishModal.thumbs[this.coverImageIndex].url = cropUrl;
    },
    // 获取视频封面弹出框
    videoCoverCropImg(imgUrl) {
      this.videoCoverCrop = !this.videoCoverCrop;
      this.imgUrl = imgUrl;
    },
    // 获取视频封面截图
    getVideoCoverCropImg(cropUrl) {
      this.publishModal.multi_video[0].thumb = cropUrl;
      this.uploadVideoCorverStyle = `background-image:url(${cropUrl})`;
    },
    toolbarScroll: function () {
      let IO = document.getElementById('publishToolbar'),
        Y = IO,
        H = 0,
        IE6;
      if (IO) {
        // IE6 = window.ActiveXObject && !window.XMLHttpRequest;
        while (Y) {
          H += Y.offsetTop;
          Y = Y.offsetParent
        };
        const d = document,
          s = Math.max(d.documentElement.scrollTop, document.body.scrollTop);
        if (s > 230 && s < 780) {
          IO.style.cssText = 'top:0px;position:fixed;';
        } else {
          IO.style.cssText = '';
        }
      }
    },
    init: function () {
      let self = this;
      // this.storageKey = this.storageKey;
      console.log('publish page init');
      this.publish_category = API.getRemoteArticleCategory();
      const tabname = this.$route.params.tabname;
      console.log('tabname:' + tabname);
      if (tabname === '2' || tabname === '3' || tabname === '4') {
        this.activeTab = tabname;
      } else {
        this.activeTab = '2';
      }
      const id = this.$route.query.id;
      if (id) {
        console.log('id:' + id);
        API.fetchArticleDetail(id).then(result => {
          console.log('获取文章详情成功');
          if (tabname === '3') {
            this.publishPicModal = result.data;
          } else if (tabname === '4') {
            this.publishVideoModal = result.data;
          } else {
            this.publishModal = result.data;
          }
          if (!this.publishModal.multi_video || this.publishModal.multi_video.length === 0) {
            Object.assign(this.publishModal.multi_video, this.$options.data().publishModal.multi_video);
          }
          // if (this.publishModal.thumbs.length !== 3 && this.publishModal.thumbs.length !== 1) {
          //   Object.assign(this.publishModal.thumbs, this.$options.data().publishModal.thumbs);
          // }
          this.editor.setContent(this.publishModal.content);
          this.publishModal.is_timeline = 0;
          this.publishModal.action = 'update';
          this.initThumbs();
          this.contentListen();
          console.log(this.editor.get);
        }, err => {
          this.publishModal.action = 'update';
          console.error('获取文章详情成功失败:' + err.message);
        });
      } else {
        // 有本地缓存
        const pm = localStorage.getItem(this.storageKey);
        if (pm) {
          const pmJson = JSON.parse(pm);
          Object.assign(this.publishModal, pmJson);
          console.log('local123:', this.publishModal);
          if (this.publishModal.content) {
            this.editor.setContent(this.publishModal.content);
          }

          this.initThumbs();
          this.contentListen();
          console.log('local2:', this.publishModal);
          this.restoreAlert = true;
          setTimeout(function () {
            self.restoreAlert = false;
          }, 3000);
        } else {
          // 没有本地缓存
          Object.assign(this.publishModal, this.$options.data().publishModal);
        }
        this.publishModal.id = '';
        this.publishModal.action = 'add';
      }
      this.publishModal.is_timeline = 0;
      // if (this.publishModal.multi_video.length !== 1) {
      //   Object.assign(this.publishModal.multi_video, this.$options.data().publishModal.multi_video);
      // }
      this.autoSaveInterval = setInterval(function () {
        self.autoSaveContent();
      }, 5000);
      console.log(this.publishModal);
    },
    // 初始化 封面 类型
    initThumbs() {
      if (this.publishModal.thumbs[2] && this.publishModal.thumbs[2].src){
        this.coverStyle = 3;
      } else if (this.publishModal.thumbs[0] && this.publishModal.thumbs[0].src) {
        this.publishModal.thumbs[1] = {};
        this.publishModal.thumbs[1].src = {};
        this.publishModal.thumbs[2] = {};
        this.publishModal.thumbs[2].src = '';
        this.coverStyle = 1;
      } else {
        this.publishModal.thumbs[0] = {};
        this.publishModal.thumbs[0].src = '';
        this.publishModal.thumbs[1] = {};
        this.publishModal.thumbs[1].src = {};
        this.publishModal.thumbs[2] = {};
        this.publishModal.thumbs[2].src = '';
        this.coverStyle = 0;
      }
      console.log('coverStyle: ', this.coverStyle);
    },
    autoSaveContent() {
      const self = this;
      // console.log('---- setInterval 1 ----', localStorage.getItem(self.storageKey));
      if (this.isAutoSaved && this.publishModal.content) {
        // console.log('---- autoSaveContent ----', this.publishModal);
        // self.contentChangeSave = false;
        let pm = {};
        Object.assign(pm, this.publishModal);
        pm.status = 0;
        const pms = JSON.stringify(pm);
        this.isAutoSaved = false;
        setTimeout(function () {
          // console.log('---- setInterval 2----', localStorage.getItem(self.storageKey));
          localStorage.setItem(self.storageKey, pms);
          self.isAutoSaved = true;
        }, 1000);
      }
    },
    contentListen() {
      let self = this;
      // const m = this.htmlDoc(this.publishModal.content);
      // console.log('m:', m);
      // console.log(this.publishModal.content);
      const s = $(this.publishModal.content);
      // console.log('---image: ',s.children('.mu-ue-image'));
      // console.log('---image-src: ',s.children('.mu-ue-image')[0].attributes);
      // console.log('---image-src: ',s.children('.mu-ue-image')[0].attributes['data-src']);
      const imageDom = $('.mu-ue-image', s);
      const videoDom = $('.video-image', s);
      // console.log('******', aa);
      // console.log('******', aa.eq(0).attr('data-src'));
      self.publishModal.images = [];
      $(imageDom).each(function () {
        // console.log($(this).attr('data-src'));
        let img = {};
        img.src = $(this).attr('data-src');
        img.url = $(this).attr('data-src');
        img.remark = '';
        self.publishModal.images.push(img);
      });

      if (videoDom && videoDom.length > 0){
        $(videoDom).each(function () {
          // console.log($(this).attr('data-src'));
          // img.src = $(this).attr('data-src');
          self.uploadFile.name = $(this).attr('data-name');
          self.uploadFile.url = $(this).attr('data-src');
          self.uploadFile.src = $(this).attr('data-src');
          self.uploadFile.percent = 100;
          console.log('---- init ----', self.publishModal, $(this).attr('data-src'), $(this).attr('data-name'));
          self.publishModal.multi_video[0].url = $(this).attr('data-src');
          self.publishModal.multi_video[0].src = $(this).attr('data-src');
          self.publishModal.multi_video[0].name = $(this).attr('data-name');
        });
      } else {
        if (self.publishModal.multi_video[0].url) {
          this.uploadFile = {};
          Object.assign(this.uploadFile, this.$options.data().uploadFile);
        }
        self.publishModal.multi_video[0].url = '';
        self.publishModal.multi_video[0].src = '';
        self.publishModal.multi_video[0].name = '';
      }
    },
    // 撤销草稿
    unRestore() {
      Object.assign(this.publishModal, this.$options.data().publishModal);
      this.uploadFile = {};
      Object.assign(this.uploadFile, this.$options.data().uploadFile);
      this.editor.setContent(this.publishModal.content);
      this.coverStyle = 0;
    },
    initData: function () {
      // this.publishModal =
    },
    ueBold: function () {
      console.log('bold');
      this.editor.execCommand('bold');
    },
    ueItalic: function () {
      this.editor.execCommand('italic');
    },
    execCommand: function (name, type) {
      this.editor.execCommand(name);
    },
    ueParagraph: function () {
      this.editor.execCommand('Paragraph', 'h1');
    },
    ueDisParagraph: function () {
      this.editor.execCommand('Paragraph', 'p');
    },
    insertorderedlist: function () {
      this.editor.execCommand('insertorderedlist', 'decimal');
    },
    insertunorderedlist: function () {
      this.editor.execCommand('insertunorderedlist');
    },
    ueImage: function () {
      // 创建dialog
      this.dialogImageVisible = true;
    },
    removeFormate: function () {
      console.log('removeFormate');
      this.editor.execCommand('removeformat', 'h1,strong,em');
    },
    ueInsertImage: function () {
      this.dialogImageVisible = true;
      this.firstImageUpload = true;
      this.uploadImageList = [];
      // this.editor.execCommand('insertimage', {
      //   src: 'https://p.pstatp.com/large/141f0006470e8453fc83'
      // });
    },
    usInsertMImage: function () {
      let imageHtml = '';
      for (const i in this.uploadImageList) {
        imageHtml += '<p><img class="mu-ue-image" src="' + this.uploadImageList[i].url + '" data-src="' + this.uploadImageList[i].url + '"><br></p>';
        this.publishModal.images.push(this.uploadImageList[i]);
      }
      // const imageHtml =
      //   '<p><img class="mu-ue-image" src="https://p.pstatp.com/large/141f0006470e8453fc83" data-src="https://p.pstatp.com/large/141f0006470e8453fc83"><br></p>';
      this.editor.execCommand('inserthtml', imageHtml);
      // this.publishModal.images = this.uploadImageList;
      this.dialogImageVisible = false;
      // const js = 'alert();';
      // this.editor.execCommand('insertcode', 'placeholder="请点击此处输入图片描述"');
      // const iframe = document.getElementById('ueditor_0').contentWindow.document;
      // console.log(iframe);
      // const node = this.editor.document.getElementsByClassName('mu-ue-image-tips');
      // console.log(node);
      // node.setAttributes('placeholder', '请点击此处输入图片描述');

      // UE.dom.domUtils.setAttributes(node, {
      //    placeholder: '请点击此处输入图片描述'
      // } );
      // console.log( UE.dom.domUtils.inDoc( node, document ) );

      // console.log(UE.dom.domUtils.getStyle(element,name));
    },
    // 添加视频进正文
    usInsertMVideo: function () {
      console.log('添加视频进正文', this.publishModal);
      if (this.publishModal.multi_video[0].url) {
        this.$message.error('正文只能上传一个视频，要修改视频请删除或重新上传!');
        return;
      }
      console.log('uploadFile : ', this.uploadFile);
      // this.settingVideoCover = false;
      const videoHtml = '<p><img class="video-image" src="' + Config.cdnPath + '/UEditor/images/video-image.png" data-src="' + this.uploadFile.url + '" data-name="' + this.uploadFile.name + '" ><p>';
      // const videoHtml = '<p><span><video src="' + this.uploadVideo + '" style="display:block;margin:auto;" width="320" height="240" controls="controls">your browser does not support the video tag</video></span><p>';
      this.publishModal.multi_video[0].url = this.uploadFile.url;
      this.editor.execCommand('inserthtml', videoHtml);
      // this.ueInsertVideo();
    },
    // 上传视频
    ueUploadVideo: function () {
      console.log(this.uploadFile, this.publishModal);
      if (this.uploadFile.name) {
        this.$message.error('正文只能上传一个视频，要修改视频请删除或重新上传!');
        return;
      }
      this.dialogVideoVisible = true;
    },
    // ueInsertVideo: function () {
    //   this.dialogVideoVisible = false;
    //   Object.assign(this.uploadFile, this.$options.data().uploadFile);
    //   var videoAttr = {
    //     // 视频地址
    //     url: 'http://test-simple.oss-cn-shanghai.aliyuncs.com/57bbe475a13bc.mp4',
    //     //视频宽高值， 单位px
    //     width: 200,
    //     height: 100
    //   };
    //   // editor 是编辑器实例
    //   // 向编辑器插入单个视频
    //   this.editor.execCommand('insertvideo', videoAttr);
    // },
    preViewClick: function () {
      // this.editor.execCommand('preview')
      this.innerHTML = this.editor.getAllHtml();
      // console.log(this.innerHTML);
      this.publishPreviewDialog = true;
    },
    submitValidator() {
      console.log('submit: ', this.publishModal);
      console.log(this.coverStyle);
      if (this.publishModal.title) {
        if (this.publishModal.title.length < 5) {
          this.$message.error('标题字数不能少于5个');
          return false;
        } else if (this.publishModal.title.length > 30) {
          this.$message.error('标题字数不能超过30个');
          return false;
        }
      } else {
        this.$message.error('标题不能为空');
        return false;
      }
      if (!this.publishModal.content) {
        this.$message.error('文章内容不能为空');
        return false;
      }
      if (this.coverStyle) {
        if (this.coverStyle === 1) {
          if (!this.publishModal.thumbs[0] || !this.publishModal.thumbs[0].src) {
            this.$message.error('请完成封面设置');
            return false;
          }
        } else if (this.coverStyle === 3) {
          for (let i = 0; i < 3; i++) {
            if (!this.publishModal.thumbs[i] || !this.publishModal.thumbs[i].src) {
              this.$message.error('请完成封面设置');
              return false;
            }
          }
        }
      }
      if (this.publishModal.multi_video[0].url) {
        if (!this.publishModal.multi_video[0].thumb) {
          this.$message.error('请先上传视频封面！');
          return false;
        }
      }
      if (!this.publishModal.category_id) {
        this.$message.error('请选择分类');
        return false;
      }
      if (this.uploadFile.name && !this.uploadFile.url) {
        this.$message.error('视频还在上传中，请先等视频上传完成，并添加到正文所需位置');
        return false;
      }
      if (this.uploadFile.url && !this.publishModal.multi_video[0].url) {
        this.$message.error('视频未添加到正文，请先将视频添加到正文所需位置');
        return false;
      }
      if (this.publishModal.multi_video[0].thumb && !this.publishModal.multi_video[0].url) {
        this.$message.error('视频未添加到正文，请先将视频添加到正文所需位置');
        return false;
      }
      return true;
    },
    // 发表
    publishArt: function () {
      if (!this.submitValidator()) {
        return;
      }
      this.fullscreenLoading = true;
      this.publishModal.status = 12;
      const pm = this.beforeCommit();
      API.saveUpdateArticle(pm).then(result => {
        console.log('storageKey: ', this.storageKey);
        clearInterval(this.autoSaveInterval);
        console.log('发表成功');
        this.fullscreenLoading = false;
        this.$message({
          message: '文章发表成功',
          type: 'success'
        });
        const self = this;
        this.$router.push('/home/manager');
        setTimeout(function () {
          localStorage.removeItem(self.storageKey);
        }, 1000);
      }, err => {
        this.fullscreenLoading = false;
        this.$message.error('发表失败' + err.message);
        console.error('发表失败:' + err.message);
      });
    },
    htmlDoc(s) {
      var div = document.createElement('div');
      div.appendChild(document.createTextNode(s));
      console.log(div.innerHTML);
      return div.innerHTML;
    },
    // htmlencode(s){
    //     var div = document.createElement('div');
    //     div.appendChild(document.createTextNode(s));
    //     console.log(div.innerHTML);
    //     return div.innerHTML;
    // },
    // function htmldecode(s){
    //   var div = document.createElement('div');
    //   div.innerHTML = s;
    //   return div.innerText || div.textContent;
    // },
    // 发表和存草稿前处理
    beforeCommit() {
      let pm = {};
      Object.assign(pm, this.publishModal);
      pm.thumbs = [];
      if (this.coverStyle === 1) {
        pm.thumbs.push(this.publishModal.thumbs[0]);
      } else if(this.coverStyle === 3) {
        pm.thumbs = this.publishModal.thumbs;
      }
      pm.content = '<div>' + UE.utils.unhtml(this.publishModal.content) + '</div>';
      return pm;
    },
    /**
     * [存草稿]
     * @return {[type]} [description]
     */
    saveDraft: function () {
      if (!this.submitValidator()) {
        return;
      }
      this.fullscreenLoading = true;
      this.publishModal.status = 8;
      const pm = this.beforeCommit();
      // this.publishModal.content = encodeURI(this.publishModal.content);
      API.saveUpdateArticle(pm).then(result => {
        clearInterval(this.autoSaveInterval);
        this.fullscreenLoading = false;
        console.log('保存草稿成功');
        this.$message({
          message: '保存草稿成功',
          type: 'success'
        });
        this.$router.push('/home/manager');
        const self = this;
        this.$router.push('/home/manager');
        setTimeout(function () {
          localStorage.removeItem(self.storageKey);
        }, 1000);
        console.log('保存草稿成功');
      }, err => {
        this.fullscreenLoading = false;
        this.$message.error('保存草稿失败：' + err.message);
        console.error('保存草稿失败:' + err.message);
      });
    },
    clearUploadVedio() {
      const h = `<div class="outHtml">${this.publishModal.content}</div>`;
      const s = $(this.publishModal.content);
      // console.log('删除了视频2：', h);
      // console.log('删除了视频2：', $('.video-image', h));
      // const videoDom = $('.video-image', s);
      // $(videoDom).each(function(){
      //   // console.log($(this).attr('data-src'));
      //   // img.src = $(this).attr('data-src');
      //   $(this).remove();
      //   console.log('删除了视频2：');
      //   // self.publishModal.multi_video[0].url = $(this).attr('data-src');
      // });
      const contentB = this.publishModal.content;
      const contentA = contentB.replace(/<img class="video-image"[^>]+>/g, '');
      // $('.video-image', h).remove();
      console.log('删除了视频：', contentA);
      this.publishModal.content = contentA;
      // console.log('删除了视频：', $('.video-image', h).html());
      // console.log('删除了视频：', $('.outHtml', h));
      this.editor.setContent(contentA);
      this.uploadFile = {};
      Object.assign(this.uploadFile, this.$options.data().uploadFile);
      Object.assign(this.publishModal.multi_video, this.$options.data().publishModal.multi_video);
      this.firstImageUpload = true;
      console.log(this.uploadFile);
      // // 显示封面
      // this.pubulishCoverSettingShow = true;
      // this.coverStyle = 0;
    },
    showChooseImageCoverDialog(imageIndex) {
      console.log(this.publishModal.images);
      if (!this.publishModal.images || this.publishModal.images.length < 1) {
        this.$message.error('文章无可用图片，请上传！');
        return;
      }
      this.coverImageIndex = imageIndex;
      this.dialogArticleVisible = true;
      this.chooseImageCoverIndex = -1;
    },
    chooseImageCover() {
      // if (this.chooseImageCoverIndex !== this.coverImageIndex) {
      // oldSelectedImage = index;
      // this.chooseImageCoverIndex = this.coverImageIndex;
      if (this.chooseImageCoverIndex === -1) {
        this.$message.error('您还未选择图片~');
        return;
      }
      console.log(this.publishModal);

      this.cropImg(this.publishModal.images[this.chooseImageCoverIndex].url);
      // }
      // else {
      //   // oldSelectedImage = '';
      //   // this.chooseImageCoverIndex = '';
      //   this.publishModal.thumbs[this.coverImageIndex].src = '';
      //   this.publishModal.thumbs[this.coverImageIndex].url = '';
      // }
      this.dialogArticleVisible = false;
    },
    onSuccess(url, file) {
      this.firstImageUpload = false;
      console.log(url);
      const im = {};
      im.src = file.files[0].name + this.suffix;
      im.url = url + this.suffix;
      im.remark = '';
      this.uploadImageList.push(im);
      console.log('upload onSuccess');
    },
    onVideoUploadSuccess(url, file) {
      // this.firstVideoUpload = false;
      // this.uploadVideo = url;
      if (!this.publishModal.multi_video || !this.publishModal.multi_video.length) {
        Object.assign(this.publishModal.multi_video, this.$options.data().publishModal.multi_video);
      }
      this.publishModal.multi_video[0].name = this.uploadFile.name;
      this.uploadFile.url = url;
      // this.uploadFile.name = file.name;
      console.log('onVideoUploadSuccess' + url);
    },
    // 视频封面上传成功
    onVideoCoverSuccess(url, file) {
      console.log('upload video corver success');
      // this.settingVideoCover = false;
      this.videoCoverCropImg(url);
      // this.publishModal.multi_video[0].thumb = url;
    },
    selectedImage(imageIndex) {
      console.log(this.publishModal);
      if (this.chooseImageCoverIndex !== imageIndex) {
        // oldSelectedImage = index;
        this.chooseImageCoverIndex = imageIndex;
      } else {
        // oldSelectedImage = '';
        this.chooseImageCoverIndex = -1;
      }
    },
    onProgress(up, file) {
      console.log('onSuccess onProgress');
    },
    onVideoProgress(up, file) {
      // // 隐藏封面
      // this.pubulishCoverSettingShow = false;
      // this.coverStyle = 0;
    },
    onVideoBeforeUpload(up, file) {
      this.haveUploadVideo = true;
      this.dialogVideoVisible = false;
      this.uploadFile = file;
      console.log('aaaaaaa', this.uploadFile);
      this.up = up;
    },
    // 取消上传视频
    cancelUpload() {
      this.$confirm('确认取消上传', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.pubulishCoverSettingShow = true;
        // this.up.stop();
        if (this.up) {
          this.up.removeFile(this.uploadFile);
        }
        this.uploadFile = {};
        Object.assign(this.uploadFile, this.$options.data().uploadFile);
        Object.assign(this.publishModal.multi_video, this.$options.data().publishModal.multi_video);
      }).catch(() => {});
    },
    onError(msg, up, err) {
      console.log('发表视频-视频上传失败：' + err);
      if (this.up) {
        this.up.removeFile(this.uploadFile);
      }
      this.uploadFile = {};
      Object.assign(this.uploadFile, this.$options.data().uploadFile);
      Object.assign(this.publishModal.multi_video, this.$options.data().publishModal.multi_video);
    },
    cancel() {
      this.$confirm('确认取消本次的发布，取消后编辑的内容将无法找回', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // });
        this.$router.push('/home');
        localStorage.removeItem(this.storageKey);
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });
      });
    }
  }
};
</script>
<style type="text/css">
.publish-box .el-tabs {
  margin-top: 14px;
}

.publish-box {
  margin-left: 40px;
  margin-right: 40px;
  width: 900px;
}

.publish-box .el-tabs__header {
  margin-bottom: 30px;
  border-bottom: 1px solid #e7e7e7;
}

.publish-box .el-tabs__item {
  font-size: 16px;
  color: #323232;
}

.publish-box .el-tabs__item.is-active {
  color: #ff74b9;
}

.publish-box #edui1_imagescale,.publish-box .edui-editor-imagescale{display:none !important;}

.publish-box-wrap {
  position: relative;
}

.publish-box-wrap .tab-link {
  position: absolute;
  right: 0;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #65ABEC;
  letter-spacing: 0;
  top: 10px;
  z-index: 10;
}

.public-aticle-box {
  border: 1px solid #E7E7E7;
  margin-bottom: 20px;
  position: relative;
}

.title-input {
  padding-right: 55px;
  width: 100%;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  border: 0;
  border-bottom: 1px solid #E9E9E9;
  font-weight: 700;
  font-size: 20px;
  line-height: 58px;
  height: 58px;
  padding-left: 20px;
}

.title_tip {
  font-size: 14px;
  position: absolute;
  right: 20px;
  top: 18.5px;
  line-height: 20px;
  font-size: 14px;
  color: #999999;
  letter-spacing: 0;
}

.title-tip-err {
  color: #ff74b9;
  font-weight: bold;
}

#editor {
  border: 1px solid #CCC;
  width: 1000px
}

#editor_toolbar_box {
  background: #F0F0EE;
  padding: 2px;
}

#editor_iframe_holder {
  border-top: 1px solid #CCC;
  border-bottom: 1px solid #CCC;
}

.publish-box .edui-editor-toolbarbox {
  display: none;
}

.publish-box .edui-default .edui-editor {
  border: none;
}

.publish-box .edui-editor-bottomContainer {
  display: none;
}

.publish-box .restore-alert .is-customed {
  color: #4e7dd2;
}

.publish-box .image-picker-dialog .el-dialog {
  width: 675px;
}

.publish-box .el-dialog__wrapper .picker-dialog-content {
  border: 2px dashed #b5b5b5;
  padding: 15px;
}

.publish-box .image-picker-dialog .public-article-pic-content .upload-wrap {
  float: left;
}

.publish-toolbar {
  background: #eee none repeat scroll 0 0;
  border-bottom: 1px solid #e9e9e9;
  border-radius: 0;
  box-shadow: none;
  padding: 5px 10px 5px 20px;
  z-index: 1000;
  width: 900px;
  /*position: absolute;*/
  /*top: 58px;*/
}

.publish-box .video-upload-box {
  border: 1px solid #e9e9e9;
  padding: 10px;
}

.publish-box .video-upload-box .el-form-item__content{
  margin-left: 0px!important;
}

.publish-box .is-saved {
  float: right;
  margin-top: 7px;
  margin-right: 10px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #999999;
  letter-spacing: 0;
}

.publish-toolbar .tool-bar-selected .public-icon {
  background-color: #fff;
}

.publish-toolbar .public-icon {
  /*height: 30px;
  width: 30px;*/
  background-repeat: no-repeat;
  background-position: 50% 50%;
  display: block;
  -moz-osx-font-smoothing: grayscale;
  font-family: "iconfont" !important;
  font-size: 20px;
  /*margin: 5px;*/
  color: #999;
  font-style: normal;
}

.publish-toolbar .tool-bar-disabled .toolbar-h {
  /*background-image: url(../../assets/images/toolbar-h-dis.png);*/
}

.toolbar-h {
  /*background-image: url(../../assets/images/toolbar-h.png);*/
  background-size: 18px 18px;
  display: inline-block;
}

.publish-toolbar .public-icon::before {
  margin: 6px;
}

.publish-toolbar .tool-bar-disabled .public-icon {
  color: #DDD;
}

.toolbar-b {
  /*background-image: url(../../assets/images/toolbar-b.png);*/
  background-size: 18px 18px;
  display: inline-block;
}

.publish-toolbar .tool-bar-disabled .toolbar-b {
  /*background-image: url(../../assets/images/toolbar-b-dis.png);*/
}

.toolbar-order {
  /*background-image: url(../../assets/images/toolbar-order.png);*/
  background-size: 18px 18px;
  display: inline-block;
}

.publish-toolbar .tool-bar-disabled .toolbar-order {
  /*background-image: url(../../assets/images/toolbar-order-dis.png);*/
}

.toolbar-unorder {
  /*background-image: url(../../assets/images/toolbar-unorder.png);*/
  background-size: 18px 18px;
  display: inline-block;
}

.publish-toolbar .tool-bar-disabled .toolbar-unorder {
  /*background-image: url(../../assets/images/toolbar-unorder-dis.png);*/
}

.toolbar-pic {
  /*background-image: url(../../assets/images/toolbar-pic.png);*/
  background-size: 18px 18px;
  display: inline-block;
}

.publish-toolbar .tool-bar-disabled .toolbar-pic {
  /*background-image: url(../../assets/images/toolbar-pic-dis.png);*/
}

.toolbar-video {
  /*background-image: url(../../assets/images/toolbar-video.png);*/
  background-size: 18px 18px;
  display: inline-block;
}

.publish-toolbar .tool-bar-disabled .toolbar-video {
  /*background-image: url(../../assets/images/toolbar-video-dis.png);*/
}

.toolbar-undo {
  transform: scaleX(-1);
  -ms-transform: scaleX(-1);
  /*background-image: url(../../assets/images/toolbar-back.png);*/
  background-size: 18px 18px;
  display: inline-block;
}

.publish-toolbar .tool-bar-disabled .toolbar-undo {
  transform: scaleX(-1);
  -ms-transform: scaleX(-1);
  /*background-image: url(../../assets/images/toolbar-back-dis.png);*/
}

.toolbar-redo {
  /*background-image: url(../../assets/images/toolbar-back.png);*/
  background-size: 18px 18px;
  display: inline-block;
}

.publish-toolbar .tool-bar-disabled .toolbar-redo {
  /*background-image: url(../../assets/images/toolbar-back-dis.png);*/
}

.publish-toolbar .public-icon{
  cursor: pointer;
}

.public-separator {
  vertical-align: top;
  width: 1px;
  height: 22px;
  margin: 5px 20px 0;
  background: #D8D8D8;
  display: inline-block;
}

.front-cover-box {
  margin-top: -30px;
}

.front-cover-main {
  position: relative;
  display: block;
  margin-top: 16px;
  padding-top: 20px;
  border-top: 1px solid #e9e9e9;
}

.simple-modal .front-cover-cur {
  left: 100.016px;
}

.three-modal .front-cover-cur {
  left: 255.016px;
}

.front-cover-cur {
  position: absolute;
  top: -8px;
  width: 12px;
  height: 8px;
  background-repeat: no-repeat;
  background-color: #fff;
  background-image: url(../../assets/images/icon-line-arrow.png);
}

.front-cover-upload {
  float: left;
}

.front-cover-wrap {
  width: 202px;
  height: 131px;
  float: left;
  border-radius: 4px;
  margin-right: 20px;
  background-position: center;
  position: relative;
  background-color: #f0f1f3;
  background-image: url(../../assets/images/picutre_add.png);
  background-repeat: no-repeat;
}

.video-progress-box {
  width: 90%;
}

.video-progress-box .el-progress-bar__inner {
  background-color: #FFA7D3;
}

.video-progress-text {
  margin-bottom: 16px;
}

.video-progress-text .video-n {
  display: inline-block;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #323232;
  letter-spacing: 0;
}

.video-progress-text .video-h {
  display: inline-block;
  float: right;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #999999;
  letter-spacing: 0;
}

.video-progress-box .video-progress-bar {
  position: relative;
}

.video-progress-box .video-progress-bar i {
  width: 16px;
  height: 16px;
  background-repeat: no-repeat;
  background-image: url(../../assets/images/tag-close.png);
  /*display: block;*/
  top: 0;
  position: absolute;
  right: -38px;
}

.front-cover-upload .front-cover-img {
  background-position: center;
  position: relative;
  float: left;
  width: 202px;
  height: 131px;
  /*margin-right: 20px;*/
  /*background-color: #f0f1f3;*/
  cursor: pointer;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
  overflow: hidden;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.front-cover-upload .front-cover-img:hover .cover-img-modify {
  display: inline-block;
}

.front-cover-upload .front-cover-img .cover-img-modify {
  background: rgba(0, 0, 0, 0.7) none repeat scroll 0 0;
  bottom: 0;
  color: #fff;
  cursor: pointer;
  display: none;
  height: 40px;
  left: 0;
  line-height: 40px;
  position: absolute;
  right: 0;
  text-align: center;
  width: 100%;
}

.image-add {
  width: 110px;
  height: 110px;
  position: relative;
  float: left;
  margin: 5px;
  cursor: pointer;
  background: #F7F7F7;
  border: 1px solid #E7E7E7;
  background-repeat: no-repeat;
  background-image: url(../../assets/images/picutre_add.png);
  background-position: center;
}

.front-cover-tip {
  clear: both;
  font-size: 13px;
  color: #9e9e9e;
  padding-top: 12px;
}

.video-uploaded {
  padding: 11px 12px;
  position: relative;
}

.video-feedback {
  position: relative;
  padding-left: 152px;
  height: 80px;
}

.video-feedback-status {
  position: absolute;
  width: 128px;
  height: 80px;
  top: 0;
  left: 0;
  background: #f0f1f3;
}

.video-success {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-size: 100% 100%;
}

.video-success>i {
  position: absolute;
  width: 46px;
  height: 46px;
  top: 50%;
  left: 50%;
  margin-top: -24px;
  margin-left: -19px;
  background-repeat: no-repeat;
  background-image: url(../../assets/images/video-cover.png);
}

.video-feedback-middle {
  height: 100%;
  padding-right: 120px;
}

.video-feedback-mtop {
  float: left;
  position: relative;
  padding: 13px 51px 0 0;
  line-height: 20px;
  height: 20px;
  max-width: 290px;
  margin-bottom: 12px;
}

.video-feedback-mtop > i {
  position: absolute;
  right: 24px;
  bottom: -16px;
  font-style: normal;
  padding: 1px 8px 1px 7px;
  font-size: 12px;
  color: #FF74B9;
  letter-spacing: 0;
  background: #FFE3F1;
  border: 1px solid #FFE3F1;
  border-radius: 20px;
}

.video-name {
  font-size: 16px;
  color: #9e9e9e;
  margin-right: 24px;
  max-width: 300px;
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.video-modify-poster {
  display: inline-block;
  position: absolute;
  width: 128px;
  height: 20px;
  left: 12px;
  bottom: 11px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  line-height: 20px;
  background-color: #999;
  cursor: pointer;
  z-index: 50;
}

.video-feedback-mbottom {
  clear: both;
  font-size: 14px;
  color: #4e7dd2;
}

.video-delete {
  float: left;
  margin-right: 20px;
  cursor: pointer;
}

.video-feedback-retry {
  position: relative;
  float: left;
  color: #4e7dd2;
  overflow: hidden;
  cursor: pointer;
}

#retry_video_file {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  opacity: 0;
  filter: alpha(opacity=0);
  cursor: pointer;
  font-size: 100em;
}

.video-feedback-btn {
  position: absolute;
  right: 0;
  top: 50%;
  margin: -17px 0 0;
  width: auto;
  min-width: 84px;
  padding: 0 15px;
  height: 34px;
  line-height: 34px;
  font-size: 14px;
}

.set-video-cover-content {
  width: 100%;
  text-align: center;
  font-size: 14px;
  color: #999999;
  letter-spacing: 0;
}

.publish-box .video-cover-dialog .upload-wrap {
  display: inline-block;
}

.publish-box .video-cover-dialog .el-dialog__footer {
  text-align: center;
}

.publish-box .picker-dialog-content {
  width: 100%;
  min-height: 320px;
  max-height: 400px;
  text-align: center;
  vertical-align: bottom;
  margin: auto;
  /*border: 2px dashed #B5B5B5;*/
}

.picker-dialog-content .image-picker>div,
.picker-dialog-content .video-picker>div {
  display: block;
  text-align: center;
  margin: 60px auto;
}

.image-picker>div>i {
  background-image: url(../../assets/images/add-pic.png);
  background-repeat: no-repeat;
  width: 70px;
  height: 70px;
  margin: auto;
  display: block;
}

.video-picker>div>i {
  background-image: url(../../assets/images/add-video.png);
  background-repeat: no-repeat;
  width: 70px;
  height: 70px;
  margin: auto;
  display: block;
}

.picker-dialog-content .el-button {
  display: block;
  margin: 20px auto;
}

.image-picker>div>span,
.video-picker>div>span {
  font-size: 12px;
  color: #999999;
  letter-spacing: 0;
}

.iphone-frame {
  background: rgba(0, 0, 0, 0) url("../../assets/images/publish-iphone-frame.png") no-repeat scroll 0 0;
  border: 0 none;
  box-shadow: none;
  height: 853px;
  margin: auto;
  width: 430px;
  position: relative;
}

.publish-box .iphone-frame-dialog .el-dialog {
  background-color: rgba(0, 0, 0, 0);
  width: 500px;
  height: 800px;
  box-shadow: none;
  top: 5%!important;
}

.mu-ue-image-tips:empty:before {
  content: "attr(placeholder)";
  color: #red;
}

.mu-ue-image-tips:focus:before {
  content: none;
}

.public-article-pic .el-dialog {
  width: 654px;
}

.public-article-pic .el-dialog .el-dialog__body {
  padding-left: 0;
  padding-right: 0;
}

.public-article-pic-content {
  overflow-x: hidden;
  max-height: 382px;
  overflow-y: auto;
}

.public-article-img {
  float: left;
  margin: 5px;
  position: relative;
  cursor: pointer;
}

.cover-pic-choose {
  background: url("../../assets/images/icon-image-choose.png") no-repeat scroll center center;
  height: 110px;
  line-height: 25px;
  position: absolute;
  top: 0;
  width: 110px;
  display: none;
  background-color:rgba(0,0,0,0.5);
}

.selected .cover-pic-choose {
  display: block;
  /*opacity: 0.5;*/
}

.public-article-img .pic-choose {
  background: #FF74B9;
  width: 25px;
  height: 25px;
  border-radius: 100%;
  position: absolute;
  right: 15px;
  bottom: 15px;
  text-align: center;
  line-height: 25px;
}

.public-article-img .el-icon-check {
  color: #fff;
}

.public-article-img img {
  width: 110px;
  height: 110px;
}

.reupload-dialog .upload-wrap {
  display: block;
  float: right;
  margin-left: 20px;
}
</style>
