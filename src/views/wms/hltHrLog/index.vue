<template>
	<div class="HSZ-common-layout">
		<div class="HSZ-common-layout-center">
			<el-row class="HSZ-common-search-box" :gutter="16">
				<el-form @submit.native.prevent>
					<el-col :span="6">
						<el-form-item label="系统模块">
							<el-input v-model="query.j2" placeholder="系统模块" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="操作人员">
							<el-input v-model="query.j5" placeholder="操作人员" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="操作类型">
							<el-input v-model="query.j3" placeholder="操作类型" clearable />	
						</el-form-item>
					</el-col>
					<template v-if="showAll">
					<el-col :span="6">
						<el-form-item label="操作状态">
							<el-input v-model="query.j8" placeholder="操作状态" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="操作日期">
							<el-date-picker v-model="query.j9" type="daterange" value-format="timestamp" format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
							</el-date-picker>
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
                <HSZ-table v-loading="listLoading" :data="list" has-c @selection-change="handleSelectionChange">
					<el-table-column prop="j1" label="日志编号" align="left" />
					<el-table-column prop="j2" label="系统模块" align="left" />
					<el-table-column prop="j3" label="操作类型" align="left" />
					<el-table-column prop="j4" label="请求方式" align="left" />
					<el-table-column prop="j5" label="操作人员" align="left" />
					<el-table-column prop="j6" label="操作地址" align="left" />
					<el-table-column prop="j7" label="操作地点" align="left" />
					<el-table-column prop="j8" label="操作状态" align="left" />
					<el-table-column prop="j9" label="操作日期" align="left" />
					<el-table-column label="操作" fixed="right" width="150">
							<template slot-scope="scope">
							<el-button type="text" @click="addOrUpdateHandle(scope.row.F_Id)" >编辑</el-button>
							<el-button type="text" @click="handleDel(scope.row.F_Id)" class='HSZ-table-delBtn' >删除</el-button>
							<el-button type="text" @click="goDetail(scope.row.F_Id)" >详情</el-button>
						</template>
					</el-table-column>
				</HSZ-table>
                <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="initData" />
            </div>
        </div>
		<HSZ-Form v-if="formVisible" ref="HSZForm" @refresh="refresh" />
		<ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download" />
        <Detail v-if="detailVisible" ref="Detail" @refresh="detailVisible=false"/>
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
	                j2:undefined,
	                j5:undefined,
	                j3:undefined,
	                j8:undefined,
	                j9:undefined,
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
                    { prop: 'j1', label: '日志编号' },
                    { prop: 'j2', label: '系统模块' },
                    { prop: 'j3', label: '操作类型' },
                    { prop: 'j4', label: '请求方式' },
                    { prop: 'j5', label: '操作人员' },
                    { prop: 'j6', label: '操作地址' },
                    { prop: 'j7', label: '操作地点' },
                    { prop: 'j8', label: '操作状态' },
                    { prop: 'j9', label: '操作日期' },
				],
			}
        },
		computed: {},
		created() {
			this.initData()
		},
		methods: {
            goDetail(id){
			    this.detailVisible = true
                this.$nextTick(() => {
                    this.$refs.Detail.init(id)
                })
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
                    url: `/api/wms/HltHrLog`,
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
                        url: `/api/wms/HltHrLog/${id}`,
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
                        url: `/api/wms/HltHrLog/batchRemove`,
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
                    url: `/api/wms/HltHrLog/Actions/Export`,
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