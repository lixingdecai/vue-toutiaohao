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
  <IFRAME border=0 marginWidth=0 name="previewFrame" id="previewFrame" frameSpacing=0 marginHeight=0 frameBorder=0 scrolling="true" width=345 height=555 vspale="0" :srcdoc="innerHTML">
  </IFRAME>
</div>
</template>

<script>
// import $ from 'jquery';

export default {
  name: 'publishPreview',
  data() {
    return {
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
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    }
  },
  mounted() {
    this.$nextTick(() => {
      // const ihtml = this.innerHTML;
      // this.phtml = `<link rel="stylesheet" type="text/css" href="/static/UEditor/themes/iframe.css">${ihtml}`;
    });
  },
};
</script>
