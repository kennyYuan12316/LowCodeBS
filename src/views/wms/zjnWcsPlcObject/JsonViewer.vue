<template>
	<el-dialog title="plc数据" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center"
		lock-scroll width="1000px">
		<el-skeleton :rows="12" animated  :loading="loading"/>

		<div class="main" v-if="!loading" >

			<el-button type="primary" icon="el-icon-refresh" @click="getData()"></el-button>
			<el-row>&nbsp;</el-row>
			<div class="flex">
				<div class="block" v-for="(item, index) in list" :key="index">
					<div class="edit_btn_box">
						<div>
							<el-tag>{{ item.deviceId + " " + item.packType }}</el-tag>
						</div>

						<div>
							<el-button class="edit_btn" type="primary" icon="el-icon-edit" @click="update(item)">
							</el-button>
						</div>
					</div>


					<!-- <el-tag>{{}}</el-tag> -->

					<json-viewer :value="item.json"></json-viewer>
				</div>
				<!-- <div class="block">
				<el-tag>Write</el-tag>
				<json-viewer :value="jsonDataR"></json-viewer>
			</div> -->
			</div>
		</div>

		<!-- <span slot="footer" class="dialog-footer">
			<el-button @click="visible=false">取 消</el-button>
			<el-button type="primary" @click="dataFormSubmit()" v-if="!isDetail" :loading="btnLoading">确 定</el-button>
		</span> -->
		<PackReadDForm v-if="PackReadDFormVisible" ref="PackReadDForm" @refresh="PackReadDFormrefresh" />
		<PackWriteDForm v-if="PackWriteDFormVisible" ref="PackWriteDForm" @refresh="PackWriteDFormrefresh" />
		<PackStatusDForm v-if="PackStatusDFormVisible" ref="PackStatusDForm" @refresh="PackStatusDFormrefresh" />
		<PackReadForm v-if="PackReadFormVisible" ref="PackReadForm" @refresh="PackReadFormrefresh" />
		<PackWriteForm v-if="PackWriteFormVisible" ref="PackWriteForm" @refresh="PackWriteFormrefresh" />
		<PackStatusForm v-if="PackStatusFormVisible" ref="PackStatusForm" @refresh="PackStatusFormrefresh" />
		<PackStackerReadForm v-if="PackStackerReadFormVisible" ref="PackStackerReadForm" @refresh="PackStackerReadFormrefresh" />
		<PackStackerReadDForm v-if="PackStackerReadDFormVisible" ref="PackStackerReadDForm" @refresh="PackStackerReadDFormrefresh" />
		<PackStackerWriteForm v-if="PackStackerWriteFormVisible" ref="PackStackerWriteForm" @refresh="PackStackerWriteFormrefresh" />
		<PackStackerWriteDForm v-if="PackStackerWriteDFormVisible" ref="PackStackerWriteDForm" @refresh="PackStackerWriteDFormrefresh" />




	</el-dialog>
</template>
<script>
import request from '@/utils/request'
import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'

import PackReadForm from './updatePlcForm/PackReadForm'
import PackWriteForm from './updatePlcForm/PackWriteForm'
import PackStatusForm from './updatePlcForm/PackStatusForm'
import PackReadDForm from './updatePlcForm/PackReadDForm'
import PackWriteDForm from './updatePlcForm/PackWriteDForm'
import PackStatusDForm from './updatePlcForm/PackStatusDForm'
import PackStackerReadForm from './updatePlcForm/PackStackerReadForm'
import PackStackerReadDForm from './updatePlcForm/PackStackerReadDForm'
import PackStackerWriteForm from './updatePlcForm/PackStackerWriteForm'
import PackStackerWriteDForm from './updatePlcForm/PackStackerWriteDForm'



export default {
	components: { 
		PackReadDForm, PackWriteDForm,PackStatusDForm,
		PackReadForm, PackWriteForm,PackStatusForm,
		PackStackerReadForm,PackStackerReadDForm,
		PackStackerWriteForm,PackStackerWriteDForm },
	props: [],
	data() {
		return {
			list: [],
			jsonDataL: undefined,
			jsonDataR: undefined,
			id: undefined,

			btnLoading: false,
			loading: false,
			visible: false,
			isDetail: false,

			PackReadDFormVisible: false,
			PackWriteDFormVisible: false,
			PackStatusDFormVisible: false,
			PackReadFormVisible: false,
			PackWriteFormVisible: false,
			PackStatusFormVisible: false,
			PackStackerReadFormVisible: false,
			PackStackerReadDFormVisible: false,

			PackStackerWriteFormVisible: false,
			PackStackerWriteDFormVisible: false,

			dataForm: {
				plcObjId: '',
				region: undefined,
				plcPointId: undefined,
				plcId: undefined,
				db: undefined,
				start: undefined,
				length: undefined,
				objType: undefined,
				objValue: undefined,
				packType: undefined,
				packSize: undefined,
				deviceId: undefined,
				descrip: undefined,
			},
			rules: {
			},
			regionOptions: [],
			plcPointIdOptions: [{ "value": "PlcPointID", "label": "PlcPointID" }, { "value": "Caption", "label": "点位名称" }, { "value": "Region", "label": "区域" }, { "value": "PlcID", "label": "PlcID" }, { "value": "Db", "label": "Db" }, { "value": "Start", "label": "Start" }],
			plcIdOptions: [{ "value": "PlcID", "label": "PlcID" }, { "value": "Caption", "label": "类型" }, { "value": "Region", "label": "区域" }, { "value": "IP", "label": "IP" }],
			packTypeOptions: [{ 'fullName': "READ", 'id': "READ" }, { 'fullName': "WRITE", 'id': "WRITE" }, { 'fullName': "STATUS", 'id': "STATUS" }],
			deviceIdOptions: [{ "value": "id", "label": "设备编号" }, { "value": "fullName", "label": "设备名称" }, { "value": "Region", "label": "区域" }, { "value": "DeviceType", "label": "设备类型" }],
		}
	},
	computed: {},
	watch: {},
	created() {
		this.getregionOptions();
	},
	mounted() {
	},
	methods: {
		getregionOptions() {
			getDictionaryDataSelector('343037780953138437').then(res => {
				this.regionOptions = res.data.list
			});
		},
		goBack() {
			this.$emit('refresh')
		},
		init(id) {
			this.id = id;
			console.log(id)
			this.list = [];
			this.$nextTick(() => {
				// this.$refs['elForm'].resetFields();
				this.getData()
			});


			// this.dataForm.plcObjId = id || 0;
			this.visible = true;
			// this.isDetail = isDetail || false;

			this.$store.commit('generator/UPDATE_RELATION_DATA', {})
		},
		getData() {
			this.loading = true;

			request({
				url: '/api/wms/ZjnWcsPlcObject/GetPlcJosnData/' + this.id,
				method: 'get'
			}).then(res => {
				this.list = res.data;
				console.log(res.data);
				this.loading = false;
				if (res.code != 200) {
					this.$message({
						type: 'success',
						message: res.msg,
						onClose: () => {
							// this.initData()
						}
					});
				}
			})

		},
		update(item) {

			console.log(item)
			switch (item.objType) {
				case "PackReadD":
					this.PackReadDFormVisible = true
					this.$nextTick(() => {
						this.$refs.PackReadDForm.init(item)
					})
					break;
				case "PackWriteD":
					this.PackWriteDFormVisible = true
					this.$nextTick(() => {
						this.$refs.PackWriteDForm.init(item)
					})
					break;
				case "PackStatusD":
					this.PackStatusDFormVisible = true
					this.$nextTick(() => {
						this.$refs.PackStatusDForm.init(item)
					})
					break;
				case "PackRead":
					this.PackReadFormVisible = true
					this.$nextTick(() => {
						this.$refs.PackReadForm.init(item)
					})
					break;
				case "PackWrite":
					this.PackWriteFormVisible = true
					this.$nextTick(() => {
						this.$refs.PackWriteForm.init(item)
					})
					break;
				case "PackStatus":
					this.PackStatusFormVisible = true
					this.$nextTick(() => {
						this.$refs.PackStatusForm.init(item)
					})
					break;
				case "PackStackerRead":
					this.PackStackerReadFormVisible = true
					this.$nextTick(() => {
						this.$refs.PackStackerReadForm.init(item)
					})
					break;
				case "PackStackerReadD":
					this.PackStackerReadDFormVisible = true
					this.$nextTick(() => {
						this.$refs.PackStackerReadDForm.init(item)
					})
					break;
				case "PackStackerWrite":
					this.PackStackerWriteFormVisible = true
					this.$nextTick(() => {
						this.$refs.PackStackerWriteForm.init(item)
					})
					break;
				case "PackStackerWriteD":
					this.PackStackerWriteDFormVisible = true
					this.$nextTick(() => {
						this.$refs.PackStackerWriteDForm.init(item)
					})
					break;

				default:
					break;
			}


		},
		PackReadDFormrefresh(isrRefresh) {
			this.PackReadDFormVisible = false
			if (isrRefresh) this.getData()
		},
		PackWriteDFormrefresh(isrRefresh) {
			this.PackWriteDFormVisible = false
			if (isrRefresh) this.getData()
		},
		PackStatusDFormrefresh(isrRefresh) {
			this.PackStatusDFormVisible = false
			if (isrRefresh) this.getData()
		},
		PackReadFormrefresh(isrRefresh) {
			this.PackReadFormVisible = false
			if (isrRefresh) this.getData()
		},
		PackWriteFormrefresh(isrRefresh) {
			this.PackWriteFormVisible = false
			if (isrRefresh) this.getData()
		},
		PackStatusFormrefresh(isrRefresh) {
			this.PackStatusFormVisible = false
			if (isrRefresh) this.getData()
		},
		PackStackerReadFormrefresh(isrRefresh) {
			this.PackStackerReadFormVisible = false
			if (isrRefresh) this.getData()
		},
		PackStackerReadDFormrefresh(isrRefresh) {
			this.PackStackerReadDFormVisible = false
			if (isrRefresh) this.getData()
		},
		PackStackerWriteFormrefresh(isrRefresh) {
			this.PackStackerWriteFormVisible = false
			if (isrRefresh) this.getData()
		},
		PackStackerWriteDFormrefresh(isrRefresh) {
			this.PackStackerWriteDFormVisible = false
			if (isrRefresh) this.getData()
		},

		dataFormSubmit() {
			this.$refs['elForm'].validate((valid) => {
				if (valid) {
					this.btnLoading = true;
					if (!this.dataForm.plcObjId) {
						request({
							url: `/api/wms/ZjnWcsPlcObject`,
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
							url: '/api/wms/ZjnWcsPlcObject/' + this.dataForm.plcObjId,
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
<style lang="scss" scoped>
.HSZ-dialog_center {
	.main {
		.flex {
			width: 100%;
			display: flex;

			.block {
				padding: 10px 5px;
				text-align: left;
				border: 1px solid #eff2f6;
				width: 50%;
				box-sizing: border-box;

				.edit_btn_box{
					display:flex ;
					justify-content:space-between;
				}
			}
		}
	}
}
</style>
