<template>
	<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" :disabled="!!isDetail" :rules="rules">
					<el-col :span="24">
						<el-form-item label-width="0">
							<HSZ-Text value="立库下单" :textStyle='{"color":"#000000","text-align":"center","font-weight":"bold","font-style":"normal","text-decoration":"none","line-height":32,"font-size":20}' :style='{"width":"100%"}'></HSZ-Text>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="业务关系编码" prop="brCode">
							<el-input v-model='dataForm.brCode' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="托盘编码" prop="trayId">
							<el-input v-model='dataForm.trayId' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="起点库区编码" prop="startAreaCode">
							<el-input v-model='dataForm.startAreaCode' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="起点库位编码" prop="startLocCode">
							<el-input v-model='dataForm.startLocCode' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="终点库区编码" prop="endAreaCode">
							<el-input v-model='dataForm.endAreaCode' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="终点库位编码" prop="endLocCode">
							<el-input v-model='dataForm.endLocCode' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="LES订单ID" prop="lesOrderId">
							<el-input v-model='dataForm.lesOrderId' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="外部订单ID" prop="outerOrderId">
							<el-input v-model='dataForm.outerOrderId' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
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
	import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
	import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
	export default {
		components: {},
		props: [],
		data() {
			return {
				btnLoading:false,
				loading: false,
				visible: false,
				isDetail: false,
				dataForm: {
					id:'',
					brCode:undefined,
					trayId:undefined,
					startAreaCode:undefined,
					startLocCode:undefined,
					endAreaCode:undefined,
					endLocCode:undefined,
					lesOrderId:undefined,
					outerOrderId:undefined,
				},
				rules: {
				},
			}
		},
		computed: {},
        watch: {},
        created() {
		},
		mounted() {
        },
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
							url: '/api/agv/ZjnBaseStdCreateorder/' + this.dataForm.id,
							method: 'get'
						}).then(res =>{
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
                                url: `/api/agv/ZjnBaseStdCreateorder`,
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
                                url: '/api/agv/ZjnBaseStdCreateorder/' + this.dataForm.id,
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
