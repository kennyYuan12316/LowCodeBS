<template>
	<el-dialog title="详情" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right">
					<el-col :span="12">
						<el-form-item label="日志标识" label-width="100px">
							<p>{{dataForm.n1}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="任务标识" label-width="100px">
							<p>{{dataForm.n2}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="系统编码" label-width="100px">
							<p>{{dataForm.n3}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="系统名称" label-width="100px">
							<p>{{dataForm.n4}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="映射编码" label-width="100px">
							<p>{{dataForm.n5}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="映射名称" label-width="100px">
							<p>{{dataForm.n6}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="同步数量" label-width="100px">
							<p>{{dataForm.n7}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="错误标识" label-width="100px">
							<p>{{dataForm.n8}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="耗时" label-width="100px">
							<p>{{dataForm.n9}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="创建时间" label-width="100px">
							<p>{{dataForm.n10}}</p>
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
					n1:undefined,
					n2:undefined,
					n3:undefined,
					n4:undefined,
					n5:undefined,
					n6:undefined,
					n7:undefined,
					n8:undefined,
					n9:undefined,
					n10:undefined,
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
							url: '/api/wms/HltHrSynchronize/' + this.dataForm.id,
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
