<template>
	<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'" :close-on-click-modal="false"
		:visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="">
			<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right"
				:disabled="!!isDetail" :rules="rules">
				<el-col :span="12">
					<el-form-item label="分组编号" prop="roadwayNo">
						<el-input v-model='dataForm.roadwayNo' :disabled="istrues" placeholder='请输入' clearable required
							:style='{"width":"100%"}'>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="分组名称" prop="roadwayName">
						<el-input v-model='dataForm.roadwayName' :disabled="istrues" placeholder='请输入' clearable
							required :style='{"width":"100%"}'>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="分组描述" prop="description">
						<el-input v-model='dataForm.description' :disabled="istrues" placeholder='请输入' clearable
							:style='{"width":"100%"}'>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="是否启用" prop="enabledMark">
						<el-switch v-model='dataForm.enabledMark' :inactive-value='0' :active-value='1'>
						</el-switch>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label-width="0">
						<el-table :data="dataForm.zjnRoadwayGroupDetailsList" size='mini'
							:row-class-name="tableRowClassName" @row-click="onRowClick"
							:summary-method='getZjnPlaneBillsInOutOrder'>
							<el-table-column type="index" width="50" label="序号" align="center" />
							<el-table-column prop="roadwayDetailsNo" label="巷道编号">
								<template slot-scope="scope">
									<el-form-item label-width="0"
										:prop="'zjnRoadwayGroupDetailsList.'+scope.$index+'.roadwayDetailsNo'"
										:rules="detailrules.roadwayDetailsNo">
										<popupSelect v-model="scope.row.roadwayDetailsNo"
											:field="'roadwayDetailsNo'+scope.$index" placeholder='请选择' required
											relationField='F_AisleNo' :columnOptions='roadwayDetailsNoOptions'
											:pageSize='50' propsValue='F_AisleNo' interfaceId='343207575606527237'
											popupType='dialog' popupTitle='选择数据' popupWidth='800px'
											@change="productsNoChcek">
										</popupSelect>
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column prop="roadwayDetailsName" label="巷道名称">
								<template slot-scope="scope">
									<el-input v-model="scope.row.roadwayDetailsName" :disabled="istrues"
										placeholder='请输入' clearable disabled>
									</el-input>
								</template>
							</el-table-column>
							<!-- <el-table-column prop="roadwayDetailsGrade" label="巷道排序">
								<template slot-scope="scope">
									<el-input v-model="scope.row.roadwayDetailsGrade" placeholder='请输入' clearable
										required>
									</el-input>
								</template>
							</el-table-column> -->
							<el-table-column prop="enabledMark" label="是否启用">
								<template slot-scope="scope">
									<el-switch v-model="scope.row.enabledMark" :active-value='1' :inactive-value='0'>
									</el-switch>
								</template>
							</el-table-column>
							<el-table-column label="操作" width="50">
								<template slot-scope="scope">
									<el-button size="mini" type="text" class="HSZ-table-delBtn"
										@click="handleDelZjnRoadwayGroupDetailsEntityList(scope.$index)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
						<div class="table-actions" @click="addHandleZjnRoadwayGroupDetailsEntityList()">
							<el-button type="text" icon="el-icon-plus">新增</el-button>
						</div>
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
		var checklocationNo = (rule, value, callback) => {
			if (!value) {
				callback(new Error('编号已存在'))
			} else {
				if (!this.dataForm.id) {
					request({
						url: `/api/wms/ZjnWmsRoadwayGroup/ExistLocationNo`,
						method: 'GET',
						data: { LocationNo: value }
					}).then((res) => {
						if (res.data) {
							callback(new Error('编号已存在！'))
						} else {
							callback()
						}
					})
				} else {
					callback()
				}
			}
		}
		var checkgroupDetailsNo = (rule, value, callback) => {
			var index = this.dataForm.zjnRoadwayGroupDetailsList.findIndex(function (el) {
				return el.roadwayDetailsNo == value
			})
			if (index != -1 && index != rule.field.split('.')[1]) {
				callback(new Error('此巷道分组明细编号已填！'))
			}
		}
		return {
			btnLoading: false,
			loading: false,
			visible: false,
			isDetail: false,
			istrues: false,
			checkRowNumber: 0,
			dataForm: {
				id: '',
				roadwayNo: undefined,
				roadwayName: undefined,
				description: undefined,
				enabledMark: 0,
				zjnRoadwayGroupDetailsList: [],
			},
			rules: {
				roadwayNo: [
					{
						required: true,
						//message: '请输入分组编号',
						trigger: 'blur',
						validator: checklocationNo
					},
				],
				roadwayName: [
					{
						required: true,
						message: '请输入分组名称',
						trigger: 'blur'
					},
				],
			},
			detailrules:
			{
				groupDetailsNo: [
					{
						required: true,
						trigger: 'blur',
						validator: checkgroupDetailsNo
					}
				],
			},
			roadwayDetailsNoOptions: [{ "value": "F_AisleNo", "label": "巷道编号" }, { "value": "F_AisleName", "label": "巷道名称" }, { "value": "F_RegionNo", "label": "所在区域" }],
		}
	},
	computed: {},
	watch: {},
	created() {
	},
	mounted() {
	},
	methods: {
		//货物编号选择事件
		productsNoChcek(p1, p2) {
			console.log('啦啦啦')
			console.log(p2)
			console.log(p2.F_AisleName);
			console.log(this.dataForm.zjnRoadwayGroupDetailsList);
			var i = 1;
			this.dataForm.zjnRoadwayGroupDetailsList.forEach(element => {
				if (element.roadwayDetailsNo == p2.F_AisleNo) {
					if (i > 1) {
						this.$message({ message: '警告，巷道已经存在', type: 'warning' });
						//赋值
						this.dataForm.zjnRoadwayGroupDetailsList[this.checkRowNumber].roadwayDetailsNo = null;
						this.dataForm.zjnRoadwayGroupDetailsList[this.checkRowNumber].roadwayDetailsName = null;
						return;
					} else {
						//赋值
						this.dataForm.zjnRoadwayGroupDetailsList[this.checkRowNumber].roadwayDetailsName = p2.F_AisleName;
					}
					i++;
				}
			});
		},
		goBack() {
			this.$emit('refresh')
		},
		init(id, isDetail) {
			this.dataForm.zjnRoadwayGroupDetailsList = [];
			this.dataForm.id = id || 0;
			this.visible = true;
			this.istrues = false;
			this.isDetail = isDetail || false;
			this.$nextTick(() => {
				this.$refs['elForm'].resetFields();
				if (this.dataForm.id) {
					request({
						url: '/api/wms/ZjnWmsRoadwayGroup/' + this.dataForm.id,
						method: 'get'
					}).then(res => {
						this.dataForm = res.data;
						this.istrues = true;
					})
				} else {

					this.dataForm.enabledMark = 1;
				}
			});
			this.$store.commit('generator/UPDATE_RELATION_DATA', {})
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

		dataFormSubmit() {
			this.$refs['elForm'].validate((valid) => {
				if (valid) {
					this.btnLoading = true;
					if (!this.dataForm.id) {
						request({
							url: `/api/wms/ZjnWmsRoadwayGroup`,
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
							url: '/api/wms/ZjnWmsRoadwayGroup/' + this.dataForm.id,
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
		tableRowClassName({
			row,
			rowIndex
		}) {
			row.index = rowIndex;
		},
		//单击行事件
		onRowClick(row, column, cell, event) {
			console.log(row.index);
			this.checkRowNumber = row.index
		},
		addHandleZjnRoadwayGroupDetailsEntityList() {
			let item = {
				roadwayDetailsNo: undefined,
				roadwayDetailsName: undefined,
				roadwayDetailsGrade: undefined,
				enabledMark: 1,
			}

			this.dataForm.zjnRoadwayGroupDetailsList.push(item)
		},
		handleDelZjnRoadwayGroupDetailsEntityList(index) {
			this.dataForm.zjnRoadwayGroupDetailsList.splice(index, 1);
		},
	}
}
</script>
