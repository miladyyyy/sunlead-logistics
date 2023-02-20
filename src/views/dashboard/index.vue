<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="14">
        <DashboardCard title="机构概述">
          <div class="content">
            <div class="content-left">
              <div class="address">地址：</div>
              <div class="principal">负责人</div>
              <el-button>查看营业部分布</el-button>
            </div>
            <!-- <el-divider class="divider" direction="vertical"></el-divider> -->
            <div class="content-right"></div>
          </div>
        </DashboardCard>
      </el-col>
      <el-col :span="10"></el-col>
    </el-row>
  </div>
</template>
<script>
import DashboardCard from './components/dashboard-card.vue'

export default {
  components: { DashboardCard },
  name: 'DashboardView'
}
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  justify-content: space-evenly;
  .content-left {
    flex: 1;
    padding: 40px 10px 0 10px;
    font-size: 14px;
    color: #818693;
    border-right: 1px solid #ebeef5;
    .address {
      margin-bottom: 8px;
    }
    .principal {
      margin-bottom: 23px;
    }
    .el-button {
      font-size: 14px;
      color: #e15536;
      width: 158px;
      height: 40px;
      background: #ffeeeb;
      border-radius: 4px;

      &:hover {
        color: #fff;
        background: #ed7455;
      }
    }
  }

  .content-right {
    flex: 1;
  }
}
.el-divider--vertical {
  height: 100%;
}
</style>
