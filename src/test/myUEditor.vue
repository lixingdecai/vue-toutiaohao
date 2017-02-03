<style type="text/css">
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
</style>
<template>
<div>
  <div>
    <div>
      <input type="button" value="加粗" v-on:click="execCommand('bold')" style="height:24px;line-height:20px" />
      <input type="button" value="加斜" v-on:click="execCommand('italic')" style="height:24px;line-height:20px" />
      <input type="button" value="标题" v-on:click='ueParagraph()' style="height:24px;line-height:20px" />
      <input type="button" value="取消标题" v-on:click='ueDisParagraph()' style="height:24px;line-height:20px" />
      <input type="button" value="下划线" v-on:click="execCommand('underline')" style="height:24px;line-height:20px" />
      <input type="button" value="上传图片" v-on:click="ueImage()" style="height:24px;line-height:20px" />
      <input type="button" value="插入图片" v-on:click="ueInsertImage()" style="height:24px;line-height:20px" />
      <input type="button" value="插入视频" v-on:click="ueInsertVideo()" style="height:24px;line-height:20px" />
      <input type="button" value="插入自定义图片" v-on:click="usInsertMImage()" style="height:24px;line-height:20px" />
      <input type="button" value="插入自定义视频" v-on:click="usInsertMVideo()" style="height:24px;line-height:20px" />
      <input type="button" value="撤销" v-on:click="execCommand('undo')" style="height:24px;line-height:20px" />
      <input type="button" value="重做" v-on:click="execCommand('redo')" style="height:24px;line-height:20px" />
      <input type="button" value="清楚格式" v-on:click="removeFormate()" style="height:24px;line-height:20px" />
    </div>
  </div>
  <div ref="editor">
  </div>
  <div ref="upload1"></div>
  <el-dialog title="上传图片" v-model="dialogImageVisible">
    <el-upload action="//jsonplaceholder.typicode.com/posts/" type="drag" :multiple="true">
      <i class="el-icon-upload"></i>
      <div class="el-dragger__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogImageVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogImageVisible = false">确 定</el-button>
    </div>
  </el-dialog>

</div>
</template>

<script>
/* eslint-disable */

import '../../static/UEditor/ueditor.config';
import '../../static/UEditor/ueditor.all';
import '../../static/UEditor/lang/zh-cn/zh-cn';
// import '../../static/UEditor/third-party/webuploader/webuploader.css';
// import '../../static/UEditor/aaa.js';
// import $ from '../../static/UEditor/third-party/jquery-1.10.2'
// // const $ = require('../../static/UEditor/third-party/jquery-1.10.2');
// import webuploader from '../../static/UEditor/third-party/webuploader/webuploader';
// import '../../static/UEditor/dialogs/internal.js'

export default {
  data() {
    return {
      id: Math.random(10) + 'ueditorId',
      content: '',
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
        this.editor.setContent('this.value');

        this.editor.addListener('contentChange', function () {
          console.log('contentChange');
          const wordCount = this.editor.getContentLength(true);
          const content = this.editor.getContent();
          const plainTxt = this.editor.getPlainTxt();
          this.$emit('input', {
            wordCount: wordCount,
            content: content,
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
    ueImage: function () {
      // 创建dialog
      this.dialogImageVisible = true;
    },
    removeFormate: function () {
      console.log('removeFormate');
      this.editor.execCommand('removeformat', 'h1,strong,em');
    },
    ueInsertImage: function () {
      this.editor.execCommand('insertimage', {
        src: 'https://p.pstatp.com/large/141f0006470e8453fc83'
      });
    },
    usInsertMImage: function () {
      const imageHtml = '<img class="mu-ue-image" src="https://p.pstatp.com/large/141f0006470e8453fc83" _src="https://p.pstatp.com/large/141f0006470e8453fc83">';
      this.editor.execCommand('inserthtml', imageHtml);
    },
    usInsertMVideo: function () {
      const videoHtml = '<a class="mu-ue-video" id="local-video" data-id="f75d661d8f2b486b86e2fe1528d08d70" href="javascript:;" title="57bbe475a13bc.mp4"><img src="http://p.pstatp.com/large/9820/3808334921" ><i></i></a>';
      this.editor.execCommand('inserthtml', videoHtml);
    },
    ueInsertVideo: function () {
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
    }
  }
};
</script>
