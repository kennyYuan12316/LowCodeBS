<template>
	<el-dialog title="详情" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right">
					<el-col :span="12">
						<el-form-item label="业务类型" label-width="100px">
							<p>{{dataForm.taskType}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="方法名" label-width="100px">
							<p>{{dataForm.methodName}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="方法参数" label-width="100px">
							<p>{{dataForm.methodParmes}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="任务号" label-width="100px">
							<p>{{dataForm.taskNo}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="设备号" label-width="100px">
							<p>{{dataForm.deviceNo}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="托盘号" label-width="100px">
							<p>{{dataForm.trayNo}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">						
						<el-form-item label="是否报错" label-width="100px">
							<p>{{dataForm.isBug==1?"是":dataForm.isBug==0?"否":"否"}}</p>
						</el-form-item>
					</el-col>

					<el-col :span="24">
						<el-form-item label="报错信息" label-width="100px">
							<p>{{dataForm.message}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="备注1" label-width="100px">
							<p>{{dataForm.case1}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="备注2" label-width="100px">
							<p>{{dataForm.case2}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="备注3" label-width="100px">
							<p>{{dataForm.case3}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="备注4" label-width="100px">
							<p>{{dataForm.case4}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="备注5" label-width="100px">
							<p>{{dataForm.case5}}</p>
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
					taskType:undefined,
					methodName:undefined,
					methodParmes:undefined,
					taskNo:undefined,
					deviceNo:undefined,
					trayNo:undefined,
					isBug:undefined,
					createTime:undefined,
					message:undefined,
					case1:undefined,
					case2:undefined,
					case3:undefined,
					case4:undefined,
					case5:undefined,
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
							url: '/api/wms/ZjnWmsRunLoginfo/' + this.dataForm.id,
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
