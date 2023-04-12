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
                    <el-form-item label="Job_One_ID" prop="Job_One_ID">
                        <el-input-number v-model='dataForm.Job_One_ID' placeholder='数字文本' :step='1'
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
                    <el-form-item label="F_One_Row" prop="F_One_Row">
                        <el-input-number v-model='dataForm.F_One_Row' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="F_One_Col" prop="F_One_Col">
                        <el-input-number v-model='dataForm.F_One_Col' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="F_One_Lay" prop="F_One_Lay">
                        <el-input-number v-model='dataForm.F_One_Lay' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="T_One_Row" prop="T_One_Row">
                        <el-input-number v-model='dataForm.T_One_Row' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="T_One_Col" prop="T_One_Col">
                        <el-input-number v-model='dataForm.T_One_Col' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="T_One_Lay" prop="T_One_Lay">
                        <el-input-number v-model='dataForm.T_One_Lay' placeholder='数字文本' :step='1'
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
                    <el-form-item label="Reserve11" prop="Reserve11">
                        <el-input-number v-model='dataForm.Reserve11' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Reserve12" prop="Reserve12">
                        <el-input-number v-model='dataForm.Reserve12' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="FireRequestDown" prop="FireRequestDown">
                        <el-switch v-model='dataForm.FireRequestDown' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="FireDownOver" prop="FireDownOver">
                        <el-switch v-model='dataForm.FireDownOver' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="FireAllowDown" prop="FireAllowDown">
                        <el-switch v-model='dataForm.FireAllowDown' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="IsReserve9" prop="IsReserve9">
                        <el-switch v-model='dataForm.IsReserve9' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="IsReserve10" prop="IsReserve10">
                        <el-switch v-model='dataForm.IsReserve10' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="IsReserve11" prop="IsReserve11">
                        <el-switch v-model='dataForm.IsReserve11' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="IsReserve12" prop="IsReserve12">
                        <el-switch v-model='dataForm.IsReserve12' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="IsReserve13" prop="IsReserve13">
                        <el-switch v-model='dataForm.IsReserve13' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="OpenMachineTime" prop="OpenMachineTime">
                        <el-switch v-model='dataForm.OpenMachineTime' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="ManualMachineTime" prop="ManualMachineTime">
                        <el-switch v-model='dataForm.ManualMachineTime' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="ManualAlarmTime" prop="ManualAlarmTime">
                        <el-switch v-model='dataForm.ManualAlarmTime' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="AutoRunTime" prop="AutoRunTime">
                        <el-switch v-model='dataForm.AutoRunTime' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="AutoStandbyTime" prop="AutoStandbyTime">
                        <el-switch v-model='dataForm.AutoStandbyTime' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="AutoAlarmTime" prop="AutoAlarmTime">
                        <el-switch v-model='dataForm.AutoAlarmTime' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="TaskRunTime" prop="TaskRunTime">
                        <el-switch v-model='dataForm.TaskRunTime' :active-value='true' :inactive-value='false'>
                        </el-switch>
                    </el-form-item>
                </el-col>


                <el-col :span="12">
                    <el-form-item label="Job_Two_ID" prop="Job_Two_ID">
                        <el-input-number v-model='dataForm.Job_Two_ID' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="F_Two_Row" prop="F_Two_Row">
                        <el-input-number v-model='dataForm.F_Two_Row' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="F_Two_Col" prop="F_Two_Col">
                        <el-input-number v-model='dataForm.F_Two_Col' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="F_Two_Lay" prop="F_Two_Lay">
                        <el-input-number v-model='dataForm.F_Two_Lay' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="T_Two_Row" prop="T_Two_Row">
                        <el-input-number v-model='dataForm.T_Two_Row' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="T_Two_Col" prop="T_Two_Col">
                        <el-input-number v-model='dataForm.T_Two_Col' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="T_Two_Lay" prop="T_Two_Lay">
                        <el-input-number v-model='dataForm.T_Two_Lay' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Start_one_fork" prop="Start_one_fork">
                        <el-input-number v-model='dataForm.Start_one_fork' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Start_two_fork" prop="Start_two_fork">
                        <el-input-number v-model='dataForm.Start_two_fork' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Target_one_fork" prop="Target_one_fork">
                        <el-input-number v-model='dataForm.Target_one_fork' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Target_two_fork" prop="Target_two_fork">
                        <el-input-number v-model='dataForm.Target_two_fork' placeholder='数字文本' :step='1'
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
                Job_One_ID: 0,
                JobCommand: 0,
                F_One_Row: 0,
                F_One_Col: 0,
                F_One_Lay: 0,
                T_One_Row: 0,
                T_One_Col: 0,
                T_One_Lay: 0,
                IsPost: 0,
                Reserve8: 0,
                Reserve9: 0,
                Reserve10: 0,
                Reserve11: 0,
                Reserve12: 0,
                FireRequestDown: false,
                FireDownOver: false,
                FireAllowDown: false,
                IsReserve9: false,
                IsReserve10: false,
                IsReserve11: false,
                IsReserve12: false,
                IsReserve13: false,
                OpenMachineTime: false,
                ManualMachineTime: false,
                ManualAlarmTime: false,
                AutoRunTime: false,
                AutoStandbyTime: false,
                AutoAlarmTime: false,
                TaskRunTime: false,
                Job_Two_ID: 0,
                F_Two_Row: 0,
                F_Two_Col: 0,
                F_Two_Lay: 0,
                T_Two_Row: 0,
                T_Two_Col: 0,
                T_Two_Lay: 0,
                Start_one_fork: 0,
                Start_two_fork: 0,
                Target_one_fork: 0,
                Target_two_fork: 0,
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
