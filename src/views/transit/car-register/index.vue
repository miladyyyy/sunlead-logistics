<template>
  <div class="app-container">
    <PageTool>
      <el-form label-width="110px" ref="searchForm" :model="searchForm">
        <el-col :span="8">
          <el-form-item label="运输任务编号:" prop="transportTaskId">
            <el-input
              placeholder="请输入运输任务编号"
              v-model="searchForm.transportTaskId"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="起始地机构:" prop="startAgencyId">
            <TreeSelect
              v-model="searchForm.startAgencyId"
              :normalizer="normalizer"
              :options="treeData"
              placeholder="请选择起始地机构"
              :appendToBody="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="目的地机构:" prop="endAgencyId">
            <TreeSelect
              v-model="searchForm.endAgencyId"
              :normalizer="normalizer"
              :options="treeData"
              placeholder="请选择目的地机构"
              :appendToBody="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="回车时间:" prop="intoStorageTime">
            <el-date-picker
              v-model="searchForm.intoStorageTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              prefix-icon="el-icon-time"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
              >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车辆是否可用:" prop="isAvailable">
            <el-select v-model="searchForm.isAvailable" clearable style="width: 100%">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="可用" :value="true"></el-option>
              <el-option label="不可用" :value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="searchTruckReturnList"
            >搜索</el-button
          >
          <el-button @click="reset">重置</el-button>
        </el-col>
      </el-form>
    </PageTool>

    <el-card shadow="never" v-loading="loading">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="transportTaskId" label="运输任务编号" />
        <el-table-column prop="startAgencyName" label="起始地机构" />
        <el-table-column prop="endAgencyName" label="目的地机构" />
        <el-table-column prop="transportOrderNumber" label="运单数量" />
        <el-table-column prop="outStorageTime" label="出车时间" />
        <el-table-column prop="intoStorageTime" label="回车时间" />
        <el-table-column prop="licensePlate" label="车牌号码" />
        <el-table-column prop="isAvailable" label="车辆是否可用">
          <template #default="{ row }">
            {{ row.isAvailable ? "可用" : "不可用" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="110" fixed="right">
          <template #default="{row}">
            <el-link :underline="false" type="primary" style="color: #419eff" @click="$router.push({ path: 'car-register-info', query: { id: row.id }})"
              >查看</el-link
            >
          </template>
        </el-table-column>

        <template #empty>
          <div class="empty-box">
            <img class="empty-img" src="@/assets/img/icon-empty.png" alt="" />
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
import { getOrgTreeAPI } from "@/api/organization";
import { searchTruckReturnListAPI } from "@/api/truck-return-register";

// import the component
import TreeSelect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "car-register",
  components: { TreeSelect },
  data() {
    return {
      treeData: [],
      loading: false,
      searchForm: {
        transportTaskId: "", // 运输任务id
        startAgencyId: null, // 起始机构id
        endAgencyId: null, // 结束机构id
        intoStorageTime: null, // 回车时间
        isAvailable: "", // 车辆是否可用
      },

      tableData: [],

      pageParams: {
        page: 1,
        pageSize: 10,
      },
      total: 0,
    };
  },

  created() {
    this.getOrgTree();
    this.searchTruckReturnList();
  },

  methods: {
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },

    async getOrgTree() {
      const { data } = await getOrgTreeAPI();
      console.log(JSON.parse(data.data));
      this.treeData = JSON.parse(data.data);
    },

    async searchTruckReturnList() {
      this.loading = true;

      try {
        const payload = {
          ...this.pageParams,
          ...this.searchForm,
        };
        payload.intoStorageStartTime = payload?.intoStorageTime?.[0];
        payload.intoStorageEndTime = payload?.intoStorageTime?.[1];
        delete payload.intoStorageTime;

        for (const key in payload) {
          if (["", null, undefined].includes(payload[key])) delete payload[key];
        }

        const {
          data: {
            data: { counts, items },
          },
        } = await searchTruckReturnListAPI(payload);
        this.loading = false;
        this.tableData = items;
        // console.log(items)
        this.total = +counts;
      } catch (error) {
        console.error(error);
        this.loading = false;
      }
    },

    handleSizeChange(newSize) {
      this.pageParams.pageSize = newSize;
      this.searchTruckReturnList();
    },

    handleCurrentChange(newPage) {
      this.pageParams.page = newPage;
      this.searchTruckReturnList();
    },

    reset() {
      this.$refs.searchForm.resetFields();
      this.searchTruckReturnList();
    },
  },
};
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

.el-date-editor {
  width: 100%;
}
</style>
