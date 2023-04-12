<template>
	<div class="HSZ-common-layout">
		<div class="HSZ-common-layout-center">
			<el-row class="HSZ-common-search-box" :gutter="16">
				<el-form @submit.native.prevent>
					<el-col :span="6">
						<el-form-item label="物料编码">
							<el-input v-model="query.F_ProductsCode" placeholder="物料编码" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="物料名称">
							<el-input v-model="query.F_ProductsName" placeholder="物料名称" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="32位批次号">
							<el-input v-model="query.F_Batch" placeholder="32位批次号" clearable />	
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
						<el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增</el-button>
						<el-button type="text" icon="el-icon-download" @click="exportData()">导出</el-button>
						<el-button type="text" icon="el-icon-delete" @click="handleBatchRemoveDel()">批量删除</el-button>
					</div>
					<div class="HSZ-common-head-right">
						<el-tooltip effect="dark" content="刷新" placement="top">
							<el-link icon="icon-sz icon-sz-Refresh HSZ-common-head-icon" :underline="false" @click="reset()" />
						</el-tooltip>
						<screenfull isContainer />
					</div>
				</div>
                <HSZ-table v-loading="listLoading" :data="list" 
                show-summary
                has-c @selection-change="handleSelectionChange">
					<el-table-column prop="F_Factory" label="工厂" align="left" />
					<el-table-column prop="F_ProductsCode" label="物料编码" align="left" />
					<el-table-column prop="F_ProductsName" label="物料名称" align="left" />
					<el-table-column prop="F_Batch" label="32位批次号" align="left" />
					<el-table-column prop="F_Quality" label="质量状态" align="left" />
					<el-table-column prop="F_ProductsUnit" label="物料单位" align="left" />
                    <el-table-column label="库内" align="top">
                        <el-table-column prop="F_SumInside" label="总数" align="left" />
					    <el-table-column prop="F_TrayCountInside" label="托盘数" align="left" />
                    </el-table-column>
                    <el-table-column label="库外" align="top">
                        <el-table-column prop="F_SumOutside" label="总数" align="left" />
					    <el-table-column prop="F_TrayCountOutside" label="托盘数" align="left" />
                    </el-table-column>
                    <el-table-column label="正在移动" align="top">
                        <el-table-column prop="F_SumMoving" label="总数" align="left" />
					    <el-table-column prop="F_TrayCountMoving" label="托盘数" align="left" />
                    </el-table-column>
                        <el-table-column label="全部" align="top">
                        <el-table-column prop="F_SumTotal" label="总数" align="left" />
					<el-table-column prop="F_TrayCountTotal" label="托盘数" align="left" />
                    </el-table-column>				
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
	                F_ProductsCode:undefined,
	                F_ProductsName:undefined,
	                F_Batch:undefined,
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
                    { prop: 'F_Factory', label: '工厂' },
                    { prop: 'F_ProductsCode', label: '物料编码' },
                    { prop: 'F_ProductsName', label: '物料名称' },
                    { prop: 'F_Batch', label: '32位批次号' },
                    { prop: 'F_Quality', label: '质量状态' },
                    { prop: 'F_ProductsUnit', label: '物料单位' },
                    { prop: 'F_SumInside', label: '总数库内' },
                    { prop: 'F_TrayCountInside', label: '托盘数库内' },
                    { prop: 'F_SumOutside', label: '总数库外' },
                    { prop: 'F_TrayCountOutside', label: '托盘数库外' },
                    { prop: 'F_SumMoving', label: '总数移动中' },
                    { prop: 'F_TrayCountMoving', label: '托盘数移动中' },
                    { prop: 'F_SumTotal', label: '总数全部' },
                    { prop: 'F_TrayCountTotal', label: '托盘数全部' },
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
                    url: `/api/wms/ZjnReportRealtime`,
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
                        url: `/api/wms/ZjnReportRealtime/${id}`,
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
			handleSelectionChange(val) {
                const res = val.map(item => item.F_Id)
                this.multipleSelection = res
            },
            handleBatchRemoveDel() {
                if (!this.multipleSelection.length) {
                    this.$message({
                        type: 'error',
                        message: '请选择一条数据',
                        duration: 1500,
                    })
                    return
                }
                const ids = this.multipleSelection
                this.$confirm('您确定要删除这些数据吗, 是否继续？', '提示', {
                    type: 'warning'
                }).then(() => {
                    request({
                        url: `/api/wms/ZjnReportRealtime/batchRemove`,
                        method: 'POST',
                        data: ids ,
                    }).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.msg,
                            onClose: () => {
                                this.initData()
                            }
                        });
                    })
                }).catch(() => { })
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
                    url: `/api/wms/ZjnReportRealtime/Actions/Export`,
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
                    sidx: "F_ProductsCode",
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
                    sidx: "F_ProductsCode",
                }
                this.initData()
            }
		}
    }
</script>