<template>
  <div>
   <el-card shadow="never">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="1"></el-tab-pane>
      <el-tab-pane label="行驶证信息" name="2"></el-tab-pane>
    </el-tabs>
   </el-card>
  </div>
</template>

<script>
export default {
  name: 'vehicle-detail',
  data () {
    return {
      activeName: '1'
    }
  },

  methods: {
    handleClick () {

    }
  }
}
</script>

<style lang="scss" scoped></style>
