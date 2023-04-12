<template>
	<div class="HSZ-common-layout">
		<div class="HSZ-common-layout-left">
			<div class="HSZ-common-title">
				<h2>托盘履历</h2>
			</div>
			<el-tree :data="treeData" :props="treeProps" default-expand-all highlight-current ref="treeBox"
				:expand-on-click-node="false" @node-click="handleNodeClick" class="HSZ-common-el-tree" node-key="id"
				:current-node-key="1">
				<span class="custom-tree-node" slot-scope="{node,data}">
					<i :class="data.icon"></i>
					<span class="text">{{node.label}}</span>
				</span>
			</el-tree>
		</div>
		<div class="HSZ-common-layout-center" v-if="currentType==1">
			<el-row class="HSZ-common-search-box" :gutter="16">
				<el-form @submit.native.prevent>
					<el-col :span="6">
						<el-form-item label="货物代码">
							<el-input v-model="query.F_GoodsCode" placeholder="货物代码" clearable />
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="托盘编号">
							<el-input v-model="query.F_TrayNo" placeholder="托盘编号" clearable />
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="货位编号">
							<el-input v-model="query.F_LocationNo" placeholder="货位编号" clearable />
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item>
							<el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
							<el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
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
				<HSZ-table v-loading="listLoading" :data="list">
					<el-table-column prop="F_GoodsCode" label="货物代码" align="left" />
					<el-table-column prop="F_Quantity" label="数量" align="left" />
					<el-table-column prop="F_Unit" label="单位" align="left" />
					<el-table-column prop="F_TrayNo" label="托盘编号" align="left" />
					<el-table-column prop="F_LocationNo" label="货位编号" align="left" />
					<el-table-column prop="F_CreateUser" label="创建者" align="left" />
					<el-table-column prop="F_CreateTime" label="创建时间" align="left">
						<template slot-scope="scope" v-if="1">
							{{ scope.row.F_CreateTime | toDate("yyyy-MM-dd hh:mm:ss") }}
						</template>
					</el-table-column>
					<el-table-column prop="F_EnabledMark" label="有效标志" align="left" />
				</HSZ-table>
				<pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
					@pagination="initData" />
			</div>
		</div>
		<div class="HSZ-common-layout-center" v-if="currentType==2">
			<el-row class="HSZ-common-search-box" :gutter="16">
				<el-form @submit.native.prevent>
					<el-col :span="6">
						<el-form-item label="货物代码">
							<el-input v-model="query.F_GoodsCode" placeholder="货物代码" clearable />
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="托盘编号">
							<el-input v-model="query.F_TrayNo" placeholder="托盘编号" clearable />
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item>
							<el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
							<el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
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
				<HSZ-table v-loading="listLoading" :data="list">
					<el-table-column prop="F_GoodsCode" label="货物代码" align="left" />
					<el-table-column prop="F_Quantity" label="数量" align="left" />
					<el-table-column prop="F_Unit" label="单位" align="left" />
					<el-table-column prop="F_TrayNo" label="托盘编号" align="left" />
					<el-table-column prop="F_CreateUser" label="创建者" align="left" />
					<el-table-column prop="F_CreateTime" label="创建时间" align="left">
						<template slot-scope="scope" v-if="2">
							{{ scope.row.F_CreateTime | toDate("yyyy-MM-dd hh:mm:ss") }}
						</template>
					</el-table-column>
					<el-table-column prop="F_EnabledMark" label="有效标志" align="left" />
				</HSZ-table>
				<pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
					@pagination="initData" />
			</div>
		</div>
		<HSZ-Form v-if="formVisible" ref="HSZForm" @refresh="refresh" />
		<ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download" />
	</div>
</template>
<script>
import request from '@/utils/request'
import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
import HSZForm from './Form'
import ExportBox from './ExportBox'
export default {
	components: { HSZForm, ExportBox },
	data() {
		return {
			showAll: false,
			query: {
				F_GoodsCode: undefined,
				F_TrayNo: undefined,
				F_LocationNo: undefined,
			},
			treeProps: {
				children: 'children',
				label: 'fullName',
				value: 'id',
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
			treeData: [{ id: 1, fullName: "托盘与货位绑定履历" }, { id: 2, fullName: "托盘与物料绑定履历" }],
			columnList: [
				{ prop: 'F_GoodsCode', label: '货物代码' },
				{ prop: 'F_Quantity', label: '数量' },
				{ prop: 'F_Unit', label: '单位' },
				{ prop: 'F_TrayNo', label: '托盘编号' },
				{ prop: 'F_LocationNo', label: '货位编号' },
				{ prop: 'F_CreateUser', label: '创建者' },
				{ prop: 'F_CreateTime', label: '创建时间' },
				{ prop: 'F_EnabledMark', label: '有效标志' },
			],
			unitOptions: [],
			currentType: 1
		}
	},
	computed: {},
	created() {
		this.initData()
	},
	methods: {
		getunitOptions() {
			getDictionaryDataSelector('326384591566800133').then(res => {
				this.unitOptions = res.data.list
			});
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
				url: this.currentType == 1 ? `/api/wms/ZjnWmsTrayLocationLog` : `/api/wms/ZjnWmsTrayGoodsLog`,
				method: 'GET',
				data: query
			}).then(res => {
				this.list = res.data.list
				this.total = res.data.pagination.total
				this.listLoading = false
			})
		},
		addOrUpdateHandle(id, isDetail) {
			this.formVisible = true
			this.$nextTick(() => {
				this.$refs.HSZForm.init(id, isDetail)
			})
		},
		handleNodeClick(data, node) {
			this.currentType = data.id
			this.listQuery = {
				currentPage: 1,
				pageSize: 20,
				sort: "desc",
				sidx: "F_Id",
			}
			this.initData()
		},
		getTreeView() {
			getDictionaryDataSelector('344618366226400517').then(res => {
				this.treeData = res.data.list
				this.initData()
			})
		},
		search() {
			this.listQuery = {
				currentPage: 1,
				pageSize: 20,
				sort: "desc",
				sidx: "F_Id",
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
				sidx: "F_Id",
			}
			this.initData()
		}
	}
}
</script>
