<template>
	<el-dialog title="详情" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right">
					<el-col :span="24">
						<el-form-item label-width="100px">
							<HSZ-Text value="LES物料原始数据" :textStyle='{"color":"#000000","text-align":"center","font-weight":"bold","font-style":"normal","text-decoration":"none","line-height":32,"font-size":19}' :style='{"width":"100%"}'></HSZ-Text>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="物料编号" label-width="100px">
							<p>{{dataForm.code}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="物料名称" label-width="100px">
							<p>{{dataForm.xName}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="物料类型" label-width="100px">
							<p>{{dataForm.xType}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="基本单位" label-width="100px">
							<p>{{dataForm.defaultUnit}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="总有效期(天）" label-width="100px">
							<p>{{dataForm.validDays}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="静置时间" label-width="100px">
							<p>{{dataForm.stayHours}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="是否批次管理 " label-width="100px">
							<p>{{dataForm.batchManageFlag}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="规格型号" label-width="100px">
							<p>{{dataForm.specification}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if='false' >
						<el-form-item label="最后更新时间" label-width="100px">
							<p>{{dataForm.createTime}}</p>
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
					code:undefined,
					xName:undefined,
					xType:undefined,
					defaultUnit:undefined,
					validDays:undefined,
					stayHours:undefined,
					batchManageFlag:undefined,
					specification:undefined,
					createTime:undefined,
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
							url: '/api/wms/ZjnBaseLesGoods/' + this.dataForm.id,
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
