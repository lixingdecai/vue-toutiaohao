<template>
  <div class="container">
    <mp-menu></mp-menu>
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import mpMenu from '../components/Menu';

export default {
  name: 'home',
  components: {
    mpMenu
  }
};
</script>
