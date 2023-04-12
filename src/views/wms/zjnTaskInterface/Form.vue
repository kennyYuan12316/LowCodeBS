<template>
  <el-dialog :title="!dataForm.id ? '新建' : isDetail ? '详情':'编辑'" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="800px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" :disabled="!!isDetail" :rules="rules">
        <el-col :span="24">
          <el-form-item label-width="0">
            <HSZ-Text value="接口配置" :text-style="{&quot;color&quot;:&quot;#000000&quot;,&quot;text-align&quot;:&quot;center&quot;,&quot;font-weight&quot;:&quot;bold&quot;,&quot;font-style&quot;:&quot;normal&quot;,&quot;text-decoration&quot;:&quot;none&quot;,&quot;line-height&quot;:12,&quot;font-size&quot;:18}" :style="{&quot;width&quot;:&quot;100%&quot;}" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="接口名称" prop="nameInterface">
            <el-input v-model="dataForm.nameInterface" placeholder="请输入" clearable required :style="{&quot;width&quot;:&quot;100%&quot;}" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="中文" prop="cnInterface">
            <el-input v-model="dataForm.cnInterface" placeholder="请输入" clearable required :style="{&quot;width&quot;:&quot;100%&quot;}" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="入参" prop="enterParameter">
            <el-input v-model="dataForm.enterParameter" placeholder="请输入" required show-word-limit :style="{&quot;width&quot;:&quot;100%&quot;}" type="textarea" :autosize="{&quot;minRows&quot;:4,&quot;maxRows&quot;:10}" maxlength="2000" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="出参" prop="outParameter">
            <el-input v-model="dataForm.outParameter" placeholder="请输入" required show-word-limit :style="{&quot;width&quot;:&quot;100%&quot;}" type="textarea" :autosize="{&quot;minRows&quot;:4,&quot;maxRows&quot;:10}" maxlength="2000" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="通讯协议" prop="communication">
            <el-select v-model="dataForm.communication" placeholder="请选择" required :style="{&quot;width&quot;:&quot;100%&quot;}">
              <el-option v-for="(item, index) in communicationOptions" :key="index" :label="item.fullName" :value="item.fullName" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="说明" prop="introduction">
            <el-input v-model="dataForm.introduction" placeholder="请输入" required show-word-limit :style="{&quot;width&quot;:&quot;100%&quot;}" type="textarea" :autosize="{&quot;minRows&quot;:4,&quot;maxRows&quot;:4}" maxlength="100" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="接口提供者" prop="interfaceProvide">
            <el-input v-model="dataForm.interfaceProvide" placeholder="请输入" clearable required :style="{&quot;width&quot;:&quot;100%&quot;}" maxlength="22" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="开/关" prop="enabledMark">
            <el-switch v-model="dataForm.enabledMark" required :active-value="1" :inactive-value="0" />
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
      },
      rules: {
        nameInterface: [
          {
            required: true,
            message: '请输入接口名称',
            trigger: 'blur'
          }
        ],
        cnInterface: [
          {
            required: true,
            message: '请输入中文',
            trigger: 'blur'
          }
        ],
        enterParameter: [
          {
            required: true,
            message: '请输入入参',
            trigger: 'blur'
          }
        ],
        outParameter: [
          {
            required: true,
            message: '请输入出参',
            trigger: 'blur'
          }
        ],
        communication: [
          {
            required: true,
            message: '请输入通讯协议',
            trigger: 'change'
          }
        ],
        introduction: [
          {
            required: true,
            message: '请输入说明',
            trigger: 'blur'
          }
        ],
        interfaceProvide: [
          {
            required: true,
            message: '请输入接口提供者',
            trigger: 'blur'
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
      communicationOptions: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getcommunicationOptions()
  },
  mounted() {
  },
  methods: {
    getcommunicationOptions() {
      getDictionaryDataSelector('343645569845036293').then(res => {
        this.communicationOptions = res.data.list
      })
    },
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
      this.$store.commit('generator/UPDATE_RELATION_DATA', {})
    },
    dataFormSubmit() {
      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          if (!this.dataForm.id) {
            request({
              url: `/api/wms/ZjnTaskInterface`,
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
              url: '/api/wms/ZjnTaskInterface/' + this.dataForm.id,
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
