<template lang="html">
  <transition name="fade">
    <div id="back-to-top" v-show="show" @click="backToTop">
      <i class="icon-totop"></i>
    </div>
  </transition>
</template>

<script type="es6">
export default {
  name: 'to-top',
  data() {
    return {
      show: false
    }
  },
  created() {
    const self = this;
    if (window.addEventListener) {
      window.addEventListener('scroll', self.handleScroll, false);
    } else if (window.attachEvent) {
      window.attachEvent('onscroll', self.handleScroll);
    } else {
      window['onscroll'] = self.handleScroll;
    }
  },
  beforeDestory() {
    const self = this;
    if (window.removeEventListener) {
      window.removeEventListener('scroll', self.handleScroll, false);
    } else if (window.detachEvent) {
      window.detachEvent('onscroll', self.handleScroll);
    } else {
      window['onscroll'] = null;
    }
  },
  methods: {
    backToTop() {
      window.scrollTo(0, 0);
    },
    handleScroll() {
      this.show = (window.scrollY > 400) && true || false;
    }
  }
};
</script>

<style lang="scss" scoped>
#back-to-top {
  position: fixed;
  right: 50px;
  bottom: 50px;
  font-size: 0;
  overflow: hidden;
  cursor: pointer;
  z-index: 99999;
}

.icon-totop {
  display: inline-block;
  height: 50px;
  width: 50px;
  background-image: url('../assets/images/totop.png');
  background-size: 100%;
  text-indent: -999em;
}

.fade-enter-active, .fade-leave-active {
  -webkit-transition: all 0.25s linear;
  -ms-transition: all 0.25s linear;
  -o-transition: all 0.25s linear;
  -moz-transition: all 0.25s linear;
  transition: all 0.25s linear;
}

.fade-enter, .fade-leave-active {
  opacity: 0;
  filter: Alpha(opacity=0);
}
</style>
