<template>
  <div>
    <el-card>
      <template #header>
        <el-row type="flex" justify="space-between">
          <span style="align-self: center">作业范围分配</span>
          <el-button type="primary">编辑</el-button>
        </el-row>
      </template>

      <el-row>
        地区关键词：<el-input style="width: 230px" v-model="keyword" placeholder="请输入地区关键词"/>
      </el-row>
      <el-alert
        v-if="polygonPath.length === 0"
        :title="`当前${$route.query.agencyName}下暂无作业范围`"
        type="warning"
        show-icon
        center
        :closable="false"
        style="margin-top: 10px" />
      <baidu-map class="bm-view" :center="center" :zoom="zoom">
        <bm-polygon :path="polygonPath" stroke-color="rgb(232, 85, 82)" :stroke-opacity="0.5" :stroke-weight="2"
                    :editing="true" strokeStyle="dashed"
                    @lineupdate="updatePolygonPath" fillColor="rgb(232, 85, 82)" :fillOpacity="0.3"/>
        <bm-local-search :auto-viewport="true" :keyword="keyword"></bm-local-search>
      </baidu-map>
    </el-card>
  </div>
</template>

<script>
import { getCourierScopeAPI } from '@/api/business-hall'

export default {
  name: 'MapContent',
  data () {
    return {
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
    this.getCourierScope(this.$route.query.id)
  },

  methods: {
    async getCourierScope (id) {
      const { data: { data } } = await getCourierScopeAPI(id)
      this.center = {
        longitude: data.lng,
        latitude: data.lat
      }
      this.polygonPath = data.polygon || []
    },

    updatePolygonPath (e) {
      this.polygonPath = e.target.getPath()
    }
  }
}
</script>

<style lang="scss" scoped>
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
