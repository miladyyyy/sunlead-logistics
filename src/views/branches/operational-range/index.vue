<template>
  <div class="app-container">
    <div class="left-side">
      <AreasTree/>
    </div>

    <div class="right-side"></div>
  </div>
</template>
<script>
import AreasTree from '@/components/areas-tree.vue'

export default {
  components: { AreasTree },
  name: 'operational-range'
}
</script>
<style lang="scss" scoped>
.app-container {
  display: flex;
  .left-side {
    padding: 9px;
    background-color: #fff;
    width: 214px;
    margin-right: 20px;
  }
  .right-side {
    flex: auto;
  }
}
</style>
