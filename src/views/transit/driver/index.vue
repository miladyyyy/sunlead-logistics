<template>
  <div class="app-container">
    <PageTool>
      <el-form label-width="110px" ref="searchForm" :model="searchForm">
        <el-col :span="8">
          <el-form-item label="司机账号:" prop="account">
            <el-input placeholder="请输入司机账号" v-model="searchForm.account" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="司机姓名:" prop="name">
            <el-input placeholder="请输入司机姓名" v-model="searchForm.name" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="司机手机号:" prop="phone">
            <el-input placeholder="请输入司机手机号" v-model="searchForm.phone" clearable/>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="所属机构:" prop="agentId">
            <TreeSelect
              v-model="searchForm.agentId"
              :normalizer="normalizer"
              :options="treeData"
              placeholder="请选择所属机构"
              :appendToBody="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="searchDriverList">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-col>
      </el-form>
    </PageTool>

    <el-card shadow="never" v-loading="loading">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" width="60" align="center" label="序号"/>
        <el-table-column prop="account" label="司机账号"/>
        <el-table-column prop="name" label="司机姓名"/>
        <el-table-column prop="mobile" label="司机电话"/>
        <el-table-column prop="truck.licensePlate" label="关联车辆"/>
        <el-table-column prop="agency.name" label="所属机构"/>
        <el-table-column label="工作状态" align="center" width="110">
          <template #default="{row}">
            <el-tag v-if="row.workStatus === 1" size="mini" type="success">上班</el-tag>
            <el-tag v-else size="mini" type="danger">下班</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="130" fixed="right">
          <template #default="{row}">
            <el-link :underline="false" style="color: #419eff" @click="toDetail(row)">
              查看
            </el-link>
            <el-divider direction="vertical"/>
            <el-link :underline="false" style="color: #419eff" >
              配置车辆
            </el-link>
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
import { searchDriverListAPI } from '@/api/driver'

export default {
  name: 'DriverView',
  components: {
    TreeSelect
  },
  data () {
    return {
      treeData: [],
      loading: false,

      searchForm: {
        account: '', // 司机账号,
        name: '', // 司机姓名,
        phone: '', // 司机手机号,
        agentId: null // 所属机构
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
    this.searchDriverList()
  },

  methods: {
    toDetail (row) {
      this.$router.push({
        path: '/transit/driver-detail',
        query: {
          formUrlName: '司机管理',
          id: row.userId
        }
      })
    },
    async searchDriverList () {
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
        } = await searchDriverListAPI(payload)
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
      this.searchDriverList()
    },

    handleCurrentChange (newPage) {
      this.pageParams.page = newPage
      this.searchDriverList()
    },

    reset () {
      this.$refs.searchForm.resetFields()
      this.searchDriverList()
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
</style>
