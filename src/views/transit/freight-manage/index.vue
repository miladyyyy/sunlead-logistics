<template>
  <div class="app-container">
    <el-dialog :visible="showDialog" @close="handleClose">
      <el-form ref="addForm" :model="addForm" label-width="130px" :rules="rules">
        <el-form-item label="模板类型" prop="templateType">
          <el-select v-model="addForm.templateType" @change="changetemplateType" placeholder="请选择">
            <el-option
              v-for="item in templateTypeMap"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="运送类型" prop="transportType">
          <el-select v-model="addForm.transportType" placeholder="请选择">
            <el-option
              v-for="item in transportTypeMap"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关联城市" prop="associatedCityList">
          <span v-if="addForm.templateType!==3">全国</span>
          <el-checkbox-group v-else v-model="addForm.associatedCityList">
            <el-checkbox
              v-for="item in associatedCityMap.slice(1)"
              :key="item.value"
              :label="item.value"
              >{{ item.label }}</el-checkbox
            ></el-checkbox-group>
          <!-- <el-select v-model="addForm.associatedCity" placeholder="请选择">
            <el-option
              v-for="item in associatedCityMap"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select> -->
        </el-form-item>
        <el-form-item label="首重" prop="firstWeight">
          <el-input v-model="addForm.firstWeight" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="续重" prop="continuousWeight">
          <el-input v-model="addForm.continuousWeight" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="轻抛系数" prop="lightThrowingCoefficient">
          <el-input v-model="addForm.lightThrowingCoefficient" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button  @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </template>
    </el-dialog>

    <el-card>
      <el-row>
        <el-button type="primary" @click="showDialog=true">新增模板</el-button>
      </el-row>
      <el-table :data="tempList" stripe>
        <el-table-column
          prop="templateType"
          label="模板名称"
          :formatter="templateTypeFormatter"
        />
        <el-table-column
          prop="transportType"
          label="运送类型"
          :formatter="transportTypeFormatter"
        />
        <el-table-column
          prop="associatedCityList"
          label="关联城市"
          :formatter="associatedCityFormatter"
        />
        <el-table-column prop="firstWeight" label="首重" />
        <el-table-column prop="continuousWeight" label="续重" />
        <el-table-column prop="lightThrowingCoefficient" label="轻抛系数" />
        <el-table-column fixed="right"  label="操作" >
          <template #default="{ row }">
            <el-link :underline="false" style="color:#419EFF" @click="handleEdit(row)">编辑</el-link>
            <el-divider direction="vertical" />
            <el-link :underline="false" type="danger" @click="handleDelete(row.id)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getAddTempAPI, addTempAPI, delTempAPI } from '@/api/freight-manage'

const templateTypeMap = [
  { label: '同城寄', value: 1 },
  { label: '省内寄', value: 2 },
  { label: '经济区互寄', value: 3 },
  { label: '跨省', value: 4 }
]

const transportTypeMap = [{ label: '普快', value: 1 }]

const associatedCityMap = [
  { label: '全国', value: 1 },
  { label: '京津冀', value: 2 },
  { label: '江浙沪', value: 3 },
  { label: '川渝', value: 4 },
  { label: '黑吉辽', value: 5 }
]

export default {
  name: 'freight-manage',
  data () {
    return {
      templateTypeMap,
      transportTypeMap,
      associatedCityMap,
      tempList: [],
      showDialog: false,
      addForm: {
        templateType: '',
        transportType: '',
        associatedCityList: ['1'],
        firstWeight: '',
        continuousWeight: '',
        lightThrowingCoefficient: ''
      },
      rules: {
        templateType: [{ required: true, message: '请选择模板名称', trigger: 'change' }],
        transportType: [
          { required: true, message: '请选择运送类型', trigger: 'change' }
        ],
        associatedCityList: [
          { required: true, message: '请选择关联城市', trigger: 'change' }
        ],
        firstWeight: [{ required: true, message: '请输入首重', trigger: 'blur' }],
        continuousWeight: [
          { required: true, message: '请输入续重', trigger: 'blur' }
        ],
        lightThrowingCoefficient: [
          { required: true, message: '请输入轻抛系数', trigger: 'blur' }
        ]
      }
    }
  },

  created () {
    this.getAddTemp()
  },

  methods: {
    getAddTemp () {
      getAddTempAPI().then(({ data: { data } }) => {
        this.tempList = data
      })
    },

    templateTypeFormatter (row, column, cellValue) {
      return templateTypeMap.find((item) => item.value === cellValue).label
    },

    transportTypeFormatter (row, column, cellValue) {
      return transportTypeMap.find((item) => item.value === cellValue).label
    },

    associatedCityFormatter (row, column, cellValue) {
      // ['1','2']==>['全国','京津冀']
      return cellValue.map((item) => {
        return associatedCityMap.find((i) => i.value === +item).label
      }).join(',')
    },

    handleClose () {
      this.$refs.addForm.resetFields()
      this.showDialog = false
      this.addForm = {
        templateType: '',
        transportType: '',
        associatedCityList: ['1'],
        firstWeight: '',
        continuousWeight: '',
        lightThrowingCoefficient: ''
      }
    },

    async handleConfirm () {
      await this.$refs.addForm.validate()
      if (this.addForm.id) {
        await addTempAPI(this.addForm)
        this.$message.success('修改成功')
      } else {
        await addTempAPI(this.addForm)
        this.$message.success('新增成功')
      }
      this.handleClose()
      this.getAddTemp()
    },

    changetemplateType (val) {
      if (val === 3) {
        this.addForm.associatedCityList = []
      } else {
        this.addForm.associatedCityList = [1]
      }
    },

    handleEdit (row) {
      this.showDialog = true
      this.addForm = {
        ...row,
        associatedCityList: row.associatedCityList.map((item) => +item)
      }
    },

    async handleDelete (id) {
      await delTempAPI(id)
      this.$message.success('删除成功')
      this.getAddTemp()
    }
  }
}
</script>
<style lang="scss" scoped></style>
