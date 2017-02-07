<!--
使用示例
imgUrl:待裁剪图片url地址
aspectRatio: 长宽比例，0：任意选择，1：正方形
getCropImg：组件像父组件传递裁剪后图片url
crop：唤醒裁剪
setSelect: 初始化裁剪框x,y,x1,y1
allowResize: 是否允许缩放选区
allowSelect: 是否允许新选区
minSize: 选区最小范围
<crop :imgUrl="imgUrl" :minSize=[100,100] :allowSelect="false" :allowResize="false" :setSelect="[10,10,100,100]" @getCropImg="ruleForm.avatar = arguments[0]" :aspectRatio="1" :crop="crop"></crop>
-->

<template lang="html">
  <div>
    <el-dialog title="裁剪图片" v-model="dialogCropVisible">
      <div class="crop-pic-content">
        <img :src="imgUrl" :id="bId" alt="Jcrop Image" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCropVisible = false">取 消</el-button>
        <el-button type="primary" @click="cropImage()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import $ from 'jquery';
import '../../static/Jcrop/js/jquery.Jcrop.min';
import '../../static/Jcrop/css/jquery.Jcrop.min.css';

export default {
  name: 'crop',
  data() {
    return {
      bId: 'static' + this.guid(),
      cropApi: '',
      x: 0,
      y: 0,
      w: 100,
      h: 100,
      cropUrl: '',
      dialogCropVisible: false
    };
  },
  props: {
    imgUrl: String,
    crop: {
      type: Boolean,
      default: false
    },
    aspectRatio: {
      type: Number,
      default: 0
    },
    allowResize: {
      type: Boolean,
      default: true
    },
    allowSelect: {
      type: Boolean,
      default: true
    },
    setSelect: {
      type: Array,
      default() {
        return [0, 0, 100, 100];
      }
    },
    minSize: {
      type: Array,
      default() {
        return [0, 0];
      }
    }
  },
  watch: {
    'crop'() {
      this.dialogCropVisible = true;
    },
    'aspectRatio'() {
      if (this.cropApi) {
        this.cropApi.setOptions(
          { aspectRatio: this.aspectRatio }
        );
      }
    },
    'imgUrl'() {
      const that = this;
      /* eslint-disable func-names */
      this.$nextTick(() => {
        if (!this.cropApi) {
          $('#' + this.bId).jcrop({
            onChange: this.setCoords,
            onSelect: this.setCoords,
            aspectRatio: this.aspectRatio,
            allowResize: this.allowResize,
            allowSelect: this.allowSelect,
            minSize: this.minSize,
            // 限制画布宽度
            boxWidth: 890,
            bgFade: true,
            bgOpacity: 0.2,
            setSelect: this.setSelect
          }, function () {
            that.cropApi = this;
          });
        } else {
          that.cropApi.setImage(this.imgUrl, () => {
            that.cropApi.setSelect(this.setSelect);
          });
        }
      });
    },
    immediate: true
  },
  methods: {
    s4() {
      return (((1 + Math.random()) * 0x10000) || 0).toString(16).substring(1);
    },
    guid() {
      return (this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4()).replace(new RegExp('\\.', 'gm'), '-');
    },
    cropImage() {
      // this.cropApi.destroy();
      this.dialogCropVisible = false;
      this.$emit('getCropImg', this.cropUrl);
    },
    setCoords(c) {
      this.x = c.x;
      this.y = c.y;
      this.w = c.w;
      this.h = c.h;
      this.cropUrl = this.imgUrl + '?imageMogr2/crop/!' + Math.round(this.w) + 'x' + Math.round(this.h) + 'a' + Math.round(this.x) + 'a' + Math.round(this.y);
    }
  }
};
</script>

<style>
  .crop-pic-content {
    overflow-y: auto;
    max-height: 500px;
    min-height: 200px;
  }
</style>
