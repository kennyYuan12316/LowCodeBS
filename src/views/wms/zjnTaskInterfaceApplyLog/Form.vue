<template>
  <el-dialog :title="!dataForm.id ? '新建' : isDetail ? '详情':'编辑'" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" :disabled="!!isDetail" :rules="rules">
        <el-col :span="24">
          <el-form-item label="接口名" prop="interfaceName">
            <el-input v-model="dataForm.interfaceName" placeholder="请输入" clearable :style="{&quot;width&quot;:&quot;100%&quot;}" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="调用完整地址" prop="address">
            <el-input v-model="dataForm.address" placeholder="请输入" clearable :style="{&quot;width&quot;:&quot;100%&quot;}" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="入参" prop="enterParameter">
            <el-input v-model="dataForm.enterParameter" placeholder="请输入" clearable :style="{&quot;width&quot;:&quot;100%&quot;}" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="出参" prop="outParameter">
            <el-input v-model="dataForm.outParameter" placeholder="请输入" clearable :style="{&quot;width&quot;:&quot;100%&quot;}" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="消息" prop="msg">
            <el-input v-model="dataForm.msg" placeholder="请输入" clearable :style="{&quot;width&quot;:&quot;100%&quot;}" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="调用时间" prop="createTime">
            <el-input v-model="dataForm.createTime" placeholder="系统自动生成" readonly />
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
import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
export default {
  components: {},
  props: [],
  data() {
    return {
      btnLoading: false,
      loading: false,
      visible: false,
      isDetail: false,
      dataForm: {
        id: '',
        interfaceName: undefined,
        address: undefined,
        enterParameter: undefined,
        outParameter: undefined,
        msg: undefined,
        createTime: undefined
      },
      rules: {
      }
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
      this.dataForm.id = id || 0
      this.visible = true
      this.isDetail = isDetail || false
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (this.dataForm.id) {
          request({
            url: '/api/wms/ZjnTaskInterfaceApplyLog/' + this.dataForm.id,
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
              url: `/api/wms/ZjnTaskInterfaceApplyLog`,
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
              url: '/api/wms/ZjnTaskInterfaceApplyLog/' + this.dataForm.id,
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
