<template>
	<transition name="el-zoom-in-center">
		<div class="HSZ-preview-main">
			<div class="HSZ-common-page-header">
				<el-page-header @back="goBack" content="详情"/>
				<div class="options">
					<el-button @click="goBack">取 消</el-button>
				</div>
			</div>
			<div :style="{margin: '0 auto',width:'100%'}">
				<el-row :gutter="15" class=" main">
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right">
					<el-col :span="12">
						<el-form-item label="货位分组编号" label-width="100px">
							<p>{{dataForm.groupNo}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="货位分组名称" label-width="100px">
							<p>{{dataForm.groupName}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="货位分组描述" label-width="100px">
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
						<el-table :data="dataForm.zjnLocationGroupDetailsList" size='mini' >
							<el-table-column type="index" width="50" label="序号" align="center" />
								<el-table-column prop="groupDetailsNo" label="货位分组明细编号">
									<template slot-scope="scope">
										<p>{{scope.row.groupDetailsNo}}</p>
									</template>
								</el-table-column>
								<el-table-column prop="startRow" label="货位起始行">
									<template slot-scope="scope">
										<p>{{scope.row.startRow}}</p>
									</template>
								</el-table-column>
								<el-table-column prop="endRow" label="货位终止行">
									<template slot-scope="scope">
										<p>{{scope.row.endRow}}</p>
									</template>
								</el-table-column>
								<el-table-column prop="startCell" label="货位起始列">
									<template slot-scope="scope">
										<p>{{scope.row.startCell}}</p>
									</template>
								</el-table-column>
								<el-table-column prop="endCell" label="货位终止列">
									<template slot-scope="scope">
										<p>{{scope.row.endCell}}</p>
									</template>
								</el-table-column>
								<el-table-column prop="startLayer" label="货位起始层">
									<template slot-scope="scope">
										<p>{{scope.row.startLayer}}</p>
									</template>
								</el-table-column>
								<el-table-column prop="endLayer" label="货位终止层">
									<template slot-scope="scope">
										<p>{{scope.row.endLayer}}</p>
									</template>
								</el-table-column>
								<el-table-column prop="startDepth" label="货位起始位深">
									<template slot-scope="scope">
										<p>{{scope.row.startDepth}}</p>
									</template>
								</el-table-column>
								<el-table-column prop="endDepth" label="货位终止位深">
									<template slot-scope="scope">
										<p>{{scope.row.endDepth}}</p>
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
			</div>
		</div>
	</transition>
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
					groupNo:undefined,
					groupName:undefined,
					description:undefined,
					enabledMark:0,
					zjnLocationGroupDetailsList:[],
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
							url: '/api/wms/ZjnWmsLocationGroup/' + this.dataForm.id,
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
