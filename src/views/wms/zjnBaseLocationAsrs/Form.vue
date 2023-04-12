<template>
  <el-dialog :title="!dataForm.id ? '新建' : isDetail ? '详情':'编辑'" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" :disabled="!!isDetail" :rules="rules">
        <el-col :span="24">
          <el-form-item label-width="0">
            <HSZ-Text value="立体库货位信息" :text-style="{&quot;color&quot;:&quot;#000000&quot;,&quot;text-align&quot;:&quot;center&quot;,&quot;font-weight&quot;:&quot;bold&quot;,&quot;font-style&quot;:&quot;normal&quot;,&quot;text-decoration&quot;:&quot;none&quot;,&quot;line-height&quot;:32,&quot;font-size&quot;:20}" :style="{&quot;width&quot;:&quot;100%&quot;}" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="货位编号" prop="locationNo">
            <el-input v-model="dataForm.locationNo" placeholder="请输入" clearable required :style="{&quot;width&quot;:&quot;100%&quot;}" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="货位类型" prop="type">
            <el-select v-model="dataForm.type" placeholder="请选择" clearable required
              :style="{ width: '100%' }">
              <el-option v-for="(item, index) in locationTypeOptions" :key="index" :label="item.fullName"
                :value="item.enCode" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="区域类型" prop="legion">
            <el-select
              v-model="dataForm.legion"
              placeholder="请选择"
              clearable
              required
              :style="{ width: '100%' }"
            >
              <el-option
                v-for="(item, index) in regionOptions"
                :key="index"
                :label="item.fullName"
                :value="item.enCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="仓库编号" prop="byWarehouse">
            <el-input v-model="dataForm.byWarehouse" placeholder="请输入" clearable :style="{&quot;width&quot;:&quot;100%&quot;}" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="设备编号" prop="deviceNo">
            <el-input v-model="dataForm.deviceNo" placeholder="请输入" clearable :style="{&quot;width&quot;:&quot;100%&quot;}" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="行" prop="row">
            <el-input-number v-model="dataForm.row" placeholder="数字文本" required :step="1" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="列" prop="cell">
            <el-input-number v-model="dataForm.cell" placeholder="数字文本" required :step="1" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="层" prop="layer">
            <el-input-number v-model="dataForm.layer" placeholder="数字文本" required :step="1" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="深" prop="depth">
            <el-input-number v-model="dataForm.depth" placeholder="数字文本" :step="1" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="托盘号" prop="trayNo">
            <popupSelect v-model='dataForm.trayNo' field='trayNo' placeholder='请选择' clearable relationField='trayNo'
              :columnOptions='TheTraycustomerIdOptions' hasPage :pageSize='20' propsValue='trayNo'
              interfaceId='333024238111819013' popupType='dialog' popupTitle='选择数据' popupWidth='800px'>
            </popupSelect>
          </el-form-item>
        </el-col>
        
        <el-col :span="24">
          <el-form-item label="上次货位状态" prop="lastStatus">
            <el-input v-model="dataForm.lastStatus" placeholder="请输入" clearable :style="{&quot;width&quot;:&quot;100%&quot;}" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="货位状态" prop="locationStatus">
            <el-select v-model="dataForm.locationStatus" placeholder="请选择" clearable required
              :style="{ width: '100%' }">
              <el-option v-for="(item, index) in locationStatusOptions" :key="index" :label="item.fullName"
                :value="item.enCode" />
            </el-select>
          </el-form-item>
        </el-col>
        
        <el-col :span="24">
          <el-form-item label="有效标志" prop="enabledMark">
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
      regionOptions:[],
      dataForm: {
        id: '',
        type:undefined,
        locationNo: undefined,
        byWarehouse: undefined,
        deviceNo: undefined,
        row: undefined,
        cell: undefined,
        layer: undefined,
        depth: undefined,
        trayNo: undefined,
        lastStatus: undefined,
        locationStatus: undefined,
        enabledMark: 0,
        createUser: undefined,
        createTime: undefined
      },
      rules: {
        
        locationNo: [
          {
            required: true,
            message: '请输入货位编号',
            trigger: 'blur'
          }
        ],
        row: [
          {
            required: true,
            message: '请输入行',
            trigger: ['blur', 'change']
          }
        ],
        cell: [
          {
            required: true,
            message: '请输入列',
            trigger: ['blur', 'change']
          }
        ],
        layer: [
          {
            required: true,
            message: '请输入层',
            trigger: ['blur', 'change']
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
      locationTypeOptions:[],
      locationStatusOptions: [], // 列表
        TheTraycustomerIdOptions: [{
        "value": "TheTray",
        "label": "托盘号"
      }, {
        "value": "TypeName",
        "label": "类型"
      }, {
        "value": "StateName",
        "label": "状态"
      }],
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getproductstypeOptions();
    this.getproductstypeOptionstype();
    this.getregionOptions();
  },
  mounted() {
  },
  methods: {
    getregionOptions() {
      getDictionaryDataSelector("343037780953138437").then((res) => {
        this.regionOptions = res.data.list;
      });
    },
    getproductstypeOptions() {
        getDictionaryDataSelector('343195269594088709').then(res => {
          this.locationStatusOptions = res.data.list
        });
      },
      getproductstypeOptionstype() {
        getDictionaryDataSelector('344618366226400517').then(res => {
          this.locationTypeOptions = res.data.list
        });
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
            url: '/api/wms/ZjnBaseLocationAsrs/' + this.dataForm.id,
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
              url: `/api/wms/ZjnBaseLocationAsrs`,
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
              url: '/api/wms/ZjnBaseLocationAsrs/' + this.dataForm.id,
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
