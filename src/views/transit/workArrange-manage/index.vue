<template>
  <div class="app-container">
    <el-dialog title="人工调整" :visible="showDialog" @close="handleCancel">
      <el-row type="flex" justify="center">
        <el-form>
          <el-form-item>
            <el-radio v-model="formData.workPatternType" label="1">礼拜制</el-radio>
            <el-radio v-model="formData.workPatternType" label="2">连续制</el-radio>
          </el-form-item>
          <el-form-item label="模式名称" label-width="80px">
            <el-select v-model="formData.workPatternId">
              <el-option v-for="item in workPatternTypeSelector[formData.workPatternType]" :key="item.id" :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-row>
      <template #footer>
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="handelConfirm">确认</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-row>
      </template>
    </el-dialog>

    <PageTool>
      <el-form label-width="110px" ref="searchForm" :model="searchForm">
        <el-col :span="8">
          <el-form-item label="员工账号:" prop="employeeNumber">
            <el-input placeholder="请输入员工账号" v-model="searchForm.employeeNumber" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="员工姓名:" prop="name">
            <el-input placeholder="请输入员工姓名" v-model="searchForm.name" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工作模式:" prop="workPatternId">
            <el-select v-model="searchForm.workPatternId" placeholder="请选择工作模式">
              <el-option v-for="item in patternsOptions" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="月份:" prop="month">
            <el-date-picker
              v-model="searchForm.month"
              type="month"
              placeholder="请选择月份"
              value-format="yyyy-MM"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="所属机构:" prop="agencyId">
            <TreeSelect
              v-model="searchForm.agencyId"
              :normalizer="normalizer"
              :options="treeData"
              placeholder="请选择所属机构"
              :appendToBody="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="searchWorkScheList">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-col>
      </el-form>
    </PageTool>

    <el-card shadow="never" v-loading="loading">
      <template #header>
        <el-button type="primary" @click="$router.push('/transit/workArrange-setting')">排班设置</el-button>
        <el-button @click="handleOpen">绑定排班</el-button>
      </template>
      <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange">>
        <el-table-column fixed type="selection" width="55" align="center"/>
        <el-table-column fixed prop="employeeNumber" label="员工账号" width="100px"/>
        <el-table-column fixed prop="name" label="员工姓名"/>
        <el-table-column fixed prop="phone" label="员工电话" width="120px"/>
        <el-table-column fixed prop="userType" label="员工角色"/>
        <el-table-column fixed prop="workPatternName" label="当前工作模式" width="110px"/>

        <el-table-column v-for="item in 31" :key="item" :label="`${item}`" width="80px">
          <template #default="{row}">
            <div class="work" v-if="row.workSchedules[item-1]">上</div>
            <div class="rest" v-else>休</div>
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
import { searchWorkScheListAPI, updateWorkScheAPI } from '@/api/work-schedulings'
import { getWorkPatternsAPI } from '@/api/work-patterns'

export default {
  name: 'WorkArrangeManage',
  components: {
    TreeSelect
  },
  data () {
    return {
      formData: {
        userIdList: [],
        workPatternId: '',
        workPatternType: '1'
      },
      workPatternTypeSelector: {},
      showDialog: false,
      patternsOptions: [
        {
          id: '0',
          name: '暂无排班'
        }
      ],

      treeData: [],
      loading: false,

      searchForm: {
        employeeNumber: '',
        name: '',
        workPatternId: '',
        month: null,
        agencyId: null
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
    this.searchWorkScheList()
    this.getWorkPatterns()
  },

  methods: {
    handleOpen () {
      if (this.formData.userIdList.length === 0) {
        this.$message.error('请选择调整人数')
        return
      }
      this.showDialog = true
    },

    async handelConfirm () {
      await updateWorkScheAPI(this.formData)
      this.showDialog = false
    },

    handleCancel () {
      this.showDialog = false
    },

    async getWorkPatterns () {
      const { data: { data } } = await getWorkPatternsAPI()
      this.workPatternTypeSelector = data
      console.log(data)
      this.patternsOptions = [
        ...Object.values(data).flat(),
        ...this.patternsOptions
      ]
    },

    async searchWorkScheList () {
      this.loading = true
      try {
        const payload = {
          ...this.pageParams,
          ...this.searchForm
        }
        const {
          data: {
            data: {
              counts,
              items
            }
          }
        } = await searchWorkScheListAPI(payload)
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
      this.searchWorkScheList()
    },

    handleCurrentChange (newPage) {
      this.pageParams.page = newPage
      this.searchWorkScheList()
    },

    reset () {
      this.$refs.searchForm.resetFields()
      this.searchWorkScheList()
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

    handleSelectionChange (val) {
      console.log(val)
      this.formData.userIdList = val.map(item => item.id)
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

.work {
  width: 24px;
  height: 24px;
  background: #ffeeeb;
  border: 1px solid #e15536;
  border-radius: 50%;
  text-align: center;
  color: #e15536;
  font-size: 13px;
}

.rest {
  width: 24px;
  height: 24px;
  background: #eff3f8;
  border: 1px solid #d8dde3;
  border-radius: 50%;
  text-align: center;
  color: #20232a;
  font-size: 13px;
}

</style>
