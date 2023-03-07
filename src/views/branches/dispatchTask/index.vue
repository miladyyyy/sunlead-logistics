<template>
  <div class="app-container">
    <PageTool>
      <el-form label-width="110px" ref="searchForm" :model="searchForm">
        <el-col :span="8">
          <el-form-item label="派件任务编号:" prop="id">
            <el-input placeholder="请输入派件任务编号" v-model="searchForm.id" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="订单编号:" prop="orderId">
            <el-input placeholder="请输入订单编号" v-model="searchForm.orderId" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属营业部:" prop="agencyId">
            <TreeSelect
              v-model="searchForm.agencyId"
              :normalizer="normalizer"
              :options="treeData"
              placeholder="请选择所属营业部"
              :appendToBody="true"
            />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="签收状态:" prop="signStatus">
            <el-select v-model="searchForm.signStatus" clearable placeholder="请选择签收状态" style="width: 100%">
              <el-option label="已签收" :value="1"></el-option>
              <el-option label="拒收" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="预计完成时间:" prop="estimatedEndTime">
            <el-date-picker
              v-model="searchForm.estimatedEndTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            />

          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实际完成时间:" prop="actualEndTime">
            <el-date-picker
              v-model="searchForm.actualEndTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="任务分配状态:" prop="assignedStatus">
            <el-select v-model="searchForm.assignedStatus" clearable placeholder="请选择任务分配状态" style="width: 100%">
              <el-option label="已分配" :value="2"></el-option>
              <el-option label="待人工分配" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="searchPickUpTaskList">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-col>
      </el-form>
    </PageTool>

    <tabs-group @tab-click="tabClick" :activeTab="activeTab">
      <table-item name="全部" :value="0"></table-item>
      <table-item name="新任务" :value="1"></table-item>
      <table-item name="已完成" :value="2"></table-item>
    </tabs-group>

    <el-card shadow="never" v-loading="loading">
      <el-row style="margin-bottom: 20px;">
        <el-button type="primary">人工分配</el-button>
      </el-row>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="selection" width="60" align="center" label="序号" fixed="left"/>
        <el-table-column type="index" width="80" align="center" label="序号"/>
        <el-table-column prop="id" label="派件作业编号" width="180"/>
        <el-table-column prop="orderId" label="订单编号" width="180"/>
        <el-table-column prop="agencyName" label="所在营业部" width="180"/>
        <el-table-column prop="assignedStatus" label="任务分配状态" width="120" :formatter="assignedStatusFormatter"/>
        <el-table-column prop="courierName" label="快递员姓名" width="120"/>
        <el-table-column prop="signStatus" label="签收状态" width="120" :formatter="signStatusFormatter"/>
        <el-table-column prop="signRecipient" label="签收人" width="120" :formatter="signRecipientFormatter"/>
        <el-table-column prop="estimatedStartTime" label="预计开始时间" width="160"/>
        <el-table-column prop="estimatedEndTime" label="预计完成时间" width="160"/>
        <el-table-column prop="actualEndTime" label="实际完成时间" width="160"/>

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
import { searchPickUpTaskListAPI } from '@/api/pickup-dispatch-task-manager'

export default {
  name: 'dispatch-task',
  components: {
    TreeSelect
  },
  data () {
    return {
      activeTab: 1,
      treeData: [],
      loading: false,

      searchForm: {
        id: '',
        orderId: '',
        agencyId: null,
        estimatedEndTime: [],
        actualEndTime: [],
        assignedStatus: '',
        signStatus: ''
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
    this.searchPickUpTaskList()
  },

  methods: {
    async tabClick (value) {
      this.loading = true
      try {
        this.activeTab = value
        const statue = value === 0 ? null : value
        const { data: { data: { items } } } = await searchPickUpTaskListAPI({
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

    async searchPickUpTaskList () {
      this.loading = true
      try {
        const payload = {
          ...this.searchForm,
          ...this.pageParams,
          minEstimatedEndTime: this.searchForm.estimatedEndTime[0],
          maxEstimatedEndTime: this.searchForm.estimatedEndTime[1],
          minActualEndTime: this.searchForm.actualEndTime[0],
          maxActualEndTime: this.searchForm.actualEndTime[1],
          taskType: 2
        }
        delete payload.estimatedEndTime
        delete payload.actualEndTime
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
        } = await searchPickUpTaskListAPI(payload)
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
      this.searchPickUpTaskList()
    },

    handleCurrentChange (newPage) {
      this.pageParams.page = newPage
      this.searchPickUpTaskList()
    },

    reset () {
      this.$refs.searchForm.resetFields()
      this.searchPickUpTaskList()
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
    },

    assignedStatusFormatter (row, column, cellValue) {
      const statusMap = {
        2: '已分配',
        3: '待人工分配'
      }
      return statusMap[cellValue]
    },

    signStatusFormatter (row, column, cellValue) {
      const statusMap = {
        0: '未签收',
        1: '已签收',
        2: '拒收'
      }
      return statusMap[cellValue]
    },

    signRecipientFormatter (row, column, cellValue) {
      const statusMap = {
        1: '本人'
      }
      return statusMap[cellValue]
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
</style>
