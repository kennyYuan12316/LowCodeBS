<template>
    <el-dialog :title="!dataForm.id ? '修改状态' :  isDetail ? '详情':'编辑'" :close-on-click-modal="false"
        :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
        <el-row :gutter="15" class="">
            <el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right"
                :disabled="!!isDetail" :rules="rules">
                <el-col :span="24">
                    <el-form-item label="单据号" prop="id">
                   <el-input
                      v-model="dataForm.PurchaseOrder" disabled
                      placeholder="请输入"
                      clearable
                      required
                      :style="{ width: '100%' }"
                    >
                    </el-input>

                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="批次号" prop="id">
                   <el-input
                      v-model="dataForm.orderNo" disabled
                      placeholder="请输入"
                      clearable
                      required
                      :style="{ width: '100%' }"
                    >
                    </el-input>

                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="货位" prop="id">
                   <el-input
                      v-model="dataForm.productsLocation" disabled
                      placeholder="请输入"
                      clearable
                      required
                      :style="{ width: '100%' }"
                    >
                    </el-input>

                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="状态" prop="InspectionStatus">
                        <el-select v-model='dataForm.InspectionStatus' placeholder='' clearable required 
                            :style='{"width":"100%"}'>
                            <el-option v-for="(item, index) in productstypeOptions" :key="index" :label="item.fullName"
                                :value="item.enCode"></el-option>
                        </el-select>

                    </el-form-item>
                </el-col>
                <el-col :span="24">

                    <el-form-item label="备注"
                    prop="productsStyle">
                    <el-input v-model="dataForm.productsStyle"
                            type="textarea"
                            :rows="6" />
                    </el-form-item>
                    
                </el-col>
            </el-form>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible=false">取 消</el-button>
            
            <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import request from '@/utils/request'
import { getDictionaryDataSelector } from '@/api/systemData/dictionary'

export default {
    components: {},
    props: [],
    data() {
        return {
            btnLoading: false,
            loading: false,
            visible: false,
            isDetail: false,
            productstypeOptions: false,
           
            dataForm: {
                id: '',
                supplierNo: undefined,
                supplierName: undefined,
                createUser: undefined,
                createTime: undefined,
                modifiedUser: undefined,
                modifiedTime: undefined,
                productsStyle:undefined,
                InspectionStatus:undefined
            },
            rules: {
                supplierNo: [
                    {
                        required: true,
                        message: '请输入供应商编号',
                        trigger: 'blur'
                    },
                ],
                supplierName: [
                    {
                        required: true,
                        message: '请输入供应商名称',
                        trigger: 'blur'
                    },
                ],
            },
        }
    },
    computed: {},
    watch: {},
    created() {
        this.getInspectionStatustions();
    },
    mounted() {
    },
    methods: {
        getInspectionStatustions() {
            getDictionaryDataSelector('325448475967751429').then(res => {
                console.log(res)

                this.productstypeOptions = res.data.list
            });
        },
        goBack() {
            this.$emit('refresh')
        },
        init(id,ProductsLocation,InspectionStatus,dangjuhao) {
            this.dataForm.orderNo=id;
            this.dataForm.productsLocation=ProductsLocation;
            this.dataForm.InspectionStatus=InspectionStatus+"";
            this.dataForm.PurchaseOrder=dangjuhao;
            this.visible = true;
        },
        dataFormSubmit(){
              console.log(this.dataForm);
              request({
                url: `/api/wms/zjnbillshistory/Updatesta`,
                method: 'PUT',
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

    }
}
</script>
