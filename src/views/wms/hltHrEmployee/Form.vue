<template>
	<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" :disabled="!!isDetail" :rules="rules">
					<el-col :span="12">
						<el-form-item label="新工号" prop="a1">
							<el-input v-model='dataForm.a1' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="适配器工号" prop="a2">
							<el-input v-model='dataForm.a2' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="嘉扬工号" prop="a3">
							<el-input v-model='dataForm.a3' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="勤达工号" prop="a4">
							<el-input v-model='dataForm.a4' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="F3工号" prop="a5">
							<el-input v-model='dataForm.a5' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="姓名" prop="a6">
							<el-input v-model='dataForm.a6' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="行政部门" prop="a7">
							<el-input v-model='dataForm.a7' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="手机号码" prop="a8">
							<el-input v-model='dataForm.a8' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="在职状态" prop="a9">
							<el-input v-model='dataForm.a9' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="更新时间" prop="a10">
							<el-date-picker v-model='dataForm.a10' placeholder='请选择' clearable :style='{"width":"100%"}' type='date' format='yyyy-MM-dd' value-format='timestamp' >
							</el-date-picker>
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
					a1:undefined,
					a2:undefined,
					a3:undefined,
					a4:undefined,
					a5:undefined,
					a6:undefined,
					a7:undefined,
					a8:undefined,
					a9:undefined,
					a10:undefined,
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
							url: '/api/wms/HltHrEmployee/' + this.dataForm.id,
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
                                url: `/api/wms/HltHrEmployee`,
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
                                url: '/api/wms/HltHrEmployee/' + this.dataForm.id,
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
