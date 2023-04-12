<template>
	<el-dialog title="详情" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right">
					<el-col :span="12">
						<el-form-item label="编号" label-width="100px">
							<p>{{dataForm.g1}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="系统名称" label-width="100px">
							<p>{{dataForm.g2}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="系统模板名称" label-width="100px">
							<p>{{dataForm.g3}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="调用类型值" label-width="100px">
							<p>{{dataForm.g4}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="超时(毫秒)" label-width="100px">
							<p>{{dataForm.g5}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="超时重派次数" label-width="100px">
							<p>{{dataForm.g6}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="绕过SSL认证" label-width="100px">
							<p>{{dataForm.g7}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="单次发送的数据总量" label-width="100px">
							<p>{{dataForm.g8}}</p>
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
					g1:undefined,
					g2:undefined,
					g3:undefined,
					g4:undefined,
					g5:undefined,
					g6:undefined,
					g7:undefined,
					g8:undefined,
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
							url: '/api/wms/HltHrTemplate/' + this.dataForm.id,
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
