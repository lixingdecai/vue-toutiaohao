<style>
.publish-preview-box {
  /*padding: 30px;*/
  position: absolute;
  top: 194px;
  left: 50px;
}
</style>
<template>
<div class="publish-preview-box" ref="previewFrame">
  <IFRAME border=0 marginWidth=0 name="previewFrame" id="previewFrame" frameSpacing=0 marginHeight=0 frameBorder=0 scrolling="true" width=345 height=555 vspale="0" :srcdoc="htm">
  </IFRAME>
</div>
</template>

<script>
import Tool from '../../util/tools';

export default {
  name: 'publishPreview',
  data() {
    return {
      htm: '',
      aa: '<b>lllllll</b>',
      phtml: '',
      publishVideoForm: false,
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
  props: {
    innerHTML: {
      type: String,
      default: '',
    },
    title: '',
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    },
    getUserInfo() {
      this.name = Tool.getUserName();
      this.avatar = Tool.getUserAvatar();
    },
    showHtml() {
      this.htm = '<div id="mainContent" class="main-content"><article class="article" id="article"><div class="article-detail"><h1 class="title">' + this.title + '</h1><div class="publish publish-auth"><img class="avatar-img scrollLoading" src="' +
        this.avatar + '" onerror="this.src=\'/home-page/images/avatar.png\'" /><span class="publish-name repeater-name">' + this.name +
        '</span><span class="date">2015-07-09</span><div class="focus-btn">关注</div></div><div class="article-content article-text-img">' + this.innerHTML + '</div> </article></div>';
    }
  },
  mounted() {
    this.$nextTick(function f1() {
      this.getUserInfo();
      this.showHtml();
    });
  }
};
</script>
