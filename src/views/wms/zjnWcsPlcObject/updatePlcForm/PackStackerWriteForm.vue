<template>
    <el-dialog :title="'编辑PLC   DB' + this.item.db + '-' + this.item.objType" append-to-body
        :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll
        width="800px">
        <el-row :gutter="15" class="">
            <el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right"
                :disabled="!!isDetail" :rules="rules">

                <el-col :span="24">
                    <el-form-item label="设备号" prop="DeviceCode">
                        <el-input v-model='dataForm.DeviceCode' placeholder='请输入' clearable
                            :style='{ "width": "100%" }'>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="IsStart" prop="IsStart">
                        <el-switch v-model='dataForm.IsStart' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="IsResetAlarm" prop="IsResetAlarm">
                        <el-switch v-model='dataForm.IsResetAlarm' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="IsResetAuto" prop="IsResetAuto">
                        <el-switch v-model='dataForm.IsResetAuto' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="IsFireCommand" prop="IsFireCommand">
                        <el-switch v-model='dataForm.IsFireCommand' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="IsTpNormal" prop="IsTpNormal">
                        <el-switch v-model='dataForm.IsTpNormal' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="IsTpAbnormal" prop="IsTpAbnormal">
                        <el-switch v-model='dataForm.IsTpAbnormal' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="IsDtsAbnormal" prop="IsDtsAbnormal">
                        <el-switch v-model='dataForm.IsDtsAbnormal' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="IsResetManual" prop="IsResetManual">
                        <el-switch v-model='dataForm.IsResetManual' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
            
                <el-col :span="12">
                    <el-form-item label="IsReserve1" prop="IsReserve1">
                        <el-switch v-model='dataForm.IsReserve1' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="IsReserve2" prop="IsReserve2">
                        <el-switch v-model='dataForm.IsReserve2' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="IsReserve3" prop="IsReserve3">
                        <el-switch v-model='dataForm.IsReserve3' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="IsReserve4" prop="IsReserve4">
                        <el-switch v-model='dataForm.IsReserve4' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="IsReserve5" prop="IsReserve5">
                        <el-switch v-model='dataForm.IsReserve5' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="IsReserve6" prop="IsReserve6">
                        <el-switch v-model='dataForm.IsReserve6' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="IsReserve7" prop="IsReserve7">
                        <el-switch v-model='dataForm.IsReserve7' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="IsReserve8" prop="IsReserve8">
                        <el-switch v-model='dataForm.IsReserve8' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
               
                <el-col :span="12">
                    <el-form-item label="JobID" prop="JobID">
                        <el-input-number v-model='dataForm.JobID' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="JobCommand" prop="JobCommand">
                        <el-input-number v-model='dataForm.JobCommand' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="F_Row" prop="F_Row">
                        <el-input-number v-model='dataForm.F_Row' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="F_Col" prop="F_Col">
                        <el-input-number v-model='dataForm.F_Col' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="F_Lay" prop="F_Lay">
                        <el-input-number v-model='dataForm.F_Lay' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="T_Row" prop="T_Row">
                        <el-input-number v-model='dataForm.T_Row' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="T_Col" prop="T_Col">
                        <el-input-number v-model='dataForm.T_Col' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="T_Lay" prop="T_Lay">
                        <el-input-number v-model='dataForm.T_Lay' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="IsPost" prop="IsPost">
                        <el-input-number v-model='dataForm.IsPost' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Reserve8" prop="Reserve8">
                        <el-input-number v-model='dataForm.Reserve8' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Reserve9" prop="Reserve9">
                        <el-input-number v-model='dataForm.Reserve9' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="Reserve10" prop="Reserve10">
                        <el-input-number v-model='dataForm.Reserve10' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Reserve1" prop="Reserve1">
                        <el-input-number v-model='dataForm.Reserve1' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Reserve2" prop="Reserve2">
                        <el-input-number v-model='dataForm.Reserve2' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
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
import { deepClone } from '@/utils'
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
            item: undefined,
            dataForm: {
                DeviceCode: "",
                IsStart: false,
                IsResetAlarm: false,
                IsResetAuto: false,
                IsFireCommand: false,
                IsTpNormal: false,
                IsTpAbnormal: false,
                IsDtsAbnormal: false,
                IsResetManual: false,
                IsReserve1: false,
                IsReserve2: false,
                IsReserve3: false,
                IsReserve4: false,
                IsReserve5: false,
                IsReserve6: false,
                IsReserve7: false,
                IsReserve8: false,
                JobID: 0,
                JobCommand: 0,
                F_Row: 0,
                F_Col: 0,
                F_Lay: 0,
                T_Row: 0,
                T_Col: 0,
                T_Lay: 0,
                IsPost: 0,
                Reserve8: 0,
                Reserve9: 0,
                Reserve10: 0,
                Reserve1: 0,
                Reserve2: 0,
            },
            rules: {
            },
            regionOptions: [],
        }
    },
    computed: {},
    watch: {},
    created() {
        // this.getregionOptions();
    },
    mounted() {
    },
    methods: {
        // getregionOptions() {
        //     getDictionaryDataSelector('343037780953138437').then(res => {
        //         this.regionOptions = res.data.list
        //     });
        // },
        goBack() {
            this.$emit('refresh')
        },
        init(item) {
            console.log(item)
            this.item = deepClone(item);
            // this.dataForm.plcObjId = id || 0;
            this.visible = true;
            this.$nextTick(() => {
                this.$refs['elForm'].resetFields();
                this.dataForm = this.item.json;
            });
            this.$store.commit('generator/UPDATE_RELATION_DATA', {})
        },
        dataFormSubmit() {
            this.$refs['elForm'].validate((valid) => {
                if (valid) {
                    this.btnLoading = true;
                    if (this.dataForm.DeviceCode && this.item) {
                        this.item.json = this.dataForm;
                        request({
                            url: '/api/wms/ZjnWcsPlcObject/UpdatePlcData',
                            method: 'PUT',
                            data: this.item
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
                    } else {
                        this.$message({
                            message: "参数为空",
                            type: 'error',
                            duration: 1000,
                            onClose: () => {
                                this.btnLoading = false;
                                this.visible = false
                                this.$emit('refresh', true)
                            }
                        })
                    }
                }
            })
        },
    }
}
</script>
