<template>
  <div class="app-container">
    <div class="left-side">
      <AreasTree scope @changeNode="changeNode"/>
    </div>

    <div class="right-side">
      <el-card>
        <template #header>
          <div class="card-header">
            <span class="title">作业范围</span>
            <div v-if="!isEdit">
              <el-button type="primary" @click="isEdit=true">编辑</el-button>
            </div>
            <div v-if="isEdit">
              <el-button type="primary" @click="submit">提交</el-button>
              <el-button @click="cancel">取消</el-button>
            </div>
          </div>
        </template>
        <el-row>
          地区关键词：<el-input style="width: 230px" v-model="keyword" placeholder="请输入地区关键词"/>
        </el-row>
        <el-row v-if="isEdit" style="margin-top: 20px">
          <el-button type="primary" @click="isDraw=!isDraw">{{ isDraw ? '完成绘制' : '开始绘制'}}</el-button>
          <el-button v-if="isDraw">删除围栏</el-button>
        </el-row>
        <baidu-map class="bm-view" :center="center" :zoom="zoom">
          <bm-polygon :path="polygonPath" stroke-color="rgb(232, 85, 82)" :stroke-opacity="0.5" :stroke-weight="2"
                      :editing="isDraw" strokeStyle="dashed"
                      @lineupdate="updatePolygonPath" fillColor="rgb(232, 85, 82)" :fillOpacity="0.3"/>
          <bm-local-search :auto-viewport="true" :keyword="keyword"></bm-local-search>
        </baidu-map>
      </el-card>
    </div>
  </div>
</template>
<script>
import AreasTree from '@/components/areas-tree.vue'
import { getScopeAPI, updateScopeAPI } from '@/api/business-hall'

export default {
  components: { AreasTree },
  name: 'institutions-jobs-area',
  data () {
    return {
      isEdit: false,
      isDraw: false,
      currentId: '1024985129287809409',
      center: {
        lng: 116.404,
        lat: 39.915
      },
      zoom: 10,
      polygonPath: [
        {
          lng: 116.412732,
          lat: 39.911707
        },
        {
          lng: 116.39455,
          lat: 39.910932
        },
        {
          lng: 116.403461,
          lat: 39.921336
        }
      ],
      keyword: '' // 搜索关键词
    }
  },

  created () {
    this.getScope(this.currentId)
  },

  methods: {
    async submit () {
      await updateScopeAPI({
        bid: this.currentId,
        type: 1,
        polygon: this.polygonPath.map(item => {
          return {
            longitude: item.lng,
            latitude: item.lat
          }
        })
      })
      this.isEdit = false
    },
    cancel () {
      this.isEdit = false
    },

    async changeNode (id) {
      // console.log(id)
      await this.getScope(id)
      this.currentId = id
    },

    async getScope (id) {
      const { data: { data } } = await getScopeAPI(id)
      this.center = {
        lng: data.longitude,
        lat: data.latitude
      }
      this.polygonPath = data.polygon.map(item => {
        return {
          lng: item.longitude,
          lat: item.latitude
        }
      })
    },

    updatePolygonPath (e) {
      this.polygonPath = e.target.getPath()
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
    flex: auto;
  }
}

::v-deep .el-card__header {
  background-color: #fafafa;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-weight: 700;
      color: #2a2929;
    }
  }
}

.bm-view {
  width: 100%;
  height: 800px;
  padding: 22px 0;
}

::v-deep .BMap_vectex_node, ::v-deep .BMap_vectex_nodeT {
  background-image: none;
  width: 6px;
  height: 6px;
  background-color: red;
  border-radius: 50%;
  text-align: center;
}
</style>
