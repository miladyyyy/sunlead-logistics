<template>
  <div class="app-container">
    <el-dialog title="新增车辆" :visible="showDialog" @close="close">
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="130px"
        :rules="addFormRules"
      >
        <el-form-item label="车辆类型" prop="truckTypeName">
          <el-select v-model="addForm.truckTypeName" style="width: 100%">
            <el-option
              v-for="item in truckTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车牌号码" prop="licensePlate">
          <el-input
            v-model="addForm.licensePlate"
            maxlength="10"
            placeholder="请输入车牌号码"
          />
        </el-form-item>
        <el-form-item label="GPS设备ID" prop="deviceGpsId">
          <el-input
            v-model="addForm.deviceGpsId"
            maxlength="10"
            placeholder="请输入GPS设备ID"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="submit">确认</el-button>
          <el-button @click="close">取消</el-button>
        </el-row>
      </template>
    </el-dialog>
    <PageTool>
      <el-form
        label-width="80px"
        ref="searchForm"
        :model="searchForm"
        style="width: 100%"
      >
        <el-col :span="8">
          <el-form-item label="车辆类型:" prop="truckTypeId">
            <el-select
              placeholder="请选择车辆类型"
              v-model="searchForm.truckTypeId"
              clearable
            >
              <el-option
                v-for="item in truckTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="车牌号码:" prop="licensePlate">
            <el-input
              placeholder="请输入车牌号码"
              v-model="searchForm.licensePlate"
              clearable
            />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-button type="primary" @click="searchTruckList">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-col>
      </el-form>
    </PageTool>

    <el-card shadow="never">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="1" >
          <template #label>
            <span>全部{{ +count['0']+ +count['1'] }}</span>
          </template>
        </el-tab-pane>
        <el-tab-pane label="可用" name="2" >
          <template #label>
            <span>可用{{ count['0'] }}</span>
          </template>
        </el-tab-pane>
        <el-tab-pane label="停用" name="3" >
          <template #label>
            <span>停用{{ count['1'] }}</span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-card shadow="never" v-loading="loading">
      <template #header>
        <el-button type="primary" @click="handleAdd">新增车型</el-button>
      </template>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" width="60" align="center" label="序号" />
        <el-table-column prop="licensePlate" label="车牌号码" />
        <el-table-column prop="truckTypeName" label="车辆类型" width="150" />
        <el-table-column prop="driverNum" label="司机数量" width="150" />
        <el-table-column prop="workStatus" label="车辆状态" width="150">
          <template #default="{ row }">
            <el-tag size="mini" v-if="row.workStatus === 1" type="success"
              >可用</el-tag
            >
            <el-tag size="mini" v-else type="danger">停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deviceGpsId" label="GPS设备ID" width="150" />
        <el-table-column
          prop="allowableLoad"
          label="实载重量 （T）"
          width="100"
        />
        <el-table-column
          prop="allowableVolume"
          label="实载体积 （方）"
          width="100"
        />
        <el-table-column label="操作" align="center" width="220" fixed="right">
          <template #default="{ row }">
            <el-link
              :underline="false"
              style="color: #419eff"
              @click="toDetail(row.id)"
              >查看详情
            </el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link :underline="false" style="color: #419eff">启用</el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link :underline="false" style="color: #419eff"
              >配置司机</el-link
            >
          </template>
        </el-table-column>

        <template #empty>
          <div class="empty-box">
            <img class="empty-img" src="@/assets/img/icon-empty.png" alt="" />
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
import { getTrukTypeAPI } from '@/api/truck-type'
import { addTruckListAPI, searchTruckListAPI, getCountAPI } from '@/api/truck'

export default {
  name: 'VehicleView',
  data () {
    return {
      activeName: '1',
      loading: false,
      addForm: {
        truckTypeName: '',
        licensePlate: '',
        deviceGpsId: ''
      },
      addFormRules: {
        truckTypeName: [
          {
            required: true,
            message: '车辆类型不能为空',
            trigger: 'blur'
          }
        ],
        licensePlate: [
          {
            required: true,
            message: '车牌号码不能为空',
            trigger: 'blur'
          },
          {
            pattern:
              /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
            message: '请输入正确的车牌号码',
            trigger: 'blur'
          }
        ],
        deviceGpsId: [
          {
            required: true,
            message: 'GPS设备ID不能为空',
            trigger: 'blur'
          }
        ]
      },
      showDialog: false,
      searchForm: {
        truckTypeId: '', // 车辆类型
        licensePlate: '' // 车牌号码
      },

      allowableLoadOption: [
        {
          value: 'RANGE_LEVEL_1',
          label: '<1.8 (吨)'
        },
        {
          value: 'RANGE_LEVEL_2',
          label: '1.8-6 (吨)'
        },
        {
          value: 'RANGE_LEVEL_3',
          label: '6-14吨)'
        },
        {
          value: 'RANGE_LEVEL_4',
          label: '14-30 (吨)'
        },
        {
          value: 'RANGE_LEVEL_5',
          label: '30-50 (吨)'
        },
        {
          value: 'RANGE_LEVEL_6',
          label: '50-100 (吨)'
        },
        {
          value: 'RANGE_LEVEL_7',
          label: '>100 (吨)'
        }
      ],

      truckTypeList: [],

      tableData: [],

      pageParams: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      count: {
        0: 0,
        1: 0
      }
    }
  },

  created () {
    this.getCount()
    this.getTruckType()
    this.searchTruckList()
  },

  methods: {
    toDetail (id) {
      this.$router.push({
        path: '/transit/vehicle-detail',
        query: { id, formUrlName: '车辆管理' }
      })
    },

    async getCount () {
      try {
        const {
          data: { data }
        } = await getCountAPI()
        // console.log(data)
        this.count = data
      } catch (error) {
        console.error(error)
      }
    },

    async getTruckType () {
      try {
        const {
          data: { data }
        } = await getTrukTypeAPI()
        this.truckTypeList = data
      } catch (error) {
        console.error(error)
      }
    },

    async searchTruckList () {
      this.loading = true
      try {
        const payload = {
          ...this.pageParams,
          ...this.searchForm
        }
        for (const key in payload) {
          if (payload[key] === '') {
            delete payload[key]
          }
        }
        const {
          data: {
            data: { counts, items }
          }
        } = await searchTruckListAPI(payload)
        this.loading = false
        this.tableData = items
        this.total = +counts
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    },

    handleSizeChange (newSize) {
      this.pageParams.pageSize = newSize
      this.searchTruckList()
    },

    handleCurrentChange (newPage) {
      this.pageParams.page = newPage
      this.searchTruckList()
    },

    handleAdd () {
      this.showDialog = true
    },

    async submit () {
      await this.$refs.addForm.validate()
      await addTruckListAPI(this.addForm)
      this.$message.success('添加成功')
      this.close()
      this.searchTruckList()
    },

    close () {
      this.$refs.addForm.resetFields()
      this.showDialog = false
    },

    reset () {
      this.$refs.searchForm.resetFields()
      this.searchTruckList()
    },

    async handleClick (tab) {
      this.loading = true
      const nameMap = {
        1: null,
        2: 1,
        3: 0
      }
      try {
        const {
          data: {
            data: { counts, items }
          }
        } = await searchTruckListAPI({
          ...this.pageParams,
          workStatus: nameMap[tab.name]
        })
        this.loading = false
        this.tableData = items
        this.total = +counts
      } catch (error) {
        console.log(error)
        this.loading = false
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
</style>
