<template>
<div ref="webUpload">
</div>
</template>

<script>
/* eslint-disable */
import '../../static/UEditor/ueditor.config';
import '../../static/UEditor/ueditor.all';
import '../../static/UEditor/lang/zh-cn/zh-cn';
// import '../lib/utf8-php/themes/default/css/ueditor.css'

// import { generateRandonInteger } from '../../../vuex/utils';

export default {
  data() {
    return {
      id: Math.random(10) + 'ueditorId',
      content: ''
    };
  },
  props: {
    value: {
      type: String,
      default: null,
    },
    config: {
      type: Object,
      default: {},
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
      this.$refs.webUpload.id = this.id;
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
