<template>
	<el-dialog title="详情" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right">
					<el-col :span="12">
						<el-form-item label="日志编号" label-width="100px">
							<p>{{dataForm.k1}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="系统模块" label-width="100px">
							<p>{{dataForm.k2}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="系统标识" label-width="100px">
							<p>{{dataForm.k3}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="请求方式" label-width="100px">
							<p>{{dataForm.k4}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="操作人员" label-width="100px">
							<p>{{dataForm.k5}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="请求系统" label-width="100px">
							<p>{{dataForm.k6}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="响应系统" label-width="100px">
							<p>{{dataForm.k7}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="操作日期" label-width="100px">
							<p>{{dataForm.k8}}</p>
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
					k1:undefined,
					k2:undefined,
					k3:undefined,
					k4:undefined,
					k5:undefined,
					k6:undefined,
					k7:undefined,
					k8:undefined,
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
							url: '/api/wms/HltHrError/' + this.dataForm.id,
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
