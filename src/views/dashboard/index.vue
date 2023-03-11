<template>
  <div class="app-container">
    <el-row :gutter="20" class="row-1">
      <el-col :span="14">
        <DashboardCard title="机构概述">
          <div class="content">
            <div class="content-left">
              <div class="org-name">
                {{ dashboard.organOverview?.organName }}
              </div>
              <div class="address">
                地址：{{ dashboard.organOverview?.organAddress }}
              </div>
              <div class="principal">
                负责人：{{ dashboard.organOverview?.principal }}
                {{ dashboard.organOverview?.phone }}
              </div>
              <el-button>查看营业部分布</el-button>
            </div>
            <!-- <el-divider class="divider" direction="vertical"></el-divider> -->
            <div class="content-right">
              <div class="data-box">
                <div class="label">分拣中心(个)</div>
                <div class="num">
                  {{ dashboard.organOverview?.sortingCenterNumber }}
                </div>
              </div>
              <div class="data-box">
                <div class="label">营业部(个)</div>
                <div class="num">
                  {{ dashboard.organOverview?.agencyNumber }}
                </div>
              </div>
              <div class="data-box">
                <div class="label">司机人数(个)</div>
                <div class="num">
                  {{ dashboard.organOverview?.driverNumber }}
                </div>
              </div>
              <div class="data-box">
                <div class="label">快递员人数(个)</div>
                <div class="num">
                  {{ dashboard.organOverview?.courierNumber }}
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>
      </el-col>
      <el-col :span="10">
        <DashboardCard title="今日数据">
          <el-row type="flex" justify="space-around">
            <div class="today-data-box">
              <div class="label">订单金额(元)</div>
              <div ref="orderSum" v-dyna="100" class="num">{{ dashboard.todayData?.orderAmount }}</div>
              <div class="bottom">较昨日 +342</div>
            </div>
            <div class="today-data-box">
              <div  class="label">订单数量(笔)</div>
              <div ref="orderCount" class="num">{{ dashboard.todayData?.orderNumber }}</div>
              <div class="bottom">较昨日 +342</div>
            </div>
            <div class="today-data-box">
              <div class="label">运输任务(次)</div>
              <div ref="taskCount" class="num">
                {{ dashboard.todayData?.transportTaskNumber }}
              </div>
              <div class="bottom">
                较昨日 {{ dashboard.todayData?.orderAmountChanges }}
              </div>
            </div>
          </el-row>
        </DashboardCard>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="row-2">
      <el-col :span="14">
        <DashboardCard title="待办任务">
          <div class="chartRow-1">
            <div class="chartBox" ref="chartBox_1"></div>
            <div class="text-row">
              <div @click="$router.push('/business/order-manage?status=23000')">
                <span>待取件</span> <span style="color: #e15536">{{ dashboard?.backlog?.waitingPickupNumber }}</span>
              </div>
              <div @click="$router.push('/business/order-manage?status=23007')">
                <span>待派件</span> <span style="color: #ffc257">{{ dashboard?.backlog?.waitingDispatchNumber }}</span>
              </div>
              <div @click="$router.push('/transport/transport-task?status=1')">
                <span>未分配运输</span> <span
                style="color: #ff9739">{{ dashboard?.backlog?.unassignedTransportTaskNumber }}</span>
              </div>
              <div @click="$router.push('/transport/transport-task?status=5')">
                <span>超时运输</span> <span
                style="color: #dfcb59">{{ dashboard?.backlog?.timeoutTransportTaskNumber }}</span>
              </div>
            </div>
          </div>

        </DashboardCard>
      </el-col>
      <el-col :span="10">
        <DashboardCard title="执行中任务">
          <div class="chartRow-1">
            <div class="chartBox" ref="chartBox_2"></div>
            <div class="text-row">
              <div @click="$router.push('/business/order-manage?status=23005')">
                <span>运输中</span> <span style="color: #e15536">{{ dashboard?.backlog?.waitingPickupNumber }}</span>
              </div>
              <div @click="$router.push('/business/order-manage?status=23008')">
                <span>派送中</span> <span style="color: #ffc257">{{ dashboard?.backlog?.waitingDispatchNumber }}</span>
              </div>
            </div>
          </div>
        </DashboardCard>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="row-3">
      <el-col>
        <el-card>
          <p class="title">常用功能</p>
          <div class="common-func-row" >
          <div class="func-box" @click="$router.push('/branches/operational')">
            <img class="func-icon" src="@/icon/fun-1.png" alt=""/>
            <p class="func-text">快递作业</p>
          </div>
            <div class="func-box" @click="$router.push('/transport/transport-task')">
              <img class="func-icon" src="@/icon/fun-2.png" alt=""/>
              <p class="func-text">运输任务</p>
            </div>
            <div class="func-box" @click="$router.push('/transport/line-manage')">
              <img class="func-icon" src="@/icon/fun-3.png" alt=""/>
              <p class="func-text">线路管理</p>
            </div>
            <div class="func-box" @click="$router.push('/transit/vehicle')">
              <img class="func-icon" src="@/icon/fun-4.png" alt=""/>
              <p class="func-text">车辆管理</p>
            </div>
            <div class="func-box" @click="$router.push('/transit/driver')">
              <img class="func-icon" src="@/icon/fun-5.png" alt=""/>
              <p class="func-text">司机管理</p>
            </div>
            <div class="func-box" @click="$router.push('/transit/freight-manage')">
              <img class="func-icon" src="@/icon/fun-6.png" alt=""/>
              <p class="func-text">运费查询</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import DashboardCard from './components/dashboard-card.vue'
import { getWorkspaceAPI } from '@/api'
import * as echarts from 'echarts'
import 'echarts-liquidfill'
import { optionWave as optionWave1 } from '@/echarts/echarts-options-1'
import { optionWave as optionWave2 } from '@/echarts/echarts-options-2'
export default {
  components: { DashboardCard },
  directives: {
    dyna: {
      inserted (dom, options) {
        console.log(dom, options)
      }
    }
  },
  name: 'DashboardView',

  data () {
    return {
      dashboard: {
        organOverview: {},
        todayData: {}
      },
      backlog: {}
    }
  },
  created () {
    this.initData()
  },

  mounted () {
    this.$on('mounted', () => {
      optionWave1.series[0].data[0] = (this.dashboard.backlog.waitingPickupRate) / 100
      optionWave1.series[1].data[0] = (this.dashboard.backlog.waitingDispatchRate) / 100
      optionWave1.series[2].data[0] = (this.dashboard.backlog.unassignedTransportTaskRate) / 100
      optionWave1.series[3].data[0] = (this.dashboard.backlog.timeoutTransportTaskRate) / 100
      optionWave2.series[0].data[0] = (this.dashboard.todayData.taskInTransitRate) / 100
      optionWave2.series[1].data[0] = (this.dashboard.todayData.taskInDeliveryRate) / 100
      optionWave1.series[0].label.formatter = this.dashboard.backlog.waitingPickupRate
      optionWave1.series[1].label.formatter = this.dashboard.backlog.waitingDispatchRate
      optionWave1.series[2].label.formatter = this.dashboard.backlog.unassignedTransportTaskRate
      optionWave1.series[3].label.formatter = this.dashboard.backlog.timeoutTransportTaskRate
      optionWave2.series[0].label.formatter = this.dashboard.todayData.taskInTransitRate
      optionWave2.series[1].label.formatter = this.dashboard.todayData.taskInDeliveryRate

      this.chart1 = echarts.init(this.$refs.chartBox_1)
      this.chart2 = echarts.init(this.$refs.chartBox_2)
      this.chart1.setOption(optionWave1)
      this.chart2.setOption(optionWave2)
      window.addEventListener('resize', () => {
        this.chart1.resize()
        this.chart2.resize()
      })
    })
  },

  methods: {
    async initData () {
      const { data: { data } } = await getWorkspaceAPI()
      this.dashboard = data
      this.$emit('mounted')
    }
  },

  beforeDestroy () {
    window.removeEventListener('resize', () => {
      this.chart1.resize()
      this.chart2.resize()
    })
  }
}
</script>

<style lang="scss" scoped>
.row-1 {
  height: 235px;

  & > .el-col {
    height: 100%;

    ::v-deep .el-card {
      height: 235px;
    }
  }
}

.content {
  display: flex;
  justify-content: space-evenly;

  .content-left {
    flex: 1;
    padding: 0 10px;
    font-size: 14px;
    border-right: 1px solid #ebeef5;

    .org-name {
      font-size: 16px;
      margin-bottom: 20px;
    }

    .address {
      margin-bottom: 8px;
      color: #818693;
    }

    .principal {
      margin-bottom: 23px;
      color: #818693;
    }

    .el-button {
      font-size: 14px;
      color: #e15536;
      width: 158px;
      height: 40px;
      background: #ffeeeb;
      border: 1px solid #f3917c;
      border-radius: 4px;

      &:hover {
        color: #fff;
        background: #ed7455;
      }
    }
  }

  .content-right {
    display: flex;
    flex: 1;
    flex-wrap: wrap;

    .data-box {
      height: 50%;
      flex: 50%;
      padding-left: 30px;

      .label {
        font-size: 14px;
        margin-bottom: 10px;
      }

      .num {
        font-size: 32px;
        font-weight: 700;
        color: #e15536;
        cursor: pointer;
      }
    }
  }
}

.el-divider--vertical {
  height: 100%;
}

.today-data-box {
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .label {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .num {
    font-size: 32px;
    font-weight: 700;
    margin: 10px 0 20px;
  }

  .bottom {
    font-size: 14px;
    color: #818693;
  }
}

.row-2 {
  height: 290px;
  margin-top: 20px;

  & > .el-col {
    height: 100%;

    ::v-deep .el-card {
      height: 290px;
    }
  }
}

.chartRow-1 {
  width: 100%;
  display: flex;
  height: 208px;
  flex-direction: column;

  .chartBox {
    height: 100%;
  }
}

.text-row {
  display: flex;
  font-weight: 700;

  & > div {
    cursor: pointer;
    text-align: center;
    flex: 25%;
  }
}

.title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 16px;
}

.row-3 {
  margin-top: 20px;
}

.common-func-row {
  display: flex;
  justify-content: space-between;
  .func-box {
    width: 15.15%;
    height: 116px;
    background: #fafafb;
    border-radius: 10px;
    cursor: pointer;
    .func-icon{
      display: block;
      width: 40px;
      margin: 20px auto 0;
    }
    .func-text {
      font-size: 16px;
      color: #20232a;
      font-weight: 700;
      text-align: center;
      margin: 1em 0;
    }

    &:hover .func-text {
      color: #e15536;
    }
  }
}
</style>
