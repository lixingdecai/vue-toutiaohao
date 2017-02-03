<template lang="html">
  <footer class="footer">
    <span class="footer-detail">闽ICP备13020990号-5</span>
    <span class="footer-detail">
      <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=35020302000042" target="_blank"><img src="../assets/images/ghs.png" height="20" width="20" class="ghs" alt="ghs" />闽公网安备 35020302000042号</a>
    </span>
    <span class="footer-detail">Copyright&nbsp;&copy;&nbsp;2016&nbsp;Meetyou.&nbsp;保留所有权利</span>
  </footer>
</template>

<script>
export default {
  name: 'footer'
};
</script>

<style lang="scss">
.footer {
  border-top: 1px solid #f2f2f2;
  width: 100%;
  height: 50px;
  font-size: 14px;
  text-align: center;
  line-height: 50px;
}

.footer-detail {
  display: inline-block;
  margin-right: 10px;
  color: #888;
  a {
    &:hover {
      text-decoration: underline;
    }
    color: #888;
    img {
      font-size: 0;
      margin-right: 3px;
      vertical-align: middle;
    }
  }
}
</style>
