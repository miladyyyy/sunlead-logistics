<template>
  <div class="app-container">
    <div class="left-side">
      <AreasTree />
    </div>

    <div class="right-side">
      <el-card>
        <template #header>
          <div class="card-header">
            <span class="title">作业范围</span>
            <el-button type="primary">编辑</el-button>
          </div>
        </template>

        <div id="map-container">
          <!-- <baidu-map class="map" center="北京"></baidu-map>s -->
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import AreasTree from '@/components/areas-tree.vue'

export default {
  components: { AreasTree },
  name: 'institutions-jobs-area'

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

::v-deep .el-card__header {
  background-color: #fafafa;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-weight: 700;
      color: #2a2929;
    }
  }
}
</style>
