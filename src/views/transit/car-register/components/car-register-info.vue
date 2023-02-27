<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <span class="card-title"> 基本信息 </span>
      </template>
      <div class="form-item-box">
        <div class="form-item">
          <span class="label">运输任务编号：</span>
          <span class="value">{{ detailForm.transportTaskId }}</span>
        </div>
        <div class="form-item">
          <span class="label">车牌号码：</span>
          <span class="value">{{ detailForm.licensePlate }}</span>
        </div>
        <div class="form-item">
          <span class="label">起始地机构：</span>
          <span class="value">{{ detailForm.startAgencyName }}</span>
        </div>
        <div class="form-item">
          <span class="label">目的地机构：</span>
          <span class="value">{{ detailForm.endAgencyName }}</span>
        </div>
        <div class="form-item">
          <span class="label">出车时间：</span>
          <span class="value">{{ detailForm.outStorageTime }}</span>
        </div>
        <div class="form-item">
          <span class="label">回车时间：</span>
          <span class="value">{{ detailForm.intoStorageTime }}</span>
        </div>
        <div class="form-item">
          <span class="label">司机：</span>
          <span class="value">{{ detailForm.driverName }}</span>
        </div>
      </div>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <span class="card-title"> 异常信息 </span>
      </template>
      <div class="form-item-box">
        <div class="form-item">
          <span class="label">车辆故障：</span>
          <span class="value">{{ detailForm.isAvailable?'是':'否' }}</span>
        </div>
        <div class="form-item">
          <span class="label">车辆违章：</span>
          <span class="value">{{ detailForm.isBreakRules?'是':'否'  }}</span>
        </div>
        <div class="form-item">
          <span class="label">车辆事故：</span>
          <span class="value">{{ detailForm.isAccident?'是':'否' }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getTruckReturnDetailAPI } from "@/api/truck-return-register";
export default {
  name: "car-register-info",
  data() {
    return {
      detailForm: {},
    };
  },

  created() {
    this.getTruckReturnDetail();
  },

  methods: {
    async getTruckReturnDetail() {
      const {
        data: { data },
      } = await getTruckReturnDetailAPI(this.$route.query.id);
      this.detailForm = data;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-card {
    margin-bottom: 20px;
}
.card-title {
  color: #2a2929;
  font-size: 16px;
  margin: 15px 0;
  font-weight: 700;
}

.form-item-box {
  display: flex;
  flex-wrap: wrap;
  line-height: 40px;

  .form-item {
    padding-left: 30px;
    width: 25%;

    .label {
      display: inline-block;
      min-width: 100px;
      color: #20232a;
      font-size: 14px;
    }

    .value {
      color: #818693;
      font-size: 14px;
    }
  }
}
</style>
