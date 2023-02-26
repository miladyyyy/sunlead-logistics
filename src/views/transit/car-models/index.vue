<template>
  <div class="app-container">
    <el-dialog title="新增车型" :visible="showDialog" @close="close">
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="130px"
        :rules="addFormRules"
      >
        <el-form-item label="车辆类型" prop="name">
          <el-input v-model="addForm.name" maxlength="16" />
        </el-form-item>
        <el-form-item label="应载重量" prop="allowableLoad">
          <el-input v-model="addForm.allowableLoad" maxlength="10">
            <template #suffix>
              <span class="suffix">吨</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="应载体积" prop="allowableVolume">
          <el-input v-model="addForm.allowableVolume" maxlength="10">
            <template #suffix>
              <span class="suffix">立方</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="长" prop="measureLong">
          <el-input v-model="addForm.measureLong" maxlength="10">
            <template #suffix>
              <span class="suffix">米</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="宽" prop="measureWidth">
          <el-input v-model="addForm.measureWidth" maxlength="10">
            <template #suffix>
              <span class="suffix">米</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="高" prop="measureHigh">
          <el-input v-model="addForm.measureHigh" maxlength="10">
            <template #suffix>
              <span class="suffix">米</span>
            </template>
          </el-input>
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
      <el-form label-width="80px" ref="searchForm" :model="searchForm">
        <el-col :span="8">
          <el-form-item label="车型编号:" prop="id">
            <el-input placeholder="请输入车型编号" v-model="searchForm.id"  clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="应载重量:" prop="allowableLoad">
            <el-select
              placeholder="请选择应载重量"
              v-model="searchForm.allowableLoad"
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
          <el-form-item label="应载体积:" prop="allowableVolume">
            <el-select
              placeholder="请选择应载体积"
              v-model="searchForm.allowableVolume"
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
          <el-form-item label="车辆类型:" prop="name">
            <el-input placeholder="请输入车辆类型" v-model="searchForm.name" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="searchTruckTypeList">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-col>
      </el-form>
    </PageTool>

    <el-card shadow="never" v-loading="loading">
      <template #header>
        <el-button type="primary" @click="handleAdd">新增车型</el-button>
      </template>
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
import { addTruckTypeAPI, searchTruckTypeAPI } from '@/api/truck-type'

export default {
  name: 'car-models',
  data () {
    return {
      loading: false,
      addForm: {
        name: '',
        allowableLoad: '',
        allowableVolume: '',
        measureLong: '0.0',
        measureWidth: '0.0',
        measureHigh: '0.0'
      },
      addFormRules: {
        name: [
          {
            required: true,
            message: '车辆类型不能为空',
            trigger: 'blur'
          }
        ],
        allowableLoad: [
          {
            required: true,
            message: '应载重量不能为空',
            trigger: 'blur'
          },
          {
            pattern: /^([1-9]|[1-9]\d|100)$/,
            message: '只可输入1-100之间的整数',
            trigger: 'blur'
          }
        ],
        allowableVolume: [
          {
            required: true,
            message: '应载体积不能为空',
            trigger: 'blur'
          },
          {
            pattern: /^([1-9]|[1-9]\d|100)$/,
            message: '只可输入1-100之间的整数',
            trigger: 'blur'
          }
        ],
        measureLong: [
          {
            pattern: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
            message: '只能输入数字类型，最多保留两位小数，请重新输入',
            trigger: 'blur'
          }
        ],
        measureWidth: [
          {
            pattern: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
            message: '只能输入数字类型，最多保留两位小数，请重新输入',
            trigger: 'blur'
          }
        ],
        measureHigh: [
          {
            pattern: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
            message: '只能输入数字类型，最多保留两位小数，请重新输入',
            trigger: 'blur'
          }
        ]
      },
      showDialog: false,
      searchForm: {
        id: '', // 车型编号,
        name: '',
        allowableVolume: null, // 应载体积
        allowableLoad: null // 应载重量
        // measureLong: null
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

      allowableVolumeOption: [
        {
          value: 'RANGE_LEVEL_1',
          label: '<3 (m³)'
        },
        {
          value: 'RANGE_LEVEL_2',
          label: '3-5 (m³)'
        },
        {
          value: 'RANGE_LEVEL_3',
          label: '5-10 (m³)'
        },
        {
          value: 'RANGE_LEVEL_4',
          label: '10-15 (m³)'
        },
        {
          value: 'RANGE_LEVEL_5',
          label: '15-30 (m³)'
        },
        {
          value: 'RANGE_LEVEL_6',
          label: '30-50 (m³)'
        },
        {
          value: 'RANGE_LEVEL_7',
          label: '50-80 (m³)'
        },
        {
          value: 'RANGE_LEVEL_8',
          label: '80-150 (m³)'
        },
        {
          value: 'RANGE_LEVEL_9',
          label: '>150 (m³)'
        }
      ],

      tableData: [],

      pageParams: {
        page: 1,
        pageSize: 10
      },
      total: 0
    }
  },

  created () {
    this.searchTruckTypeList()
  },

  methods: {
    async searchTruckTypeList () {
      this.loading = true
      try {
        const {
          data: {
            data: { counts, items }
          }
        } = await searchTruckTypeAPI({
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
      this.searchTruckTypeList()
    },

    handleCurrentChange (newPage) {
      this.pageParams.page = newPage
      this.searchTruckTypeList()
    },

    handleAdd () {
      this.showDialog = true
    },

    async submit () {
      await this.$refs.addForm.validate()
      await addTruckTypeAPI(this.addForm)
      this.$message.success('添加成功')
      this.close()
      this.searchTruckTypeList()
    },

    close () {
      this.$refs.addForm.resetFields()
      this.showDialog = false
    },

    reset () {
      this.$refs.searchForm.resetFields()
      this.searchTruckTypeList()
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
