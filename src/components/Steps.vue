<template lang="html">
  <div class="register-steps">
    <el-steps :space="152" :active="active" finish-status="finish" class="el-steps">
      <el-step title="注册信息"></el-step>
      <el-step title="运营者信息"></el-step>
      <el-step title="账号信息"></el-step>
    </el-steps>
  </div>
</template>

<script type="es6">
export default {
  props: ['active']
}
</script>
