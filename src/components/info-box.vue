<template>
  <div class="info-box">
    <el-collapse v-model="activeNames">
      <el-collapse-item :title="title" name="1">
        <slot></slot>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: 'InfoBox',
  props: {
    title: {
      type: String
    }
  },

  data () {
    return {
      activeNames: '1'
    }
  }
}
</script>

<style lang="scss" scoped>
.el-collapse {
  width: 100%;

  ::v-deep .el-collapse-item__header {
    font-weight: 700;
    color: #2a2929;
    font-size: 16px;
    height: 60px;
    padding: 0 44px;
    line-height: 60px;
    background: #f8faff;
  }

  ::v-deep .el-collapse-item__content {
    padding: 24px 44px;
  }
}
</style>
