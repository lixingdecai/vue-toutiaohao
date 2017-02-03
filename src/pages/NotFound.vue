<template lang="html">
  <div class="container">
    <div class="error-wrap">
      <img class="error-img" src="../assets/images/404.png" height="348" width="588" alt="">
      <p class="error-msg">页面不存在或已被删除</p>
    </div>
  </div>
</template>

<script type="es6">
export default {
  name: 'not-found'
};
</script>

<style lang="scss">
.error-wrap {
  text-align: center;
  padding-top: 200px;
}

.error-img {
  display: block;
  width: 425px;
  height: 250px;
  margin: 0 auto;
}

.error-msg {
  font-size: 20px;
  color: #323232;
  margin-top: 25px;
}
</style>
