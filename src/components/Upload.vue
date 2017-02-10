<!--
//使用示例：onSuccess成功回调函数，onProgress：当前进度回调函数，beforeUpload上传文件前回调行数
filters对象格式：
{
  ext: 'jpg,gif,png,bmp', //扩展名类型
  max_file_size: '10mb' //限制大小
}
<upload :filters="filters" :onSuccess="onSuccess" :onProgress="onProgress" :beforeUpload="beforeUpload">
  <el-button size="small" type="primary" class="account-upload">上 传</el-button>
</upload>
-->
<template lang="html">
  <div class="upload-wrap">
      <div :id="pId"></div>
      <span :id="bId">
        <slot>
          <a href="javascript:void(0);" class='upload-btn'>上传</a>
        </slot>
      </span>
  </div>
</template>

<script>
import Base64 from '../../static/pupload/base64';
import '../../static/pupload/crypto1/crypto/crypto';
import '../../static/pupload/crypto1/hmac/hmac';
import '../../static/pupload/crypto1/sha1/sha1';
import plupload from '../../static/pupload/plupload-2.1.2/js/plupload.full.min';
// import API from '../service';

export default {
  name: 'upload',
  data() {
    return {
      // fileId: '',
      bId: 'static' + this.guid(),
      pId: 'static' + this.guid(),
      accessid: '',
      accesskey: '',
      token: '',
      host: '',
      userID: '',
      gDirname: 'www.mp.meiyou.com/',
      gObjectName: '',
      policyText: '',
      policyBase64: '',
      message: '',
      bytes: '',
      signature: ''
    };
  },
  props: {
    isAvatar: {
      type: Boolean,
      default: false
    },
    fileId: '',
    beforeUpload: Function,
    onSuccess: Function,
    onError: Function,
    onProgress: Function,
    filters: {
      type: Object,
      default() {
        return {
          ext: 'jpg,gif,jpeg,png,bmp',
          max_file_size: '5mb'
        };
      }
    }
  },
  beforeCreate() {

  },
  mounted() {
    this.$nextTick(() => {
      this.initDataAndUpload();
    });
  },
  methods: {
    initDataAndUpload() {
      this.accessid = 'LTAIOa3pfAqDh3UP';
      this.accesskey = '5GbDstnwPucCJqAKaC9OzWRUm1aySY';
      // this.token = data.SecurityToken;
      this.host = 'https://lixingdecai.oss-cn-shanghai.aliyuncs.com/';
      // this.userID = data.userID;
      this.policyText = {
        // 设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
        expiration: '2020-01-01T12:00:00.000Z',
        // 设置上传文件的大小限制
        conditions: [
          ['content-length-range', 0, 104857600000]
        ]
      };
      this.policyBase64 = Base64.encode(JSON.stringify(this.policyText));
      this.message = this.policyBase64;
      this.bytes = Crypto.hmac(Crypto.SHA1, this.message, this.accesskey, {
        asBytes: true
      });
      this.signature = Crypto.util.bytesToBase64(this.bytes);
      this.upload();
      // API.fetchUploadtoken().then(json => {
      //   if (json && json.code === 0) {
      //     const data = json.data;
      //     this.accessid = data.AccessKeyId;
      //     this.accesskey = data.AccessKeySecret;
      //     this.token = data.SecurityToken;
      //     this.host = data.imageHost;
      //     this.userID = data.userID;
      //     this.policyText = {
      //       // 设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
      //       expiration: data.Expiration,
      //       // 设置上传文件的大小限制
      //       conditions: [
      //         ['content-length-range', 0, 104857600000]
      //       ]
      //     };
      //     this.policyBase64 = Base64.encode(JSON.stringify(this.policyText));
      //     this.message = this.policyBase64;
      //     this.bytes = Crypto.hmac(Crypto.SHA1, this.message, this.accesskey, {
      //       asBytes: true
      //     });
      //     this.signature = Crypto.util.bytesToBase64(this.bytes);
      //     this.upload();
      //   }
      // }).catch(error => {
      //   this.$message.error('上传接口异常，' + error.status);
      // });
    },
    s4() {
      return (((1 + Math.random()) * 0x10000) || 0).toString(16).substring(1);
    },
    guid() {
      return (this.s4() + Date.now() + Math.floor(Math.random() * 999999)).replace(new RegExp('\\.', 'gm'), '');
    },
    getSuffix(filename) {
      const pos = filename.lastIndexOf('.');
      let suffix = '';
      if (pos !== -1) {
        suffix = filename.substring(pos);
      }
      return suffix;
    },
    calculateObjectName(filename) {
      this.gObjectName += `${filename}`;
      const suffix = this.getSuffix(filename);
      if (this.isAvatar) {
        this.gObjectName = this.gDirname + 'avatar_' + this.userID + '_' + this.guid() + suffix;
      } else {
        this.gObjectName = this.gDirname + this.guid() + suffix;
      }
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
        // 'x-oss-security-token': this.token
      };
      up.setOption({
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
        url: that.host,
        multi_selection: true,
        filters: {
          mime_types: [{
            title: '允许上传文件类型',
            extensions: this.filters.ext
          }],
          // 最大只能上传100kb的文件
          max_file_size: this.filters.max_file_size.toLowerCase(),
          // 不允许队列中存在重复文件
          // prevent_duplicates: true
        },
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
              if (that.fileId) {
                file.imageId = that.fileId;
              }
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
              if (that.fileId) {
                file.id = that.fileId;
              }
              that.onProgress(up, file);
            }
          },

          FileUploaded: (up, file, info) => {
            if (info.status === 200) {
              const fileUrl = that.host + that.getUploadedObjectName(file.name);
              // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '上传成功, 文件名:' + that.getUploadedObjectName(file.name);
              if (that.onSuccess) {
                if (that.fileId) {
                  file.id = that.fileId;
                }
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
            if (err.message === 'File size error.') {
              that.$message.error('文件大小超出限制，限制大小为' + that.filters.max_file_size);
            }
            if (that.onError) {
              that.onError(err.message);
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
.upload-wrap {
  overflow: hidden;
}

.upload-btn {
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

a.upload-btn:hover {
  background-color: #ff82c0;
}

.progress {
  margin-top: 2px;
  width: 200px;
  height: 14px;
  margin-bottom: 10px;
  overflow: hidden;
  background-color: #f5f5f5;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);
}

.progress-bar {
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
