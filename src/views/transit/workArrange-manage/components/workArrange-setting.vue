<template>
  <div>
    <el-dialog title="新增工作模式" :visible="showDialog">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="礼拜制" name="1">
        <el-form :model="formData" label-width="130px">
          <el-form-item prop="name" label="工作模式名称：">
            <el-input v-model="formData.name" placeholder="请输入工作模式名称"></el-input>
          </el-form-item>
          <el-form-item label="连续工作天数：">

          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
      </el-dialog>

    <el-card>
      <el-button type="primary" @click="showDialog = true">添加工作模式</el-button>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="id" label="工作模式编号"></el-table-column>
        <el-table-column prop="name" label="工作模式"></el-table-column>
        <el-table-column prop="workPatternTypeDesc" label="类型"></el-table-column>
        <el-table-column prop="workDate" label="工作日期"></el-table-column>
        <el-table-column  label="工作时间">
          <template #default="{ row }">
            {{((row.workEndMinute1-row.workStartMinute1)/60).toFixed(2)}}小时
          </template>
        </el-table-column>
        <el-table-column label="工作时间">
          <template #default="{ row }">
            <el-button type="text" size="small" style="color: #419eff;">编辑</el-button>
            <el-divider direction="vertical"/>
            <el-button type="text" size="small">删除</el-button>
          </template>
        </el-table-column>

        <template #empty>
          <div class="empty-box">
            <img class="empty-img" src="@/assets/img/icon-empty.png" alt="">
            <span class="empty-txt">没有找到您要的内容哦~</span>
          </div>
        </template>
      </el-table>

      <el-row type="flex" justify="center">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageParams.page"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>
  </div>
</template>

<script>

import { getWorkPattListAPI } from '@/api/work-patterns'

export default {
  name: 'WorkArrangeSetting',
  data () {
    return {
      formData: {
        workPatternId: '',
        workPatternType: '1',
        workDate: [],
        workStartMinute1: '',
        workEndMinute1: ''
      },
      activeName: '1',
      showDialog: false,
      tableData: [],

      pageParams: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      loading: false,
    }
  },

  created () {
    this.getWorkPattList()
  },

  methods: {
    async getWorkPattList () {
      this.loading = true
      try {
        const {
          data: {
            data: {
              counts,
              items
            }
          }
        } = await getWorkPattListAPI(this.pageParams)
        console.log(items)
        this.loading = false
        this.tableData = items
        this.total = +counts
      } catch (error) {
        console.error(error)
        this.loading = false
      }
    },

    handleSizeChange (newSize) {
      this.pageParams.pageSize = newSize
      this.getWorkPattList()
    },

    handleCurrentChange (newPage) {
      this.pageParams.page = newPage
      this.getWorkPattList()
    },

    handleClick (tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
