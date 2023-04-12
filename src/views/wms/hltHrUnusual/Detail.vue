<template>
	<el-dialog title="详情" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right">
					<el-col :span="12">
						<el-form-item label="错误信息标识 " label-width="100px">
							<p>{{dataForm.m1}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="实时信息标识" label-width="100px">
							<p>{{dataForm.m2}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="系统名称" label-width="100px">
							<p>{{dataForm.m3}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="映射名称" label-width="100px">
							<p>{{dataForm.m4}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="信息类型名称" label-width="100px">
							<p>{{dataForm.m5}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="异常信息编码" label-width="100px">
							<p>{{dataForm.m6}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="异常信息内容" label-width="100px">
							<p>{{dataForm.m7}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="消息创建时间" label-width="100px">
							<p>{{dataForm.m8}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="消息变更时间" label-width="100px">
							<p>{{dataForm.m9}}</p>
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
					m1:undefined,
					m2:undefined,
					m3:undefined,
					m4:undefined,
					m5:undefined,
					m6:undefined,
					m7:undefined,
					m8:undefined,
					m9:undefined,
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
							url: '/api/wms/HltHrUnusual/' + this.dataForm.id,
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
