<template>
  <div class="app-container">
    <PageTool>
      <el-form label-width="80px">
        <el-col :span="8">
          <el-form-item label="车型编号:">
            <el-input placeholder="请输入车型编号" v-model="formData.id" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="应载重量:">
            <el-select
              placeholder="请选择应载重量"
              v-model="formData.allowableLoad"
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
          <el-form-item label="应载体积:">
            <el-select
              placeholder="请选择应载体积"
              v-model="formData.measureLong"
            >
              <el-option
                v-for="item in measureLongOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车辆类型:">
            <el-input placeholder="请输入车辆类型" v-model="formData.name" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button type="primary">搜索</el-button>
          <el-button>重置</el-button>
        </el-col>
      </el-form>
    </PageTool>

    <el-card shadow="never">
      <template #header>
        <el-button type="primary">新增车型</el-button>
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
import { getTruckTypeListAPI } from '@/api/truck-type'

export default {
  name: 'car-models',
  data () {
    return {
      formData: {
        id: '', // 车型编号,
        name: '',
        allowableLoad: null, // 应载重量
        measureLong: null // 应载体积
      },

      allowableLoadOption: [
        {
          value: 1,
          label: '<1.8 (吨)'
        },
        {
          value: 2,
          label: '1.8-6 (吨)'
        },
        {
          value: 3,
          label: '6-14吨)'
        },
        {
          value: 4,
          label: '14-30 (吨)'
        },
        {
          value: 5,
          label: '30-50 (吨)'
        },
        {
          value: 6,
          label: '50-100 (吨)'
        },
        {
          value: 7,
          label: '>100 (吨)'
        }
      ],

      measureLongOption: [
        {
          value: 1,
          label: '<3 (m³)'
        },
        {
          value: 2,
          label: '3-5 (m³)'
        },
        {
          value: 3,
          label: '5-10 (m³)'
        },
        {
          value: 4,
          label: '10-15 (m³)'
        },
        {
          value: 5,
          label: '15-30 (m³)'
        },
        {
          value: 6,
          label: '30-50 (m³)'
        },
        {
          value: 7,
          label: '50-80 (m³)'
        },
        {
          value: 8,
          label: '80-150 (m³)'
        },
        {
          value: 9,
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
    this.getTruckTypeList()
  },

  methods: {
    async getTruckTypeList () {
      const {
        data: {
          data: { counts, items }
        }
      } = await getTruckTypeListAPI(this.pageParams)
      console.log(items)
      this.tableData = items
      this.total = +counts
    },

    handleSizeChange (newSize) {
      this.pageParams.pageSize = newSize
      this.getTruckTypeList()
    },

    handleCurrentChange (newPage) {
      this.pageParams.page = newPage
      this.getTruckTypeList()
    }
  }
}
</script>
<style lang="scss" scoped>
.el-col-8 {
  padding: 0 30px;
}
.el-pagination{
  margin: 20px 0;
}
</style>
