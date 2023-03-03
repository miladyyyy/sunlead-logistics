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
                    <el-form-item label="员工编号：" prop="id">
                      <el-input v-model="form.id" placeholder="请输入员工编号"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="司机名称：" prop="name">
                      <el-input v-model="form.name" placeholder="请输入司机名称"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="所属机构：" prop="agency.name">
                      <el-input v-model="form.agency.name" placeholder="请输入所属机构"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row type="flex">
                  <el-col :span="8">
                    <el-form-item label="电话：" prop="mobile">
                      <el-input v-model="form.mobile" placeholder="请输入电话"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="年龄：" prop="age">
                      <el-input v-model="form.age" placeholder="请输入年龄"></el-input>
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

import { getDriverInfoAPI } from '@/api/driver'

export default {
  name: 'DriverDetail',
  data () {
    return {
      activeName: '1',
      form: {
        id: '',
        name: '',
        mobile: '',
        age: '',
        agency: {
          name: ''
        }
      }
    }
  },

  created () {
    this.getDriverInfo()
  },

  methods: {
    async getDriverInfo () {
      const { data: { data } } = await getDriverInfoAPI(this.$route.query.id)
      this.form = data
      console.log(this.form)
    },

    handleClick () {

    }
  }
}
</script>

<style lang="scss" scoped></style>
