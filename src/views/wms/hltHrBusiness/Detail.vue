<template>
	<el-dialog title="详情" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right">
					<el-col :span="24">
						<el-form-item label="编号" label-width="100px">
							<p>{{dataForm.d1}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="模块组名称" label-width="100px">
							<p>{{dataForm.d2}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="模块组编码" label-width="100px">
							<p>{{dataForm.d3}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="所属部门名称" label-width="100px">
							<p>{{dataForm.d4}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="负责人名称" label-width="100px">
							<p>{{dataForm.d5}}</p>
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
					d1:undefined,
					d2:undefined,
					d3:undefined,
					d4:undefined,
					d5:undefined,
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
							url: '/api/wms/HltHrBusiness/' + this.dataForm.id,
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
