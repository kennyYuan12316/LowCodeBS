<template>
  <el-dialog title="详情" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right">
        <el-col :span="24">
          <el-form-item label="接口名" label-width="100px">
            <p>{{ dataForm.interfaceName }}</p>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="调用完整地址" label-width="100px">
            <p>{{ dataForm.address }}</p>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="入参" label-width="100px">
            <p>{{ dataForm.enterParameter }}</p>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="出参" label-width="100px">
            <p>{{ dataForm.outParameter }}</p>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="消息" label-width="100px">
            <p>{{ dataForm.msg }}</p>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="调用时间" label-width="100px">
            <p>{{ dataForm.createTime }}</p>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible=false">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import request from '@/utils/request'
export default {
  props: [],
  data() {
    return {
      loading: false,
      visible: false,
      dataForm: {
        id: '',
        interfaceName: undefined,
        address: undefined,
        enterParameter: undefined,
        outParameter: undefined,
        msg: undefined,
        createTime: undefined
      }
    }
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
    }
  }
}
</script>
