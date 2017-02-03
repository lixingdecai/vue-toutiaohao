<template>
  <div>
    <div class='edit-area'>
      <ueditor v-bind:value='defaultMsg' v-bind:config='config' ref="ueditor" v-on:input='input' v-on:ready='ready'></ueditor>
    </div>
    <el-button type="primary" v-on:click='onSubmit'>主要按钮</el-button>
  </div>
</template>

<script>
  import ueditor from './uEditor.vue';

  export default {
    components: {
      ueditor,
    },
    data() {
      // let ServerUrl = '//192.168.10.191/shoespifa/js/uedit/';
      return {
        defaultMsg: '<p>初始文本ssssssss</p>',
        config: null
      };
    },
    methods: {
      onSubmit() {
        // let value = this.$refs.ueditor.editorContent;
        // console.log(this.editorContent.content);
      },
      input(editorContent) {
        this.editorContent = editorContent;
        // console.log(editorContent);
      },
      ready(ueditor) {
        this.ueditor = ueditor;
      }
    }
  };
</script>
