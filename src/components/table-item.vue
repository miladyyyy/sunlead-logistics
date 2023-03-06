<template>
  <div class="table-item" :class="{active:$parent.activeName===value}" @click="tabClick">
    {{ name }}
  </div>
</template>

<script>
export default {
  name: 'TableItem',
  props: {
    name: {
      type: String,
      default: ''
    },
    value: {
      type: Number,
      required: true
    }
  },

  methods: {
    tabClick () {
      this.$parent.tabClick(this.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.table-item {
  height: 100%;
  width: 120px;
  font-size: 14px;
  cursor: pointer;
  line-height: 48px;
  text-align: center;
}

.active {
  background-color: #ffeeeb;
  color: #e15536;
}
</style>
