<template>
	<el-dialog title="详情" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right">
					<el-col :span="24">
						<el-form-item label="编号" label-width="100px">
							<p>{{dataForm.i1}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="任务名称" label-width="100px">
							<p>{{dataForm.i2}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="映射名称" label-width="100px">
							<p>{{dataForm.i3}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="系统名称" label-width="100px">
							<p>{{dataForm.i4}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="任务时间表达式" label-width="100px">
							<p>{{dataForm.i5}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="任务状态" label-width="100px">
							<p>{{dataForm.i6}}</p>
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
					i1:undefined,
					i2:undefined,
					i3:undefined,
					i4:undefined,
					i5:undefined,
					i6:undefined,
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
							url: '/api/wms/HltHrRegular/' + this.dataForm.id,
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
