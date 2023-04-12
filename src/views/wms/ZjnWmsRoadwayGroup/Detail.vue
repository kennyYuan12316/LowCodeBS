<template>
	<el-dialog title="详情" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right">
					<el-col :span="12">
						<el-form-item label="分组编号" label-width="100px">
							<p>{{dataForm.roadwayNo}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="分组名称" label-width="100px">
							<p>{{dataForm.roadwayName}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="分组描述" label-width="100px">
							<p>{{dataForm.description}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="是否启用" label-width="100px">
							<p>{{dataForm.enabledMark}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label-width="100px">
						<el-table :data="dataForm.zjnRoadwayGroupDetailsList" size='mini' >
							<el-table-column type="index" width="50" label="序号" align="center" />
								<el-table-column prop="roadwayDetailsNo" label="巷道编号">
									<template slot-scope="scope">
										<p>{{scope.row.roadwayDetailsNo}}</p>
									</template>
								</el-table-column>
								<el-table-column prop="roadwayDetailsName" label="巷道名称">
									<template slot-scope="scope">
										<p>{{scope.row.roadwayDetailsName}}</p>
									</template>
								</el-table-column>
								<el-table-column prop="roadwayDetailsGrade" label="巷道排序">
									<template slot-scope="scope">
										<p>{{scope.row.roadwayDetailsGrade}}</p>
									</template>
								</el-table-column>
								<el-table-column prop="enabledMark" label="是否启用">
									<template slot-scope="scope">
										<p>{{scope.row.enabledMark}}</p>
									</template>
								</el-table-column>
							</el-table>
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
					roadwayNo:undefined,
					roadwayName:undefined,
					description:undefined,
					enabledMark:0,
					zjnRoadwayGroupDetailsList:[],
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
							url: '/api/wms/ZjnWmsRoadwayGroup/' + this.dataForm.id,
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
