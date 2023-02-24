<template>
  <div class="app-container">
    <div class="left-side">
      <AreasTree
        @getOrgDetail="getOrgDetail"
        @getEmployeeList="getEmployeeList"
      />
    </div>
    <div class="right-side">
      <div class="organization-info">
        <el-card>
          <template #header>
            <span>机构信息</span>
          </template>
          <el-form :model="orgForm" label-width="auto" :disabled="!isEdit">
            <el-row type="flex" justify="space-between">
              <el-col :span="8">
                <el-form-item prop="id" label="机构编号">
                  <el-row>
                    <el-input v-model="orgForm.id" disabled></el-input>
                  </el-row>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="name" label="机构名称">
                  <el-input v-model="orgForm.name" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="机构类型">
                  <el-select
                    style="width: 100%"
                    v-model="orgForm.type"
                    disabled
                  >
                    <el-option
                      v-for="item in orgType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row type="flex">
              <el-col :span="24">
                <el-form-item label="机构地址" width="100%">
                  <el-row
                    type="flex"
                    justify="space-between"
                    class="org-address"
                  >
                    <el-col :span="7">
                      <el-select
                        placeholder="请选择省"
                        v-model="orgForm.province.id"
                        @change="changeProvince"
                        clearable
                        @clear="clearProvince"
                      >
                        <el-option
                          v-for="item in provinceList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        />
                      </el-select>
                    </el-col>
                    <el-col :span="7">
                      <el-select
                        placeholder="请选择市"
                        v-model="orgForm.city.id"
                        @change="changeCity"
                        clearable
                        @clear="clearCity"
                      >
                        <el-option
                          v-for="item in cityList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        />
                      </el-select>
                    </el-col>
                    <el-col :span="7">
                      <el-select
                        placeholder="请选择县/区"
                        v-model="orgForm.county.id"
                        clearable
                      >
                        <el-option
                          v-for="item in countyList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        />
                      </el-select>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row type="flex" justify="space-between">
              <el-col :span="8">
                <el-form-item prop="address" label="详细地址">
                  <el-row>
                    <el-input v-model="orgForm.address"></el-input>
                  </el-row>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="经度">
                  <el-input v-model="orgForm.county.lng" disabled>
                    <template #suffix>
                      <span>E</span>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="纬度">
                  <el-input v-model="orgForm.county.lat" disabled>
                    <template #suffix>
                      <span>N</span>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row type="flex">
              <el-col :span="8">
                <el-form-item label="机构负责人">
                  <el-row>
                    <el-input v-model="orgForm.managerName"></el-input>
                  </el-row>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="机构电话">
                  <el-row>
                    <el-input v-model="orgForm.phone"></el-input>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <el-row type="flex" justify="center">
            <el-button type="primary" @click="handleBtnClick">
              {{ isEdit ? "保存" : "编辑" }}
            </el-button>
          </el-row>
        </el-card>

        <el-card style="margin-top: 20px">
          <template #header>
            <span>员工信息</span>
          </template>
          <el-table :data="employeeList" stripe style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              width="50"
              align="center"
            />
            <el-table-column prop="userId" label="员工编号" />
            <el-table-column prop="name" label="员工姓名" />
            <el-table-column prop="mobile" label="手机号" />
            <el-table-column
              prop="agency"
              label="所属机构"
              :formatter="agencyFormatter"
            />
            <el-table-column prop="account" label="系统账户" />
            <el-table-column prop="stationName" label="系统角色" />
            <el-table-column label="账号状态">
              <template #default="{ row }">
                <div class="tableColumn-status">
                  {{ row.status | statusFilter }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="employeeListParams.page"
            :page-sizes="[5, 10, 20, 40]"
            :page-size="employeeListParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </el-card>
      </div>
      <div class="employee-info"></div>
    </div>
  </div>
</template>
<script>
import { getOrgDetailAPI, getEmployeeListAPI } from '@/api/organization'
import { getAreasAPI, getAreasByIdAPI } from '@/api/index'
import AreasTree from '@/components/areas-tree.vue'

// const orgTypeMap = new Map()
// orgTypeMap
//   .set(1, '一级转运中心')
//   .set(2, '二级转运中心')
//   .set(3, '营业部')

export default {
  components: { AreasTree },
  name: 'organization-manage',
  filters: {
    statusFilter (value) {
      return value === 1 ? '正常' : '异常'
    }
  },
  data () {
    return {
      isEdit: false,
      orgType: [
        {
          value: 1,
          label: '一级转运中心'
        },
        {
          value: 2,
          label: '二级转运中心'
        },
        {
          value: 3,
          label: '营业部'
        }
      ],
      // treeData: [],

      orgForm: {
        address: '',
        province: {
          id: '',
          lat: '',
          lng: '',
          mutiPoints: null,
          name: ''
        },

        city: {
          id: '',
          lat: '',
          lng: '',
          mutiPoints: null,
          name: ''
        },

        county: {
          id: '',
          latitude: '',
          longitude: '',
          managerName: '',
          name: ''
        },
        phone: '',
        type: null
      },
      provinceList: [],
      cityList: [],
      countyList: [],

      employeeList: [],

      employeeListParams: {
        agencyId: null,
        page: 1,
        pageSize: 5
      },
      total: 0
    }
  },

  async created () {
    await this.getOrgDetail(this.defaultKey)
    await this.getEmployeeList()
  },

  methods: {
    async getOrgDetail (id) {
      try {
        const { data } = await getOrgDetailAPI(id)
        this.orgForm = data.data
        // console.log(data.data)
        const res = await Promise.all([
          getAreasAPI(),
          getAreasByIdAPI(this.orgForm.province.id),
          getAreasByIdAPI(this.orgForm.city.id)
        ])
        const {
          data: { data: provinceList }
        } = res[0]
        // console.log(provinceList)
        this.provinceList = provinceList
        const {
          data: { data: cityList }
        } = res[1]
        // console.log(cityList)
        this.cityList = cityList
        const {
          data: { data: countyList }
        } = res[2]
        // console.log(countyList)
        this.countyList = countyList

        this.employeeListParams.agencyId = this.orgForm.id
      } catch (error) {
        this.$message.error('获取机构信息失败')
      }
    },

    handleBtnClick () {
      this.isEdit = !this.isEdit
    },

    async changeProvince (provinceId) {
      const {
        data: { data }
      } = await getAreasByIdAPI(provinceId)
      if (this.orgForm.province.id) this.cityList = data
      this.orgForm.city.id = ''
      this.orgForm.county.id = ''
    },

    async changeCity (cityId) {
      const {
        data: { data }
      } = await getAreasByIdAPI(cityId)
      this.countyList = data
      this.orgForm.county.id = ''
    },

    clearProvince () {
      this.cityList = []
      this.countyList = []
    },

    clearCity () {
      this.countyList = []
    },

    async getEmployeeList () {
      const {
        data: {
          data: { items, counts }
        }
      } = await getEmployeeListAPI(this.employeeListParams)
      // console.log(items)
      this.employeeList = items
      this.total = +counts
    },

    agencyFormatter (row, column, cellValue) {
      return cellValue.name
    },

    handleSizeChange (newSize) {
      // console.log(newSize)
      this.employeeListParams.pageSize = newSize
      this.getEmployeeList()
    },

    handleCurrentChange (newPage) {
      this.employeeListParams.page = newPage
      this.getEmployeeList()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  .left-side {
    padding: 9px;
    background-color: #fff;
    width: 214px;
    margin-right: 20px;
  }
  .right-side {
    // background-color: #fff;
    flex: auto;
  }
}

::v-deep .el-card__header {
  background-color: #fafafa;

  span {
    font-weight: 700;
    color: #2a2929;
  }
}

.el-form {
  .el-row {
    width: 100%;
  }
}

.org-address .el-select {
  width: 100%;
}

::v-deep .el-input__suffix-inner {
  color: rgb(32, 35, 42);
  font-size: 14px;
  margin-right: 14px;
}

::v-deep .el-form-item__label {
  color: #20232a;
  font-weight: 700;
}

.tableColumn-status {
  display: flex;
  align-items: center;

  &::before {
    content: "";
    display: inline-block;
    margin-right: 6px;
    background: #1dc779;
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
}
</style>
