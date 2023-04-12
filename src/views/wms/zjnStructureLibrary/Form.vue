<template>
  <transition name="el-zoom-in-center">
    <div class="HSZ-preview-main">
      <div class="HSZ-common-page-header">
        <el-page-header :content="!dataForm.id ? '入库' : isDetail ? '详情' : '编辑'" @back="goBack" />
        <div class="options">
          <el-button v-if="!isDetail" type="primary" :loading="btnLoading" @click="dataFormSubmit()">确 定</el-button>
          <el-button @click="goBack">取 消</el-button>
        </div>
      </div>
      <div :style="{margin: '0 auto',width:'100%'}">
        <el-row :gutter="15" class=" main">
          <el-form
            ref="elForm"
            :model="dataForm"
            size="small"
            label-width="100px"
            label-position="right"
            :disabled="!!isDetail"
            :rules="rules"
          >
            <el-col :span="24">
              <el-card class="mb-20" shadow="always">
                <div slot="header" class="clearfix">
                  <span>基础数据</span>
                </div>
                <el-col :span="8">
                  <el-form-item label="单据号" prop="PurchaseOrder">
                    <el-input id="No" v-model="dataForm.PurchaseOrder" placeholder="请输入" required :style="{&quot;width&quot;:&quot;100%&quot;}" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="32位流水号" prop="orderNo">
                    <el-input id="No" v-model="dataForm.orderNo" placeholder="请输入" required :style="{&quot;width&quot;:&quot;100%&quot;}" @keyup.enter.native="accountLogin(dataForm.orderNo)" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="单据类型" prop="orderType">
                    <el-select
                      v-model="dataForm.orderType"
                      placeholder=""
                      clearable
                      required
                      disabled
                      :style="{&quot;width&quot;:&quot;100%&quot;}"
                    >
                      <el-option
                        v-for="(item, index) in billTypeOptions"
                        :key="index"
                        :label="item.fullName"
                        :value="item.enCode"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="入库数量" prop="productsTotal">
                    <el-input
                      v-model="dataForm.productsTotal"
                      placeholder="请输入"
                      clearable
                      required
                      :style="{&quot;width&quot;:&quot;100%&quot;}"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item id="No" label="入库货位" prop="ProductsLocation">
                    <popupSelect
                      id="No"
                      v-model="dataForm.ProductsLocation"
                      field="ProductsLocation"
                      placeholder="请选择"
                      relation-field="F_LocationNo"
                      :column-options="ProductsLocationOptions"
                      has-page
                      :page-size="20"
                      props-value="F_LocationNo"
                      interface-id="333814162578736389"
                      popup-type="dialog"
                      popup-title="选择数据"
                      popup-width="800px"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="检验类型" prop="TestType">
                    <el-select
                      v-model="dataForm.TestType"
                      placeholder=""
                      clearable
                      required
                      disabled
                      :style="{&quot;width&quot;:&quot;100%&quot;}"
                    >
                      <el-option
                        v-for="(item, index) in TestTypeOptions"
                        :key="index"
                        :label="item.fullName"
                        :value="item.enCode"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="失效时间" prop="ExpiryDate">
                    <el-date-picker v-model="dataForm.ExpiryDate" placeholder="请选择" clearable :style="{&quot;width&quot;:&quot;100%&quot;}" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="timestamp" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="物料编号" prop="productsNo">
                    <el-input
                      id="No"
                      v-model="dataForm.productsNo"
                      placeholder="请输入"
                      clearable
                      required
                      :style="{&quot;width&quot;:&quot;100%&quot;}"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="托盘号" prop="TheTray">
                    <popupSelect
                      v-model="dataForm.TheTray"
                      field="TheTray"
                      placeholder="请选择"
                      clearable
                      relation-field="TheTray"
                      :column-options="TheTraycustomerIdOptions"
                      has-page
                      :page-size="20"
                      props-value="TheTray"
                      interface-id="333024238111819013"
                      popup-type="dialog"
                      popup-title="选择数据"
                      popup-width="800px"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="容器号" prop="TheContainer">
                    <popupSelect
                      v-model="dataForm.TheContainer"
                      field="TheContainer"
                      placeholder="请选择"
                      clearable
                      relation-field="TheTray"
                      :column-options="TheTraycustomerIdOptions"
                      has-page
                      :page-size="20"
                      props-value="TheTray"
                      interface-id="333043126618817797"
                      popup-type="dialog"
                      popup-title="选择数据"
                      popup-width="800px"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="物料等级" prop="productsGrade">
                    <el-select
                      v-model="dataForm.productsGrade"
                      placeholder=""
                      clearable
                      required
                      :style="{&quot;width&quot;:&quot;100%&quot;}"
                    >
                      <el-option
                        v-for="(item, index) in GradeOptions"
                        :key="index"
                        :label="item.fullName"
                        :value="item.enCode"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="客户" prop="productsUser">
                    <popupSelect
                      v-model="dataForm.productsUser"
                      field="productsUser"
                      placeholder="请选择"
                      clearable
                      relation-field="F_CustomerName"
                      :column-options="hsz_zjn_base_goods_details_hsz_customerIdOptions"
                      has-page
                      :page-size="20"
                      props-value="F_CustomerNo"
                      interface-id="326594899472286981"
                      popup-type="dialog"
                      popup-title="选择数据"
                      popup-width="800px"
                    />
                  </el-form-item>
                </el-col>
              </el-card>
            </el-col>
            <el-col :span="24">
              <el-card class="mb-20" shadow="always">
                <div slot="header" class="clearfix">
                  <span>详细数据</span>
                </div>

                <el-col :span="8">
                  <el-form-item label="物料名称" prop="productsName">
                    <el-input
                      v-model="dataForm.productsName"
                      placeholder="请输入"
                      clearable
                      required
                      disabled
                      :style="{&quot;width&quot;:&quot;100%&quot;}"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="物料类型" prop="productsType">
                    <el-select
                      v-model="dataForm.productsType"
                      placeholder=""
                      clearable
                      required
                      disabled
                      :style="{&quot;width&quot;:&quot;100%&quot;}"
                    >
                      <el-option
                        v-for="(item, index) in productstypeOptions"
                        :key="index"
                        :label="item.fullName"
                        :value="item.enCode"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="物料规格" prop="productsStyle">
                    <el-input
                      v-model="dataForm.productsStyle"
                      placeholder="请输入"
                      clearable
                      required
                      disabled
                      :style="{&quot;width&quot;:&quot;100%&quot;}"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="物料单位" prop="productsUnit">
                    <el-select
                      v-model="dataForm.productsUnit"
                      placeholder=""
                      clearable
                      required
                      disabled
                      :style="{&quot;width&quot;:&quot;100%&quot;}"
                    >
                      <el-option
                        v-for="(item, index) in productsUnitdesc"
                        :key="index"
                        :label="item.fullName"
                        :value="item.enCode"
                      />
                    </el-select>

                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="物料批次" prop="productsBach">
                    <el-input
                      v-model="dataForm.productsBach"
                      placeholder="请输入"
                      clearable
                      required
                      disabled
                      :style="{&quot;width&quot;:&quot;100%&quot;}"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="生产日期" prop="TheDateOfProduction">
                    <el-date-picker v-model="dataForm.TheDateOfProduction" placeholder="请选择" disabled clearable :style="{&quot;width&quot;:&quot;100%&quot;}" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="timestamp" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="供应商" prop="productsSupplier">
                    <popupSelect
                      v-model="dataForm.productsSupplier"
                      disabled
                      field="hsz_zjn_base_goods_details_hsz_vendorId"
                      placeholder="请选择"
                      clearable
                      relation-field="F_SupplierName"
                      :column-options="hsz_zjn_base_goods_details_hsz_vendorIdOptions"
                      has-page
                      :page-size="20"
                      props-value="F_SupplierNo"
                      interface-id="326610288549823749"
                      popup-type="dialog"
                      popup-title="选择数据"
                      popup-width="800px"
                    />
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
        PurchaseOrder: undefined,
        ExpiryDate: undefined,
        TheContainer: undefined,
        TheTray: undefined,
        orderNo: undefined,
        orderType: undefined,
        productsNo: undefined,
        productsName: undefined,
        productsType: undefined,
        productsStyle: undefined,
        productsTotal: undefined,
        productsUnit: undefined,
        productsGrade: undefined,
        productsBach: undefined,
        ProductsLocation: undefined,
        productsSupplier: undefined,
        enabledMark: '1',
        parentId: undefined,
        hsz_zjn_base_goods_details_hsz_vendorId: undefined,
        hsz_zjn_base_goods_details_hsz_enabledMark: '1',
        TestType: undefined
      },
      rules: {
        orderNo: [{
          required: true,
          message: '请输入32位流水编号',
          trigger: 'blur'
        }],
        orderType: [{
          required: true,
          message: '请输入单据类型',
          trigger: 'blur'
        }],
        productsNo: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        }],
        PurchaseOrder: [{
          required: true,
          message: '请输入',
          trigger: 'blur'

        }],
        productsTotal: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        }],
        ExpiryDate: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        }],
        TestType: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        }],
        ProductsLocation: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        }]

      },
      GradeOptions: [],
      productsUnitdesc: [],
      unitOptions: [],
      billTypeOptions: [],
      goodstypeOptions: [],
      productstypeOptions: [],
      TestTypeOptions: [],
      enabledMarkOptions: [{
        'fullName': '启用',
        'id': '1'
      }, {
        'fullName': '禁用',
        'id': '0'
      }],
      hsz_zjn_base_goods_details_hsz_goodsStateOptions: [],
      hsz_zjn_base_goods_details_hsz_goodsGradeOptions: [],

      hsz_zjn_base_goods_details_hsz_customerIdOptions: [{
        'value': 'F_CustomerNo',
        'label': '客户编号'
      }, {
        'value': 'F_CustomerName',
        'label': '客户名称'
      }],
      hsz_zjn_base_goods_details_hsz_palledNoOptions: [{
        'value': 'F_TrayNo',
        'label': '托盘编号'
      }, {
        'value': 'F_TrayName',
        'label': '托盘名称'
      }],
      hsz_zjn_base_goods_details_hsz_vendorIdOptions: [{
        'value': 'F_SupplierNo',
        'label': '供应商编号'
      }, {
        'value': 'F_SupplierName',
        'label': '供应商名称'
      }],
      hsz_zjn_base_goods_details_hsz_checkTypeOptions: [],
      TheTraycustomerIdOptions: [{
        'value': 'TheTray',
        'label': '托盘号'
      }, {
        'value': 'TypeName',
        'label': '类型'
      }, {
        'value': 'StateName',
        'label': '状态'
      }],
      ProductsLocationOptions: [{
        'value': 'F_LocationNo',
        'label': '货位编号'
      }, {
        'value': 'F_FULLNAME',
        'label': '状态'
      }, {
        'value': 'EnabledMark',
        'label': '有效状态'
      },{
          "value": "F_WarehouseName",
          "label": "所属仓库"

        }]
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getproductsGradeOptions()
    this.getproductstypeOptions()
    this.getbillTypeOptions()
    this.getunitOptions()
    this.getgoodstypeOptions()
    this.getproductsUnitdescOptions()
    this.gethsz_zjn_base_goods_details_hsz_goodsStateOptions()// 货物状态的数据字典
    this.gethsz_zjn_base_goods_details_hsz_goodsGradeOptions()
    this.gethsz_zjn_base_goods_details_hsz_checkTypeOptions()
    this.getTestTypeOptionsOptions()
  },
  mounted() {},
  methods: {
    getTestTypeOptionsOptions() {
      getDictionaryDataSelector('325448312364729605').then(res => {
        this.TestTypeOptions = res.data.list
      })
    },
    getproductsUnitdescOptions() {
      getDictionaryDataSelector('326384591566800133').then(res => {
        this.productsUnitdesc = res.data.list
      })
    },
    getproductsGradeOptions() {
      getDictionaryDataSelector('326588657760732421').then(res => {
        this.GradeOptions = res.data.list
      })
    },
    getproductstypeOptions() {
      getDictionaryDataSelector('325449144728552709').then(res => {
        this.productstypeOptions = res.data.list
      })
    },
    getbillTypeOptions() {
      getDictionaryDataSelector('325447612469609733').then(res => {
        this.billTypeOptions = res.data.list
      })
      this.dataForm.orderType = '009'
    },
    getunitOptions() {
      getDictionaryDataSelector('326384591566800133').then(res => {
        this.unitOptions = res.data.list
      })
    },
    getgoodstypeOptions() {
      getDictionaryDataSelector('325449144728552709').then(res => {
        this.goodstypeOptions = res.data.list
      })
    },
    gethsz_zjn_base_goods_details_hsz_goodsStateOptions() {
      getDictionaryDataSelector('326590282281780485').then(res => {
        this.hsz_zjn_base_goods_details_hsz_goodsStateOptions = res.data.list
      })
    },
    gethsz_zjn_base_goods_details_hsz_goodsGradeOptions() {
      getDictionaryDataSelector('326588657760732421').then(res => {
        this.hsz_zjn_base_goods_details_hsz_goodsGradeOptions = res.data.list
      })
    },
    gethsz_zjn_base_goods_details_hsz_checkTypeOptions() {
      getDictionaryDataSelector('325448312364729605').then(res => {
        this.hsz_zjn_base_goods_details_hsz_checkTypeOptions = res.data.list
      })
    },
    goBack() {
      this.$emit('refresh')
    },
    init(id, isDetail) {
      this.dataForm.id = id || 0
      this.visible = true
      this.isDetail = isDetail || false
      var txt = document.getElementById('No')
      if (txt != null) {
				   console.log(txt)
        txt.disabled = false
      }
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (this.dataForm.id) {
          request({
            url: '/api/wms/zjnbillshistory/' + this.dataForm.id,
            method: 'get'
          }).then(res => {
            const temp = res.data.hsz_zjn_base_goods_details_hsz_enabledMark
            res.data.hsz_zjn_base_goods_details_hsz_enabledMark = temp == null ? '' : temp.toString()
            this.dataForm = res.data
            var txts = document.getElementById('No')
            txts.disabled = true
          })
        }
      })
      this.$store.commit('generator/UPDATE_RELATION_DATA', {})
    },
    dataFormSubmit() {
      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.dataForm.orderType = '009'
          if (!this.dataForm.id) {
            console.log(this.dataForm)
            request({
              url: `/api/wms/zjnbillshistory`,
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
              url: '/api/wms/zjnbillshistory/' + this.dataForm.id,
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
    },
    accountLogin(ids) {
      const _query = {
        id: ids
      }
      request({
        url: '/api/wms/zjnbillshistory/GeAnalysisOfThe',
        method: 'Get',
        data: _query
      }).then(res => {
        const temp = res.data.hsz_zjn_base_goods_details_hsz_enabledMark
        res.data.hsz_zjn_base_goods_details_hsz_enabledMark = temp == null ? '' : temp.toString()
        if (this.dataForm.ExpiryDate == null || dataForm.ExpiryDate == undefined || dataForm.ExpiryDate == '') {
          this.dataForm = res.data
          this.dataForm.ExpiryDate = ''
        }
        console.log(this.dataForm)
      })
    }
  }
}
</script>
