<template>
  <div>
    <el-container>
      <el-main>
        <el-card shadow="never">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基本信息" name="1">
              <el-form ref="formRef" :model="form" label-width="100px">
                <el-row type="flex">
                  <el-col :span="8">
                    <el-form-item label="车辆编号：" prop="id">
                      <el-input v-model="form.id" placeholder="请输入车辆编号"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="车牌号码：" prop="licensePlate">
                      <el-input v-model="form.licensePlate" placeholder="请输入车牌号码"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="车型名称：" prop="truckTypeName">
                      <el-input v-model="form.truckTypeName" placeholder="请输入车型名称"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row type="flex">
                  <el-col :span="8">
                    <el-form-item label="车辆体积：" prop="allowableVolume">
                      <el-input v-model="form.allowableVolume" placeholder="请输入车辆体积"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="车牌载重：" prop="allowableLoad">
                      <el-input v-model="form.allowableLoad" placeholder="请输入车牌载重"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="GPSID：" prop="deviceGpsId">
                      <el-input v-model="form.deviceGpsId" placeholder="请输入GPSID"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="行驶证信息" name="2"></el-tab-pane>
          </el-tabs>
        </el-card>
      </el-main>
      <el-footer>
        <el-card shadow="never">
          <el-row type="flex" justify="center">
            <el-button type="primary">保存</el-button>
            <el-button>取消</el-button>
          </el-row>
        </el-card>
      </el-footer>
    </el-container>
  </div>
</template>

<script>

import { getTruckDetailAPI } from '@/api/truck'

export default {
  name: 'vehicle-detail',
  data () {
    return {
      activeName: '1',
      form: {}
    }
  },

  created () {
    this.getTruckDetail()
  },

  methods: {
    async getTruckDetail () {
      const { data: { data } } = await getTruckDetailAPI(this.$route.query.id)
      this.form = data
      console.log(this.form)
    },

    handleClick () {

    }
  }
}
</script>

<style lang="scss" scoped></style>
