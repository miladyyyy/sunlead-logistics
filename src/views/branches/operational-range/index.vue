<template>
  <div class="app-container">
    <PageTool>
      <el-form label-width="110px" ref="searchForm" :model="searchForm">
        <el-col :span="8">
          <el-form-item label="快递员账号:" prop="account">
            <el-input placeholder="请输入快递员账号" v-model="searchForm.account"  clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="快递员姓名:" prop="name">
            <el-input placeholder="请输入快递员姓名" v-model="searchForm.name"  clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="快递员手机号:" prop="phone">
            <el-input placeholder="请输入快递员手机号" v-model="searchForm.phone"  clearable/>
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
          <el-button type="primary" @click="searchCourierList">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-col>
      </el-form>
    </PageTool>

    <el-card shadow="never" v-loading="loading">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" width="60" align="center" label="序号" />
        <el-table-column prop="account" label="快递员账号" />
        <el-table-column prop="name" label="快递员姓名"  />
        <el-table-column prop="mobile" label="快递员手机号" />
        <el-table-column prop="agency.name" label="所属机构"  />
        <el-table-column label="操作" align="center" width="110" fixed="right">
          <template #default>
            <el-link :underline="false"  style="color: #419eff"
            >作业范围分配</el-link
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
import { getOrgTreeAPI, searchCourierListAPI } from '@/api/business-hall'

export default {
  name: 'operational-range',
  components: {
    TreeSelect
  },
  data () {
    return {
      treeData: [],
      loading: false,

      searchForm: {
        account: '', // 快递员账号,
        name: '', // 快递员姓名,
        phone: '', // 快递员手机号,
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
    this.searchCourierList()
  },

  methods: {
    async searchCourierList () {
      this.loading = true
      try {
        const {
          data: {
            data: { counts, items }
          }
        } = await searchCourierListAPI({
          ...this.pageParams,
          ...this.searchForm
        })
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
      this.searchCourierList()
    },

    handleCurrentChange (newPage) {
      this.pageParams.page = newPage
      this.searchCourierList()
    },

    reset () {
      this.$refs.searchForm.resetFields()
      this.searchCourierList()
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
  .empty-img{
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

</style>
