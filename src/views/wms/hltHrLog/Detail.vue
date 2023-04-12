<template>
	<el-dialog title="详情" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right">
					<el-col :span="12">
						<el-form-item label="日志编号" label-width="100px">
							<p>{{dataForm.j1}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="系统模块" label-width="100px">
							<p>{{dataForm.j2}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="操作类型" label-width="100px">
							<p>{{dataForm.j3}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="请求方式" label-width="100px">
							<p>{{dataForm.j4}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="操作人员" label-width="100px">
							<p>{{dataForm.j5}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="操作地址" label-width="100px">
							<p>{{dataForm.j6}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="操作地点" label-width="100px">
							<p>{{dataForm.j7}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="操作状态" label-width="100px">
							<p>{{dataForm.j8}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="操作日期" label-width="100px">
							<p>{{dataForm.j9}}</p>
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
					j1:undefined,
					j2:undefined,
					j3:undefined,
					j4:undefined,
					j5:undefined,
					j6:undefined,
					j7:undefined,
					j8:undefined,
					j9:undefined,
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
							url: '/api/wms/HltHrLog/' + this.dataForm.id,
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
