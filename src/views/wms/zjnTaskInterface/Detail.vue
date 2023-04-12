<template>
  <el-dialog title="详情" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="800px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right">
        <el-col :span="24">
          <el-form-item label-width="100px">
            <HSZ-Text value="接口配置" :text-style="{&quot;color&quot;:&quot;#000000&quot;,&quot;text-align&quot;:&quot;center&quot;,&quot;font-weight&quot;:&quot;bold&quot;,&quot;font-style&quot;:&quot;normal&quot;,&quot;text-decoration&quot;:&quot;none&quot;,&quot;line-height&quot;:12,&quot;font-size&quot;:18}" :style="{&quot;width&quot;:&quot;100%&quot;}" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="接口名称" label-width="100px">
            <p>{{ dataForm.nameInterface }}</p>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="中文" label-width="100px">
            <p>{{ dataForm.cnInterface }}</p>
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
          <el-form-item label="通讯协议" label-width="100px">
            <p>{{ dataForm.communication }}</p>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="说明" label-width="100px">
            <p>{{ dataForm.introduction }}</p>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="接口提供者" label-width="100px">
            <p>{{ dataForm.interfaceProvide }}</p>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="有效标志" label-width="100px">
            <p>{{ dataForm.enabledMark }}</p>
          </el-form-item>
        </el-col>
        <el-col v-if="false" :span="24">
          <el-form-item label="创建者" label-width="100px">
            <p>{{ dataForm.createUser }}</p>
          </el-form-item>
        </el-col>
        <el-col v-if="false" :span="24">
          <el-form-item label="创建时间" label-width="100px">
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
        nameInterface: undefined,
        cnInterface: undefined,
        enterParameter: undefined,
        outParameter: undefined,
        communication: '1',
        introduction: undefined,
        interfaceProvide: undefined,
        enabledMark: 1,
        createUser: undefined,
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
            url: '/api/wms/ZjnTaskInterface/' + this.dataForm.id,
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
