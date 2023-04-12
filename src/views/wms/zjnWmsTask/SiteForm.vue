<template>
	<el-dialog :title="'修改目的地站点'" :close-on-click-modal="false" :append-to-body="true"
		:visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="">
			<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right"
				 :rules="rules">
				<el-col :span="24">
					<el-form-item label="目的地站点" prop="deviceTo">
						<popupSelect v-model="dataForm.deviceTo" field="deviceTo" placeholder="请选择终点站点" clearable
							required relationField="Capion" :columnOptions="deviceToOptions" :pageSize="20"
							propsValue="StationID" interfaceId="343244101333812485" popupType="dialog" popupTitle="选择数据"
							popupWidth="800px">
						</popupSelect>
					</el-form-item>
				</el-col>



			</el-form>
		</el-row>
		<span slot="footer" class="dialog-footer">
			<el-button @click="visible=false">取 消</el-button>
			<el-button type="primary" @click="dataFormSubmit()"  :loading="btnLoading">确 定</el-button>
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
			btnLoading: false,
			loading: false,
			visible: false,
			isDetail: false,

			dataForm: {
				id: '',
				deviceTo: undefined,
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
			deviceToOptions: [
        { value: "StationID", label: "站点编号" },
        { value: "Capion", label: "站点名称" },
      ],
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
		init(id,taskDetailsEnd) {
			console.log(id)
			this.dataForm.id = id || 0;
			this.visible = true;
			this.dataForm.deviceTo=taskDetailsEnd;
			 this.$nextTick(() => {
			// 	// this.$refs['elForm'].resetFields();
				
			 });
			//  this.$store.commit('generator/UPDATE_RELATION_DATA', {})

		},
		dataFormSubmit() {
			console.log("test")
			this.$refs['elForm'].validate((valid) => {
				if (valid) {
					this.btnLoading = true;
					if (!this.dataForm.id) {
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
							url: '/api/wms/ZjnWmsTask/'+this.dataForm.id+'/UpadteTaskSite/'+this.dataForm.deviceTo ,
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
