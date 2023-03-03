<template>
    <div>
       <el-tree
        :data="treeData"
        :props="defaultProps"
        @node-click="handleNodeClick"
        node-key="id"
        :current-node-key="defaultKey"
        :default-expanded-keys="[defaultKey]"
        :highlight-current="true"
        :expand-on-click-node="false"
      >
      </el-tree>
    </div>
</template>
<script>
import { getOrgTreeAPI } from '@/api/business-hall'

export default {
  name: 'AreasTree',
  props: {
    scope: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      treeData: [],
      defaultProps: { label: 'name' },
      defaultKey: '1024985129287809409'
    }
  },
  created () {
    this.getOrgTree()
  },
  methods: {
    async getOrgTree () {
      const { data } = await getOrgTreeAPI()
      // console.log(JSON.parse(data.data))
      this.treeData = JSON.parse(data.data)
    },

    handleNodeClick (data) {
    //   this.getOrgDetail(data.id)
    //   this.getEmployeeList()
      if (this.scope) {
        this.$emit('changeNode', data.id)
      } else {
        this.$emit('getOrgDetail', data.id)
        this.$emit('getEmployeeList')
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
