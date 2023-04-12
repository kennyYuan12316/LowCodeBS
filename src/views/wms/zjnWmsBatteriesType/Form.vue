<template>
	<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" :disabled="!!isDetail" :rules="rules">
					<el-col :span="24">
						<el-form-item label="电芯种类" prop="batteriesType">
							<el-select v-model='dataForm.batteriesType' placeholder='请选择' clearable required :style='{"width":"100%"}' filterable>
									<el-option v-for="(item, index) in batteriesTypeOptions" :key="index" :label="item.fullName" :value="item.enCode">
									</el-option>
								</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="静置时间（小时）" prop="standingTime">
							<el-input v-model='dataForm.standingTime' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="描述" prop="description">
							<el-input v-model='dataForm.description' placeholder='请输入' show-word-limit :style='{"width":"100%"}' type='textarea' :autosize='{"minRows":4,"maxRows":4}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="创建时间" prop="createTime">
							<el-date-picker v-model='dataForm.createTime' placeholder='请选择' clearable :style='{"width":"100%"}' type='date' format='yyyy-MM-dd' value-format='timestamp' >
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="有效标志" prop="enabledMark">
							<el-switch v-model='dataForm.enabledMark' :active-value='1' :inactive-value='0' >
							</el-switch>
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
				batteriesTypeOptions:[],
				dataForm: {
					id:'',
					batteriesType:undefined,
					standingTime:undefined,
					description:undefined,
					createTime:undefined,
					enabledMark:0,
				},
				rules: {
				},
			}
		},
		computed: {},
        watch: {},
        created() {
			this.getbatteriesTypeOptions()
		},
		mounted() {
        },
		methods: {
			getbatteriesTypeOptions(){
				getDictionaryDataSelector('356947142322947333').then(res => {
					this.batteriesTypeOptions = res.data.list
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
							url: '/api/wms/ZjnWmsBatteriesType/' + this.dataForm.id,
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
                                url: `/api/wms/ZjnWmsBatteriesType`,
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
                                url: '/api/wms/ZjnWmsBatteriesType/' + this.dataForm.id,
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
