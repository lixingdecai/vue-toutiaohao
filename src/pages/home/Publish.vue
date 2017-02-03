<template>
<div class="wrap publish-box">
  <div class="">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="发表文章" name="2">
        <el-form label-position="left" label-width="100px" ref="publishModal" :model="publishModal">
          <div class="public-aticle-box">
            <div>
              <input class="title-input" placeholder="标题(5-30字)" v-model="publishModal.title">
              <span class="title_tip">7/30</span>
            </div>
            <div class="publish-toolbar" id="publishToolbar">
              <el-tooltip content="H1标题" placement="top" effect="light">
                <div class="public-icon toolbar-h" v-on:click='ueParagraph()'>
                </div>
              </el-tooltip>
              <el-tooltip content="加粗" placement="top" effect="light">
                <div class="public-icon toolbar-b" v-on:click="execCommand('bold')">
                </div>
              </el-tooltip>
              <el-tooltip content="无序列表" placement="top" effect="light">
                <div class="public-icon toolbar-order" v-on:click="insertunorderedlist()">
                </div>
              </el-tooltip>
              <el-tooltip content="有序列表" placement="top" effect="light">
                <div class="public-icon toolbar-unorder" v-on:click="insertorderedlist()">
                </div>
              </el-tooltip>
              <div class="public-separator"></div>
              <el-tooltip content="图片" placement="top" effect="light">
                <div class="public-icon toolbar-pic" @click="usInsertMImage()">
                </div>
              </el-tooltip>
              <el-tooltip content="视频" placement="top" effect="light">
                <div class="public-icon toolbar-video" @click="usInsertMVideo()">
                </div>
              </el-tooltip>
              <el-tooltip content="撤销" placement="top" effect="light">
                <div class="public-icon toolbar-undo">
                </div>
              </el-tooltip>
              <el-tooltip content="重做" placement="top" effect="light">
                <div class="public-icon toolbar-redo">
                </div>
              </el-tooltip>
            </div>
            <div ref="editor">
            </div>
          </div>
          <el-form-item label="视频上传">
            <div id="video-uploaded" class="video-uploaded">
              <div class="video-modify-poster" @click="settingVideoCover=true">设置视频封面</div>
              <div class="video-feedback">
                <div id="video-feedback-status" class="video-feedback-status">
                  <a class="video-success" href="http://i.snssdk.com/video/playcode/1/toutiao/e08af26b575c4380abe2760b76c57793" target="_blank">
                    <i></i>
                    <!-- <img src="http://p.pstatp.com/large/9820/3808334921" width="100%" height="100%"> -->
                  </a>
                </div>
                <div class="video-feedback-middle">
                  <div class="video-feedback-mtop">
                    <div id="video-feedback-name" class="video-name oneline">57bbe475a13bc.mp4</div>
                    <i>视频</i>
                  </div>
                  <div class="video-feedback-mbottom">
                    <div class="video-delete" id="video-delete">删除</div>
                    <div class="video-feedback-retry"><span>重新上传</span><input name="video_file" id="retry_video_file" type="file"></div>
                  </div>
                </div>
                <el-button class="new-btn cancel video-feedback-btn" id="video-feedback-btn">添加到正文</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="封面">
            <el-radio-group v-model="coverStyle">
              <el-radio label="" :label="0">自动</el-radio>
              <el-radio label="" :label="1">单图模式</el-radio>
              <el-radio label="" :label="3">三图模式(仅在wifi环境下显示)</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="front-cover-box simple-modal" v-show="coverStyle==1">
            <div class="front-cover-main">
              <i class="front-cover-cur"></i>
              <div class="front-cover-upload">
                <div class="front-cover-img front-cover-single" @click="dialogArticleVisible = true">
                  <!-- <div class="cover-img-modify"><i></i><span>修改</span></div> -->
                </div>
              </div>
              <!-- <div class="front-cover-right">
                <button class="new-btn front-cover-preview cancel" id="front-cover-preview">客户端预览</button>
              </div> -->
              <div class="front-cover-tip">所使用的封面图片均需来自于正文，如文章中含视频请使用自动模式。</div>
            </div>
          </el-form-item>
          <el-form-item class="front-cover-box three-modal" v-show="coverStyle==3">
            <div class="front-cover-main">
              <i class="front-cover-cur"></i>
              <div class="front-cover-upload">
                <div class="front-cover-img front-cover-single">
                  <!-- <div class="cover-img-modify"><i></i><span>修改</span></div> -->
                </div>
                <div class="front-cover-img front-cover-multi" style="display: block;">
                  <!-- <div class="cover-img-modify"><i></i><span>修改</span></div> -->
                </div>
                <div class="front-cover-img front-cover-multi" style="display: block;">
                  <!-- <div class="cover-img-modify"><i></i><span>修改</span></div> -->
                </div>
              </div>
              <!-- <div class="front-cover-right">
                <button class="new-btn front-cover-preview cancel" id="front-cover-preview">客户端预览</button>
              </div> -->
              <div class="front-cover-tip">所使用的封面图片均需来自于正文，如文章中含视频请使用自动模式。</div>
            </div>
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="publishModal.category_id">
              <el-option v-for="item in publish_category" :label="item.tag_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="publishArt()">发表</el-button>
            <el-button @click="saveDraft()">存草稿</el-button>
            <el-button @click="preViewClick()">客户端预览</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="发表视频" name="4">
        <publishVideo></publishVideo>
      </el-tab-pane>
      <el-tab-pane label="发表图集" name="3">
        <publishPics></publishPics>
      </el-tab-pane>
    </el-tabs>
  </div>
  <el-dialog title="上传图片" v-model="dialogImageVisible">
    <div class="image-picker picker-dialog-content">
      <div>
        <i></i>
        <el-button type="primary" @click="dialogImageVisible = false">点击选择图片</el-button>
        <span>支持绝大多数图片格式，单张图片最大支持5MB</span>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogImageVisible = false">确 定</el-button>
      <el-button @click="dialogImageVisible = false">取 消</el-button>
    </div>
  </el-dialog>
  <el-dialog title="本地视频" v-model="dialogVideoVisible">
    <div class="video-picker picker-dialog-content">
      <div>
        <i></i>
        <el-button type="primary" @click="dialogVideoVisible = false">点击选择视频</el-button>
        <span>支持MP4格式的视频，大小不超过2G，较大的视频请压缩上传</span>
      </div>
    </div>
    <!-- <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogImageVisible = false">确 定</el-button>
      <el-button @click="dialogImageVisible = false">取 消</el-button>
    </div> -->
  </el-dialog>
  <el-dialog title="设置视频封面" v-model="settingVideoCover" class="video-cover-dialog">
    <div class="set-video-cover-content">您可以从视频中选择图片作为封面图片，也可以从本地上传照片</div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary">从本地上传照片</el-button>
      <el-button>选择视频中的图片</el-button>
    </div>
  </el-dialog>
  <el-dialog v-model="publishPreviewDialog" class="iphone-frame-dialog">
    <div class="iphone-frame">
      <publishPreview v-bind:innerHTML='innerHTML'></publishPreview>
    </div>
  </el-dialog>

  <el-dialog title="选择图片" class="public-article-pic" v-model="dialogArticleVisible">
    <div class="public-article-pic-content">
      <div class="public-article-img">
        <img src="../../assets/images/icon_meiyou.png" />
        <div class="pic-choose">
          <i class="el-icon-check" style="color:#fff;"></i>
        </div>
      </div>
      <div class="public-article-img">
        <img src="../../assets/images/icon_meiyou.png" />
      </div>
      <div class="public-article-img">
        <img src="../../assets/images/icon_meiyou.png" />
      </div>
      <div class="public-article-img">
        <img src="../../assets/images/icon_meiyou.png" />
      </div>
      <div class="public-article-img">
        <img src="../../assets/images/icon_meiyou.png" />
      </div>
      <div class="public-article-img">
        <img src="../../assets/images/icon_meiyou.png" />
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogArticleVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogArticleVisible = false">确 定</el-button>
  </span>
  </el-dialog>
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

export default {
  name: 'home-publish',
  components: {
    publishVideo,
    publishPics,
    publishPreview,
  },
  data() {
    return {
      id: Math.random(10) + 'ueditorId',
      coverStyle: 0, // 封面
      content: '',
      innerHTML: '',
      activeTab: '', // 选择选项卡的name
      publish_category: [],
      publishModal: {
        type: 2,
        title: '',
        content: '',
        thumbs: [],
        images: [],
        category_id: '',
        action: 'add',
        id: '',
        multi_video: [],
        status: 1,
        video: [],
      },
      toolStates: {
        bold: 0,
        italic: 0,
        paragraph: 0,
        underline: 0,
        insertImage: 0,
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
  },
  mounted() {
    this.$nextTick(function f1() {
      // 保证 this.$el 已经插入文档
      this.$refs.editor.id = this.id;
      this.editor = UE.getEditor(this.id, this.config);

      this.editor.ready(function f2() {
        // this.editor.setContent('this.value');
        this.init();
        this.editor.addListener('contentChange', function () {
          console.log('contentChange');
          const wordCount = this.editor.getContentLength(true);
          this.publishModal.content = this.editor.getContent();
          const plainTxt = this.editor.getPlainTxt();
          this.$emit('input', {
            wordCount: wordCount,
            content: this.publishModal.content,
            plainTxt: plainTxt
          });
        }.bind(this));

        this.editor.addListener('selectionchange', function () {
          // console.log(this.toolStates.keys());
          const stateList = Object.keys(this.toolStates);
          var i = -1;
          while (i++ < stateList.length - 1) {
            this.toolStates[stateList[i]] = this.editor.queryCommandState(stateList[i]);
          }
          console.log(this.toolStates);
        }.bind(this));

        this.$emit('ready', this.editor);
      }.bind(this));

      // this.$refs.upload1.id = this.id + 'upload';
    });

  },
  created() {
    const self = this;
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
  methods: {
    toolbarScroll: function () {
      let IO = document.getElementById('publishToolbar'),
        Y = IO,
        H = 0,
        IE6;
      if(IO){
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
          this.publishModal = result.data;
          this.editor.setContent = this.publishModal.content;
          console.log(this.editor.get);
        }, err => {
          console.error('获取文章详情成功失败:' + err.message);
        });
      } else {
        // 有本地缓存
        // 没有本地缓存
        Object.assign(this.publishModal, this.$options.data().publishModal);
        console.log(this.publishModal);
      }
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
      this.editor.execCommand('insertunorderedlist', 'decimal');
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
      this.editor.execCommand('insertimage', {
        src: 'https://p.pstatp.com/large/141f0006470e8453fc83'
      });
    },
    usInsertMImage: function () {
      const imageHtml =
        '<p><img class="mu-ue-image" src="https://p.pstatp.com/large/141f0006470e8453fc83" _src="https://p.pstatp.com/large/141f0006470e8453fc83"><br></p>';
      this.editor.execCommand('inserthtml', imageHtml);
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
    usInsertMVideo: function () {
      this.settingVideoCover = true;
      // const videoHtml = '<p><img class="video-image" src="/static/images/video-cover.png"><p>';
      const videoHtml = '<p><video src="/static/video.mp4" style="display:block;margin:auto;" width="320" height="240" controls="controls">your browser does not support the video tag</video><p>';
      this.editor.execCommand('inserthtml', videoHtml);
    },
    ueInsertVideo: function () {
      this.settingVideoCover = true;
      var videoAttr = {
        // 视频地址
        url: 'http://www.youku.com/xxx',
        //视频宽高值， 单位px
        width: 200,
        height: 100
      };
      // editor 是编辑器实例
      // 向编辑器插入单个视频
      this.editor.execCommand('insertvideo', videoAttr);
    },
    preViewClick: function () {
      // this.editor.execCommand('preview')
      this.innerHTML = this.editor.getAllHtml();
      console.log(this.innerHTML);
      this.publishPreviewDialog = true;
    },
    publishArt: function () {
      this.publishModal.status = 1;
      API.saveUpdateArticle(this.publishModal).then(result => {
        console.log('发表成功');
        this.$message({
          message: '文章发表成功',
          type: 'success'
        });
      }, err => {
        this.$message.error('发表失败' + err.message);
        console.error('发表失败:' + err.message);
      });
    },
    saveDraft: function () {
      this.publishModal.status = 8;
      API.saveUpdateArticle(this.publishModal).then(result => {
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
<style type="text/css">
.publish-box {
  margin-left: 40px;
  margin-right: 40px;
  width: 900px;
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

.publish-box .el-tabs__item {
  font-size: 16px;
}

.publish-toolbar {
  background: #eee none repeat scroll 0 0;
  border-bottom: 1px solid #e9e9e9;
  border-radius: 0;
  box-shadow: none;
  padding: 5px 10px;
  z-index: 1000;
  width: 900px;
  /*position: absolute;*/
  top: 58px;
}

.publish-toolbar .public-icon {
  height: 30px;
  width: 30px;
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
}

.toolbar-h {
  background-image: url(../../assets/images/toolbar-h.png);
  background-size: 18px 18px;
  display: inline-block;
}

.toolbar-b {
  background-image: url(../../assets/images/toolbar-b.png);
  background-size: 18px 18px;
  display: inline-block;
}

.toolbar-order {
  background-image: url(../../assets/images/toolbar-order.png);
  background-size: 18px 18px;
  display: inline-block;
}

.toolbar-unorder {
  background-image: url(../../assets/images/toolbar-unorder.png);
  background-size: 18px 18px;
  display: inline-block;
}

.toolbar-pic {
  background-image: url(../../assets/images/toolbar-pic.png);
  background-size: 18px 18px;
  display: inline-block;
}

.toolbar-video {
  background-image: url(../../assets/images/toolbar-video.png);
  background-size: 18px 18px;
  display: inline-block;
}

.toolbar-undo {
  transform: scaleX(-1);
  background-image: url(../../assets/images/toolbar-back.png);
  background-size: 18px 18px;
  display: inline-block;
}

.toolbar-redo {
  background-image: url(../../assets/images/toolbar-back.png);
  background-size: 18px 18px;
  display: inline-block;
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

.front-cover-upload .front-cover-img {
  background-position: center;
  position: relative;
  float: left;
  width: 202px;
  height: 131px;
  margin-right: 20px;
  background-color: #f0f1f3;
  cursor: pointer;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
  overflow: hidden;
  background-repeat: no-repeat;
  background-image: url(../../assets/images/picutre_add.png);
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
}

.video-success {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
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

.video-feedback-mtop>i {
  position: absolute;
  right: 0;
  bottom: 0;
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

.publish-box .video-cover-dialog .el-dialog__footer {
  text-align: center;
}

.image-picker .picker-dialog-content {
  width: 100%;
  height: 328px;
  text-align: center;
  vertical-align: bottom;
  margin: auto;
  border: 2px dashed #B5B5B5;
}

.picker-dialog-content>div {
  display: block;
  text-align: center;
  margin: 60px auto;
}

.image-picker>div>i {
  background-image: url(../../assets/images/add-pic.png);
}

.video-picker>div>i {
  background-image: url(../../assets/images/add-video.png);
}

.picker-dialog-content>div>i {
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

.picker-dialog-content>span {
  font-size: 14px;
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
  width: 630px;
  margin-left: auto;
  margin-right: auto;
  border: 1px dashed #B5B5B5;
  overflow-x: hidden;
  padding: 20px 10px;
  max-height: 348px;
  overflow-y: auto;
}

.public-article-img {
  float: left;
  margin-left: 10px;
  margin-top: 10px;
  position: relative;
  cursor: pointer;
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
</style>
