<template>
  <div class="app-container">
    <PageTool>
      <el-form label-width="110px" ref="searchForm" :model="searchForm">
        <el-col :span="8">
          <el-form-item label="运单编号:" prop="id">
            <el-input placeholder="请输入运单编号" v-model="searchForm.id" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="订单编号:" prop="orderId">
            <el-input placeholder="请输入订单编号" v-model="searchForm.orderId" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="调度状态:" prop="schedulingStatus">
            <el-select v-model="searchForm.schedulingStatus">
              <el-option label="待调度" :value="0"/>
              <el-option label="未匹配线路" :value="1"/>
              <el-option label="已调度" :value="2"/>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="起始地机构:" prop="startAgencyId">
            <TreeSelect
              v-model="searchForm.startAgencyId"
              :normalizer="normalizer"
              :options="treeData"
              placeholder="请选择起始地机构"
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
                placeholder="请选择目的地机构"
                :appendToBody="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="当前所在机构:" prop="currentAgencyId">
              <TreeSelect
                v-model="searchForm.currentAgencyId"
                :normalizer="normalizer"
                :options="treeData"
                placeholder="请选择当前所在机构"
                :appendToBody="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="searchTransportOrderList">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
      </el-form>
    </PageTool>

    <tabs-group @tab-click="tabClick" :activeTab="activeTab">
      <table-item :name="`全部${total}`" :value="0"></table-item>
      <table-item :name="`新建${countData['1']}`" :value="1"></table-item>
      <table-item :name="`已装车${countData['2']}`" :value="2"></table-item>
      <table-item :name="`运输中${countData['3']}`" :value="3"></table-item>
      <table-item :name="`到达终端网点${countData['4']}`" :value="4"></table-item>
      <table-item :name="`拒收 ${countData['6']}`" :value="6"></table-item>
    </tabs-group>

    <el-card shadow="never" v-loading="loading">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" width="60" align="center" label="序号"/>
        <el-table-column prop="id" label="运单编号" width="160"/>
        <el-table-column prop="orderId" label="订单编号" width="180"/>
        <el-table-column prop="status" label="运单状态" width="180" :formatter="statusFormatter"/>
        <el-table-column prop="schedulingStatus" label="调度状态" width="130" :formatter="schedulingStatusFormatter"/>
        <el-table-column prop="startAgencyName" label="起始营业部" width="170"/>
        <el-table-column prop="endAgencyName" label="终点营业部" width="170"/>
        <el-table-column prop="currentAgencyName" label="当前所在机构" width="170"/>
        <el-table-column prop="nextAgencyName" label="下一个机构" width="170"/>
        <el-table-column prop="totalVolume" label="货品总体积(立方米)" width="170"/>
        <el-table-column prop="totalWeight" label="货品总体积(千克)" width="170"/>
        <el-table-column prop="created" label="创建时间" width="170"/>
        <el-table-column prop="updated" label="更新时间" width="170"/>
        <el-table-column label="操作" align="center" width="85" fixed="right">
          <template #default="{row}">
            <el-link :underline="false" style="color: #419eff" @click="toDetail(row)"
            >查看详情
            </el-link
            >
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
import { getCountAPI, searchTransportOrderListAPI } from '@/api/transport-order-manager'

export default {
  name: 'WayBill',
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
    this.getOrgTree()
    this.searchTransportOrderList()
    this.getCount()
  },

  methods: {
    async tabClick (value) {
      this.loading = true
      try {
        this.activeTab = value
        const statue = value === 0 ? null : value
        const { data: { data: { items } } } = await searchTransportOrderListAPI({
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
        path: '/business/waybill-detail',
        query: {
          id: row.id,
          orderId: null
        }
      })
    },
    async searchTransportOrderList () {
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
        } = await searchTransportOrderListAPI(payload)
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
      this.searchTransportOrderList()
    },

    handleCurrentChange (newPage) {
      this.pageParams.page = newPage
      this.searchTransportOrderList()
    },

    reset () {
      this.$refs.searchForm.resetFields()
      this.searchTransportOrderList()
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

    statusFormatter (row, column, cellValue) {
      switch (cellValue) {
        case 1:
          return '新建'
        case 2:
          return `已装车,发往${row.nextAgencyName}转运中心`
        case 3:
          return '到达'
        case 4:
          return '到达终端网点'
        case 6:
          return '拒收'
        default:
          return ''
      }
    },

    schedulingStatusFormatter (row, column, cellValue) {
      switch (cellValue) {
        case 1:
          return '待调度'
        case 2:
          return '未匹配线路'
        case 3:
          return '已调度'
        default:
          return ''
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
</style>
