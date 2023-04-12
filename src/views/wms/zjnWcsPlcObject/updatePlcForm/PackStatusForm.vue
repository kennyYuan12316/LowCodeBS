<template>
    <el-dialog :title="'编辑PLC   DB'+this.item.db+'-'+this.item.objType" append-to-body :close-on-click-modal="false" :visible.sync="visible"
        class="HSZ-dialog HSZ-dialog_center" lock-scroll width="800px">
        <el-row :gutter="15" class="">
            <el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right"
                :disabled="!!isDetail" :rules="rules">

                <el-col :span="24">
                    <el-form-item label="设备号" prop="DeviceCode_S">
                        <el-input v-model='dataForm.DeviceCode_S' placeholder='请输入'  clearable
                            :style='{ "width": "100%" }'>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="任务号" prop="TaskCode">
                        <el-input-number v-model='dataForm.TaskCode' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
               
                <el-col :span="12">
                    <el-form-item label="托盘" prop="TrayCode_S">
                        <el-input v-model='dataForm.TrayCode_S' placeholder='请输入' clearable :style='{ "width": "100%" }'>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="目标位置" prop="TargetDevice_S">
                        <el-input v-model='dataForm.TargetDevice_S' placeholder='请输入' clearable
                            :style='{ "width": "100%" }'>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="是否占位(0占位1无)" prop="ExistTray">
                        <el-input-number v-model='dataForm.ExistTray' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="报警" prop="Alarm">
                        <el-input-number v-model='dataForm.Alarm' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="状态" prop="Status">
                        <el-input-number v-model='dataForm.Status' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="预留字段1" prop="Reserve1">
                        <el-input-number v-model='dataForm.Reserve1' placeholder='数字文本' :step='1'
                            controls-position='right'>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="预留字段2" prop="Reserve2">
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
            item:undefined,
            dataForm: {
                DeviceCode_S: "",
                TaskCode: 0,
                TrayCode_S: "",
                TargetDevice_S: "",
                ExistTray: 0,
                Alarm: 0,
                Status: 0,
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
            this.item=deepClone(item);
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
                    if (this.dataForm.DeviceCode_S && this.item) {
                        this.item.json=this.dataForm;
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
                                message:"参数为空",
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
