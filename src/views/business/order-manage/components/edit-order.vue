<template>
  <div class="app-container">
    <el-card shadow="never">
      <el-row type="flex" class="info-box">
        <div class="order-info">订单编号： <span>{{ infoData.id || '--' }}</span></div>
        <div class="order-info">运单编号： <span>{{ infoData?.transportOrder?.id || '--' }}</span></div>
        <div class="order-info">下单时间： <span>{{ infoData.createTime || '--' }}</span></div>
        <div class="order-info">订单状态： <span>{{ infoData.status | statusFilter }}</span></div>
        <div class="order-info">预计到达时间： <span>{{ infoData.estimatedArrivalTime || '--' }}</span></div>
      </el-row>
    </el-card>

    <info-box title="基本信息">
      <div class="sender">
        <div class="item-header"><img src="@/icon/location.png" alt=""/><span>发货方</span></div>
        <div class="sender-item">
          <div>
            <span class="item-name">发货方姓名：</span> <span class="item-desc">{{ infoData.senderName }}</span>
          </div>
          <div>
            <span class="item-name">发货方电话：</span> <span class="item-desc">{{ infoData.senderPhone }}</span>
          </div>
        </div>
        <div class="sender-item">
          <div>
            <span class="item-name">发货方地址：</span> <span
            class="item-desc">{{
              infoData?.senderProvince?.name + infoData?.senderCity?.name + infoData?.senderCounty?.name
            }}</span>
          </div>
          <div>
            <span class="item-name">详细地址：</span> <span class="item-desc">{{ infoData.senderAddress }}</span>
          </div>
        </div>
        <div class="sender">
          <div class="item-header"><img src="@/icon/target.png" alt=""/><span>收货方</span></div>
          <div class="sender-item">
            <div>
              <span class="item-name">收货方姓名：</span> <span class="item-desc">{{ infoData.receiverName }}</span>
            </div>
            <div>
              <span class="item-name">收货方电话：</span> <span class="item-desc">{{ infoData.receiverPhone }}</span>
            </div>
          </div>
          <div class="sender-item">
            <div>
              <span class="item-name">收货方地址：</span> <span class="item-desc">{{
                infoData?.receiverProvince?.name + infoData?.receiverCity?.name + infoData?.receiverCounty?.name
              }}</span>
            </div>
            <div>
              <span class="item-name">详细地址：</span> <span class="item-desc">{{ infoData.receiverAddress }}</span>
            </div>
          </div>
        </div>
        <div class="sender">
          <div class="item-header"><img src="@/icon/flag.png" alt=""/><span>距离：{{ infoData.distance }}km</span></div>
          备注：暂无
        </div>
      </div>
    </info-box>

    <info-box title="取件信息">
    <el-row>
      <el-col :span="6">
        <div>
          <span class="item-name">所在网点：</span> <span class="item-desc">{{
            infoData?.taskPickup?.agency?.name
            }}</span>
        </div>
        <div>
          <span class="item-name">快递员电话：</span> <span class="item-desc">{{ infoData?.taskPickup?.courier?.mobile }}</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <span class="item-name">取件类型：</span> <span class="item-desc">{{ infoData.pickupType | pickupTypeFilter}}</span>
        </div>
        <div>
          <span class="item-name">预计取件时间：</span> <span class="item-desc">{{ infoData.estimatedStartTime }}</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <span class="item-name">作业状态：</span> <span class="item-desc">{{ infoData?.transportOrder?.status }}</span>
        </div>
        <div>
          <span class="item-name">取件完成时间：</span> <span class="item-desc">{{ infoData.estimatedEndTime }}</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <span class="item-name">取件快递员：</span> <span class="item-desc">{{ infoData?.taskPickup?.courier?.name }}</span>
        </div>
      </el-col>
    </el-row>
    </info-box>
  </div>
</template>

<script>
import { getOrderDetailAPI } from '@/api/order-manager'

export default {
  name: 'EditOrder',
  data () {
    return {
      infoData: {}
    }
  },
  filters: {
    statusFilter (value) {
      switch (value) {
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
          return '--'
      }
    },
    pickupTypeFilter (value) {
      switch (value) {
        case 1:
          return '网点自寄'
        case 0:
          return '上门取件'
        default:
          return ''
      }
    }
  },
  created () {
    this.getOrderDetail()
  },

  methods: {
    async getOrderDetail () {
      const { data: { data } } = await getOrderDetailAPI(this.$route.query.orderId)
      this.infoData = data
      // console.log(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.info-box {
  display: flex;
  flex-wrap: wrap;

  .order-info {
    width: 25%;
    padding-left: 20px;
    margin-top: 20px;
    font-size: 14px;

    span {
      color: #818693;
    }
  }

  & .order-info:nth-child(-n+4) {
    margin-top: 0;
  }
}

.info-box {
  margin-top: 20px;
}

.item-header {
  img {
    height: 18px;
    vertical-align: middle;
    margin-left: 2px;
  }

  span {
    margin-left: 10px;
    font-size: 16px;
  }
}

.sender:nth-child(n+2) {
  margin-top: 20px;
}

.sender-item {
  display: flex;
  padding-left: 40px;

  & > div {
    width: 200px;
    margin-top: 10px;

    &:nth-child(2n) {
      margin-left: 174px;
    }
  }
}

.item-desc {
  color: #818693;
}
</style>
