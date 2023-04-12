<template>
	<el-dialog :title="'修改子任务'" :close-on-click-modal="false" :append-to-body="true" :visible.sync="visible"
		class="HSZ-dialog HSZ-dialog_center" lock-scroll width="800px">
		<el-row :gutter="15" class="">
			<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right"
				:rules="rules">

				<el-col :span="24">
					<el-form-item label="子任务号" prop="taskDetailsId">
						<el-input v-model='dataForm.taskDetailsId' placeholder='请输入' :disabled="true" clearable
							:style='{ "width": "100%" }'>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="任务类型" prop="taskType">
						<el-select v-model='dataForm.taskType' placeholder='请选择' clearable required
							:style='{ "width": "100%" }'>
							<el-option v-for="(item, index) in workTypeOptions" :key="index" :label="item.fullName"
								:value="item.enCode"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="起点" prop="taskDetailsStart">
						<popupSelect v-model="dataForm.taskDetailsStart" field="Capion" placeholder="请选择起点站点" clearable
							required relationField="Capion#DeviceID" :columnOptions="deviceToOptions" :pageSize="20"
							:hasPage="true" propsValue="DeviceID" interfaceId="357306936955241733" popupType="dialog"
							popupTitle="选择数据" popupWidth="800px" @change="changeStart">
						</popupSelect>
					</el-form-item>
				</el-col>

				<el-col :span="8">
					<el-form-item label="起点行" prop="rowStart">
						<el-input-number v-model="dataForm.rowStart" placeholder="起点行" :step="1" />
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="起点列" prop="cellStart">
						<el-input-number v-model="dataForm.cellStart" placeholder="起点列" :step="1" />
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="起点层" prop="layerStart">
						<el-input-number v-model="dataForm.layerStart" placeholder="起点层" :step="1" />
					</el-form-item>
				</el-col>


				<el-col :span="24">
					<el-form-item label="终点终点" prop="taskDetailsEnd">
						<popupSelect v-model="dataForm.taskDetailsEnd" field="Capion" placeholder="请选择终点站点" clearable
							required relationField="Capion#DeviceID" :columnOptions="deviceToOptions" :pageSize="20"
							:hasPage="true" propsValue="DeviceID" interfaceId="357306936955241733" popupType="dialog"
							popupTitle="选择数据" popupWidth="800px" @change="changeEnd">
						</popupSelect>
					</el-form-item>
				</el-col>

				<el-col :span="8">
					<el-form-item label="终点行" prop="rowEnd">
						<el-input-number v-model="dataForm.rowEnd" placeholder="终点行" :step="1" />
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="终点列" prop="cellEnd">
						<el-input-number v-model="dataForm.cellEnd" placeholder="终点列" :step="1" />
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="终点层" prop="layerEnd">
						<el-input-number v-model="dataForm.layerEnd" placeholder="终点层" :step="1" />
					</el-form-item>
				</el-col>

				<el-col :span="24">
					<el-form-item label="任务状态" prop="taskDetailsStates">
						<el-select v-model='dataForm.taskDetailsStates' placeholder='请选择' clearable required
							:style='{ "width": "100%" }'>
							<el-option v-for="(item, index) in taskDetailsStatesOptions" :key="index" :label="item.fullName"
								:value="item.enCode"></el-option>
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="24">
					<el-form-item label="输送设备" prop="taskDetailsMove">
						<el-input v-model='dataForm.taskDetailsMove' placeholder='请输入' clearable
							:style='{ "width": "100%" }'>
						</el-input>
					</el-form-item>
				</el-col>





			</el-form>
		</el-row>
		<span slot="footer" class="dialog-footer">
			<el-button @click="visible = false">取 消</el-button>
			<el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading">确 定</el-button>
		</span>
	</el-dialog>
</template>
<script>
import request from '@/utils/request'
import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
import { deepClone } from '@/utils'
export default {
	components: {},
	props: [],
	data() {
		return {
			btnLoading: false,
			loading: false,
			visible: false,
			isDetail: false,

			dataForm: {
				taskDetailsId: '',
				taskDetailsStart: undefined,
				taskDetailsStartName: undefined,
				rowStart: undefined,
				cellStart: undefined,
				layerStart: undefined,
				taskDetailsEnd: undefined,
				taskDetailsEndName: undefined,
				rowEnd: undefined,
				cellEnd: undefined,
				layerEnd: undefined,
				taskType: undefined,
				taskDetailsStates: undefined,
				taskDetailsMove:undefined,
			},
			rules: {
				deviceTo: [
					{
						required: true,
						message: '请选择目的地站点',
						trigger: 'blur'
					},
				],

			},
			typeOptions: [],
			trayStateOptions: [],
			workTypeOptions: [],
			taskDetailsStatesOptions:[],
			deviceToOptions: [
				{ value: "DeviceID", label: "站点编号" },
				{ value: "Capion", label: "站点名称" },
				{ value: "F_Row", label: "行" },
				{ value: "F_Cell", label: "列" },
				{ value: "F_Layer", label: "层" },

			],
		}
	},
	computed: {},
	watch: {},
	created() {
		this.getworkTypeOptions();
		this.gettaskDetailsStatesOptions();
	},
	mounted() {
	},
	methods: {
		getworkTypeOptions() {
			getDictionaryDataSelector('349394962401461509').then(res => {
				this.workTypeOptions = res.data.list
			});
		},
		gettaskDetailsStatesOptions() {
			getDictionaryDataSelector('349416203686511877').then(res => {
				this.taskDetailsStatesOptions = res.data.list
			});
		},
		goBack() {
			this.$emit('refresh')
		},
		init(data) {
			console.log(data)
			var data = deepClone(data)

			this.dataForm.id = data.taskDetailsId || 0;
			this.visible = true;
			this.$nextTick(() => {
				this.$refs['elForm'].resetFields();
				this.dataForm = data;
				this.dataForm.taskType += "";
				this.dataForm.taskDetailsStates += "";

			});
			this.$store.commit('generator/UPDATE_RELATION_DATA', {})

		},
		dataFormSubmit() {
			console.log("test")
			this.$refs['elForm'].validate((valid) => {
				if (valid) {
					this.btnLoading = true;
					if (!this.dataForm.taskDetailsId) {
						// request({
						// 	url: `/api/wms/ZjnPlaneTray`,
						// 	method: 'post',
						// 	data: this.dataForm,
						// }).then((res) => {
						// 	this.$message({
						// 		message: res.msg,
						// 		type: 'success',
						// 		duration: 1000,
						// 		onClose: () => {
						// 			this.btnLoading = false;
						// 			this.visible = false,
						// 				this.$emit('refresh', true)
						// 		}
						// 	})
						// })
					} else {

						request({
							url: '/api/wms/ZjnWmsTask/UpadteTask',
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
		changeStart(id, row) {
			console.log(id, row)
			this.dataForm.taskDetailsStartName=row.Capion;
			this.dataForm.rowStart=row.F_Row;
			this.dataForm.cellStart=row.F_Cell;
			this.dataForm.layerStart=row.F_Layer;

		},
		changeEnd(id, row) {
			console.log(id, row)
			this.dataForm.taskDetailsEndName=row.Capion;
			this.dataForm.rowEnd=row.F_Row;
			this.dataForm.cellEnd=row.F_Cell;
			this.dataForm.layerEnd=row.F_Layer;
		},
	}
}
</script>
