<template>
  <div class="app-container">
    <el-dialog
      width="600px"
      :title="this.currentFormType==='add'?'新增线路':'编辑线路'"
      :visible.sync="formVisible"
      @close="handleFormClose"
      >
      <el-form :model="formData" label-width="110px" ref="addFormRef">
        <el-form-item label="线路编号：" prop="number">
          <el-input v-model="formData.number" placeholder="请输入线路编号"/>
        </el-form-item>
        <el-form-item label="线路名称：" prop="name">
          <el-input v-model="formData.name" placeholder="请输入线路名称"/>
        </el-form-item>
        <el-form-item label="线路类型：" prop="type">
          <el-select v-model="formData.type" placeholder="请选择线路类型" style="width: 100%" :disabled="currentFormType==='edit'">
            <el-option label="干线" :value="1"/>
            <el-option label="支线" :value="2"/>
            <el-option label="接驳路线" :value="3"/>
          </el-select>
        </el-form-item>
        <el-form-item label="起始地机构：" prop="startOrganId">
          <TreeSelect
            v-model="formData.startOrganId"
            :normalizer="normalizer"
            :options="treeData"
            placeholder="请选择起始地机构"
            :disabled="currentFormType==='edit'"
          />
        </el-form-item>
        <el-form-item label="目的地机构：" prop="endOrganId">
          <TreeSelect
            v-model="formData.endOrganId"
            :normalizer="normalizer"
            :options="treeData"
            placeholder="请选择目的地机构"
            :disabled="currentFormType==='edit'"
          />
        </el-form-item>
        <el-form-item v-show="currentFormType==='edit'" label="距离" prop="distance">
          <el-input v-model="formData.distance" placeholder="请输入距离">
            <template #suffix>
              <span>千米</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item v-show="currentFormType==='edit'" label="成本" prop="cost">
          <el-input v-model="formData.cost" placeholder="请输入成本">
            <template #suffix>
              <span>元</span>
            </template>
          </el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="handleFormConfirm">确定</el-button>
          <el-button  @click="handleFormClose">取消</el-button>
        </el-row>
      </template>
    </el-dialog>

    <PageTool>
      <el-form label-width="110px" ref="searchForm" :model="searchForm">
        <el-col :span="8">
          <el-form-item label="线路编号:" prop="number">
            <el-input placeholder="请输入线路编号" v-model="searchForm.number" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="线路名称:" prop="name">
            <el-input placeholder="请输入线路名称" v-model="searchForm.name" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="起始机构:" prop="startOrganId">
            <TreeSelect
              v-model="searchForm.startOrganId"
              :normalizer="normalizer"
              :options="treeData"
              placeholder="请选择起始机构"
              :appendToBody="true"
            />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="目的地机构:" prop="endOrganId">
            <TreeSelect
              v-model="searchForm.endOrganId"
              :normalizer="normalizer"
              :options="treeData"
              placeholder="请选择目的地机构"
              :appendToBody="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="searchTransportLineList">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-col>
      </el-form>
    </PageTool>

    <el-card shadow="never" v-loading="loading">
      <el-row style="margin-bottom: 20px;">
        <el-button type="primary" @click="openFormDialog('add')">新增线路</el-button>
        <el-button type="primary" @click="openFormDialog('edit')">成本设置</el-button>
      </el-row>
      <el-table :data="tableData"  stripe style="width: 100%" @expand-change="handleExpand" :row-key="getRowKey" :expand-row-keys="expands">
        <el-table-column type="expand" width="50" align="center">
          <template #default>
              <div class="sub-table-box" v-loading="subLoading">
                <el-table :data="subTableData">
                  <el-table-column prop="name" label="车次名称" width="180"/>
                  <el-table-column  label="发车频次" width="180">
                    <template #default="{row}">
                      {{`${Math.floor(row.departureTime / 60)}:${row.departureTime % 60<10 ? '0'+row.departureTime % 60 : row.departureTime % 60}/${row.periodName}`}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="到达时间" width="180">
                    <template #default="{row}">
                      {{`${Math.floor(row.arriveTime / 60)}:${row.arriveTime % 60<10 ? '0'+row.arriveTime % 60 : row.arriveTime % 60}`}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="truckDrivers[0].truck.licensePlate" label="车辆安排" width="180">
                  </el-table-column>
                  <el-table-column prop="truckDrivers[0].driver.name" label="司机安排" width="180"/>
                  <el-table-column label="操作" align="center" width="320">
                    <template #default="{row}">
                      <el-link :underline="false" style="color: #419eff" @click="toDetail(row)">编辑车次</el-link>
                      <el-divider direction="vertical"/>
                      <el-link :underline="false" type="danger" >删除车次</el-link>
                      <el-divider direction="vertical"/>
                      <el-link :underline="false" style="color: #419eff" @click="toDetail(row)">安排车辆</el-link>
                      <el-divider direction="vertical"/>
                      <el-link :underline="false" type="danger" >车辆解绑</el-link>
                    </template>
                  </el-table-column>

                  <template #empty>
                    <div class="empty-box">
                      <img class="empty-img" src="@/assets/img/icon-empty.png" alt="">
                      <span class="empty-txt">没有找到您要的内容哦~</span>
                    </div>
                  </template>
                </el-table>
              </div>
          </template>
        </el-table-column>
        <el-table-column prop="number" label="线路编号" />
        <el-table-column prop="name" label="线路名称" width="120"/>
        <el-table-column prop="type" label="线路类型" width="120" :formatter="typeFormatter"/>
        <el-table-column prop="startOrganName" label="起始地机构" width="160"/>
        <el-table-column prop="endOrganName" label="目的地机构" width="160"/>
        <el-table-column prop="distance" label="距离（千米）" width="140"/>
        <el-table-column prop="cost" label="成本（元）" width="140"/>
        <el-table-column prop="time" label="预计时间（分钟）" width="140"/>
        <el-table-column label="操作" align="center" width="200">
          <template #default="{row}">
            <el-link :underline="false" style="color: #419eff" @click="openFormDialog('edit',row.id)">修改</el-link>
            <el-divider direction="vertical"/>
            <el-link :underline="false" type="danger" >删除</el-link>
            <el-divider direction="vertical"/>
            <el-link :underline="false" style="color: #419eff" >增加车次</el-link>
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
import {
  searchTransportLineListAPI,
  getTripsByIdAPI,
  addTransportLineAPI,
  getTransportLineDetailAPI
} from '@/api/transport-line'

export default {
  name: 'line-manage',
  components: {
    TreeSelect
  },
  data () {
    return {
      currentFormType: null,
      formData: {
        number: 'XL',
        name: '',
        type: '',
        startOrganId: null,
        endOrganId: null
      },
      formVisible: false,
      expands: [],
      subLoading: false,
      treeData: [],
      loading: false,

      searchForm: {
        name: '',
        type: '',
        startOrganId: null,
        endOrganId: null
      },

      tableData: [],
      subTableData: [],

      pageParams: {
        page: 1,
        pageSize: 10
      },
      total: 0
    }
  },

  created () {
    this.getOrgTree()
    this.searchTransportLineList()
  },

  methods: {
    handleFormClose () {
      this.$refs.addFormRef.resetFields()
      this.formVisible = false
      this.currentFormType = null
      this.formData = {
        name: '',
        type: '',
        startOrganId: null,
        endOrganId: null
      }
    },

    async handleFormConfirm () {
      await this.$refs.addFormRef.validate()
      await addTransportLineAPI(this.formData)
      this.handleFormClose()
      this.$message.success('新增成功')
      await this.searchTransportLineList()
    },

    async openFormDialog (type, id) {
      if (type === 'edit') {
        const { data: { data } } = await getTransportLineDetailAPI(id)
        this.formData = data
      }
      this.currentFormType = type
      this.formVisible = true
    },

    getRowKey (row) {
      return row.id
    },

    async handleExpand (row, expandedRows) {
      this.subLoading = true
      try {
        this.subTableData = []
        this.expands = []
        if (expandedRows.length > 0) {
          this.expands.push(row.id)
        }
        const { data: { data } } = await getTripsByIdAPI({ transportLineId: row.id })
        this.subTableData = data
      } catch (error) {
        console.error(error)
      } finally {
        this.subLoading = false
      }
    },

    async searchTransportLineList () {
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
        } = await searchTransportLineListAPI(payload)
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
      this.searchTransportLineList()
    },

    handleCurrentChange (newPage) {
      this.pageParams.page = newPage
      this.searchTransportLineList()
    },

    reset () {
      this.$refs.searchForm.resetFields()
      this.searchTransportLineList()
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

    typeFormatter (row, column, cellValue) {
      switch (cellValue) {
        case 1:
          return '干线'
        case 2:
          return '支线'
        case 3:
          return '接驳路线'
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

.sub-table-box {
  width: 94%;
  margin: auto;
  padding: 0 8px 8px;
  border-radius: 4px;
}
</style>
