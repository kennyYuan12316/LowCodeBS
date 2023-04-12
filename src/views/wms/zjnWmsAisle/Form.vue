<template>
  <el-dialog :title="!dataForm.id ? '新建' : isDetail ? '详情' : '编辑'" :close-on-click-modal="false" :visible.sync="visible"
    class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right"
        :disabled="!!isDetail" :rules="rules">
        <el-col :span="24">
          <el-form-item label-width="0">
            <HSZ-Text value="巷道信息"
              :textStyle='{ "color": "#000000", "text-align": "center", "font-weight": "bold", "font-style": "normal", "text-decoration": "none", "line-height": 32, "font-size": 32 }'
              :style='{ "width": "100%" }'></HSZ-Text>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="巷道编号" prop="aisleNo">
            <el-input v-model='dataForm.aisleNo' placeholder='请输入' clearable required :style='{ "width": "100%" }'>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="巷道名称" prop="aisleName">
            <el-input v-model='dataForm.aisleName' placeholder='请输入' clearable required :style='{ "width": "100%" }'>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="区域编号" prop="regionNo">
            <popupSelect v-model='dataForm.regionNo' field='regionNo' placeholder='请选择' clearable
              relationField='F_RegionNo' :columnOptions='regionNoOptions' hasPage :pageSize='20' propsValue='F_RegionNo'
              interfaceId='343278840488920325' popupType='dialog' popupTitle='选择数据' popupWidth='800px'>
            </popupSelect>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="仓库名称" prop="warehouseNo">
            <popupSelect v-model='dataForm.warehouseNo' field='warehouseNo' placeholder='请选择' clearable
              relationField='F_WarehouseName' :columnOptions='billWarehouseOptions' :pageSize='20'
              propsValue='F_WarehouseNo' interfaceId='327591530430727429' popupType='dialog' popupTitle='选择数据'
              popupWidth='800px'>
            </popupSelect>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="堆垛机编号" prop="stackerNo">
            <popupSelect v-model='dataForm.stackerNo' field='stackerNo' placeholder='请选择' clearable
              relationField='F_RegionNo' :columnOptions='TheTraycustomerIdOptions' hasPage :pageSize='20'
              propsValue='F_RegionNo' interfaceId='343284180026656005' popupType='dialog' popupTitle='选择数据'
              popupWidth='800px'>
            </popupSelect>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="堆垛机作业模式" prop="stackerWorkType">
            <el-select v-model="dataForm.stackerWorkType" placeholder="请选择" clearable required
              @change="setStackerWorkNo" :style="{ 'width': '100%' }">
              <el-option v-for="(item, index) in stackerWorkTypeOptions" :key="index" :label="item.fullName"
                :value="item.enCode" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="堆垛机当前作业" prop="stackerWorkNo">
            <el-input v-model='dataForm.stackerWorkNo' placeholder='系统自动生成' readonly>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24" v-if='false'>
          <el-form-item label="创建者" prop="createUser">
            <el-input v-model='dataForm.createUser' placeholder='系统自动生成' readonly>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if='false'>
          <el-form-item label="创建时间" prop="createTime">
            <el-input v-model='dataForm.createTime' placeholder='系统自动生成' readonly>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="有效标志" prop="enabledMark">
            <el-radio-group v-model='dataForm.enabledMark' required :style='{}'>
              <el-radio v-for="(item, index) in enabledMarkOptions" :key="index" :label="item.id">
                {{ item.fullName }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" v-if="!isDetail" :loading="btnLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import request from '@/utils/request'
import {
  getDictionaryDataSelector
} from '@/api/systemData/dictionary'
import {
  getDataInterfaceRes
} from '@/api/systemData/dataInterface'
export default {
  components: {},
  props: [],
  data() {
    var checkaisleNo = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入巷道编号'))
      } else {
        if (!this.dataForm.id) {
          request({
            url: `/api/wms/ZjnWmsAisle/ExistAisleNo`,
            method: 'GET',
            data: { AisleNo: value }
          }).then((res) => {
            if (res.data) {
              callback(new Error('巷道编号已存在！'))
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
        aisleNo: undefined,
        aisleName: undefined,
        regionNo: undefined,
        warehouseNo: undefined,
        stackerNo: undefined,
        createUser: undefined,
        createTime: undefined,
        stackerWorkType: undefined,
        stackerWorkNo: undefined,
        enabledMark: "0",
      },
      rules: {
        aisleNo: [{
          required: true,
          trigger: 'blur',
          validator: checkaisleNo
        },],
        aisleName: [{
          required: true,
          message: '请输入巷道名称',
          trigger: 'blur'
        },],
        regionNo: [{
          required: true,
          message: '请输入区域编号',
          trigger: 'change'
        },],
        warehouseNo: [{
          required: true,
          message: '请输入仓库编号',
          trigger: 'change'
        },],
        stackerNo: [{
          required: true,
          message: '请输入堆垛机编号',
          trigger: 'change'
        },],
        stackerWorkType: [{
          required: true,
          message: '请输入堆垛机作业模式',
          trigger: 'change'
        },],
        enabledMark: [{
          required: true,
          message: '请输入有效标志',
          trigger: 'change'
        },],
      },
      TheTraycustomerIdOptions: [{
        "value": "F_RegionNo",
        "label": "编号"
      }, {
        "value": "F_RegionName",
        "label": "名称"

      }],
      billWarehouseOptions: [{
        "value": "F_WarehouseNo",
        "label": "仓库编号"
      }, {
        "value": "F_WarehouseName",
        "label": "仓库名称"
      }, {
        "value": "F_RegionNo",
        "label": "区域编号"
      }, {
        "value": "F_RegionName",
        "label": "区域名称"
      }],
      regionNoOptions: [{
        "value": "F_RegionNo",
        "label": "编号"
      }, {
        "value": "F_RegionName",
        "label": "名称"
      }],
      enabledMarkOptions: [{
        'fullName': "禁用",
        'id': "0"
      }, {
        'fullName': "启用",
        'id': "1"
      }],
      stackerWorkTypeOptions: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getworktypeOptions();
  },
  mounted() { },
  methods: {
    getworktypeOptions() {
      getDictionaryDataSelector('348706141745710341').then(res => {
        this.stackerWorkTypeOptions = res.data.list
      });
    },
    goBack() {
      this.$emit('refresh')
    },
    setStackerWorkNo(value) {
      var option = this.stackerWorkTypeOptions.find(f => f.enCode == value);
      var match = option.fullName.match(/\d+/);
      this.dataForm.stackerWorkNo = match[0];
    },
    init(id, isDetail) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.isDetail = isDetail || false;
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields();
        if (this.dataForm.id) {
          request({
            url: '/api/wms/ZjnWmsAisle/' + this.dataForm.id,
            method: 'get'
          }).then(res => {
            this.dataForm = res.data;
          })
        }
      });
      this.$store.commit('generator/UPDATE_RELATION_DATA', {})
    },
    dataFormSubmit() {
      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          if (!this.dataForm.id) {
            request({
              url: `/api/wms/ZjnWmsAisle`,
              method: 'post',
              data: this.dataForm,
            }).then((res) => {
              this.$message({
                message: res.msg,
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.btnLoading = false;
                  this.visible = false,
                    this.$emit('refresh', true)
                }
              })
            })
          } else {
            request({
              url: '/api/wms/ZjnWmsAisle/' + this.dataForm.id,
              method: 'PUT',
              data: this.dataForm
            }).then((res) => {
              this.$message({
                message: res.msg,
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.btnLoading = false;
                  this.visible = false
                  this.$emit('refresh', true)
                }
              })
            })
          }
        }
      })
    },
  }
}
</script>
