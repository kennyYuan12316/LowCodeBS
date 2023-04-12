<template>
  <el-dialog :title="!dataForm.id ? '新建' : isDetail ? '详情':'编辑'" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" :disabled="!!isDetail" :rules="rules">
        <el-col :span="24">
          <el-form-item label-width="0">
            <HSZ-Text value="仓库信息" :text-style="{'color':'#000000','text-align':'center','font-weight':'bold','font-style':'normal','text-decoration':'none','line-height':32,'font-size':32}" :style="{'width':'100%'}" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="仓库编号" prop="warehouseNo">
            <el-input v-model="dataForm.warehouseNo" placeholder="请输入" :disabled="!!dataForm.id" clearable required :style="{'width':'100%'}" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="仓库名称" prop="warehouseName">
            <el-input v-model="dataForm.warehouseName" placeholder="请输入" clearable required :style="{'width':'100%'}" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="区域编号" prop="regionNo">
            <el-select v-model="dataForm.regionNo" placeholder="请选择" clearable required :style="{'width':'100%'}">
              <el-option v-for="(item, index) in regionNoOptions" :key="index" :label="item.RegionName" :value="item.RegionNo" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="false" :span="24">
          <el-form-item label="创建者" prop="createUser">
            <el-input v-model="dataForm.createUser" placeholder="系统自动生成" readonly />
          </el-form-item>
        </el-col>
        <el-col v-if="false" :span="24">
          <el-form-item label="创建时间" prop="createTime">
            <el-input v-model="dataForm.createTime" placeholder="系统自动生成" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="有效标志" prop="enabledMark">
            <el-radio-group v-model="dataForm.enabledMark" required :style="{}">
              <el-radio v-for="(item, index) in enabledMarkOptions" :key="index" :label="item.id">{{ item.fullName }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible=false">取 消</el-button>
      <el-button v-if="!isDetail" type="primary" :loading="btnLoading" @click="dataFormSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import request from '@/utils/request'
export default {
  components: {},
  props: [],
  data() {
    var checkwarehouseNo = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入仓库编号'))
      } else {
        if (!this.dataForm.id) {
          request({
            url: `/api/wms/ZjnWmsWarehouse/ExistWarehouseNo`,
            method: 'GET',
            data: { WarehouseNo: value }
          }).then(res => {
            if (res.data) {
              callback(new Error('仓库编号已存在！'))
            } else {
              callback()
            }
          })
        } else {
          callback()
        }
      }
    }
    return {
      btnLoading: false,
      loading: false,
      visible: false,
      isDetail: false,
      dataForm: {
        id: '',
        warehouseNo: undefined,
        warehouseName: undefined,
        regionNo: undefined,
        createUser: undefined,
        createTime: undefined,
        enabledMark: '1'
      },
      rules: {
        warehouseNo: [
          {
            required: true,
            trigger: 'blur',
            validator: checkwarehouseNo
          }
        ],
        warehouseName: [
          {
            required: true,
            message: '请输入仓库名称',
            trigger: 'blur'
          }
        ],
        regionNo: [
          {
            required: true,
            message: '请输入区域编号',
            trigger: 'change'
          }
        ],
        enabledMark: [
          {
            required: true,
            message: '请输入有效标志',
            trigger: 'change'
          }
        ]
      },
      regionNoOptions: [],
      enabledMarkOptions: [{ 'fullName': '启用', 'id': '1' }, { 'fullName': '禁用', 'id': '0' }]
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    goBack() {
      this.$emit('refresh')
    },
    init(id, isDetail) {
      // 获取区域编号列表
      request({
        	url: '/api/wms/ZjnWmsRegion/GetListToBox',
        	method: 'get'
      }).then(res => {
        	this.regionNoOptions = res.data
        console.log(this.regionNoOptions)
      })

      this.dataForm.id = id || 0
      this.visible = true
      this.isDetail = isDetail || false
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (this.dataForm.id) {
          request({
            url: '/api/wms/ZjnWmsWarehouse/' + this.dataForm.id,
            method: 'get'
          }).then(res => {
            this.dataForm = res.data
          })
        }
      })
      this.$store.commit('generator/UPDATE_RELATION_DATA', {})
    },
    dataFormSubmit() {
      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          if (!this.dataForm.id) {
            request({
              url: `/api/wms/ZjnWmsWarehouse`,
              method: 'post',
              data: this.dataForm
            }).then((res) => {
              this.$message({
                message: res.msg,
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.btnLoading = false
                  this.visible = false,
                  this.$emit('refresh', true)
                }
              })
            })
          } else {
            request({
              url: '/api/wms/ZjnWmsWarehouse/' + this.dataForm.id,
              method: 'PUT',
              data: this.dataForm
            }).then((res) => {
              this.$message({
                message: res.msg,
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.btnLoading = false
                  this.visible = false
                  this.$emit('refresh', true)
                }
              })
            })
          }
        }
      })
    }
  }
}
</script>
