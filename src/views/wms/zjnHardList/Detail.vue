<template>
	<el-dialog title="详情" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right">
					<el-col :span="24">
						<el-form-item label-width="100px">
							<HSZ-Text value="设备信息" :textStyle='{"color":"#000000","text-align":"center","font-weight":"bold","font-style":"normal","text-decoration":"none","line-height":32,"font-size":32}' :style='{"width":"100%"}'></HSZ-Text>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="设备编号" label-width="100px">
							<p>{{dataForm.hardNo}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="设备名称" label-width="100px">
							<p>{{dataForm.hardName}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="类型" label-width="100px">
							<p>{{dataForm.type}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="虚拟设备" label-width="100px">
							<p>{{dataForm.fictitiousHard}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if='false' >
						<el-form-item label="创建者" label-width="100px">
							<p>{{dataForm.createUser}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if='false' >
						<el-form-item label="创建时间" label-width="100px">
							<p>{{dataForm.createTime}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if='false' >
						<el-form-item label="状态" label-width="100px">
							<p>{{dataForm.status}}</p>
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
					hardNo:undefined,
					hardName:undefined,
					type:"1",
					fictitiousHard:"0",
					createUser:undefined,
					createTime:undefined,
					status:undefined,
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
							url: '/api/wms/ZjnHardList/' + this.dataForm.id,
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
