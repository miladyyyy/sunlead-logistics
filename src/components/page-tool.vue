<template>
    <div>
        <el-card shadow="never">
            <el-row type="flex">
                <slot></slot>
            </el-row>
        </el-card>
    </div>
</template>
<script>
export default {
  name: 'PageTool'
}
</script>
<style lang="scss" scoped>
    .el-card {
        margin-bottom: 20px;
    }
</style>
