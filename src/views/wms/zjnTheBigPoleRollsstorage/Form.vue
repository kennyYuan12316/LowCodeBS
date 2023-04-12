<template>
  <transition name="el-zoom-in-center">
    <div class="HSZ-preview-main">
      <div class="HSZ-common-page-header">
        <el-page-header @back="goBack" :content="!dataForm.id ? '入库' : isDetail ? '详情' : '编辑'" />
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
                  <span>出库数据</span>
                </div>         
                
                <el-col :span="8">
                    <el-form-item label="物料名称" prop="productsName">
                      <popupSelect v-model='dataForm.productsName' field='productsName' placeholder='请选择' clearable
                        relationField='F_ProductsName' :columnOptions='billWarehouseOptions' :pageSize='20'
                        propsValue='F_ProductsName' interfaceId='331237828224615685' popupType='dialog' popupTitle='选择数据'
                        popupWidth='800px' @change="productsNoChcek">
                      </popupSelect>
                    </el-form-item>
                  </el-col>
                <el-col :span="8">
                  <el-form-item label="物料Id" prop="productsNo">
                    <el-input v-model='dataForm.productsNo' placeholder='请输入' clearable required disabled
                      :style='{"width":"100%"}'>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="出库数量" prop="TheDelivery">
                    <el-input v-model='dataForm.TheDelivery' placeholder='请输入' clearable required
                      :style='{"width":"100%"}'>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="流水号" prop="orderNo">
                    <el-input v-model='dataForm.orderNo' placeholder='请输入' clearable required :style='{"width":"100%"}' disabled >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="物料类型" prop="productsType">
                    <el-select v-model='dataForm.productsType' placeholder='' clearable required disabled
                        :style='{"width":"100%"}'>
                        <el-option v-for="(item, index) in productstypeOptions" :key="index" :label="item.fullName"
                          :value="item.enCode"></el-option>
                      </el-select>
                  </el-form-item>
                </el-col>
                 <el-col :span="8">
                  <el-form-item label="物料规格" prop="productsStyle">
                    <el-input v-model='dataForm.productsStyle' placeholder='请输入' clearable required disabled
                      :style='{"width":"100%"}'>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="当前数量" prop="productsTotal">
                    <el-input v-model='dataForm.productsTotal' placeholder='请输入' clearable required disabled
                      :style='{"width":"100%"}'>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="物料单位" prop="productsUnit">
                    <el-select v-model='dataForm.productsUnit' placeholder='' clearable required disabled
                        :style='{"width":"100%"}'>
                        <el-option v-for="(item, index) in productsUnitdesc" :key="index" :label="item.fullName"
                          :value="item.enCode"></el-option>
                      </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="物料等级" prop="productsGrade">
                    <el-select v-model='dataForm.productsGrade' placeholder='' clearable required disabled
                        :style='{"width":"100%"}'>
                        <el-option v-for="(item, index) in GradeOptions" :key="index" :label="item.fullName"
                          :value="item.enCode"></el-option>
                      </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="物料批次" prop="productsBach">
                    <el-input v-model='dataForm.productsBach' placeholder='请输入' clearable required disabled
                      :style='{"width":"100%"}'>
                    </el-input>
                  </el-form-item>
                </el-col>                
                <el-col :span="8">
                  <el-form-item label="客户" prop="productsUser">
                    <popupSelect v-model='dataForm.productsUser' disabled
                      field='productsUser' placeholder='请选择' clearable
                      relationField='F_CustomerName' :columnOptions='hsz_zjn_base_goods_details_hsz_customerIdOptions'
                      hasPage :pageSize='20' propsValue='F_CustomerNo' interfaceId='326594899472286981' popupType='dialog'
                      popupTitle='选择数据' popupWidth='800px'>
                    </popupSelect>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="供应商" prop="productsSupplier">
                    <popupSelect v-model='dataForm.productsSupplier' disabled
                      field='hsz_zjn_base_goods_details_hsz_vendorId' placeholder='请选择' clearable
                      relationField='F_SupplierName' :columnOptions='hsz_zjn_base_goods_details_hsz_vendorIdOptions'
                      hasPage :pageSize='20' propsValue='F_SupplierNo' interfaceId='326610288549823749' popupType='dialog'
                      popupTitle='选择数据' popupWidth='800px'>
                    </popupSelect>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="物料货位" prop="productsLocation">
                    <el-input v-model='dataForm.productsLocation' placeholder='请输入' clearable required disabled
                      :style='{"width":"100%"}'>
                    </el-input>
                  </el-form-item>
                </el-col>
                
                <el-col :span="8">
                  <el-form-item label="托盘号" prop="case3">
                    <el-input v-model='dataForm.case3' placeholder='请输入' clearable required disabled
                      :style='{"width":"100%"}'>
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
          TheDelivery: undefined,         
          productsNo:undefined,
          orderNo: undefined,
          orderType: undefined,
          productsNo: undefined,
          productsName: undefined,
          productsType:undefined,
          productsStyle: undefined,
          productsTotal:undefined,
          productsUnit:undefined,
          productsGrade:undefined,
          productsBach:undefined,
          productsLocation:undefined,
          productsSupplier:undefined,
          case3:undefined,
          hsz_zjn_base_goods_details_hsz_enabledMark: "1",
         
        },
        rules: {
          TheDelivery: [{
            required: true,
            message: '请输入出库数量',
            trigger: 'blur'
          }, ],         
             
        },
        unitOptions: [],
        productsUnitdesc:[],
        goodstypeOptions:[],
        productstypeOptions:[],
        GradeOptions:[],
        enabledMarkOptions: [{
          'fullName': "启用",
          'id': "1"
        }, {
          'fullName': "禁用",
          'id': "0"
        }],
        hsz_zjn_base_goods_details_hsz_goodsStateOptions: [],
        hsz_zjn_base_goods_details_hsz_goodsGradeOptions: [],
    
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
         billWarehouseOptions: [{
          "value": "F_OrderNo",
          "label": "流水编号"
        }, {
          "value": "F_ProductsNo",
          "label": "物料编号"
        }, {
          "value": "F_ProductsName",
          "label": "物料名称"
        }, {
          "value": "ProductsTotal",
          "label": "库存数量"
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
      this.getproductsUnitdescOptions();
      this.getproductstypeOptions();
      this.getproductsGradeOptions();
    },
    mounted() {},
    methods: {

         //物料编号选择事件
      productsNoChcek(p1, p2) {
        console.log(p2)
         console.log(p2.F_ProductsNo)
        //赋值
         this.dataForm.productsNo = p2.F_ProductsNo;
         this.dataForm.orderNo=p2.F_OrderNo;
         this.dataForm.productsType=p2.F_ProductsType;
        this.dataForm.productsStyle=p2.F_ProductsStyle;
        this.dataForm.productsTotal=p2.ProductsTotal;
        this.dataForm.productsUnit=p2.F_ProductsUnit;
        this.dataForm.productsGrade=p2.F_ProductsGrade;
        this.dataForm.productsBach=p2.F_ProductsBach;
        this.dataForm.productsUser=p2.F_ProductsUser;
        this.dataForm.productsSupplier=p2.F_ProductsSupplier;
        this.dataForm.productsLocation=p2.F_ProductsLocation;
        this.dataForm.case3=p2.case3;
      },
      getproductsGradeOptions() {
        getDictionaryDataSelector('326588657760732421').then(res => {
          this.GradeOptions = res.data.list
        });
      },
      getproductstypeOptions() {
        getDictionaryDataSelector('325449144728552709').then(res => {
          this.productstypeOptions = res.data.list
        });
      },
       getproductsUnitdescOptions() {
        getDictionaryDataSelector('326384591566800133').then(res => {
          this.productsUnitdesc = res.data.list
        });
      },
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
              url: '/api/wms/zjnbillshistory/' + this.dataForm.id,
              method: 'get'
            }).then(res => {              
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
       
          this.dataForm.productsTotal=this.dataForm.TheDelivery;
        this.$refs['elForm'].validate((valid) => {
          
          console.log(this.dataForm.productsTotal);
            this.btnLoading = true;
            if (!this.dataForm.id) {
              console.log(this.dataForm);
              this.dataForm.orderType="008";
              request({
                url: `/api/wms/zjnbillshistory/NewOutboundRecord`,
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
            }           
        })
      },
    }
  }
</script>
