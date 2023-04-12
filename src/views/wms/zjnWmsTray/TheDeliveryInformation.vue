<template>
    <el-dialog :title="'出库'" :close-on-click-modal="false" :visible.sync="visible"
      class="HSZ-dialog HSZ-dialog_center" lock-scroll width="800px">
      <el-row :gutter="15" class="">
        <el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right"
          :disabled="!!isDetail" :rules="rules">
          
          <el-col :span="12">
            <el-form-item label="托盘号" prop="F_TrayNo">
              <el-input v-model='dataForm.F_TrayNo' placeholder='请输入' disabled required clearable :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="托盘名称" prop="F_TrayName">
              <el-input v-model='dataForm.F_TrayName' placeholder='请输入' disabled required clearable :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物料代码" prop="F_GoodsCode">
              <el-input v-model='dataForm.F_GoodsCode' placeholder='请输入' disabled required clearable :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物料编号" prop="F_GoodsCodeNmae">
              <el-input v-model='dataForm.F_GoodsCodeNmae' placeholder='请输入' disabled required clearable :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="数量" prop="F_Quantity">
              <el-input v-model='dataForm.F_Quantity' placeholder='请输入' disabled required clearable :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
						<el-form-item label="物料单位" prop="F_Unit">
							<el-select v-model='dataForm.F_Unit' disabled placeholder='请选择' clearable required :style='{"width":"100%"}' filterable >
								<el-option v-for="(item, index) in unitOptions" :key="index" :label="item.fullName" :value="item.enCode" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
          
          <el-col :span="12">
            <el-form-item label="货位编号" prop="F_LocationNo">
              <el-input v-model='dataForm.F_LocationNo' disabled placeholder='请输入' required clearable :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货位描述" prop="F_LocationName">
              <el-input v-model='dataForm.F_LocationName' disabled required clearable :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="巷道编号" prop="F_NumberOfRoadway">
              <el-input v-model='dataForm.F_NumberOfRoadway' disabled required clearable :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
						<el-form-item label="出库口">
							<el-select placeholder='请选择' v-model="dataForm.F_EquipmentSerialNumber" clearable :style='{"width":"100%"}' >
								<el-option v-for="(item, index) in equipmentList" :key="index" :label="item.F_DeviceName" :value="item.F_TheBinding" ></el-option>
                
							</el-select>
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
        return {
          btnLoading: false,
          loading: false,
          visible: false,
          isDetail: false,
          dataForm: {
            F_TrayNo:undefined,
            F_TrayName:undefined,
            F_GoodsCodeNmae:undefined,
            F_GoodsCode:undefined,
            F_Quantity:undefined,
            F_Unit:undefined,
            F_LocationNo:undefined,
            F_NumberOfRoadway:undefined,
            F_EquipmentSerialNumber:undefined
          },
          rules: {
           
          },
          typeOptions: [],
          trayStatesOptions: [],
          unitOptions:[],
          equipmentList:[]
        }
      },
      computed: {},
      watch: {},
      created() {
        this.getunitOptions();
      },
      mounted() {},
      methods: {
        getunitOptions(){
				getDictionaryDataSelector('326384591566800133').then(res => {
					this.unitOptions = res.data.list
				});        
			},      
        init(id) {
          var that=this;
            console.log(id);
            let query = {TrayNo:id}
            
             this.visible = true;
             
            // this.isDetail = isDetail || false;
             request({
               url: '/api/wms/ZjnWmsTray/GetLocationLog',
               method: 'get',
               data: query
             }).then(res => {
                this.dataForm = res.data;
                if( this.dataForm.F_TrayNo==null){
                    this.$message({ message: '查询不到货位，确认数据是否正确！', type: 'warning' });
         
                    this.visible = false;
                }
                //获取设备绑定表数据
                that.getEquipmentList(res.data.F_NumberOfRoadway);
             })
             this.$store.commit('generator/UPDATE_RELATION_DATA', {})
        },
        dataFormSubmit(){
          if (!this.dataForm.F_EquipmentSerialNumber) {
            this.$message({ message: '请选择出库口！', type: 'warning' });
            return false
          }
          request({
            url: `/api/wms/ZjnWmsTray/ConfirmTheDelivery`,
            method: 'post',
            data: this.dataForm,
          }).then((res) => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1000,
              onClose: () => {
                
                this.visible = false,
                  this.$emit('refresh', true)
              }
            })
          })
        },
      //获取设备绑定表数据        
      getEquipmentList(numberOfRoadway){
        if(numberOfRoadway==null||numberOfRoadway==''||numberOfRoadway==undefined){
          return;
        }
        let query = {F_EquipmentSerialNumber:numberOfRoadway}          
          request({
            url: `/api/wms/ZjnWmsEquipmentList`,
            method: 'GET',
            data: query
          }).then(res => {
            this.equipmentList = res.data.list
            //console.log(res.data.list)
          })
        }
      },
      
      
      
    }
  </script>
  