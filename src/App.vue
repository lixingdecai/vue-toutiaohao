<template>
  <div>
    <mp-header></mp-header>
    <transition>
      <router-view></router-view>
    </transition>
    <mp-footer></mp-footer>
  </div>
</template>

<script>
import mpHeader from './components/Header';
import mpFooter from './components/Footer';

export default {
  name: 'app',
  components: {
    mpHeader,
    mpFooter
  }
};
</script>
