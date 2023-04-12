<template>
	<div class="HSZ-common-layout">
		<div class="HSZ-common-layout-center">
			<el-row class="HSZ-common-search-box" :gutter="16">
				<el-form @submit.native.prevent>
					<el-col :span="6">
						<el-form-item label="线体编号">
							<el-input v-model="query.F_LineNo" placeholder="线体编号" clearable />
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="线体名称">
							<el-input v-model="query.F_LineName" placeholder="线体名称" clearable />
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="物料编号">
							<el-input v-model="query.F_GoodsCode" placeholder="物料编号" clearable />
						</el-form-item>
					</el-col>
					<template v-if="showAll">						
						<el-col :span="6">							
							<el-form-item label="物料类型">
								<el-select v-model="query.F_GoodsType" placeholder="物料类型" clearable>
									<el-option v-for="(item, index) in goodsTypeOptions" :key="index"
										:label="item.fullName" :value="item.enCode" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="托盘编号">
								<el-input v-model="query.F_TrayNo" placeholder="托盘编号" clearable />
							</el-form-item>
						</el-col>
					</template>
					<el-col :span="6">
						<el-form-item>
							<el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
							<el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
							<el-button type="text" icon="el-icon-arrow-down" @click="showAll=true" v-if="!showAll">展开
							</el-button>
							<el-button type="text" icon="el-icon-arrow-up" @click="showAll=false" v-else>收起</el-button>
						</el-form-item>
					</el-col>
				</el-form>
			</el-row>
			<div class="HSZ-common-layout-main HSZ-flex-main">
				<div class="HSZ-common-head">
					<div>
					</div>
					<div class="HSZ-common-head-right">
						<el-tooltip effect="dark" content="刷新" placement="top">
							<el-link icon="icon-sz icon-sz-Refresh HSZ-common-head-icon" :underline="false"
								@click="reset()" />
						</el-tooltip>
						<screenfull isContainer />
					</div>
				</div>
				<HSZ-table v-loading="listLoading" :data="list" @sort-change='sortChange'
					@selection-change="handleSelectionChange">
					<el-table-column prop="F_LineNo" label="线体编号" align="left" sortable='custom' />
					<el-table-column prop="F_LineName" label="线体名称" align="left" />
					<el-table-column label="物料类型" prop="goodsType" sortable='custom' align="left" width="100"  >
						<template slot-scope="scope">{{ scope.row.F_GoodsType | dynamicTextByenCode(goodsTypeOptions) }}</template>
					</el-table-column>
					<el-table-column prop="F_GoodsCode" label="物料编号" align="left" />
					<el-table-column prop="F_TrayNo" label="托盘编号" align="left" />
					<el-table-column prop="F_LineStart" label="线体缓存起点" align="left" />
					<el-table-column prop="F_LineEnd" label="线体缓存终点" align="left" />
					<el-table-column prop="F_LineLayer" label="线体层" align="left" />
					<el-table-column prop="F_LineMaxWork" label="线体最大任务数" align="left" />
					<el-table-column prop="F_LineNowWork" label="当前任务数量" align="left" />
					<el-table-column prop="F_Description" label="线体描述" align="left" />
					<el-table-column prop="F_Expand" label="预留字段" align="left" />
					<el-table-column prop="F_Status" label="状态" align="left" sortable='custom' >
                        <template slot-scope="scope">
                            <span>{{scope.row.F_Status==1?"在线":scope.row.F_Status==2?"已出":""}}</span>
                        </template>
                    </el-table-column>
					<el-table-column prop="F_OutTime" label="出库时间" align="left" >
						<template slot-scope="scope">
							{{ scope.row.F_OutTime | toDate("yyyy-MM-dd hh:mm:ss") }}
							</template>
					</el-table-column>
					<el-table-column prop="F_CreateTime" label="创建时间" align="left" sortable='custom' >
						<template slot-scope="scope">
							{{ scope.row.F_CreateTime | toDate("yyyy-MM-dd hh:mm:ss") }}
							</template>
					</el-table-column>
					<el-table-column label="操作" fixed="right" width="50">
						<template slot-scope="scope">
							<el-button type="text" @click="goDetail(scope.row.F_Id)">详情</el-button>
						</template>
					</el-table-column>
				</HSZ-table>
				<pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
					@pagination="initData" />
			</div>
		</div>
		<HSZ-Form v-if="formVisible" ref="HSZForm" @refresh="refresh" />
		<ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download" />
		<Detail v-if="detailVisible" ref="Detail" @refresh="detailVisible=false" />
	</div>
</template>
<script>
	import request from '@/utils/request'
	import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
	import HSZForm from './Form'
	import ExportBox from './ExportBox'
	import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
	import Detail from './Detail'
	export default {
		components: { HSZForm, ExportBox, Detail },
		data() {
			return {
				detailVisible: false,
				showAll: false,
				query: {
					F_LineNo: undefined,
					F_LineName: undefined,
					F_GoodsCode: undefined,
					F_TrayNo: undefined,
					F_GoodsType: undefined,
				},
				list: [],
				listLoading: true,
				multipleSelection: [],
				total: 0,
				listQuery: {
					currentPage: 1,
					pageSize: 20,
					sort: "desc",
					sidx: "",
				},
				formVisible: false,
				exportBoxVisible: false,
				columnList: [
					{ prop: 'F_LineNo', label: '线体编号' },
					{ prop: 'F_LineName', label: '线体名称' },
					{ prop: 'F_GoodsType', label: '物料类型' },
					{ prop: 'F_GoodsCode', label: '物料编号' },
					{ prop: 'F_TrayNo', label: '托盘编号' },
					{ prop: 'F_LineStart', label: '线体缓存起点' },
					{ prop: 'F_LineEnd', label: '线体缓存终点' },
					{ prop: 'F_LineLayer', label: '线体层' },
					{ prop: 'F_LineMaxWork', label: '线体最大任务数' },
					{ prop: 'F_LineNowWork', label: '当前任务数量' },
					{ prop: 'F_Description', label: '线体描述' },
					{ prop: 'F_Expand', label: '预留字段' },
					{ prop: 'F_Status', label: '状态' },
					{ prop: 'F_OutTime', label: '出库时间' },
					{ prop: 'F_CreateTime', label: '创建时间' },
				],
				goodsTypeOptions: [],
			}
		},
		computed: {},
		created() {
			this.initData();
			this.getgoodsTypeOptions();
		},
		methods: {
			goDetail(id) {
				this.detailVisible = true
				this.$nextTick(() => {
					this.$refs.Detail.init(id)
				})
			},
			getgoodsTypeOptions() {
				getDictionaryDataSelector('325449144728552709').then(res => {
					this.goodsTypeOptions = res.data.list
				});
			},
			sortChange({
				column,
				prop,
				order
			}) {
				this.listQuery.sort = order == 'ascending' ? 'asc' : 'desc'
				this.listQuery.sidx = !order ? '' : prop
				this.initData()
			},
			initData() {
				this.listLoading = true;
				let _query = {
					...this.listQuery,
					...this.query
				};
				let query = {}
				for (let key in _query) {
					if (Array.isArray(_query[key])) {
						query[key] = _query[key].join()
					} else {
						query[key] = _query[key]
					}
				}
				request({
					url: `/api/wms/ZjnWmsLineSettinglog`,
					method: 'GET',
					data: query
				}).then(res => {
					this.list = res.data.list
					this.total = res.data.pagination.total
					this.listLoading = false
				})
			},
			handleSelectionChange(val) {
				const res = val.map(item => item.F_Id)
				this.multipleSelection = res
			},
			addOrUpdateHandle(id, isDetail) {
				this.formVisible = true
				this.$nextTick(() => {
					this.$refs.HSZForm.init(id, isDetail)
				})
			},
			exportData() {
				this.exportBoxVisible = true
				this.$nextTick(() => {
					this.$refs.ExportBox.init(this.columnList)
				})
			},
			download(data) {
				let query = { ...data, ...this.listQuery, ...this.query }
				request({
					url: `/api/wms/ZjnWmsLineSettinglog/Actions/Export`,
					method: 'GET',
					data: query
				}).then(res => {
					if (!res.data.url) return
					window.location.href = this.define.comUrl + res.data.url
					this.$refs.ExportBox.visible = false
					this.exportBoxVisible = false
				})
			},
			search() {
				this.listQuery = {
					currentPage: 1,
					pageSize: 20,
					sort: "desc",
					sidx: "F_CreateTime",
				}
				this.initData()
			},
			refresh(isrRefresh) {
				this.formVisible = false
				if (isrRefresh) this.reset()
			},
			reset() {
				for (let key in this.query) {
					this.query[key] = undefined
				}
				this.listQuery = {
					currentPage: 1,
					pageSize: 20,
					sort: "desc",
					sidx: "F_CreateTime",
				}
				this.initData()
			}
		}
	}
</script>