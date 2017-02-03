<template lang="html">
  <div class="wrap">
    <div :id="pId">你的浏览器不支持flash,Silverlight或者HTML5！</div>
    <div>
      <div :id="bId">
        <slot>
          <a href="javascript:void(0);" class='btn'>上传</a>
        </slot>
      </div>
      
    </div>
    <pre id="console"></pre>
    <p>&nbsp;</p>
  </div>
</template>

<script>
import Base64 from '../../static/js/lib/pupload/base64';
import '../../static/js/lib/pupload/crypto1/crypto/crypto';
import '../../static/js/lib/pupload/crypto1/hmac/hmac';
import '../../static/js/lib/pupload/crypto1/sha1/sha1';
import plupload from '../../static/js/lib/pupload/plupload-2.1.2/js/plupload.full.min';

export default {
  name: 'upload',
  data() {
    return {
      bId: 'b' + this.uploadId,
      pId: 'p' + this.uploadId,
      accessid: 'LTAI7wc8mBFlYpxy',
      accesskey: 'W3eH1wDLF0I7c0ecJrffV91R6wnNbC',
      host: 'http://test-simple.oss-cn-shanghai.aliyuncs.com',
      gDirname: '',
      gObjectName: '',
      policyText: {
        // 设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
        expiration: '2020-01-01T12:00:00.000Z',
        // 设置上传文件的大小限制
        conditions: [
          ['content-length-range', 0, 1048576000]
        ]
      },
      policyBase64: '',
      message: '',
      bytes: '',
      signature: ''
    };
  },
  props: {
    uploadId: String,
    beforeUpload: Function,
    onSuccess: Function,
    onError: Function,
    onProgress: Function
  },
  beforeCreate() {

  },
  created() {
    this.$nextTick(() => {
      this.initData();
      this.upload();
    });
  },
  methods: {
    initData() {
      this.policyBase64 = Base64.encode(JSON.stringify(this.policyText));
      this.message = this.policyBase64;
      this.bytes = Crypto.hmac(Crypto.SHA1, this.message, this.accesskey, { asBytes: true });
      this.signature = Crypto.util.bytesToBase64(this.bytes);
    },
    calculateObjectName(filename) {
      this.gObjectName += `${filename}`;
      return '';
    },
    getUploadedObjectName(filename) {
      let tmpName = this.gObjectName;
      tmpName = tmpName.replace(`${filename}`, filename);
      return tmpName;
    },
    setUploadParam(up, filename) {
      this.gObjectName = this.gDirname;
      if (filename !== '') {
        this.calculateObjectName(filename);
      }
      const newMultipartParams = {
        key: this.gObjectName,
        policy: this.policyBase64,
        OSSAccessKeyId: this.accessid,
        // 让服务端返回200,不然，默认会返回204
        success_action_status: '200',
        signature: this.signature,
      };
      up.setOption({
        url: this.host,
        multipart_params: newMultipartParams
      });
      up.start();
    },
    upload() {
      const that = this;
      const uploader = new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4',
        browse_button: that.bId + '',
        // multi_selection: false,
        // container: document.getElementById('container'),
        flash_swf_url: '../../static/js/lib/pupload/plupload-2.1.2/js/Moxie.swf',
        silverlight_xap_url: '../../static/js/lib/pupload/plupload-2.1.2/js/Moxie.xap',
        url: 'http://oss.aliyuncs.com',
        init: {
          PostInit: () => {
            document.getElementById(that.pId).innerHTML = '';
            // document.getElementById('postfiles').onclick = () => {
            //   setUploadParam(uploader, '', false);
            //   return false;
            // };
          },
          FilesAdded: () => {
            // plupload.each(files, file => {
            //   document.getElementById(that.pId).innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
            //   + '<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
            //   + '</div>';
            // });
            // 选择后自动上传
            this.setUploadParam(uploader, '', false);
          },

          BeforeUpload: (up, file) => {
            // getDirname();
            this.setUploadParam(up, file.name, true);
            if (that.beforeUpload) {
              that.beforeUpload(up, file);
            }
          },

          UploadProgress: (up, file) => {
            // const d = document.getElementById(file.id);
            // d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + '%</span>';
            // const prog = d.getElementsByTagName('div')[0];
            // const progBar = prog.getElementsByTagName('div')[0];
            // progBar.style.width = (2 * file.percent) + 'px';
            // progBar.setAttribute('aria-valuenow', file.percent);
            if (that.onProgress) {
              that.onProgress(up, file);
            }
          },


          FileUploaded: (up, file, info) => {
            if (info.status === 200) {
              const fileUrl = that.host + '/' + that.getUploadedObjectName(file.name);
              // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '上传成功, 文件名:' + that.getUploadedObjectName(file.name);
              if (that.onSuccess) {
                that.onSuccess(fileUrl, up, file, info);
              }
            } else {
              const message = info.response;
              if (that.onError) {
                that.onError(message);
              }
              // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
            }
          },
          Error: (up, err) => {
            if (that.onError) {
              that.onError(err.response);
            }
            // document.getElementById('console').appendChild(document.createTextNode('\nError xml:' + err.response));
          }
        }
      });
      uploader.init();
    }
  }
};
</script>

<style>
  .btn{
    color: #fff;
    background-color: #ff74b9;
    border-color: #ff74b9;
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    text-decoration: none;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;
  }
  a.btn:hover{
    background-color: #ff82c0;
  }
  .progress{
    margin-top:2px;
    width: 200px;
    height: 14px;
    margin-bottom: 10px;
    overflow: hidden;
    background-color: #f5f5f5;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 2px rgba(0,0,0,.1);
    box-shadow: inset 0 1px 2px rgba(0,0,0,.1);
  }
  .progress-bar{
    background-color: rgb(92, 184, 92);
    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.14902) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.14902) 50%, rgba(255, 255, 255, 0.14902) 75%, transparent 75%, transparent);
    background-size: 40px 40px;
    box-shadow: rgba(0, 0, 0, 0.14902) 0px -1px 0px 0px inset;
    box-sizing: border-box;
    color: rgb(255, 255, 255);
    display: block;
    float: left;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    transition-delay: 0s;
    transition-duration: 0.6s;
    transition-property: width;
    transition-timing-function: ease;
    width: 266.188px;
  }
</style>
