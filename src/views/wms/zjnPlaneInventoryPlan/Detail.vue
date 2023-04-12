<template>
	<el-dialog title="详情" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right">
					<el-col :span="24">
						<el-form-item label-width="100px">
							<HSZ-Text value="盘点计划" :textStyle='{"color":"#000000","text-align":"center","font-weight":"bold","font-style":"normal","text-decoration":"none","line-height":32,"font-size":20}' :style='{"width":"100%"}'></HSZ-Text>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="盘点单据号" label-width="100px">
							<p>{{dataForm.inventoryNo}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="盘点类型" label-width="100px">
							<p>{{dataForm.inventoryType}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="开始时间" label-width="100px">
							<p>{{dataForm.startTime}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="结束时间" label-width="100px">
							<p>{{dataForm.endTime}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="描述" label-width="100px">
							<p>{{dataForm.description}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if='false' >
						<el-form-item label="创建用户" label-width="100px">
							<p>{{dataForm.createUser}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if='false' >
						<el-form-item label="创建时间" label-width="100px">
							<p>{{dataForm.createTime}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if='false' >
						<el-form-item label="修改用户" label-width="100px">
							<p>{{dataForm.lastModifyUserId}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if='false' >
						<el-form-item label="修改时间" label-width="100px">
							<p>{{dataForm.lastModifyTime}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="有效标志" label-width="100px">
							<p>{{dataForm.enabledMark}}</p>
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
					inventoryNo:undefined,
					inventoryType:undefined,
					startTime:undefined,
					endTime:undefined,
					description:undefined,
					createUser:undefined,
					createTime:undefined,
					lastModifyUserId:undefined,
					lastModifyTime:undefined,
					enabledMark:"0",
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
							url: '/api/wms/ZjnPlaneInventoryPlan/' + this.dataForm.id,
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
