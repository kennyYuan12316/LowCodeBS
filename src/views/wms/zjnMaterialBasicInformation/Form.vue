<template>
  <transition name="el-zoom-in-center">
    <div class="HSZ-preview-main">
      <div class="HSZ-common-page-header">
        <el-page-header @back="goBack" :content="!dataForm.id ? '新建' : isDetail ? '详情' : '编辑'" />
        <div class="options">
          <el-button type="primary" @click="dataFormSubmit()" v-if="!isDetail" :loading="btnLoading">确 定</el-button>
          <el-button @click="goBack">取 消</el-button>
        </div>
      </div>
      <div :style="{margin: '0 auto',width:'100%'}">
        <el-row :gutter="15" class=" main">
          <el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right"
            :disabled="!!isDetail" :rules="rules">
            <el-col :span="24">
              <el-card class="mb-20" shadow="always">
                <div slot="header" class="clearfix">
                  <span>基础数据</span>
                </div>
                <el-col :span="8">
                  <el-form-item label="货物ID" prop="goodsId">
                    <el-input v-model='dataForm.goodsId' placeholder='请输入' clearable required :style='{"width":"100%"}'>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="货物编码" prop="goodsCode">
                    <el-input v-model='dataForm.goodsCode' placeholder='请输入' clearable required
                      :style='{"width":"100%"}'>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="货物名称" prop="goodsName">
                    <el-input v-model='dataForm.goodsName' placeholder='请输入' clearable required
                      :style='{"width":"100%"}'>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="货物单位" prop="unit">
                    <el-select v-model='dataForm.unit' placeholder='请选择' clearable required :style='{"width":"100%"}'>
                      <el-option v-for="(item, index) in unitOptions" :key="index" :label="item.fullName"
                        :value="item.enCode"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="货物类型" prop="goodstype">
                    <el-select v-model='dataForm.goodstype' placeholder='请选择' clearable required :style='{"width":"100%"}'>
                      <el-option v-for="(item, index) in goodstypeOptions" :key="index" :label="item.fullName"
                        :value="item.enCode"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="有效标志" prop="enabledMark">
                    <el-radio-group v-model='dataForm.enabledMark' required :style='{}'>
                      <el-radio v-for="(item, index) in enabledMarkOptions" :key="index" :label="item.id">
                        {{item.fullName}}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-card>
            </el-col>
            <el-col :span="24">
              <el-card class="mb-20" shadow="always">
                <div slot="header" class="clearfix">
                  <span>详细数据</span>
                </div>
                <!-- <el-col :span="8">
                  <el-form-item label="货物批次" prop="hsz_zjn_base_goods_details_hsz_batch">
                    <el-input v-model='dataForm.hsz_zjn_base_goods_details_hsz_batch' placeholder='请输入' clearable
                      :style='{"width":"100%"}'>
                    </el-input>
                  </el-form-item>
                </el-col> -->
                <el-col :span="8">
                  <el-form-item label="货物规格" prop="hsz_zjn_base_goods_details_hsz_specifications">
                    <el-input v-model='dataForm.hsz_zjn_base_goods_details_hsz_specifications' placeholder='请输入'
                      clearable :style='{"width":"100%"}'>
                    </el-input>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="8">
                  <el-form-item label="生产日期" prop="hsz_zjn_base_goods_details_hsz_goodsCreateData">
                    <el-date-picker v-model='dataForm.hsz_zjn_base_goods_details_hsz_goodsCreateData' placeholder='请选择'
                      clearable :style='{"width":"100%"}' type='date' format='yyyy-MM-dd' value-format='timestamp'>
                    </el-date-picker>
                  </el-form-item>
                </el-col> -->
                <el-col :span="8">
                  <el-form-item label="货物状态" prop="hsz_zjn_base_goods_details_hsz_goodsState">
                    <el-select v-model='dataForm.hsz_zjn_base_goods_details_hsz_goodsState' placeholder='请选择' clearable
                      :style='{"width":"100%"}'>
                      <el-option v-for="(item, index) in hsz_zjn_base_goods_details_hsz_goodsStateOptions" :key="index"
                        :label="item.fullName" :value="item.enCode"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="8">
                  <el-form-item label="检验日期" prop="hsz_zjn_base_goods_details_hsz_checkDate">
                    <el-date-picker v-model='dataForm.hsz_zjn_base_goods_details_hsz_checkDate' placeholder='请选择'
                      clearable :style='{"width":"100%"}' type='date' format='yyyy-MM-dd' value-format='timestamp'>
                    </el-date-picker>
                    </el-input>
                  </el-form-item>
                </el-col> -->
                <!-- <el-col :span="8">
                  <el-form-item label="货物等级" prop="hsz_zjn_base_goods_details_hsz_goodsGrade">
                    <el-select v-model='dataForm.hsz_zjn_base_goods_details_hsz_goodsGrade' placeholder='请选择' clearable
                      :style='{"width":"100%"}'>
                      <el-option v-for="(item, index) in hsz_zjn_base_goods_details_hsz_goodsGradeOptions" :key="index"
                        :label="item.fullName" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col> -->
                <!-- <el-col :span="8">
                  <el-form-item label="货位" prop="hsz_zjn_base_goods_details_hsz_goodsLocationNo">
                    <popupSelect v-model='dataForm.hsz_zjn_base_goods_details_hsz_goodsLocationNo'
                      field='hsz_zjn_base_goods_details_hsz_goodsLocationNo' placeholder='请选择' clearable
                      relationField='F_LocationNo'
                      :columnOptions='hsz_zjn_base_goods_details_hsz_goodsLocationNoOptions' hasPage :pageSize='20'
                      propsValue='F_LocationNo' interfaceId='326602051024848133' popupType='dialog' popupTitle='选择数据'
                      popupWidth='800px'>
                    </popupSelect>
                  </el-form-item>
                </el-col> -->
                <el-col :span="8">
                  <el-form-item label="客户" prop="hsz_zjn_base_goods_details_hsz_customerId">
                    <popupSelect v-model='dataForm.hsz_zjn_base_goods_details_hsz_customerId'
                      field='hsz_zjn_base_goods_details_hsz_customerId' placeholder='请选择' clearable
                      relationField='F_CustomerName' :columnOptions='hsz_zjn_base_goods_details_hsz_customerIdOptions'
                      hasPage :pageSize='20' propsValue='F_CustomerNo' interfaceId='326594899472286981' popupType='dialog'
                      popupTitle='选择数据' popupWidth='800px'>
                    </popupSelect>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="8">
                  <el-form-item label="托盘" prop="hsz_zjn_base_goods_details_hsz_palledNo">
                    <popupSelect v-model='dataForm.hsz_zjn_base_goods_details_hsz_palledNo'
                      field='hsz_zjn_base_goods_details_hsz_palledNo' placeholder='请选择' clearable
                      relationField='F_TrayName' :columnOptions='hsz_zjn_base_goods_details_hsz_palledNoOptions' hasPage
                      :pageSize='20' propsValue='F_TrayNo' interfaceId='326609369489736965' popupType='dialog'
                      popupTitle='选择数据' popupWidth='800px'>
                    </popupSelect>
                  </el-form-item>
                </el-col> -->
                <el-col :span="8">
                  <el-form-item label="供应商" prop="hsz_zjn_base_goods_details_hsz_vendorId">
                    <popupSelect v-model='dataForm.hsz_zjn_base_goods_details_hsz_vendorId'
                      field='hsz_zjn_base_goods_details_hsz_vendorId' placeholder='请选择' clearable
                      relationField='F_SupplierName' :columnOptions='hsz_zjn_base_goods_details_hsz_vendorIdOptions'
                      hasPage :pageSize='20' propsValue='F_SupplierNo' interfaceId='326610288549823749' popupType='dialog'
                      popupTitle='选择数据' popupWidth='800px'>
                    </popupSelect>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="检验类型" prop="hsz_zjn_base_goods_details_hsz_checkType">
                    <el-select v-model='dataForm.hsz_zjn_base_goods_details_hsz_checkType' placeholder='请选择' clearable
                      :style='{"width":"100%"}'>
                      <el-option v-for="(item, index) in hsz_zjn_base_goods_details_hsz_checkTypeOptions" :key="index"
                        :label="item.fullName" :value="item.enCode"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="有效标志" prop="hsz_zjn_base_goods_details_hsz_enabledMark">
                    <el-radio-group v-model='dataForm.hsz_zjn_base_goods_details_hsz_enabledMark' :style='{}'>
                      <el-radio v-for="(item, index) in hsz_zjn_base_goods_details_hsz_enabledMarkOptions" :key="index"
                        :label="item.id">{{item.fullName}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="货物描述" prop="hsz_zjn_base_goods_details_hsz_remarks">
                    <el-input v-model='dataForm.hsz_zjn_base_goods_details_hsz_remarks' placeholder='请输入'
                      show-word-limit :style='{"width":"100%"}' type='textarea' :autosize='{"minRows":4,"maxRows":4}'>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-card>
            </el-col>
          </el-form>
        </el-row>
      </div>
    </div>
  </transition>
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
      return {
        btnLoading: false,
        loading: false,
        visible: false,
        isDetail: false,
        dataForm: {
          id: '',
          goodsId: undefined,
          goodsCode: undefined,
          goodsName: undefined,
          unit: undefined,
          goodstype:undefined,
          trayNo: undefined,
          enabledMark: "1",
          parentId:undefined,
          hsz_zjn_base_goods_details_hsz_batch: undefined,
          hsz_zjn_base_goods_details_hsz_specifications: undefined,
          hsz_zjn_base_goods_details_hsz_goodsCreateData: undefined,
          hsz_zjn_base_goods_details_hsz_goodsState: undefined,
          hsz_zjn_base_goods_details_hsz_checkDate: undefined,
          hsz_zjn_base_goods_details_hsz_goodsGrade: undefined,
          hsz_zjn_base_goods_details_hsz_goodsLocationNo: undefined,
          hsz_zjn_base_goods_details_hsz_customerId: undefined,
          hsz_zjn_base_goods_details_hsz_palledNo: undefined,
          hsz_zjn_base_goods_details_hsz_vendorId: undefined,
          hsz_zjn_base_goods_details_hsz_checkType: undefined,
          hsz_zjn_base_goods_details_hsz_enabledMark: "1",
          hsz_zjn_base_goods_details_hsz_remarks: undefined,
        },
        rules: {
          goodsId: [{
            required: true,
            message: '请输入货物ID',
            trigger: 'blur'
          }, ],
          goodsCode: [{
            required: true,
            message: '请输入货物编码',
            trigger: 'blur'
          }, ],
          goodsName: [{
            required: true,
            message: '请输入货物名称',
            trigger: 'blur'
          }, ],
          unit: [{
            required: true,
            message: '请输入货物单位',
            trigger: 'change'
          }, ],
          goodstype: [{
            required: true,
            message: '请选择货物类型',
            trigger: 'change'
          }, ],
          enabledMark: [{
            required: true,
            message: '请输入有效标志',
            trigger: 'change'
          }, ],
        },
        unitOptions: [],
        goodstypeOptions:[],
        enabledMarkOptions: [{
          'fullName': "启用",
          'id': "1"
        }, {
          'fullName': "禁用",
          'id': "0"
        }],
        hsz_zjn_base_goods_details_hsz_goodsStateOptions: [],
        hsz_zjn_base_goods_details_hsz_goodsGradeOptions: [],
        hsz_zjn_base_goods_details_hsz_goodsLocationNoOptions: [{
          "value": "F_LocationNo",
          "label": "货位编码"
        }],
        hsz_zjn_base_goods_details_hsz_customerIdOptions: [{
          "value": "F_CustomerNo",
          "label": "客户编号"
        }, {
          "value": "F_CustomerName",
          "label": "客户名称"
        }],
        hsz_zjn_base_goods_details_hsz_palledNoOptions: [{
          "value": "F_TrayNo",
          "label": "托盘编号"
        }, {
          "value": "F_TrayName",
          "label": "托盘名称"
        }],
        hsz_zjn_base_goods_details_hsz_vendorIdOptions: [{
          "value": "F_SupplierNo",
          "label": "供应商编号"
        }, {
          "value": "F_SupplierName",
          "label": "供应商名称"
        }],
        hsz_zjn_base_goods_details_hsz_checkTypeOptions: [],
        hsz_zjn_base_goods_details_hsz_enabledMarkOptions: [{
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
    created() {
      this.getunitOptions();
      this.getgoodstypeOptions();
      this.gethsz_zjn_base_goods_details_hsz_goodsStateOptions();//货物状态的数据字典
      this.gethsz_zjn_base_goods_details_hsz_goodsGradeOptions();
      this.gethsz_zjn_base_goods_details_hsz_checkTypeOptions();
    },
    mounted() {},
    methods: {
      getunitOptions() {
        getDictionaryDataSelector('326384591566800133').then(res => {
          this.unitOptions = res.data.list
        });
      },
      getgoodstypeOptions() {
        getDictionaryDataSelector('325449144728552709').then(res => {
          this.goodstypeOptions = res.data.list
        });
      },
      gethsz_zjn_base_goods_details_hsz_goodsStateOptions() {
        getDictionaryDataSelector('326590282281780485').then(res => {
          this.hsz_zjn_base_goods_details_hsz_goodsStateOptions = res.data.list
        });
      },
      gethsz_zjn_base_goods_details_hsz_goodsGradeOptions() {
        getDictionaryDataSelector('326588657760732421').then(res => {
          this.hsz_zjn_base_goods_details_hsz_goodsGradeOptions = res.data.list
        });
      },
      gethsz_zjn_base_goods_details_hsz_checkTypeOptions() {
        getDictionaryDataSelector('325448312364729605').then(res => {
          this.hsz_zjn_base_goods_details_hsz_checkTypeOptions = res.data.list
        });
      },
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
              url: '/api/wms/ZjnBaseGoods/' + this.dataForm.id,
              method: 'get'
            }).then(res => {
              res.data.enabledMark = res.data.enabledMark.toString();
              let temp = res.data.hsz_zjn_base_goods_details_hsz_enabledMark;
              res.data.hsz_zjn_base_goods_details_hsz_enabledMark = temp == null ? "" :temp.toString();
              this.dataForm = res.data;
              console.log(this.dataForm);
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
                url: `/api/wms/ZjnBaseGoods`,
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
                url: '/api/wms/ZjnBaseGoods/' + this.dataForm.id,
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
