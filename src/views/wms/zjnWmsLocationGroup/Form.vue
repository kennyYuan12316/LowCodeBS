<template>
	<transition name="el-zoom-in-center">
		<div class="HSZ-preview-main">
			<div class="HSZ-common-page-header">
				<el-page-header @back="goBack" :content="!dataForm.id ? '新建' : isDetail ? '详情' : '编辑'" />
				<div class="options">
					<el-button type="primary" @click="dataFormSubmit()" v-if="!isDetail" :loading="btnLoading">确 定
					</el-button>
					<el-button @click="goBack">取 消</el-button>
				</div>
			</div>
			<div :style="{margin: '0 auto',width:'100%'}">
				<el-row :gutter="15" class=" main">
					<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right"
						:disabled="!!isDetail" :rules="rules">
						<el-col :span="12">
							<el-form-item label="货位分组编号" prop="groupNo">
								<el-input v-model='dataForm.groupNo' placeholder='请输入' clearable
									:style='{"width":"100%"}'>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="货位分组类型" prop="groupName">
								<el-select v-model='dataForm.groupName' placeholder='请选择' clearable required :style='{"width":"100%"}'>
									<el-option v-for="(item, index) in groupNameOptions" :key="index" :label="item.fullName" :value="item.enCode">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="货位分组描述" prop="description">
								<el-input v-model='dataForm.description' placeholder='请输入' clearable
									:style='{"width":"100%"}'>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="是否启用" prop="enabledMark">
								<el-switch v-model='dataForm.enabledMark' :active-value='1' :inactive-value='0'>
								</el-switch>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label-width="0">
								<el-table :data="dataForm.zjnLocationGroupDetailsList" >
									<el-table-column type="index" width="50" label="序号" align="center" />
									<el-table-column prop="groupDetailsNo" label="货位分组明细编号" required>
										<template slot-scope="scope">
												<el-input v-model="scope.row.groupDetailsNo=dataForm.groupNo+'-'+scope.$index" disabled="true">
												</el-input>
										</template>
									</el-table-column>

									<el-table-column prop="startRow" label="货位起始行">
										<template slot-scope="scope">
											<el-input-number v-model="scope.row.startRow" placeholder='请输入' clearable>
											</el-input-number>

										</template>
									</el-table-column>
									<el-table-column prop="endRow" label="货位终止行">
										<template slot-scope="scope">
											<el-input-number v-model="scope.row.endRow" placeholder='请输入' clearable>
											</el-input-number>
										</template>
									</el-table-column>
									<el-table-column prop="startCell" label="货位起始列">
										<template slot-scope="scope">
											<el-input-number v-model="scope.row.startCell" placeholder='请输入' clearable>
											</el-input-number>
										</template>
									</el-table-column>
									<el-table-column prop="endCell" label="货位终止列">
										<template slot-scope="scope">
											<el-input-number v-model="scope.row.endCell" placeholder='请输入' clearable>
											</el-input-number>
										</template>
									</el-table-column>
									<el-table-column prop="startLayer" label="货位起始层">
										<template slot-scope="scope">
											<el-input-number v-model="scope.row.startLayer" placeholder='请输入' clearable>
											</el-input-number>
										</template>
									</el-table-column>
									<el-table-column prop="endLayer" label="货位终止层">
										<template slot-scope="scope">
											<el-input-number v-model="scope.row.endLayer" placeholder='请输入' clearable>
											</el-input-number>
										</template>
									</el-table-column>
									<el-table-column prop="startDepth" label="货位起始位深">
										<template slot-scope="scope">
											<el-input-number v-model="scope.row.startDepth" placeholder='请输入' clearable>
											</el-input-number>
										</template>
									</el-table-column>
									<el-table-column prop="endDepth" label="货位终止位深">
										<template slot-scope="scope">
											<el-input-number v-model="scope.row.endDepth" placeholder='请输入' clearable>
											</el-input-number>
										</template>
									</el-table-column>
									<el-table-column prop="enabledMark" label="是否启用">
										<template slot-scope="scope">
											<el-switch v-model="scope.row.enabledMark" :active-value='1'
												:inactive-value='0'>
											</el-switch>
										</template>
									</el-table-column>
									<el-table-column label="操作" width="50">
										<template slot-scope="scope">
											<el-button size="mini" type="text" class="HSZ-table-delBtn"
												@click="handleDelZjnLocationGroupDetailsEntityList(scope.$index)">删除
											</el-button>
										</template>
									</el-table-column>
								</el-table>
								<div class="table-actions" @click="addHandleZjnLocationGroupDetailsEntityList()">
									<el-button type="text" icon="el-icon-plus">新增</el-button>
								</div>
							</el-form-item>
						</el-col>
					</el-form>
				</el-row>
			</div>
		</div>
	</transition>
</template>
<script>
import request from '@/utils/request'
import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
export default {
	components: {},
	props: [],
	data() {
		var checkgroupNo = (rule, value, callback) => {
			if (!value) {
				callback(new Error('请输入货位组编号'))
			} else {
				if (!this.dataForm.id) {
					request({
						url: `/api/wms/ZjnWmsLocationGroup/ExistGroupNo`,
						method: 'GET',
						data: { GroupNo: value }
					}).then((res) => {
						if (res.data) {
							callback(new Error('货位组编号已存在！'))
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
			var index = this.dataForm.zjnLocationGroupDetailsList.findIndex(function (el) {
				return el.groupDetailsNo == value
			})
			if (!value) {
				callback(new Error('请输入货位分组明细编号'))
			}
			else if (index != -1 && index != rule.field.split('.')[1]) {
				callback(new Error('此货位分组明细编号已填！'))
			}
			else {
				if (!this.dataForm.id) {
					request({
						url: `/api/wms/ZjnWmsLocationGroup/ExistGroupDetailsNo`,
						method: 'GET',
						data: { GroupDetailsNo: value }
					}).then((res) => {
						if (res.data) {
							callback(new Error('货位分组明细编号已存在！'))
						} else {
							callback()
						}
					})
				}
				else {
					callback()
				}
			}
		}
		return {
			btnLoading: false,
			loading: false,
			visible: false,
			isDetail: false,
			groupNameOptions:[],
			dataForm: {
				id: '',
				groupNo: undefined,
				groupName: undefined,
				description: undefined,
				enabledMark: 0,
				zjnLocationGroupDetailsList: [],
			},
			rules:
			{
				groupNo: [
					{
						required: true,
						trigger: 'blur',
						validator: checkgroupNo
					}
				],
				groupName: [
					{
						required: true,
						message: '请输入货位分组名称',
						trigger: 'blur'
					}
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
		}
	},
	computed: {},
	watch: {},
	created() {
	 this.	getgroupNameOptions();
	},
	mounted() {
	},
	methods: {
		getgroupNameOptions(){
				getDictionaryDataSelector('350069536688440581').then(res => {
					this.groupNameOptions = res.data.list
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
						url: '/api/wms/ZjnWmsLocationGroup/' + this.dataForm.id,
						method: 'get'
					}).then(res => {
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
							url: `/api/wms/ZjnWmsLocationGroup`,
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
							url: '/api/wms/ZjnWmsLocationGroup/' + this.dataForm.id,
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
		addHandleZjnLocationGroupDetailsEntityList() {  
			let item = {
				groupDetailsNo: undefined,
				startRow: undefined,
				endRow: undefined,
				startCell: undefined,
				endCell: undefined,
				startLayer: undefined,
				endLayer: undefined,
				startDepth: undefined,
				endDepth: undefined,
				enabledMark: 1,
			}
			this.dataForm.zjnLocationGroupDetailsList.push(item);
			
		},
		handleDelZjnLocationGroupDetailsEntityList(index) {
			this.dataForm.zjnLocationGroupDetailsList.splice(index, 1);
		},
	}
}
</script>
