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
              <el-tabs type="" tab-position="top" v-model="active1" class="mb-10">
                <el-tab-pane label="单据基础数据">
                  <el-col :span="6">
                    <el-form-item label="单据类型" prop="billType">
                      <el-select v-model='dataForm.billType' placeholder='' clearable required
                        :style='{"width":"100%"}'>
                        <el-option v-for="(item, index) in billTypeOptions" :key="index" :label="item.fullName"
                          :value="item.enCode"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="单据号码" prop="billNo">
                      <el-input v-model='dataForm.billNo' placeholder='请输入' clearable required
                        :style='{"width":"100%"}'>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="仓库名称" prop="billWarehouse">
                      <popupSelect v-model='dataForm.billWarehouse' field='billWarehouse' placeholder='请选择' clearable
                        relationField='F_WarehouseName' :columnOptions='billWarehouseOptions' :pageSize='20'
                        propsValue='F_WarehouseNo' interfaceId='327591530430727429' popupType='dialog' popupTitle='选择数据'
                        popupWidth='800px'>
                      </popupSelect>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="单据状态" prop="billState">
                      <el-select v-model='dataForm.billState' placeholder='' clearable required
                        :style='{"width":"100%"}'>
                        <el-option v-for="(item, index) in billStateOptions" :key="index" :label="item.fullName"
                          :value="item.enCode"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="有效标志" prop="enabledMark">
                      <el-radio-group v-model='dataForm.enabledMark' required :style='{}'>
                        <el-radio v-for="(item, index) in enabledMarkOptions" :key="index" :label="item.id">
                          {{item.fullName}}
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-tab-pane>
              </el-tabs>
            </el-col>
            <!-- 明细数据 -->
            <el-col :span="24">
              <el-tabs type="" tab-position="top" v-model="active2" class="mb-10">
                <el-tab-pane label="单据明细数据">
                  <el-col :span="24">
                    <el-form-item label-width="0">
                      <el-table :data="dataForm.zjnPlaneBillsInOutOrderList" size='mini' show-summary
                        :row-class-name="tableRowClassName" @row-click="onRowClick"
                        :summary-method='getZjnPlaneBillsInOutOrder'>
                        <el-table-column type="index" width="50" label="序号" align="center" />
                        <!-- <el-table-column prop="ordeerNo" label="单据编号" width="100">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.ordeerNo" clearable readonly required>
                            </el-input>
                          </template>
                        </el-table-column> -->
                        <el-table-column prop="productsNo" label="货物编码" width="150">
                          <template slot-scope="scope">
                            <popupSelect v-model="scope.row.productsNo" :field="'productsNo'+scope.$index"
                              placeholder='' clearable relationField='F_GoodsCode' :columnOptions='productsNoOptions'
                              hasPage :pageSize='20' propsValue='F_GoodsCode' interfaceId='326734295324427525'
                              popupType='dialog' popupTitle='选择货物' popupWidth='600px' @change="productsNoChcek">
                            </popupSelect>
                          </template>
                        </el-table-column>
                        <el-table-column prop="productsName" label="货物名称" width="200">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.productsName" placeholder='' required>
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="productsTotal" label="货物数量" width="100">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.productsTotal" required>
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="productsBach" label="货物批次" width="100">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.productsBach" placeholder=''>
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="productsGrade" label="货物等级" width="100">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.productsGrade" placeholder='' clearable>
                              <el-option v-for="(item, index) in productsGradeOptions" :key="index"
                                :label="item.fullName" :value="item.enCode" :disabled="item.disabled"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column prop="productsLocation" label="货位编号" width="120">
                          <template slot-scope="scope">
                            <popupSelect v-model="scope.row.productsLocation" :field="'productsLocation'+scope.$index"
                              placeholder='' clearable relationField='F_LocationNo'
                              :columnOptions='productsLocationOptions' :pageSize='20' propsValue='F_LocationNo'
                              interfaceId='326602051024848133' popupType='dialog' popupTitle='选择数据' popupWidth='600px'>
                            </popupSelect>
                          </template>
                        </el-table-column>
                        <el-table-column prop="productsTray" label="托盘编号" width="120">
                          <template slot-scope="scope">
                            <popupSelect v-model="scope.row.productsTray" :field="'productsTray'+scope.$index"
                              placeholder='' clearable relationField='F_TrayName' :columnOptions='productsTrayOptions'
                              :pageSize='20' propsValue='F_TrayNo' interfaceId='326609369489736965' popupType='dialog'
                              popupTitle='选择数据' popupWidth='600px'>
                            </popupSelect>
                          </template>
                        </el-table-column>
                        <el-table-column prop="productsDate" label="生产日期" width="160">
                          <template slot-scope="scope">
                            <el-date-picker v-model="scope.row.productsDate" :style='{"width":"100%"}' placeholder=''
                              clearable format='yyyy-MM-dd' value-format='timestamp' type='date'>
                            </el-date-picker>
                          </template>
                        </el-table-column>
                        <el-table-column prop="productsType" label="货物类型" width="120">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.productsType" placeholder='' clearable required>
                              <el-option v-for="(item, index) in productsTypeOptions" :key="index"
                                :label="item.fullName" :value="item.enCode" :disabled="item.disabled"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column prop="productsStyle" label="货物规格" width="120">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.productsStyle">
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="productsUnit" label="货物单位" width="90">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.productsUnit" placeholder='' clearable>
                              <el-option v-for="(item, index) in productsUnitOptions" :key="index"
                                :label="item.fullName" :value="item.enCode" :disabled="item.disabled"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column prop="productsCheckType" label="检验类型" width="100">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.productsCheckType" placeholder='' clearable>
                              <el-option v-for="(item, index) in productsCheckTypeOptions" :key="index"
                                :label="item.fullName" :value="item.enCode" :disabled="item.disabled"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column prop="productsUser" label="客户编号" width="160">
                          <template slot-scope="scope">
                            <popupSelect v-model="scope.row.productsUser" :field="'productsUser'+scope.$index"
                              placeholder='' clearable relationField='F_CustomerName'
                              :columnOptions='productsUserOptions' :pageSize='20' propsValue='F_CustomerNo'
                              interfaceId='326594899472286981' popupType='dialog' popupTitle='选择数据' popupWidth='600px'>
                            </popupSelect>
                          </template>
                        </el-table-column>
                        <el-table-column prop="productsSupplier" label="供应商编号" width="180">
                          <template slot-scope="scope">
                            <popupSelect v-model="scope.row.productsSupplier" :field="'productsSupplier'+scope.$index"
                              placeholder='' clearable relationField='F_SupplierName'
                              :columnOptions='productsSupplierOptions' :pageSize='20' propsValue='F_SupplierNo'
                              interfaceId='326610288549823749' popupType='dialog' popupTitle='选择数据' popupWidth='600px'>
                            </popupSelect>
                          </template>
                        </el-table-column>
                        <el-table-column prop="orderState" label="当前状态" width="120">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.orderState" placeholder='' clearable>
                              <el-option v-for="(item, index) in orderStateOptions" :key="index" :label="item.fullName"
                                :value="item.enCode" :disabled="item.disabled"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column prop="productsRemarks" label="货物备注" width="200">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.productsRemarks" placeholder=''>
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="enabledMark" label="有效标志">
                          <template slot-scope="scope">
                            <el-switch v-model="scope.row.enabledMark" :active-value='1' :inactive-value='0'>
                            </el-switch>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" width="50" fixed="right">
                          <template slot-scope="scope">
                            <el-button size="mini" type="text" class="HSZ-table-delBtn"
                              @click="handleDelZjnPlaneBillsInOutOrderEntityList(scope.$index)">删除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                      <div class="table-actions" @click="addHandleZjnPlaneBillsInOutOrderEntityList()">
                        <el-button type="text" icon="el-icon-plus">新增</el-button>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-tab-pane>
              </el-tabs>
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
        checkRowNumber: 0,
        dataForm: {
          id: '',
          billType: undefined,
          billNo: undefined,
          billWarehouse: undefined,
          billState: '0',
          enabledMark: "1",
          zjnPlaneBillsInOutOrderList: [],
        },
        rules: {
          billType: [{
            required: true,
            message: '请输入单据类型',
            trigger: 'change'
          }, ],
          billNo: [{
            required: true,
            message: '请输入单据号码',
            trigger: 'blur'
          }, ],
          billState: [{
            required: true,
            message: '请输入单据状态',
            trigger: 'change'
          }, ],
          enabledMark: [{
            required: true,
            message: '请输入有效标志',
            trigger: 'change'
          }, ],
        },
        billTypeOptions: [],
        billStateOptions: [],
        enabledMarkOptions: [{
          'fullName': "启用",
          'id': "1"
        }, {
          'fullName': "禁用",
          'id': "0"
        }],
        active1: "0",
        productsNoOptions: [{
          "value": "F_GoodsCode",
          "label": "货物编码"
        }, {
          "value": "F_GoodsName",
          "label": "货物名称"
        }, {
          "value": "F_specifications",
          "label": "货物规格"
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
        productsTypeOptions: [],
        productsUnitOptions: [],
        productsGradeOptions: [],
        orderStateOptions: [],
        productsCheckTypeOptions: [],
        productsUserOptions: [{
          "value": "F_CustomerNo",
          "label": "客户编号"
        }, {
          "value": "F_CustomerName",
          "label": "客户名称"
        }, {
          "value": "F_ContactName",
          "label": "联系人"
        }],
        productsSupplierOptions: [{
          "value": "F_SupplierNo",
          "label": "供应商编号"
        }, {
          "value": "F_SupplierName",
          "label": "供应商名称"
        }],
        productsLocationOptions: [{
          "value": "F_LocationNo",
          "label": "货位编号"
        }, {
          "value": "F_WarehouseName",
          "label": "所属仓库"
        },{
          "value": "F_WarehouseName",
          "label": "所属仓库"

        }],
        productsTrayOptions: [{
          "value": "F_TrayNo",
          "label": "托盘编号"
        }, {
          "value": "F_TrayName",
          "label": "托盘名称"
        }],
        active2: "0",
      }
    },
    computed: {},
    watch: {},
    created() {
      this.getbillTypeOptions();
      this.getbillStateOptions();
      this.getproductsTypeOptions();
      this.getproductsUnitOptions();
      this.getproductsGradeOptions();
      this.getorderStateOptions();
      this.getproductsCheckTypeOptions();
    },
    mounted() {},
    methods: {

      //货物编号选择事件
      productsNoChcek(p1, p2) {
        console.log('啦啦啦')
        console.log(p2)
        //赋值
        this.dataForm.zjnPlaneBillsInOutOrderList[this.checkRowNumber].productsName = p2.F_GoodsName;
        this.dataForm.zjnPlaneBillsInOutOrderList[this.checkRowNumber].productsType = p2.F_GoodsType;
        this.dataForm.zjnPlaneBillsInOutOrderList[this.checkRowNumber].productsStyle = p2.F_specifications;
        this.dataForm.zjnPlaneBillsInOutOrderList[this.checkRowNumber].productsUnit = p2.F_Unit;
        this.dataForm.zjnPlaneBillsInOutOrderList[this.checkRowNumber].productsCheckType = p2.F_CheckType;
        this.dataForm.zjnPlaneBillsInOutOrderList[this.checkRowNumber].productsSupplier = p2.F_VendorId;
        this.dataForm.zjnPlaneBillsInOutOrderList[this.checkRowNumber].productsUser = p2.F_CustomerId;

      },
      tableRowClassName({
        row,
        rowIndex
      }) {
        row.index = rowIndex;
      },
      //单击行事件
      onRowClick(row, column, cell, event) {
        this.checkRowNumber = row.index
      },
      getbillTypeOptions() {
        getDictionaryDataSelector('325447612469609733').then(res => {
          this.billTypeOptions = res.data.list
        });
      },
      getbillStateOptions() {
        getDictionaryDataSelector('325448007375914245').then(res => {
          this.billStateOptions = res.data.list
        });
      },
      getproductsTypeOptions() {
        getDictionaryDataSelector('325449144728552709').then(res => {
          this.productsTypeOptions = res.data.list
        });
      },
      getproductsUnitOptions() {
        getDictionaryDataSelector('326384591566800133').then(res => {
          this.productsUnitOptions = res.data.list
        });
      },
      getproductsGradeOptions() {
        getDictionaryDataSelector('326588657760732421').then(res => {
          this.productsGradeOptions = res.data.list
        });
      },
      getorderStateOptions() {
        getDictionaryDataSelector('325448007375914245').then(res => {
          this.orderStateOptions = res.data.list
        });
      },
      getproductsCheckTypeOptions() {
        getDictionaryDataSelector('325448312364729605').then(res => {
          this.productsCheckTypeOptions = res.data.list
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
              url: '/api/wms/ZjnPlaneBills/' + this.dataForm.id,
              method: 'get'
            }).then(res => {
              this.dataForm = res.data;
            })
          }
        });
        this.$store.commit('generator/UPDATE_RELATION_DATA', {})
      },
      //提交事件
      dataFormSubmit() {
        console.log(this.dataForm)
        this.$refs['elForm'].validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            if (!this.dataForm.id) {
              request({
                url: `/api/wms/ZjnPlaneBills`,
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
                url: '/api/wms/ZjnPlaneBills/' + this.dataForm.id,
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
      addHandleZjnPlaneBillsInOutOrderEntityList() {
        let item = {
          ordeerNo: undefined,
          productsNo: undefined,
          productsName: undefined,
          productsType: undefined,
          productsStyle: undefined,
          productsTotal: undefined,
          productsUnit: undefined,
          productsBach: undefined,
          productsGrade: undefined,
          orderState: '0',
          productsCheckType: undefined,
          productsUser: undefined,
          productsSupplier: undefined,
          productsLocation: undefined,
          productsTray: undefined,
          productsDate: undefined,
          productsRemarks: undefined,
          enabledMark: 1,
        }
        this.dataForm.zjnPlaneBillsInOutOrderList.push(item)
      },
      handleDelZjnPlaneBillsInOutOrderEntityList(index) {
        this.dataForm.zjnPlaneBillsInOutOrderList.splice(index, 1);
      },
      getZjnPlaneBillsInOutOrder(param) {
        const summaryField = []
        const {
          columns,
          data
        } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (!summaryField.includes(column.property)) {
            sums[index] = '';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          } else {
            sums[index] = '';
          }
        });
        return sums
      },
    }
  }
</script>
