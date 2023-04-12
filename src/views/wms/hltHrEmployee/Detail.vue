<template>
	<el-dialog title="详情" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right">
					<el-col :span="12">
						<el-form-item label="新工号" label-width="100px">
							<p>{{dataForm.a1}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="适配器工号" label-width="100px">
							<p>{{dataForm.a2}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="嘉扬工号" label-width="100px">
							<p>{{dataForm.a3}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="勤达工号" label-width="100px">
							<p>{{dataForm.a4}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="F3工号" label-width="100px">
							<p>{{dataForm.a5}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="姓名" label-width="100px">
							<p>{{dataForm.a6}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="行政部门" label-width="100px">
							<p>{{dataForm.a7}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="手机号码" label-width="100px">
							<p>{{dataForm.a8}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="在职状态" label-width="100px">
							<p>{{dataForm.a9}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="更新时间" label-width="100px">
							<p>{{dataForm.a10}}</p>
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
							url: '/api/wms/HltHrEmployee/' + this.dataForm.id,
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
