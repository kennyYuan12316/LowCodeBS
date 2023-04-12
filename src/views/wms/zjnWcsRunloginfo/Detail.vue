<template>
	<el-dialog title="详情" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right">
					<el-col :span="12">
						<el-form-item label="业务类型" label-width="100px">
							<p>{{dataForm.runType}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="设备号" label-width="100px">
							<p>{{dataForm.equipmentCode}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="任务号1" label-width="100px">
							<p>{{dataForm.taskCode1}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="任务号2" label-width="100px">
							<p>{{dataForm.taskCode2}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="托盘条码1" label-width="100px">
							<p>{{dataForm.containerBarcode1}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="托盘条码2" label-width="100px">
							<p>{{dataForm.containerBarcode2}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="日志信息" label-width="100px">
							<p>{{dataForm.runLog}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="创建时间" label-width="100px">
							<p>{{ dataForm.createTime | toDate("yyyy-MM-dd hh:mm:ss") }}</p>
						</el-form-item>
					</el-col>

				</el-form>
		</el-row>
		<span slot="footer" class="dialog-footer">
			<el-button @click="visible=false">取 消</el-button>
		</span>
	</el-dialog>
</template>
<script>
	import request from '@/utils/request'
	export default {
		props: [],
		data() {
			return {
				loading: false,
				visible: false,
				dataForm: {
					id:'',
					runType:undefined,
					equipmentCode:undefined,
					taskCode1:undefined,
					taskCode2:undefined,
					containerBarcode1:undefined,
					containerBarcode2:undefined,
					runLog:undefined,
					createTime:undefined,
				},
			}
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
							url: '/api/wms/ZjnWcsRunloginfo/' + this.dataForm.id,
							method: 'get'
						}).then(res =>{
							this.dataForm = res.data;
						})
					}
				})
			},
		}
	}
</script>
