<template>
  <div>
    <el-card>
      <div class="card-header">
        <div class="title">
          {{ title }}
          <el-tooltip effect="light" placement="bottom-start" popper-class="tooltip">
            <template #content>
              <div class="todoTasks1">
                待取件率=待取件/（下单数量-取消数量），且取件类型=上门取件<br />
                待派送率=待派送/（待派送+派送中+已签收+拒收）<br />
                未分配率=未分配/全部数据<br />
                超时率=超时任务/（已完成+进行中+已取消）
              </div>
            </template>
            <img class="tip" src="@/icon/tip.png" alt="" />
          </el-tooltip>
        </div>
        <span>{{ currentTime }}</span>
      </div>
       <slot></slot>
    </el-card>
  </div>
</template>
<script>
import dayjs from 'dayjs'

export default {
  name: 'DashboardCard',
  props: {
    title: {
      type: String
    }
  },
  data () {
    return {
      currentTime: dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>
<style lang="scss" scoped>
.el-card {
  width: 100%;
}
.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  span {
    font-size: 14px;
    color: #818693;
    line-height: 100%;
    &::before {
      content: "";
      display: inline-block;
      width: 15px;
      height: 14px;
      background: no-repeat center/contain url(@/icon/refresh.png);
      margin-right: 8px;
      cursor: pointer;
    }
  }
}

.tip {
  height: 20px;
  margin-left: 6px;
  line-height: 1em;
}
.title {
  display: flex;
  font-weight: 700;
}

.todoTasks1{
  line-height: 28px;
  color: #818693;
  font-size: 14px;
  background-color: #fff;
}
</style>
