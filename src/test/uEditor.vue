<template>
<div ref="editor">
</div>
</template>

<script>
/* eslint-disable */
import '../../static/UEditor/ueditor.config';
import '../../static/UEditor/ueditor.all';
import '../../static/UEditor/lang/zh-cn/zh-cn';
// import '../../static/UEditor/addVideoButton';
// import '../../static/UEditor/addCustomizeDialog';

// import './ueditor_custom.css'
// import '../../static/UEditor/common';
// import '../lib/utf8-php/themes/default/css/ueditor.css'

// import { generateRandonInteger } from '../../../vuex/utils';

export default {
  data() {
    return {
      id: Math.random(10) + 'ueditorId',
      content: '',
      config: {
        toolbars: [
          [
            'h1',
            'bold',
            // 'underline',
            // '|',
            'blockquote',
            'ul',
            'ol',
            'horizontal',

            '|',
            'article_link',
            'insertimage',
            'ic',

            'upload_video',
            'create_vote',

            '|',
            'removeformat',
            'myautosave',
            'undo',
            'redo'
          ]

        ],
        labelMap: {
          simpleupload: "单图上传",
          insertimage: "图片",
          create_vote: "投票",
          upload_video: "视频",
          groupimages: "组图",
          create_rank: "插入榜单"
        },
      },
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
        this.editor.setContent(this.value);

        this.editor.addListener("contentChange", function () {
          const wordCount = this.editor.getContentLength(true);
          const content = this.editor.getContent();
          const plainTxt = this.editor.getPlainTxt();
          this.$emit('input', {
            wordCount: wordCount,
            content: content,
            plainTxt: plainTxt
          });
        }.bind(this));

        this.$emit('ready', this.editor);
      }.bind(this));
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
  }
};
</script>
