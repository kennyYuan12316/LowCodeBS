<template>
  <el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'" :close-on-click-modal="false" :visible.sync="visible"
    class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right"
        :disabled="!!isDetail" :rules="rules">
        <el-col :span="24">
          <el-form-item label-width="0">
            <HSZ-Text value="区域信息"
              :textStyle='{"color":"#000000","text-align":"center","font-weight":"bold","font-style":"normal","text-decoration":"none","line-height":32,"font-size":32}'
              :style='{"width":"100%"}'></HSZ-Text>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="区域编号" prop="regionNo">
            <el-input v-model='dataForm.regionNo' placeholder='请输入' clearable required :style='{"width":"100%"}'>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="区域名称" prop="regionName">
            <el-input v-model='dataForm.regionName' placeholder='请输入' clearable required :style='{"width":"100%"}'>
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
            <el-radio-group v-model='dataForm.enabledMark' :style='{}'>
              <el-radio v-for="(item, index) in enabledMarkOptions" :key="index" :label="item.id">{{item.fullName}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible=false">取 消</el-button>
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
    var checkregionNo = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入区域编号'))
      } else {
        if (!this.dataForm.id) {
          request({
            url: `/api/wms/ZjnWmsRegion/ExistRegionNo`,
            method: 'GET',
            data: { regionNo: value }
          }).then(res => {
            if (res.data) {
              callback(new Error('区域编号已存在！'))
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
        regionNo: undefined,
        regionName: undefined,
        createUser: undefined,
        createTime: undefined,
        enabledMark: "1",
      },
      rules:
      {
        regionNo: [
          {
            required: true,
            trigger: 'blur',
            validator: checkregionNo
          }
        ],
        regionName: [
          {
            required: true,
            message: '请输入区域名称',
            trigger: 'blur'
          }
        ],
      },
      enabledMarkOptions: [{
        'fullName': "启用",
        'id': "1"
      }, {
        'fullName': "禁用",
        'id': "0"
      }],
    }
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    goBack() {
      this.$emit('refresh')
    },
    init(id, isDetail) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.isDetail = isDetail || false;
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields();
        if (this.dataForm.id) {
          request({
            url: '/api/wms/ZjnWmsRegion/' + this.dataForm.id,
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
              url: `/api/wms/ZjnWmsRegion`,
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
              url: '/api/wms/ZjnWmsRegion/' + this.dataForm.id,
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
