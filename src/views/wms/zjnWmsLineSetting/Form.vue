<template>
	<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'" :close-on-click-modal="false"
		:visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="">
			<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right"
				:disabled="!!isDetail" :rules="rules">
				<el-col :span="24">
					<el-form-item label="线体编号" prop="lineNo">
						<el-input v-model='dataForm.lineNo' placeholder='请输入' clearable required
							:style='{"width":"100%"}' :disabled='!!dataForm.id'>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="线体名称" prop="lineName">
						<el-input v-model='dataForm.lineName' placeholder='请输入' clearable required
							:style='{"width":"100%"}'>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24"> 
					<el-form-item label="电芯类型" prop="goodsType">
							<el-select v-model='dataForm.goodsType' placeholder='请选择' clearable required :style='{"width":"100%"}' >
								<el-option v-for="(item, index) in GoodsTypeOptions" :key="index" :label="item.fullName" :value="item.enCode" ></el-option>
							</el-select>
						</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="线体缓存起点" prop="lineStart">
						<el-input v-model='dataForm.lineStart' placeholder='请输入' clearable required
							:style='{"width":"100%"}'>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="线体缓存终点" prop="lineEnd">
						<el-input v-model='dataForm.lineEnd' placeholder='请输入' clearable required
							:style='{"width":"100%"}'>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="线体层" prop="lineLayer">
						<el-input v-model='dataForm.lineLayer' placeholder='请输入' clearable required
							:style='{"width":"100%"}'>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="线体最大任务（缓存）数" prop="lineMaxWork">
						<el-input-number v-model='dataForm.lineMaxWork' placeholder='数字文本' required :step='1' :min="1">
						</el-input-number>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="线体描述" prop="description">
						<el-input v-model='dataForm.description' placeholder='请输入' show-word-limit
							:style='{"width":"100%"}' type='textarea' :autosize='{"minRows":4,"maxRows":4}'>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="是否启用" prop="enabledMark">
						<el-switch v-model='dataForm.enabledMark' :active-value='1' :inactive-value='0'>
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
		var checkLineNo = (rule, value, callback) => {
			if (!value) {
				callback(new Error('请输入线体编号'))
			} else {
				if (!this.dataForm.id) {
					request({
						url: `/api/wms/ZjnWmsLineSetting/existLineNo`,
						method: 'GET',
						data: { lineNo: value }
					}).then((res) => {
						if (res.data) {
							callback(new Error('线体编号已存在！'))
						} else {
							callback()
						}
					})
				} else {
					callback()
				}
			}
		}
		return {
			btnLoading: false,
			loading: false,
			visible: false,
			isDetail: false,
			dataForm: {
				id: '',
				lineNo: undefined,
				lineName: undefined,
				lineMaxWork: undefined,
				description: undefined,
				enabledMark: 1,
			},
			rules: {
				lineNo: [
					{
						required: true,
						trigger: 'blur',
						validator: checkLineNo
					},
				],
				lineName: [
					{
						required: true,
						message: '请输入线体名称',
						trigger: 'blur'
					},
				],
				lineMaxWork: [
					{
						required: true,
						message: '请输入线体最大任务（缓存）数',
						trigger: ["blur", "change"]
					},
				]
			},
			GoodsTypeOptions:[],
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
			this.getGoodsTypeOptions();
			this.dataForm.id = id || 0;
			this.visible = true;
			this.isDetail = isDetail || false;
			this.$nextTick(() => {
				this.$refs['elForm'].resetFields();
				if (this.dataForm.id) {
					request({
						url: '/api/wms/ZjnWmsLineSetting/' + this.dataForm.id,
						method: 'get'
					}).then(res => {
						this.dataForm = res.data;
					})
				}
			});
			this.$store.commit('generator/UPDATE_RELATION_DATA', {})
		},
		getGoodsTypeOptions(){
				getDictionaryDataSelector('325449144728552709').then(res => {
					this.GoodsTypeOptions = res.data.list
				});
			},
		dataFormSubmit() {
			this.$refs['elForm'].validate((valid) => {
				if (valid) {
					this.btnLoading = true;
					if (!this.dataForm.id) {
						request({
							url: `/api/wms/ZjnWmsLineSetting`,
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
							url: '/api/wms/ZjnWmsLineSetting/' + this.dataForm.id,
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
