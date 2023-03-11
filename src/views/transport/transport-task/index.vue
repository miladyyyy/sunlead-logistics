<template>
  <div class="app-container">
    <PageTool>
      <el-form label-width="110px" ref="searchForm" :model="searchForm">
        <el-col :span="8">
          <el-form-item label="任务编号:" prop="id">
            <el-input placeholder="请输入任务编号" v-model="searchForm.id" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="任务分配状态:" prop="orderId">
            <el-select v-model="searchForm.assignedStatus" placeholder="请选择任务分配状态" clearable>
              <el-option label="已分配" :value="2"/>
              <el-option label="待人工分配" :value="3"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="满载状态:" prop="loadingStatus">
            <el-select v-model="searchForm.loadingStatus" placeholder="请选择满载状态" clearable>
              <el-option label="满载" :value="2"/>
              <el-option label="空载" :value="3"/>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="车牌号码:" prop="licensePlate">
            <el-input placeholder="请输入任务编号" v-model="searchForm.licensePlate" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="起始地机构:" prop="startAgencyId">
            <TreeSelect
              v-model="searchForm.startAgencyId"
              :normalizer="normalizer"
              :options="treeData"
              placeholder="请选择目的地机构"
              :appendToBody="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="目的地机构:" prop="endAgencyId">
            <TreeSelect
              v-model="searchForm.endAgencyId"
              :normalizer="normalizer"
              :options="treeData"
              placeholder="请选择当前所在机构"
              :appendToBody="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="searchTransportTaskList">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-col>
      </el-form>
    </PageTool>

    <tabs-group @tab-click="tabClick" :activeTab="activeTab">
      <table-item :name="`全部${total}`" :value="0"></table-item>
      <table-item :name="`待提货${countData['1']}`" :value="1"></table-item>
      <table-item :name="`进行中${countData['2']}`" :value="2"></table-item>
      <table-item :name="`已完成${countData['3']}`" :value="4"></table-item>
      <table-item :name="`已取消${countData['4']}`" :value="5"></table-item>
    </tabs-group>

    <el-card shadow="never" v-loading="loading">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" width="60" align="center" label="序号"/>
        <el-table-column prop="id" label="运输任务编号" width="180"/>
        <el-table-column prop="truck.licensePlate" label="车牌编号" width="160"/>
        <el-table-column prop="startAgency.name" label="起始地" width="180" />
        <el-table-column prop="endAgency.name" label="目的地" width="130" />
        <el-table-column prop="status" label="运输任务状态" width="170"/>
        <el-table-column prop="loadingStatus" label="车辆满载状态" width="170"/>
        <el-table-column prop="assignedStatus" label="任务分配状态" width="170"/>
        <el-table-column prop="planDepartureTime" label="计划发车时间" width="170"/>
        <el-table-column prop="actualDepartureTime" label="实际发车时间" width="170"/>
        <el-table-column prop="updated" label="更新时间" width="170"/>
        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template #default="{row}">
            <el-link :underline="false" style="color: #419eff" @click="toDetail(row)">查看</el-link>
            <el-divider direction="vertical"/>
            <el-link :underline="false"  disabled @click="toDetail(row)">取消</el-link>
            <el-divider direction="vertical"/>
            <el-link :underline="false"  disabled @click="toDetail(row)">手动调整</el-link>
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
// import the component
import TreeSelect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getOrgTreeAPI } from '@/api/business-hall'
import { searchTransportTaskListAPI, getCountAPI } from '@/api/transport-task-manager'

export default {
  name: 'TransportOrderList',
  components: {
    TreeSelect
  },
  data () {
    return {
      activeTab: 1,
      treeData: [],
      loading: false,

      searchForm: {
        id: '', // 运单编号
        orderId: '', // 订单编号
        schedulingStatus: '', // 调度状态
        startAgencyId: null, // 起始地机构
        endAgencyId: null, // 目的地机构
        currentAgencyId: null // 当前所在机构
      },

      tableData: [],

      pageParams: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      countData: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        6: 0
      }
    }
  },

  created () {
    Object.assign(this.searchForm, this.$route.query)
    this.getOrgTree()
    this.searchTransportTaskList()
    this.getCount()
  },

  methods: {
    async tabClick (value) {
      this.loading = true
      try {
        this.activeTab = value
        const statue = value === 0 ? null : value
        const { data: { data: { items } } } = await searchTransportTaskListAPI({
          ...this.pageParams,
          status: statue
        })
        this.tableData = items
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    toDetail (row) {
      this.$router.push({
        path: '/transport/task-detail',
        query: {
          id: row.id,
          type: '运输管理'
        }
      })
    },
    async searchTransportTaskList () {
      this.loading = true
      try {
        const payload = {
          ...this.searchForm,
          ...this.pageParams
        }
        for (const payloadKey in payload) {
          if (['', null, undefined].includes(payload[payloadKey])) {
            delete payload[payloadKey]
          }
        }

        const {
          data: {
            data: {
              counts,
              items
            }
          }
        } = await searchTransportTaskListAPI(payload)
        this.loading = false
        this.tableData = items
        this.total = +counts
      } catch (error) {
        console.error(error)
        this.loading = false
      }
    },

    async getCount () {
      const { data: { data } } = await getCountAPI()
      this.countData = data
    },

    handleSizeChange (newSize) {
      this.pageParams.pageSize = newSize
      this.searchTransportTaskList()
    },

    handleCurrentChange (newPage) {
      this.pageParams.page = newPage
      this.searchTransportTaskList()
    },

    reset () {
      this.$refs.searchForm.resetFields()
      this.searchTransportTaskList()
    },

    async getOrgTree () {
      const { data } = await getOrgTreeAPI()
      this.treeData = JSON.parse(data.data)
    },

    normalizer (node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
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

  .empty-img {
    width: 336px;
  }

  .empty-txt {
    color: rgb(129, 134, 147);
    font-size: 14px;
    margin-top: 25px;
  }
}

::v-deep .vue-treeselect__placeholder {
  line-height: 40px;
}

::v-deep .vue-treeselect__input {
  vertical-align: middle;
}

.el-date-editor {
  width: 100%;
}

.tabs-group {
  margin-bottom: 20px;
}

.el-select {
  width: 100%;
}
</style>
