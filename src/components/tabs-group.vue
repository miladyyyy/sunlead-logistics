<template>
  <div class="tabs-group">
  <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'TabsGroup',
  props: {
    activeTab: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      activeName: this.activeTab
    }
  },
  methods: {
    tabClick (value) {
      this.$emit('tab-click', value)
    }
  },
  watch: {
    activeTab (val) {
      this.activeName = val
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs-group {
  display: flex;
  height: 48px;
  background: #fff;
}
</style>
