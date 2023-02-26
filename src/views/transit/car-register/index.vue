<template>
  <div class="app-container">
    <PageTool>
      <el-form label-width="110px" ref="searchForm" :model="searchForm">
        <el-col :span="8">
          <el-form-item label="运输任务编号:" prop="transportTaskId">
            <el-input placeholder="请输入运输任务编号" v-model="searchForm.transportTaskId"  clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="起始地机构:" prop="startAgencyId">
            <el-select
              placeholder="请选择起始地机构"
              v-model="searchForm.startAgencyId"
            >
              <el-option
                v-for="item in allowableLoadOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="目的地机构:" prop="endAgencyId">
            <el-select
              placeholder="请选择目的地机构"
              v-model="searchForm.endAgencyId"
            >
              <el-option
                v-for="item in allowableVolumeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="回车时间:" prop="intoStorageStartTime">
            <el-input placeholder="请输入回车时间" v-model="searchForm.intoStorageStartTime" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="searchTruckReturnList">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-col>
      </el-form>
    </PageTool>

    <el-card shadow="never" v-loading="loading">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" width="60" align="center" label="序号" />
        <el-table-column prop="id" label="车型编号" />
        <el-table-column prop="name" label="车辆类型" width="150" />
        <el-table-column prop="num" label="车型数量" width="150" />
        <el-table-column prop="allowableLoad" label="应载重量" width="150" />
        <el-table-column prop="allowableVolume" label="应载体积" width="150" />
        <el-table-column prop="measureLong" label="长 （米）" width="100" />
        <el-table-column prop="measureWidth" label="宽 （米）" width="100" />
        <el-table-column prop="measureHigh" label="高 （米）" width="100" />
        <el-table-column label="操作" align="center" width="110" fixed="right">
          <template #default>
            <el-link :underline="false" type="primary" style="color: #419eff"
              >编辑</el-link
            >
            <el-divider direction="vertical"></el-divider>
            <el-link :underline="false" type="danger">删除</el-link>
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
import { getOrgTreeAPI } from '@/api/organization'
import { searchTruckReturnListAPI } from '@/api/truck-return-register'

export default {
  name: 'car-register',
  data () {
    return {
      loading: false,
      searchForm: {
        transportTaskId: '', // 运输任务id
        startAgencyId: '', // 起始机构id
        endAgencyId: '', // 结束机构id
        intoStorageStartTime: '', // 回车时间
        isAvailable: '' // 车辆是否可用
      },

      tableData: [],

      pageParams: {
        page: 1,
        pageSize: 10
      },
      total: 0
    }
  },

  created () {
    this.getOrgTree()
    this.searchTruckReturnList()
  },

  methods: {
    async getOrgTree () {
      const { data } = await getOrgTreeAPI()
      console.log(JSON.parse(data.data))
      this.treeData = JSON.parse(data.data)
    },

    async searchTruckReturnList () {
      this.loading = true
      try {
        const {
          data: {
            data: { counts, items }
          }
        } = await searchTruckReturnListAPI({
          ...this.pageParams,
          ...this.searchForm
        })
        this.loading = false
        this.tableData = items
        // console.log(items)
        this.total = +counts
      } catch (error) {
        console.error(error)
        this.loading = false
      }
    },

    handleSizeChange (newSize) {
      this.pageParams.pageSize = newSize
      this.searchTruckReturnList()
    },

    handleCurrentChange (newPage) {
      this.pageParams.page = newPage
      this.searchTruckReturnList()
    },

    reset () {
      this.$refs.searchForm.resetFields()
      this.searchTruckReturnList()
    }
  }
}
</script>
<style lang="scss" scoped>
.el-col-8 {
  padding: 0 30px;
}
.el-pagination {
  margin: 20px 0;
}

.suffix {
  color: rgb(32, 35, 42);
  margin-right: 14px;
}

.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  .empty-img{
  width: 336px;
}

  .empty-txt {
    color: rgb(129, 134, 147);
    font-size: 14px;
    margin-top: 25px;
  }
}

</style>
