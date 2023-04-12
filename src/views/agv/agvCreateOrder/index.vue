<template>
	<div class="HSZ-common-layout">
		<div class="HSZ-common-layout-center">
			<el-row class="HSZ-common-search-box" :gutter="16">
				<el-form @submit.native.prevent>
					<el-col :span="6">
						<el-form-item label="业务关系编码">
							<el-input v-model="query.F_BrCode" placeholder="业务关系编码" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="托盘编码">
							<el-input v-model="query.F_TrayId" placeholder="托盘编码" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="起点库区编码">
							<el-input v-model="query.F_StartAreaCode" placeholder="起点库区编码" clearable />	
						</el-form-item>
					</el-col>
					<template v-if="showAll">
					<el-col :span="6">
						<el-form-item label="起点库位编码">
							<el-input v-model="query.F_StartLocCode" placeholder="起点库位编码" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="终点库区编码">
							<el-input v-model="query.F_EndAreaCode" placeholder="终点库区编码" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="终点库位编码">
							<el-input v-model="query.F_EndLocCode" placeholder="终点库位编码" clearable />	
						</el-form-item>
					</el-col>
					</template>
					<el-col :span="6">
						<el-form-item>
							<el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
							<el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
							<el-button type="text" icon="el-icon-arrow-down" @click="showAll=true" v-if="!showAll">展开</el-button>
							<el-button type="text" icon="el-icon-arrow-up" @click="showAll=false" v-else>收起</el-button>
						</el-form-item>
					</el-col>
				</el-form>
			</el-row>
			<div class="HSZ-common-layout-main HSZ-flex-main">
				<div class="HSZ-common-head">
					<div>
						<el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增</el-button>
					</div>
					<div class="HSZ-common-head-right">
						<el-tooltip effect="dark" content="刷新" placement="top">
							<el-link icon="icon-sz icon-sz-Refresh HSZ-common-head-icon" :underline="false" @click="reset()" />
						</el-tooltip>
						<screenfull isContainer />
					</div>
				</div>
                <HSZ-table v-loading="listLoading" :data="list">
					<el-table-column prop="F_BrCode" label="业务关系编码" align="left" />
					<el-table-column prop="F_TrayId" label="托盘编码" align="left" />
					<el-table-column prop="F_StartAreaCode" label="起点库区编码" align="left" />
					<el-table-column prop="F_StartLocCode" label="起点库位编码" align="left" />
					<el-table-column prop="F_EndAreaCode" label="终点库区编码" align="left" />
					<el-table-column prop="F_EndLocCode" label="终点库位编码" align="left" />
					<el-table-column prop="F_LesOrderId" label="LES订单ID" align="left" />
					<el-table-column prop="F_OuterOrderId" label="外部订单ID" align="left" />
					<el-table-column label="操作" fixed="right" width="100">
							<template slot-scope="scope">
							<el-button type="text" @click="addOrUpdateHandle(scope.row.F_Id)" >编辑</el-button>
							<el-button type="text" @click="handleDel(scope.row.F_Id)" class='HSZ-table-delBtn' >删除</el-button>
						</template>
					</el-table-column>
				</HSZ-table>
                <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="initData" />
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
	import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
	export default {
	    components: { HSZForm, ExportBox },
	    data() {
	        return {
	            showAll: false,
	        query: {
	                F_BrCode:undefined,
	                F_TrayId:undefined,
	                F_StartAreaCode:undefined,
	                F_StartLocCode:undefined,
	                F_EndAreaCode:undefined,
	                F_EndLocCode:undefined,
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
                    { prop: 'F_BrCode', label: '业务关系编码' },
                    { prop: 'F_TrayId', label: '托盘编码' },
                    { prop: 'F_StartAreaCode', label: '起点库区编码' },
                    { prop: 'F_StartLocCode', label: '起点库位编码' },
                    { prop: 'F_EndAreaCode', label: '终点库区编码' },
                    { prop: 'F_EndLocCode', label: '终点库位编码' },
                    { prop: 'F_LesOrderId', label: 'LES订单ID' },
                    { prop: 'F_OuterOrderId', label: '外部订单ID' },
				],
			}
        },
		computed: {},
		created() {
			this.initData()
		},
		methods: {
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
                    url: `/api/agv/ZjnBaseStdCreateorder`,
                    method: 'GET',
                    data: query
                }).then(res => {
                    this.list = res.data.list
                    this.total = res.data.pagination.total
                    this.listLoading = false
                })
            },
			handleDel(id) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    type: 'warning'
                }).then(() => {
                    request({
                        url: `/api/agv/ZjnBaseStdCreateorder/${id}`,
                        method: 'DELETE'
                    }).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.msg,
                            onClose: () => {
                                this.initData()
                            }
                        });
                    })
                }).catch(() => {
                });
            },
			addOrUpdateHandle(id, isDetail) {
                this.formVisible = true
                this.$nextTick(() => {
                    this.$refs.HSZForm.init(id, isDetail)
                })
            },
			search() {
                this.listQuery = {
                    currentPage: 1,
                    pageSize: 20,
                    sort: "desc",
                    sidx: "F_OuterOrderId",
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
                    sidx: "F_OuterOrderId",
                }
                this.initData()
            }
		}
    }
</script>