<template>
  <div class="app-container">
    <PageTool>
      <el-form label-width="110px" ref="searchForm" :model="searchForm">
        <el-col :span="8">
          <el-form-item label="订单编号:" prop="id">
            <el-input placeholder="请输入订单编号" v-model="searchForm.id" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="订单状态:" prop="status">
            <el-input placeholder="请输入订单状态" v-model="searchForm.status" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="付费状态:" prop="paymentStatus">
            <el-input placeholder="请输入付费状态" v-model="searchForm.paymentStatus" clearable/>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="发件人姓名:" prop="senderName">
            <el-input placeholder="请输入发件人姓名" v-model="searchForm.senderName" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发件人电话:" prop="senderPhone">
            <el-input placeholder="请输入发件人电话" v-model="searchForm.senderPhone" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发件人地址:">
            <div class="address-selector">
              <el-select v-model="searchForm.senderProvinceId" clearable @focus="getProvince('sender')"
                         @change="getCity($event,'sender')" placeholder="请选择省">
                <el-option
                  v-for="item in senderAddress.provinceOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select v-model="searchForm.senderCityId" clearable @change="getCounty($event,'sender')" placeholder="请选择市">
                <el-option
                  v-for="item in senderAddress.cityOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select v-model="searchForm.senderCountyId" clearable placeholder="请选择区/县">
                <el-option
                  v-for="item in senderAddress.countyOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="收件人姓名:" prop="receiverName">
            <el-input placeholder="请输入收件人姓名" v-model="searchForm.receiverName" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="收件人电话:" prop="receiverPhone">
            <el-input placeholder="请输入收件人电话" v-model="searchForm.receiverPhone" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="收件人地址:">
            <div class="address-selector">
              <el-select v-model="searchForm.receiverProvinceId" clearable @focus="getProvince('receiver')"
                         @change="getCity($event,'receiver')" placeholder="请选择省">
                <el-option
                  v-for="item in receiverAddress.provinceOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select v-model="searchForm.receiverCityId" clearable @change="getCounty($event,'receiver')" placeholder="请选择市">
                <el-option
                  v-for="item in receiverAddress.cityOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select v-model="searchForm.receiverCountyId" clearable placeholder="请选择区/县">
                <el-option
                  v-for="item in receiverAddress.countyOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="searchOrderList">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-col>
      </el-form>
    </PageTool>

    <el-card shadow="never" v-loading="loading">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" width="60" align="center" label="序号"/>
        <el-table-column prop="id" label="订单编号" width="160px"/>
        <el-table-column prop="transportOrder.id" label="运单编号" width="130px"/>
        <el-table-column prop="updated" label="下单时间" width="160px"/>
        <el-table-column prop="status" label="订单状态" width="90px" :formatter="statusFormatter"/>
        <el-table-column prop="senderName" label="发件人姓名" width="100px"/>
        <el-table-column prop="senderPhone" label="发件人电话" width="120px"/>
        <el-table-column prop="senderAddress" label="发件人地址" width="150px"/>
        <el-table-column prop="receiverName" label="收件人姓名" width="100px"/>
        <el-table-column prop="receiverPhone" label="收件人电话" width="120px"/>
        <el-table-column prop="receiverAddress" label="收件人地址" width="120px"/>
        <el-table-column prop="pickupType" label="取件类型" width="100px" :formatter="pickupTypeFormatter"/>
        <el-table-column prop="paymentMethod" label="付费类型" width="100px" :formatter="paymentMethodFormatter"/>
        <el-table-column prop="paymentStatus" label="付费状态" width="100px" :formatter="pickupPaymentStatus"/>
        <el-table-column label="操作" align="center" width="85px" fixed="right">
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

import { searchOrderListAPI } from '@/api/order-manager'
import { getAreasAPI, getAreasByIdAPI } from '@/api'

export default {
  name: 'OrderManage',
  data () {
    return {
      loading: false,

      searchForm: {
        id: '',
        transportOrderId: '',
        senderName: '',
        senderPhone: '',
        senderProvinceId: '',
        senderCityId: '',
        senderCountyId: '',
        receiverName: '',
        receiverPhone: '',
        receiverProvinceId: '',
        receiverCityId: '',
        receiverCountyId: '',
        status: '',
        pickupType: '',
        paymentMethod: '',
        paymentStatus: ''
      },

      tableData: [],

      pageParams: {
        page: 1,
        pageSize: 10
      },
      total: 0,

      senderAddress: {
        provinceOptions: [],
        cityOptions: [],
        countyOptions: []
      },

      receiverAddress: {
        provinceOptions: [],
        cityOptions: [],
        countyOptions: []
      }
    }
  },

  created () {
    this.searchOrderList()
  },

  methods: {
    async getProvince (type) {
      const { data: { data } } = await getAreasAPI()
      if (type === 'sender') {
        this.senderAddress.provinceOptions = data
      } else if (type === 'receiver') this.receiverAddress.provinceOptions = data
    },

    async getCity (id, type) {
      const { data: { data } } = await getAreasByIdAPI(id)
      if (type === 'sender') {
        this.senderAddress.cityOptions = data
      } else if (type === 'receiver') this.receiverAddress.cityOptions = data
    },

    async getCounty (id, type) {
      const { data: { data } } = await getAreasByIdAPI(id)
      if (type === 'sender') {
        this.senderAddress.countyOptions = data
      } else if (type === 'receiver') this.receiverAddress.countyOptions = data
    },

    toDetail (row) {
      this.$router.push({
        path: '/business/edit-order',
        query: {
          orderId: row.id,
          status: row.status,
          pickupType: row.pickupType
        }
      })
    },
    async searchOrderList () {
      this.loading = true
      try {
        const {
          data: {
            data: {
              counts,
              items
            }
          }
        } = await searchOrderListAPI({
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
      this.searchOrderList()
    },

    handleCurrentChange (newPage) {
      this.pageParams.page = newPage
      this.searchOrderList()
    },

    reset () {
      this.$refs.searchForm.resetFields()
      this.searchForm.senderProvinceId = ''
      this.searchForm.senderCityId = ''
      this.searchForm.senderCountyId = ''
      this.searchForm.receiverProvinceId = ''
      this.searchForm.receiverCityId = ''
      this.searchForm.receiverCountyId = ''
      this.senderAddress = {
        provinceOptions: [],
        cityOptions: [],
        countyOptions: []
      }
      this.receiverAddress = {
        provinceOptions: [],
        cityOptions: [],
        countyOptions: []
      }
      this.searchOrderList()
    },

    statusFormatter (row, column, cellValue) {
      switch (cellValue) {
        case 23000:
          return '待取件'
        case 23001:
          return '已取件'
        case 23002:
          return '网点自寄'
        case 23003:
          return '网点入库'
        case 23004:
          return '待装车'
        case 23005:
          return '运输中'
        case 23006:
          return '网点出库'
        case 20007:
          return '待派送'
        case 23008:
          return '派送中'
        case 23009:
          return '已签收'
        case 23010:
          return '拒收'
        case 23011:
          return '已取消'
        default:
          return ''
      }
    },

    pickupTypeFormatter (row, column, cellValue) {
      switch (cellValue) {
        case 1:
          return '网点自寄'
        case 0:
          return '上门取件'
        default:
          return ''
      }
    },
    paymentMethodFormatter (row, column, cellValue) {
      switch (cellValue) {
        case 1:
          return '预结'
        case 2:
          return '到付'
        default:
          return ''
      }
    },

    pickupPaymentStatus (row, column, cellValue) {
      switch (cellValue) {
        case 1:
          return '未付'
        case 2:
          return '已付'
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

::v-deep .el-table tr td {
  font-size: 13px;
}

.el-date-editor {
  width: 100%;
}

.address-selector {
  display: flex;
  justify-content: space-between;

  .el-select {
    width: 30%;
  }
}
</style>
